import Pet from '../../schemas/petSchema.js';
import ErrorLogMessage from "../../schemas/errorLogMessageSchema.js";

const addPetPhotoToPet = async (req, res) => {
  const { petId, userId, photoId } = req.body;
    

    try {
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ msg: "Pet not found" });
        } 
        if (pet.userId.toString() !== userId) {
            return res.status(403).json({ msg: "Unauthorized to add photo to this pet" });
        }  
        pet.photoIds.push(photoId);
        await pet.save();
        console.log(`Added photo ${photoId} to pet ${petId}`);
        res.status(200).json({ pet });
    } catch (err) {
        const errorLog = new ErrorLogMessage({
          message: err.message,
          component: "Add Pet Photo To Pet Controller Backend",
          level: "error",
          timestamp: new Date(),
          notes: null,
          currentSatus: "new",
        });
        await errorLog.save();
        res.status(500).json({ msg: "Error adding photo to pet", error: err.message });
    }
    
};

export default addPetPhotoToPet;