const express = require('express');
const app = express();
const mongoose = require("mongoose");
const cors = require('cors')
require('dotenv').config()
let http = require("http").Server(app);
global.io = require('socket.io')(http);

const appRouter = require('./routers/authRouter')


app.use(cors());
app.use(express.json());
app.use("/app", appRouter );

mongoose.set('strictQuery', true);
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PWD}@cluster0.mhax05f.mongodb.net/`)
// mongoose.connect("mongodb://127.0.0.1:27017/kt-app");;


http.listen(process.env.PORT || 3001, ()=>{
    console.log('Server Running')
})
