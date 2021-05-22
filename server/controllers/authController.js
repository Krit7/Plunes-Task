const bcrypt = require('bcryptjs');
const authSecret = require('../config/authSecret');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const nodeMailer = require('./nodeMailerConroller')

const user = mongoose.model('user');
const BASE_URL = 'http://localhost:3000/user/auth/resetPassword/'

const generateResetPasswordData = () => {
    const resetToken = Math.random().toString(36).toUpperCase().slice(2) + Math.random().toString(36).slice(2)
    const today = new Date();
    const resetTokenLimit = new Date(today)
    resetTokenLimit.setDate(resetTokenLimit.getDate() + 1)
    return [resetToken, resetTokenLimit.valueOf()]
}
exports.verifySignup = (req, res, next) => {
    const email = req.body.email ? req.body.email : ''
    if (email === '') {
        return res.status(400).json({
            success: false,
            message: `Please Enter an email id to proceed to signup`
        })
    }
    user.findOne({
        email: email
    })
        .then(fetchedUser => {
            if (fetchedUser) {
                res.status(400).json({
                    success: false,
                    message: `User already Exist with email ${email}`
                })
            } else {
                next()
            }
        })
}

exports.userSignUp = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    const password2 = req.body.password2

    if (!email || !password || !password2) {
        return res.status(400).json({
            success: false,
            message: `Please Enter all the details!`
        })
    }
    if (password !== password2) {
        return res.status(400).json({
            success: false,
            message: `Different Passwords!`
        })
    }
    bcrypt.hash(password, 10).then(hashedPassword => {
        user.create({
            email,
            password: hashedPassword,
            resetToken: '',
            resetTokenLimit: 0
        })
            .then(createdUser => {
                if (createdUser) {
                    res.status(200).json({
                        success: true,
                        message: `User Created Successfully. Please Login`
                    })
                    nodeMailer
                        .sendWelcomeMail(createdUser)
                        .then(() => {
                            console.log('Mail Sent')
                        })
                        .catch(err => {
                            console.log(err)
                            console.log('Mail Not Sent')
                        })
                }
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    success: false,
                    message: err
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

exports.userLogin = (req, res, next) => {
    const { email, password } = req.body;

    //Simple Validation
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please fill all fields' });
    }

    //Check for existing user
    user.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ msg: 'User Does Not Exists!' });
            }
            //Validating Password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch)
                        return res.status(400).json({ msg: "Invalid Email or Password!" });
                    else {
                        jwt.sign({
                            id: user._id
                        },
                            authSecret.secret,
                            {
                                expiresIn: '2630000s'
                            },
                            (err, token) => {
                                if (err)
                                    throw err;
                                else {
                                    res.json({
                                        token,
                                        user: {
                                            id: user._id,
                                            email: user.email
                                        }
                                    });
                                }
                            });
                    }
                })
        })
}

exports.generateResetLink = (req, res, next) => {
    const { email } = req.body
    //Simple Validation
    if (!email) {
        return res.status(400).json({ msg: 'Please fill all fields' });
    }
    user.findOne({ email: email })
        .then(fetchedUser => {
            if (!fetchedUser) {
                return res.status(400).json({ msg: `User with email ${email} does not exit!` });
            } else {
                const [resetToken, resetTokenLimit] = generateResetPasswordData()
                fetchedUser.resetToken = resetToken
                fetchedUser.resetTokenLimit = resetTokenLimit
                const resetURL = BASE_URL + fetchedUser._id + '/' + resetToken
                fetchedUser.save()
                    .then(updatedUser => {
                        nodeMailer
                            .sendResetMail(updatedUser, resetURL)
                            .then(() => {
                                console.log('Mail Sent')
                                console.log('User Updated')
                                res.status(200).json({
                                    msg: `Reset Link Sent To ${email}`
                                })
                            })
                            .catch(err => {
                                console.log(err)
                                console.log('Mail Not Sent')
                            })

                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({
                            msg: 'Mail Not Sent!',
                            error: err
                        });

                    })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                msg: 'Mail Not Sent!',
                error: err
            });
        })
}

exports.getResetPassword = (req, res, next) => {
    const userId = req.params.userId
    const resetToken = req.params.resetToken

    user.findOne({ _id: userId })
        .then(fetchedUser => {
            if (!fetchedUser) {
                return res.status(400).json({ msg: 'User Not Found!' });
            } else {
                const today = new Date().valueOf()
                // console.log(fetchedUser.resetTokenLimit > today)
                // console.log(fetchedUser.resetToken == resetToken)
                if (fetchedUser.resetTokenLimit > today && fetchedUser.resetToken == resetToken) {
                    res.status(200).json(fetchedUser)
                } else {
                    fetchedUser.resetTokenLimit = 0
                    fetchedUser.resetToken = 'expired'
                    fetchedUser.save()
                        .then(updateUser => {
                            console.log(updateUser)
                            res.status(400).json({ msg: 'Reset Token Expired' });
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            }
        })
        .catch(err => {
            console.log(err)
        })
}

exports.postResetPassword = (req, res, next) => {
    const { email, password, password2 } = req.body;
    const userId = req.params.userId
    const resetToken = req.params.resetToken
    //Simple Validation
    if (!email || !password || !password2) {
        return res.status(400).json({ msg: 'Please fill all fields' });
    }
    if (password != password2) {
        return res.status(400).json({ msg: 'Password Does Not Match' });
    }
    user.findOne({
        _id: userId
    })
        .then(fetchedUser => {
            if (!fetchedUser) {
                return res.status(400).json({ msg: 'User Not Found!' });
            } else {
                const today = new Date().valueOf()
                // console.log(fetchedUser.resetTokenLimit > today)
                // console.log(fetchedUser.resetToken == resetToken)
                if (fetchedUser.resetTokenLimit > today && fetchedUser.resetToken == resetToken) {
                    bcrypt.genSalt(10)
                        .then(generatedSalt => {
                            bcrypt.hash(password, generatedSalt)
                                .then(hashedPassword => {
                                    fetchedUser.password = hashedPassword
                                    fetchedUser.resetTokenLimit = 0
                                    fetchedUser.resetToken = 'changed'
                                    fetchedUser.save()
                                        .then(updatedUser => {
                                            console.log('Password Changed')
                                            res.status(200).json({ msg: 'Password Changed Successfully!' })
                                        })
                                        .catch(err => {
                                            res.status(500).json({ msg: 'Password Not Changed!' });
                                        })
                                })
                                .catch(err => {
                                    res.status(500).json({ msg: 'Password Not Changed!' });
                                })
                        })
                        .catch(err => {
                            res.status(500).json({ msg: 'Password Not Changed!' });
                        })
                } else {
                    fetchedUser.resetTokenLimit = 0
                    fetchedUser.resetToken = 'expired'
                    fetchedUser.save()
                        .then(updateUser => {
                            res.status(400).json({ msg: 'Reset Token Expired' });
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            }
        })
}
