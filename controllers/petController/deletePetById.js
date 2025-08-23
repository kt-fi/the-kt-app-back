import Pet from "../../schemas/petSchema.js";
import HttpError from "../../httpError.js";

const deletePetById = async (req, res, next) => {
  const petId = req.params.petId;

  try {
    const pet = await Pet.findOneAndDelete({ petId: petId });
    if (!pet) {
      const error = new HttpError("Pet Not Found", 404);
      return res.status(404).json({ msg: error.message });

    }
    res.json({ msg: "Pet Deleted Successfully", petId: pet.petId });
  } catch (err) {
    const error = new HttpError("Error Deleting Pet", 500);
    return res.status(500).json({ msg: error.message });
  }
};

export default deletePetById;