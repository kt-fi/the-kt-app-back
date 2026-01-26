import mongoose from "mongoose";

const errorLogMessageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    component: {
        type: String,
    },
    level: {
        type: String,
        enum: ['info', 'warn', 'error', 'fatal'],
        default: 'error',
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
    },
    notes: {
        type: String,
        default: null,
    },
    currentStatus: {
        type: String,
        enum: ['new', 'in_progress', 'resolved'],
        default: 'new',
        required: true,
    },
   
});

export default mongoose.model('ErrorLogMessage', errorLogMessageSchema);