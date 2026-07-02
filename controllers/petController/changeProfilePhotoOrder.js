import Pet from "../../schemas/petSchema.js";
import ErrorLogMessage from "../../schemas/errorLogMessageSchema.js";

const changeProfilePhotoOrder = async (req, res) => {
    const { petId, userId, photoId } = req.body;

    try {
        const pet = await Pet.findById(petId);
        if(pet.userId.toString() !== userId) {
            return res.status(403).json({ msg: "Unauthorized to change profile photo order for this pet" });
        }

        const photoIndex = pet.photoIds.indexOf(photoId);
        console.log(pet.photoIds);
        if (photoIndex === -1) {
            return res.status(404).json({ msg: "Photo not found in pet's photo list" });
        }

        pet.photoIds.splice(photoIndex, 1);
        pet.photoIds.unshift(photoId);
        await pet.save();
        console.log(`Changed profile photo order for pet ${petId}, moved photo ${photoId} to the front`);
        res.status(200).json({ pet });
    } catch (err) {
        const errorLog = new ErrorLogMessage({
          message: err.message,
          component: "Change Profile Photo Order Controller Backend",
          level: "error",
          timestamp: new Date(),
          notes: null,
          currentSatus: "new",
        });
        await errorLog.save();
        res.status(500).json({ msg: "Error changing profile photo order", error: err.message });
    }

};

export default changeProfilePhotoOrder;