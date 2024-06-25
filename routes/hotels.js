import express from "express";
import {
    countByCity,
    countByType,
    createHotel,
    deleteHotel,
    getHotel,
    getHotelRooms,
    getHotels,
    updateHotel
} from "../Controllers/hotel.js"; // Correction du chemin vers les contrôleurs
import { verifyAdmin } from "../utils/verifyToken.js"; // Assurez-vous que ce chemin est correct

const router = express.Router();

// Routes pour les opérations sur les hôtels
router.post("/", verifyAdmin, createHotel); // Créer un nouvel hôtel
router.put("/:id", verifyAdmin, updateHotel); // Mettre à jour un hôtel
router.delete("/:id", verifyAdmin, deleteHotel); // Supprimer un hôtel
router.get("/find/:id", getHotel); // Récupérer un hôtel spécifique
router.get("/", getHotels); // Récupérer tous les hôtels
router.get("/countByCity", countByCity); // Compter les hôtels par ville
router.get("/countByType", countByType); // Compter les hôtels par type
router.get("/room/:id", getHotelRooms); // Récupérer les chambres d'un hôtel

export default router;
