import User from "../../schemas/userSchema.js";
import HttpError from "../../httpError.js";
import ErrorLogMessage from "../../schemas/errorLogMessageSchema.js";

const getPetsByUserId = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await User.findOne({ _id: userId })
    .populate("pets")
    .populate("location");

    if (!user || !user.pets || user.pets.length === 0) {
      const error = new HttpError("No pets found for this user", 404);
      return res.status(404).json({ msg: error.message });
    }
    res.json(user.pets);
  } catch (err) {
    const errorLog = new ErrorLogMessage({
          message: err.message,
          component: "Get Pets By User ID Controller Backend",
          level: "error",
          timestamp: new Date(),
          notes: null,
          currentSatus: "new",
        });
        await errorLog.save();
    const error = new HttpError("Unable to find user", 500);
    return res.status(500).json({ msg: error.message });
  }
};

export default getPetsByUserId;