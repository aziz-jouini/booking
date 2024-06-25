import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { createError } from "../utils/error.js";

export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};
export const updateRoomAvailability = async (req, res, next) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates
        },
      }
    );
    res.status(200).json("Room status has been updated.");
  } catch (err) {
    next(err);
  }
};
export const deleteRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  try {
    await Room.findByIdAndDelete(req.params.id);
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Room has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};
export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};
export const getHotel = async (req, res, next) => {
    try {
      const hotel = await Hotel.findById(req.params.id);
      res.status(200).json(hotel);
    } catch (err) {
      next(err);
    }
  };
  export const getHotels = async (req, res, next) => {
    // Extrair les valeurs `min` et `max` des paramètres de requête, ainsi que tout autre paramètre
    const { min, max, ...others } = req.query;

    try {
        // Rechercher les hôtels dans la base de données en utilisant les critères de recherche
        const hotels = await Hotel.find({
            // Utilise les autres paramètres de requête pour les filtres
            ...others,
            // Filtrer par prix minimal et maximal
            // `$gt: min || 1` : Si `min` n'est pas défini ou est faux (falsy), utilise 1 par défaut
            // `$lt: max || 999` : Si `max` n'est pas défini ou est faux (falsy), utilise 999 par défaut
            cheapestPrice: { $gt: min || 1, $lt: max || 999 },
        })
        // Limiter le nombre de résultats à la valeur spécifiée dans `req.query.limit`
        .limit(req.query.limit);

        // Répondre avec un statut HTTP 200 et les hôtels trouvés au format JSON
        res.status(200).json(hotels);
    } catch (err) {
        // En cas d'erreur, passer l'erreur au middleware de gestion des erreurs
        next(err);
    }
};
