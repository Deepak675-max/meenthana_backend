const nodemailer = require('nodemailer');
const httpErrors = require('http-errors');

const mailTransporter = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    secure: false,
    auth: {
        user: 'deepakkamboj6656@gmail.com',
        pass: 'GYbM1AF36Z0rJSQT' // Your SMTP key or password
    },
});


const sendEmail = async (emailConfig) => {
    try {
        // const status = await mailTransporter.sendMail({
        //     from: 'deepakkamboj4672@gmail.com',
        //     to: emailConfig.recipient,
        //     subject: "Forget password email",
        //     text: "please reset your password using following link",
        //     html: '<p>Click <a href="http://localhost/api/auth/reset-password/' + emailConfig.recoveryToken + '">here</a> to reset your password</p>'
        // });

        const status = await mailTransporter.sendMail({
            from: 'deepakkamboj4672@gmail.com',
            to: emailConfig.recipient,
            subject: "registered user email",
            text: "Your registration is successfully compleated.please use this password for login into your account",
            html: `<p>Password: ${emailConfig.password}</p>`
        });


        return status;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    sendEmail
}