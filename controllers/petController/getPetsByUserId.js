import User from "../../schemas/userSchema.js";
import HttpError from "../../httpError.js";

const getPetsByUserId = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await User.findOne({ userId }).populate("pets");

    if (!user || !user.pets || user.pets.length === 0) {
      const error = new HttpError("No pets found for this user", 404);
      res.status(404).json({ msg: error.message });
      return next(error);
    }

    res.json(user.pets);
  } catch (err) {
    const error = new HttpError("Unable to find user", 500);
    res.status(500).json({ msg: error.message });
    return next(error);
  }
};

export default getPetsByUserId;