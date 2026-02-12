import Pet from "../../schemas/petSchema.js";
import HttpError from "../../httpError.js";

const getSpottedLocationsList = async (req, response, next) => {
    const petId = req.params.petId;

    try {
        const pet = await Pet.findById(petId).select('spottedLocations');

        if (!pet) {
            return response.status(404).json({ msg: "Pet not found" });
        }

        response.json({ spottedLocations: pet.spottedLocations });
    } catch (err) {
        const error = new HttpError("Error fetching spotted locations", 500);
        return response.status(500).json({ msg: error.message });
    }
}

export default getSpottedLocationsList;