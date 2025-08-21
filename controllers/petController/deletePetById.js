import Pet from "../../schemas/petSchema.js";
import HttpError from "../../httpError.js";


const deletePetById = async (req, res, next) => {
  const petId = req.params.petId;
  let pet;

  try {
    pet = await Pet.findOneAndDelete({ petId: petId });
    if (!pet) {
      const error = new HttpError("Pet Not Found", 404);
      res.json({ msg: error.message });
      return next(error);
    }
  } catch (err) {
    const error = new HttpError("Error Deleting Pet", 500);
    res.json({ msg: error.message });
    return next(error);
  }

  res.json({ msg: "Pet Deleted Successfully", petId: pet.petId });
};


export default deletePetById;