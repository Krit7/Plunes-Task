const mongoose = require('mongoose')
const song = mongoose.model('song');
const ObjectId = require('mongodb').ObjectID;

exports.getAllSongs = (req, res, next) => {
    song
        .find({})
        .then(fetchedSongs => {
            res.status(200).json({
                success: true,
                songs: fetchedSongs
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                success: false,
                message: err
            })
        })
}
exports.songVote = (req, res, next) => {
    const user=req.user
    const { voteType } = req.body
    const songId = ObjectId(req.params.songId)
    song
        .findOne({
            _id: songId
        })
        .then(fetchedSong => {
            if (voteType === "upVote") {
                fetchedSong['upVotes'] = fetchedSong['upVotes'] + 1
                if (!fetchedSong.usersUpVoted.includes(songId)) {
                    fetchedSong.usersUpVoted.push(ObjectId(user.id))
                }
                fetchedSong.markModified('upVotes')
                fetchedSong.markModified('usersUpVoted')
            } else if (voteType === "downVote") {
                fetchedSong['downVotes'] = fetchedSong['downVotes'] + 1
                if (!fetchedSong.usersDownVoted.includes(songId)) {
                    fetchedSong.usersDownVoted.push(ObjectId(user.id))
                }
                fetchedSong.markModified('upVotes')
                fetchedSong.markModified('usersDownVoted')
            }
            fetchedSong
                .save()
                .then(() => {
                    res.status(200).json({
                        success: true,
                        message: `${voteType}d!`
                    })
                })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                success: false,
                message: err
            })
        })
}
exports.getTrendingSongs = (req, res, next) => {
    song
        .find({})
        .sort({
            upVotes: -1
        })
        .then(fetchedSongs => {
            res.status(200).json({
                success: true,
                songs: fetchedSongs
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                success: false,
                message: err
            })
        })
}
exports.getUserUpVotedSongs = (req, res, next) => {
    const user=req.user
    song
        .find({
            usersUpVoted: {
                $in: [ObjectId(user.id)]
            }
        })
        .sort({
            upVotes: 1
        })
        .then(fetchedSongs => {
            res.status(200).json({
                success: true,
                songs: fetchedSongs
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                success: false,
                message: err
            })
        })
}