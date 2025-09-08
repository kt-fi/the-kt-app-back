import Pet from "../../schemas/petSchema.js";
import User from "../../schemas/userSchema.js";
import location from "../../schemas/locationSchema.js";
import HttpError from "../../httpError.js";
import cloudinary from "../../utils/cloudinary.js";
import mongoose from "mongoose";
const deletePetById = async (req, res, next) => {
  const petId = req.params.petId;

  const sess = await mongoose.startSession();
  sess.startTransaction();

  try {
    const pet = await Pet.findOneAndDelete({ petId: petId }, { session: sess });
    if (!pet) {
      await sess.abortTransaction();
      sess.endSession();
      const error = new HttpError("Pet Not Found", 404);
      return res.status(404).json({ msg: error.message });
    }

      const user = await User.findOneAndUpdate(
      { userId: pet.userId },
      { $pull: { pets: pet._id } },
      { session: sess }
    );
    if (!user) {
      await sess.abortTransaction();
      sess.endSession();
      const error = new HttpError("User Not Found", 404);
      return res.status(404).json({ msg: error.message });
    }

    if (pet.locationLastSeen) {
      const locationDocument = await location.findOneAndDelete(
        { _id: pet.locationLastSeen },
        { session: sess }
      );
      if (!locationDocument) {
        await sess.abortTransaction();
        sess.endSession();
        const error = new HttpError("Location Not Found", 404);
        return res.status(404).json({ msg: error.message });
      }
    }

    await sess.commitTransaction();
    sess.endSession();

    cloudinary.uploader.destroy(
      `ktApp-petMainPic/${petId}`,
      function (error, result) {
        console.log(result, error);
      }
    );

    res.json({ msg: "Pet Deleted Successfully", petId: pet.petId });
  } catch (err) {
    await sess.abortTransaction();
    sess.endSession();
    const error = new HttpError("Error Deleting Pet", 500);
    return res.status(500).json({ msg: error.message });
  }
};

export default deletePetById;
