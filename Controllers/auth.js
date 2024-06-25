import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

// controllers/auth.js (register function)
export const register = async (req, res, next) => {
    try {
        // Génération d'un sel pour le hashage
        const salt = bcrypt.genSaltSync(10);
        // Hashage du mot de passe
        const hash = bcrypt.hashSync(req.body.password, salt);
        // Création d'un nouvel utilisateur avec le mot de passe hashé
        const newUser = new User({
            ...req.body,
            password: hash,
        });
        // Sauvegarde du nouvel utilisateur dans la base de données
        await newUser.save();
        res.status(200).send("User has been created.");
    } catch (err) {
        next(err); // Passer l'erreur au middleware de gestion des erreurs
    }
};

// controllers/auth.js (login function)
export const login = async (req, res, next) => {
    try {
        // Recherche de l'utilisateur par nom d'utilisateur
        const user = await User.findOne({ username: req.body.username });
        if (!user) return next(createError(404, "User not found!"));

        // Vérification du mot de passe
        const isPasswordCorrect = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!isPasswordCorrect) 
            return next(createError(400, "Wrong password or username!"));

        // Génération du jeton JWT
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT, // Secret pour JWT
            { expiresIn: "1h" } // Optionnel : définir une expiration pour le jeton
        );

        // Exclusion du mot de passe des détails de l'utilisateur pour la réponse
        const { password, ...otherDetails } = user._doc;

        // Envoi du cookie avec le jeton d'accès et la réponse
        res.cookie("access_token", token, {
            httpOnly: true, // HTTP only pour empêcher l'accès via JavaScript
        })
        .status(200)
        .json({ details: { ...otherDetails }, isAdmin: user.isAdmin });

    } catch (err) {
        next(err); // Passer l'erreur au middleware de gestion des erreurs
    }
};


