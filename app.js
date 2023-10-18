const express = require('express');
const app = express();
const mongoose = require("mongoose");
const cors = require('cors')
require('dotenv').config()
let http = require("http").Server(app);
global.io = require('socket.io')(http);

const appRouter = require('./routers/authRouter')
const petRouter = require('./routers/petRouter')

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
