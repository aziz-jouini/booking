import User from "../models/User.js";
export const updateUser = async (req,res, next) => {
    try {
        const updateUser= await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body}, // Utilise $set pour mettre à jour les champs
        
        {new: true} );// retourne le document mise a jour       
        res.status(200).json(updateUser);

    } catch (err) {
        next(err);
    }
}
export const deleteUser = async (req,res,next)=>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("USER has been deleted");
    }catch (err) {
        next(err);  // Passe l'erreur au middleware de gestion des erreurs
    }
}
export const getUser = async (req,res,next)=>{
    try{
       const User = await User.findById(req.params.id);
       res.status(200).json("USER has been deleted");
    }catch (err) {
        next(err);
    }
}
export const getUsers = async (req,res,next)=>{
    try{
       const User = await User.find();
       res.status(200).json("USERS");
    }catch (err) {
        next(err);
    }
}
