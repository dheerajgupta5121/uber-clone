const dotenv= require('dotenv');
dotenv.config();



const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

// add cookie parser

const cookieParser = require("cookie-parser");
app.use(cookieParser());


const connectDB = require('./config/db');
connectDB();


app.get('/', (req, res) => {
    res.send('Uber clone!');
});

module.exports = app;