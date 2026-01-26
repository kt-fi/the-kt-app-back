import Chat from "../../schemas/chatSchema.js";
import mongoose from "mongoose";
import HttpError from "../../httpError.js";
import Message from "../../schemas/messageSchema.js";


import { io } from "../../app.js"; // <-- Add this import

const getChatById = async (req, res, next) => {
  
  const {chatId, userId} = req.params;

  let messages;
  let senderId;

  try {
    // Update only messages where senderId is NOT the user and seen is false
    messages = await Message.updateMany(
      {
        chatId: chatId,
        senderId: { $ne: userId }, // Only messages not sent by the user
        seen: false
      },
      { $set: { seen: true } }
    );
    
    const chat = await Chat.findById(chatId).populate({
      path: 'messages',
      populate: [
    {
      path: 'senderId',
      model: 'User',
      select: '-password'
    }
  ]
    }).populate('participants', '-password').populate('petId');
    if (!chat) {
      let err = new HttpError("Chat not found", 404);
      res.status(404).json({ msg: err.message });
      return next(err);
    }

senderId = chat.participants.find(participant => participant._id.toString() !== userId)._id.toString();    

console.log(senderId)

    io.to(senderId).emit("message_seen", {
         chatSeen: chatId
    });

    return res.status(200).json({ chat });
  } catch (err) {
    let error = new HttpError(err.message, 500);
    res.status(500).json({ msg: error.message });
    return next(error);
  }

    
};

export default getChatById;
