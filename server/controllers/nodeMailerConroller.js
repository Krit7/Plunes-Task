const nodemailer = require('nodemailer');
const nodeMailerConfig=require('../config/nodeMailerConfig')
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    port: 465,
    auth: {
        user: `${nodeMailerConfig.email}`,
        pass: `${nodeMailerConfig.password}`
    }
});
const sendWelcomeMail = (userDetails) => {
    var mailOptions = {
        from: `${nodeMailerConfig.email}`,
        to: `${userDetails.email}`,
        subject: 'Welcome Mail',
        html: `
        <p>Hi</p>

        <p>Welcome aboard!</p>

        <p>Welcome Email</p>

        `
    };
    return transporter.sendMail(mailOptions)

}

const sendResetMail = (userDetails, resetURL) => {
    var mailOptions = {
        from: `${nodeMailerConfig.email}`,
        to: `${userDetails.email}`,
        subject: 'Reset Password Mail',
        html: `
        <style>
        .button {
          background-color: #f4511e;
          border: none;
          color: white;
          padding: 16px 32px;
          text-align: center;
          font-size: 16px;
          margin: 4px 2px;
          opacity: 0.6;
          transition: 0.3s;
          display: inline-block;
          text-decoration: none;
          cursor: pointer;
        }

        .button:hover {opacity: 1}
        </style>

        <h3>Hi</h3>

        <p>Greetings </p>
        <p>We received a request for a password change on your account.</p>
        <p>You can reset your password by clicking the link <span>Reset Link :- ${resetURL}</span>or click the button below to reset it.</p>
        
        <p>Thanks</p>

        `
    };
    return transporter.sendMail(mailOptions)
}

module.exports = {
    sendWelcomeMail,
    sendResetMail
}
