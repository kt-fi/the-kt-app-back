import Pet from "../../schemas/petSchema.js";
import User from "../../schemas/userSchema.js";
import HttpError from "../../httpError.js";
import { deletePet } from "../../utils/deleteDocuments.js";
import ErrorLogMessage from "../../schemas/errorLogMessageSchema.js";


const deleteUser = async (req, res) => {
  const userId = req.params.userId;
    try {   
    const user = await User.findOneAndDelete({ _id: userId });
    if (!user) {
      const error = new HttpError("User Not Found", 404);
      return res.status(404).json({ msg: error.message });
    }

    const usersPets = await Pet.find({ userId: user._id });

    for (const pet of usersPets) {
      await deletePet(pet);
      await Pet.findOneAndDelete({ _id: pet._id });
    }

    res.json({ msg: "User Deleted Successfully", userId: user._id });
  } catch (err) {
    const errorLog = new ErrorLogMessage({
          message: err.message,
          component: "Delete User Controller Backend",
          level: "error",
          timestamp: new Date(),
          notes: null,
          currentSatus: "new",
        });
        await errorLog.save();
    const error = new HttpError("Error Deleting User", 500);
    return res.status(500).json( err );
  }
};

export default deleteUser;