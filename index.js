import express from "express";
import cors from "cors"; // Assurez-vous que cors est installé
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/room.js";

dotenv.config(); // Charger les variables d'environnement

const app = express();

// Connexion à MongoDB
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Sortir du processus avec une erreur
    }
};

// Événements de connexion et de déconnexion de MongoDB
mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected!");
});

mongoose.connection.on("connected", () => {
    console.log("MongoDB connected!");
});

// Connecter à MongoDB
connect();

// Middleware pour Express
app.use(cors()); // Pour permettre les requêtes cross-origin
app.use(cookieParser()); // Pour parser les cookies
app.use(express.json()); // Pour traiter les requêtes JSON

// Définir les routes
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

// Middleware pour la gestion des erreurs globales
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

// Démarrer le serveur
app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
