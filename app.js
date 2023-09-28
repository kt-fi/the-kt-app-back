const server = require('http').createServer();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const io = require('socket.io')(server);
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/katie-app");




server.listen(process.env.PORT || 3001, ()=>{
    console.log('Server Online')
});