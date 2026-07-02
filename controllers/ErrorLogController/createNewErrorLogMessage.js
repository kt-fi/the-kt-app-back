import ErrorLogMessage from "../../schemas/errorLogMessageSchema.js";
import HttpError from "../../httpError.js";

const createErrorLogMessage = async (req, res, next) => {

    const { message, component, level, currentStatus, meta } = req.body;

    try {
        constructErrorLogMessage(message, component, level, notes, currentStatus, meta);
        res.status(201).json(newErrorLogMessage);
    } catch (err) {
        let error = new HttpError("Creating error log message failed, please try again.", 500);
        return next(error);
    }
};

export async function constructErrorLogMessage(message, component, level, notes, currentStatus, meta){
        const errorLogMessage =new ErrorLogMessage({
            message,    
            component,
            level,
            notes: notes | null,
            currentStatus,
            meta,
        })
        await errorLogMessage.save();
}

export default createErrorLogMessage ;

