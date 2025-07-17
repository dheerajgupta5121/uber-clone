const express = require("express");
const app = express();
const http = require("http");
const { initializeSocket } = require('./socket');


// add cookie parser

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// load config from env file

require("dotenv").config();

const cors = require('cors');
app.use(cors());


// middleware

app.use(express.json());

const PORT = process.env.PORT || 4000;



const userRoutes = require("./Routes/userRoutes");
const CaptainRoutes = require("./Routes/captainRoute"); 
const mapRoutes = require("./Routes/mapRoutes");
const rideRoutes = require("./Routes/rideRoutes");


// mount 

app.use("/api/v1",userRoutes);
app.use("/api/v1/captain",CaptainRoutes);
app.use("/api/v1/maps",mapRoutes);
app.use("/api/v1/rides",rideRoutes); 


// fetch db

const database = require("./config/db");
const { Server } = require("socket.io");
database();

// start the server
const server = http.createServer(app);
initializeSocket(server);

server.listen(PORT,()=>{
    console.log(`server started successfully at port no. ${PORT}`)
});



app.get("/",(req,res)=>{
    res.send(`<h1> uber clone loading...</h1>`)
})
 