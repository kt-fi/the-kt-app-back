import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

dotenv.config();

const app = express();
const http = createServer(app);
global.io = new SocketIOServer(http);
import * as cloudinary from './utils/cloudinary.js';

import appRouter from './routers/authRouter.js';
import petRouter from './routers/petRouter.js';

app.use(cors());
app.use(express.json({limit: '100mb', extended: true}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(express.text({limit: '100mb', extended: true}));
app.use("/app", appRouter );
app.use('/pets', petRouter)

mongoose.set('strictQuery', true);
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PWD}@cluster0.mhax05f.mongodb.net/`)
// mongoose.connect("mongodb://127.0.0.1:27017/kt-app");;


http.listen(process.env.PORT || 3001, ()=>{
    console.log('Server Running')
})
