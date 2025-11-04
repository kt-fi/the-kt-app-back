import HttpError from "../../httpError.js";
import Pet from "../../schemas/petSchema.js";

const getPetById = async (req, res) => {
    const petId = req.params.petId;


    let pet;
    try {

        pet = await Pet.findById(petId).populate(["locationLastSeen"]);

        if(!pet) {
            const error = new HttpError("Could Not find Pet or something went wrong! ", 404);
            return res.status(404).json({ msg: error.message });
        }

    }catch(err) {
         const error = new HttpError("Could Not retrieve Pet ", 500);
        return res.status(500).json({ msg: error.message });
    }

    return res.status(200).json(pet);
};
export default getPetById;