import Message from "../../schemas/messageSchema.js";

import { io } from "../../app.js"; // <-- Add this import

const markMessageRead = async (req, res, next) => {

  const  message  = req.body;
  console.log( "on it", message)
  try {
    const updatedMessage = await Message.findByIdAndUpdate(message.messageId, { seen: true }, { new: true });

    await updatedMessage.save();

    console.log("emitting diude", updatedMessage.senderId.toString())

    io.to(updatedMessage.senderId.toString()).emit("message_seen", {
         chatSeen: updatedMessage.chatId.toString()
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
//   const { messageIds, userId, senderId } = req.body;

// console.log(messageIds)
//   try {
//     let chatId;

//     const messages = await Message.updateMany({ _id: { $in: messageIds } }, { seen: true });

//     // chatId = messages[0].chatId;
//     console.log(messages)
//     // if (messages) {
//     //   messages.save();
//     // }

//     if (!messages) {
//       return res.status(404).json({ msg: "Message not found" });
//     }
//     res.json({ msg: "Message marked as read", messages });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ msg: "Server error", error: err.message });
//   }

  // io.to(senderId).emit("mark_message_seen", {
  //        chatSeen: chatId
  //   });

// ******************************************* OLD CODE ********************************************

        // const { messageId, userId, senderId } = req.body;


  // try {
  //   const message = await Message.findByIdAndUpdate(messageId, { seen: true });
  //   if (message) {
  //     message.save();
  //   }

  //   if (!message) {
  //     return res.status(404).json({ msg: "Message not found" });
  //   }
  //   res.json({ msg: "Message marked as read", message });
  // } catch (err) {
  //   console.error(err);
  //   return res.status(500).json({ msg: "Server error", error: err.message });
  // }

  // io.to(senderId).emit("mark_message_seen", {
  //         messageSeen: true
  //       });
};

export default markMessageRead;
