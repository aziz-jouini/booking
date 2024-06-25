import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
export const createHotel = async (req, res, next) => {
    const newHotel = new Hotel(req.body);
    try {
        const savedHotel = await newHotel.save();
        res.status(200).json(savedHotel);
    } catch (err){
        next(err);
    }

    
};
export const updateHotel = async (req, res, next) => {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {new: true}
        );
        res.status(200).json(updatedHotel);

    } catch (err) {
        next(err);
    }
}; 
export const deleteHotel = async(req,res, next) => {
    try{
        await Hotel.findByIdAndDelete(req.params.id);
        res.status(200).json("Hotel has been deleted");
        
    } catch (err){
        next(err);
    }
};
export const countByCity = async (req,res, next)=> {
    const cities = req.query.cities.split(",");
    try {
         const list = await Promise.all(
            cities.map((city)=> {
                return Hotel.countDocuments({ city: city });
            })
         );
    } catch (err){
        next(err);
    }

};
export const countByType = async (req,res, next) =>{
try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });
    res.status(200).JSON([
        { type: "hotel", count: hotelCount},
        { type: "apartements", count: apartmentCount},
        { type: "resorts", count: resortCount},
        { type: "villas", count: villaCount},
        { type: "cabins", count: cabinCount},
    ]);

} catch(err){
    next(err);
}
};
export const getHotelRooms = async (req, res, next) => {
    try {
        // Cherche l'hôtel par son identifiant dans la base de données
        const hotel = await Hotel.findById(req.params.id);
        
        // Utilise Promise.all pour récupérer les détails des chambres en parallèle
        const list = await Promise.all(
            hotel.rooms.map((roomId) => {
                // Cherche chaque chambre par son identifiant dans la liste des chambres de l'hôtel
                return Room.findById(roomId);
            })
        );
        
        // Envoie la liste des chambres en réponse avec un statut HTTP 200
        res.status(200).json(list);
    } catch (err) {
        // Passe l'erreur au middleware de gestion des erreurs
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
    const { min, max, ...others } = req.query;
    try {
      const hotels = await Hotel.find({
        ...others,
        cheapestPrice: { $gt: min | 1, $lt: max || 999 },
      }).limit(req.query.limit);
      res.status(200).json(hotels);
    } catch (err) {
      next(err);
    }
  };