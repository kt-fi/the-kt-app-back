import Message from "../../schemas/messageSchema.js";

import { io } from "../../app.js"; // <-- Add this import

const markMessageRead = async (req, res, next) => {
  const { messageId, userId, senderId } = req.body;


  try {
    const message = await Message.findByIdAndUpdate(messageId, { seen: true });
    if (message) {
      message.save();
    }

    if (!message) {
      return res.status(404).json({ msg: "Message not found" });
    }
    res.json({ msg: "Message marked as read", message });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }

  io.to(senderId).emit("mark_message_seen", {
          messageSeen: true
        });
};

export default markMessageRead;
