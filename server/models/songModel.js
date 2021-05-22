const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const songSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: String,
    },
    album: {
        type: String,
    },
    artist: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    upVotes: {
        type: Number,
        default: 0
    },
    downVotes: {
        type: Number,
        default: 0
    },
    usersUpVoted: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    usersDownVoted: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ]
})

const song = mongoose.model("song", songSchema)

module.exports = song