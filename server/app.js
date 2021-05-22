const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

app.use(cors())

app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
});
//Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Cookie Parser and Logger
app.use(cookieParser());
app.use(logger('dev'));


//MongoDb config


//Connect to MongoDb
const mongoConnect = require('./utils/databaseConnect').mongoConnect
mongoConnect()
//Registering Schemas
const user = require("./models/userModel");
const song = require("./models/songModel");



//Enabling the server.js to find the file user_register.js
const authRoutes = require('./routes/authRoutes');
const songRoutes = require('./routes/songRoutes');




//Using Routes
app.use('/user/auth', authRoutes);
app.use('/songs', songRoutes);


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server Started on port ${port}`));