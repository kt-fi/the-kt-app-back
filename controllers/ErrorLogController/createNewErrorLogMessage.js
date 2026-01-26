import ErrorLogMessage from "../../schemas/errorLogMessageSchema.js";
import HttpError from "../../httpError.js";

const createErrorLogMessage = async (req, res, next) => {

    const { message, component, level, currentStatus, meta } = req.body;

    try {
        const newErrorLogMessage = new ErrorLogMessage({
            message,    
            component,
            level,
            notes: null,
            currentStatus,
            meta,
        })
        const savedMessage = await newErrorLogMessage.save();
        res.status(201).json(savedMessage);
    } catch (err) {
        let error = new HttpError("Creating error log message failed, please try again.", 500);
        return next(error);
    }
};

export default createErrorLogMessage ;

