require('dotenv').config()
const nodemailer = require('nodemailer')

const transporter= nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    secure: false,
    requireTLS: true,
    auth:{
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASSWORD
    }
})

console.log(process.env.SMPT_HOST);
console.log(process.env.SMPT_PORT);
console.log("SMTP Mail: ",process.env.SMPT_MAIL);
console.log("SMTP Password: ",process.env.SMPT_PASSWORD);

const sendMail=async(email,subject,content)=>{
    try {
        var mailOptions={
            from: process.env.SMPT_MAIL,
            to: email,
            subject: subject,
            html: content
        }
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error)
            {
                console.log(error);
            }
            // console.log("Mail sent: ",info.messageId);
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {sendMail}