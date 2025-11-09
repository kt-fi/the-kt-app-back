import Chat from "../../schemas/chatSchema.js";
import mongoose from "mongoose";
import User from "../../schemas/userSchema.js";
import HttpError from "../../httpError.js";

const getAllChatMessagesById = async (req, res, next) => {
  const { chatId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    let err = new HttpError("Invalid chatId", 400);
    res.status(400).json({ msg: "Server Error" });
    return next(err);
  }

  let chat;
  try {
    chat = await Chat.findById(chatId).populate({
      path: "messages",
      populate: {
        path: "senderId",
        model: User,
        '-password': 0, // Exclude password field
      },
    })
    
    if (!chat) {
      let err = new HttpError("Chat not found", 404);
      res.status(404).json({ msg: "Chat not found" });
      return next(err);
    }
    res.status(200).json({ messages: chat.messages });
  } catch (error) {
    let err = new HttpError(
      "Fetching chat messages failed, please try again later.",
      500
    );
    res
      .status(500)
      .json({ msg: "Fetching chat messages failed, please try again later." });
    return next(err);
  }
};

export default getAllChatMessagesById;
// filepath: d:\Programming\Katie App 2024\the-kt-app-back\controllers\chatController\getAllChatMessagesById.js
