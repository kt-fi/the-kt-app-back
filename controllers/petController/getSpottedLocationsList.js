import Pet from "../../schemas/petSchema.js";
import HttpError from "../../httpError.js";
import ErrorLogMessage from "../../schemas/errorLogMessageSchema.js";

const getSpottedLocationsList = async (req, response, next) => {
    const petId = req.params.petId;

    try {
        const pet = await Pet.findById(petId).select('spottedLocations');

        if (!pet) {
            return response.status(404).json({ msg: "Pet not found" });
        }

        response.json({ spottedLocations: pet.spottedLocations });
    } catch (err) {
        const errorLog = new ErrorLogMessage({
          message: err.message,
          component: "Get Spotted Locations List Controller Backend",
          level: "error",
          timestamp: new Date(),
          notes: null,
          currentSatus: "new",
        });
        await errorLog.save();
        const error = new HttpError("Error fetching spotted locations", 500);
        return response.status(500).json({ msg: error.message });
    }
}

export default getSpottedLocationsList;