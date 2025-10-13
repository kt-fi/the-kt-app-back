import HttpError from "../../httpError.js";
import tempUser from "../../schemas/tempUserSchema.js";

import Chat from "../../schemas/chatSchema.js";
import User from "../../schemas/userSchema.js";
import Pet from "../../schemas/petSchema.js";
import TempUser from "../../schemas/tempUserSchema.js";

const createChat = async (req, res, next) => {
  // if user a temp and not signed up create temp User

  const { chatId, senderUserData, recipientData, petId } = req.body;
  console.log(req.body);
  try {
    let user;
    let recipient;
    let pet;

    let chat;

    pet = await Pet.findOne({ _id: petId });

    if (senderUserData != null) {
      user = await User.findOne({ _id: senderUserData.userId });
    }

    recipient = await User.findOne({ _id: recipientData.userId });

    if (chatId != null) {
      chat = await Chat.findOne({ _id: chatId }).populate(["participants", "petId"]);
    }

    if (chatId == null || !chat) {
      chat = await Chat.findOne({
        petId: pet._id,
        participants: { $all: [user._id, recipient._id] },
      }).populate(["participants", "petId"]);
    }

    if (!user || user == null) {
      user = new TempUser({
        userName: senderUserData.userName
          ? senderUserData.userName
          : "Anonymous",
        email: senderUserData.email,
        token: senderUserData.token,
      });
    }
    

    if (!chat) {
       chat = new Chat({
        petId: pet._id,
        messages: [],
        participants: [user._id, recipient._id],
      });
      await chat.save();
    recipient.chats.push(chat);
    await recipient.save();
      chat = await chat.populate(["participants", "petId"]);

      if (senderUserData != null) {
    user.chats.push(chat);
    await user.save();
}
    }



   
    

    if (!recipient) {
      return next(new HttpError("Recipient not found", 404));
    }
    if (!pet) {
      return next(new HttpError("Pet not found", 404));
    }
    res.json({ chat});
  } catch (error) {
    console.log(error);
    return next(new HttpError("Creating chat failed, please try again", 500));
  }
};

export default createChat;
