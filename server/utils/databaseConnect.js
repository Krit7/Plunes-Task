var mongoose = require("mongoose");

const dbConfig = require("../config/databaseConfig.js");

//connecting to the database
const mongoConnect = () => {
    mongoose
        .connect(dbConfig.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        .then(() => {
            console.log("Successfully connected to the database");
        })
        .catch(err => {
            console.log("Could not connect to the database.", err);
            process.exit();
        });
}

module.exports = {
    mongoConnect
}