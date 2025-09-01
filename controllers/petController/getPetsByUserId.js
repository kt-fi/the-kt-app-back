import User from "../../schemas/userSchema.js";
import HttpError from "../../httpError.js";

const getPetsByUserId = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await User.findOne({ userId })
    .populate("pets")
    .populate("location");

    if (!user || !user.pets || user.pets.length === 0) {
      const error = new HttpError("No pets found for this user", 404);
      return res.status(404).json({ msg: error.message });
    }
    res.json(user.pets);
  } catch (err) {
    const error = new HttpError("Unable to find user", 500);
    return res.status(500).json({ msg: error.message });
  }
};

export default getPetsByUserId;