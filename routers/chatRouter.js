import * as chatController from "../controllers/chatController/chatController.js";

import express from "express";
const router = express.Router();

router.post("/sendMessage", chatController.sendMessage);



export default router;