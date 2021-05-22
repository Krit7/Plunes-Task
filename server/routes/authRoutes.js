const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController')

router.post('/singUp',authController.verifySignup, authController.userSignUp);

router.post('/login', authController.userLogin);

router.post('/generateResetLink', authController.generateResetLink);

router.get('/resetPassword/:userId/:resetToken', authController.getResetPassword);

router.post('/resetPassword/:userId/:resetToken', authController.postResetPassword);
module.exports = router;