const express = require('express');
const router = express.Router();

const songController = require('../controllers/songController')
const middleWare = require('../middleware/auth')

router.get('/getAllSongs', songController.getAllSongs);

router.post('/vote/:songId', middleWare.auth, songController.songVote);

router.get('/getUpVoted', middleWare.auth, songController.getUserUpVotedSongs);

router.get('/getTrending', middleWare.auth, songController.getTrendingSongs);


module.exports = router;