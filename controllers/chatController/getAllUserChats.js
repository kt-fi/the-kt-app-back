import Chat from "../../schemas/chatSchema.js";
import User from "../../schemas/userSchema.js";
import HttpError from "../../httpError.js";

const getAllUserChats = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({ userId }).populate({
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
      model: "Pet",
    },
  ],
    });
    if (!user) {
      let error = new HttpError("User not found", 404);
      res.status(404).json({ msg: error.message });
      return next(error);
    }
    return res.status(200).json(user.chats);
  } catch (err) {
    let error = new HttpError("Server error", 500);
    res.status(500).json({ msg: error.message });
    return next(error);
  }
};
export default getAllUserChats;
