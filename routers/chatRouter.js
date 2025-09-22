import * as chatController from "../controllers/chatController/chatController.js";

import express from "express";
const router = express.Router();

router.post("/createChat", chatController.getChat);
router.post("/sendMessage", chatController.sendMessage);
router.get("/getAllChatMessagesById/:chatId", chatController.getAllChatMessagesById);
router.get("/getChatById/:chatId", chatController.getChatById);
router.get("/getAllUserChats/:userId", chatController.getAllUserChats);

export default router;