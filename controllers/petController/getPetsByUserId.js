import User from "../../schemas/userSchema.js";
import HttpError from "../../httpError.js";


const getPetsByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  let user;
  let pets;

  try {
    pets = await User.findOne({ userId }).populate("pets");

    if (pets == null) {
      const error = new HttpError("No pets found", 500);
      res.json({ msg: error.message });
      return next(error);
    }
    res.json(pets.pets);
  } catch (err) {
    const error = new HttpError("Unable to find user", 500);
    res.json({ msg: error.message });
    return next(error);
  }
};

export default getPetsByUserId;