const authSecret = require('../config/authSecret');
const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
    const bearerToken = req.header('Authorization');
    const token=bearerToken.split(' ')[1]
    //Check Token
    if (!token)
        res.status(401).json({ msg: 'Not Authorised' });
    try {
        //Verify Token
        const decoded = jwt.verify(token, authSecret.secret);
        req.user = decoded;
        next();
    }
    catch (e) {
        res.status(400).json({ msg: 'Token not valid' });

    }
}