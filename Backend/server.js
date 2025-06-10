const express = require("express");
const app = express();


// add cookie parser

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// load config from env file

require("dotenv").config();

const PORT = process.env.PORT || 4000;

// middleware

app.use(express.json());



const authRoutes = require("./Routes/userRoutes");

// mount 

app.use("/api/v1",authRoutes);

// fetch db

const database = require("./config/db");
database();

// start the server

app.listen(PORT,()=>{
    console.log(`server started successfully at port no. ${PORT}`)
});

app.get("/",(req,res)=>{
    res.send(`<h1> uber clone loading...</h1>`)
})
