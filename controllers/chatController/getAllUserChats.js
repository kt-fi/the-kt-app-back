import Chat from "../../schemas/chatSchema.js";
import User from "../../schemas/userSchema.js";
import HttpError from "../../httpError.js";
import ErrorLogMessage from "../../schemas/errorLogMessageSchema.js";

const getAllUserChats = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({ _id: userId }).populate({
      path: "chats",
      populate: [
        {
          path: "messages",
          model: "Message",
          populate: {
            path: "senderId",
            model: "User",
          },
        },
        {
          path: "petId",
          model: "Pet", // Place an If For when pet has been removed or set a ****!!Conversation Rermoved Situatiobn!!****
        },
        { path: "participants", model: "User", select: "-password" }, // Exclude password field
      ],
    });
    if (!user) {
      let error = new HttpError("User not found", 404);
      res.status(404).json({ msg: error.message });
      return next(error);
    }
 
    return res.status(200).json(user.chats);
  } catch (err) {
     const errorLog = new ErrorLogMessage({
          message: err.message,
          component: "GetAllUserChats Controller Backend",
          level: "error",
          timestamp: new Date(),
          notes: null,
          currentSatus: "new",
        });
        await errorLog.save();
    let error = new HttpError("Server error", 500);
    res.status(500).json({ msg: error.message });
    return next(error);
  }
};
export default getAllUserChats;
