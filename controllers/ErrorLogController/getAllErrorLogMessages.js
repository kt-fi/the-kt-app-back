import ErrorLogMessage from "../../schemas/errorLogMessageSchema.js";
import HttpError from "../../httpError.js";


const createErrorLogMessage = async (req, res, next) => {

    try {
        let allMessages = await ErrorLogMessage.find().sort({ createdAt: -1 });
        res.status(200).json(allMessages);
    } catch (err) {
        let error = new HttpError("Fetching error log messages failed, please try again.", 500);
        return next(error);
    }
};

export default createErrorLogMessage;