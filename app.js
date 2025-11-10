import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

dotenv.config();

const app = express();
const http = createServer(app);

const server = createServer(app);

const io = new SocketIOServer(server, {
  cors: {
     origin: [
      "*"
    ],
    methods: ["GET", "POST"]
  }
});

export { io, userSocketMap };

import * as cloudinary from './utils/cloudinary.js';

import appRouter from './routers/authRouter.js';
import petRouter from './routers/petRouter.js';
import chatRouter from './routers/chatRouter.js';
import locationRouter from './routers/locationRouter.js';

// app.use((req, res, next) => {
//   console.log(`[${req.method}] ${req.originalUrl}`);
//   next();
// });
const userSocketMap = new Map();

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  // Associate userId with socket.id
  console.log('User connected:', userId, socket.id);
if (userId) {
    socket.join(userId); // <-- This is the missing line!
    console.log(`Socket ${socket.id} joined room ${userId}`);
        io.to(userId).emit('new_message', { text: 'Hello after join!' });

  }
  
  socket.on('disconnect', () => {
    if (socket.userId) {
      userSocketMap.delete(socket.userId);
      console.log('User disconnected:', socket.userId, socket.id);
    }
  });
});




app.use(cors());

app.use(express.json({limit: '100mb', extended: true}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(express.text({limit: '100mb', extended: true}));
app.use("/app", appRouter );
app.use('/pets', petRouter);
app.use('/chat', chatRouter);
app.use('/location', locationRouter);

// app.use((err, req, res, next) => {
//   console.error('MULTER/EXPRESS ERROR:', err);
//   res.status(500).json({ error: err.message });
// });

mongoose.set('strictQuery', true);
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PWD}@cluster0.mhax05f.mongodb.net/`)
// mongoose.connect("mongodb://127.0.0.1:27017/kt-app");;



server.listen(process.env.PORT || 3001, ()=>{
    console.log('Server Running')
})
