const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creating Schema

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: {
        type: String,
    },
    resetTokenLimit: {
        type: Number,
    },

});

module.exports = mongoose.model("user", UserSchema);
