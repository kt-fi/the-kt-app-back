import HttpError from "../../httpError.js";
import Pet from "../../schemas/petSchema.js";
import ErrorLogMessage from "../../schemas/errorLogMessageSchema.js";

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
        const errorLog = new ErrorLogMessage({
          message: err.message,
          component: "Get Pet By ID Controller Backend",
          level: "error",
          timestamp: new Date(),
          notes: null,
          currentSatus: "new",
        });
        await errorLog.save();
         const error = new HttpError("Could Not retrieve Pet ", 500);
        return res.status(500).json({ msg: error.message });
    }

    return res.status(200).json(pet);
};
export default getPetById;