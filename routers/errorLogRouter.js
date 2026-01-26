import express from "express";

import  createErrorLogMessage  from "../controllers/ErrorLogController/createNewErrorLogMessage.js";
import  getAllErrorLogMessages  from "../controllers/ErrorLogController/getAllErrorLogMessages.js";

const router = express.Router();   

router.post("/newErrorLogMessage", createErrorLogMessage);
router.get("/allErrorLogMessages", getAllErrorLogMessages);

export default router;