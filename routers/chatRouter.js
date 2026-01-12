import * as chatController from "../controllers/chatController/chatController.js";

import express from "express";
const router = express.Router();

router.post("/createChat", chatController.createChat);
router.post("/sendMessage", chatController.sendMessage);
router.get("/getAllChatMessagesById/:chatId", chatController.getAllChatMessagesById);
router.get("/getChatById/:chatId", chatController.getChatById);
router.get("/getAllUserChats/:userId", chatController.getAllUserChats);

router.post("/markMessageRead", chatController.markMessageRead);

router.post("/quickMessage", chatController.quickMessage);

export default router;