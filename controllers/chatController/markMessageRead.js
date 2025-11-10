import Message from "../../schemas/messageSchema.js";

const markMessageRead = async (req, res, next) => {
  const { messageId, userId } = req.body;
  console.log(req.body);
  console.log("Marking message as read, ID:", messageId);

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
};

export default markMessageRead;
