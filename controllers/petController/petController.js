import Pet from "../../schemas/petSchema.js";
import User from "../../schemas/userSchema.js";
import HttpError from "../../httpError.js";
import Location from "../../schemas/locationSchema.js";

export { default as addNewPet } from './addNewPet.js';
export { default as getPetsByUserId } from './getPetsByUserId.js';
export { default as uploadPhoto } from './uploadPhoto.js';
export { default as getAllLostPets } from './getAllLostPets.js';
export { default as deletePetById } from './deletePetById.js';
export { default as updatePetById } from './updatePetById.js';

// TEST METHOD -----------------------------------------------------------------------
const deleteAllPets = async (req, res, next) => {
  try {
    await Pet.deleteMany({});
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    const error = new HttpError("Error deleting pets", 500);
    res.status(500).json({ msg: error.message });
    return next(error);
  }
};

export { deleteAllPets };