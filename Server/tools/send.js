const nodemailer = require('nodemailer');

class Email {
    constructor() {
        this.transport = nodemailer.createTransport(
            {
                host: 'smtp.gmail.com', 
                port: '465', 
                secure: true, 
                auth: {
                    type: 'login', 
                    user: 'catalantt@gmail.com', 
                    pass: 'C@nelit0'
                }
            }
        );
    }

    sendMail(mailOptions) {
        try {
            this.transport.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                }
                else {
                    console.log(info);
                }
                this.transport.close();
            })
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = Email;

/*
var transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com', 
    port: 587, 
    secure: true, 
    auth: {
        user: 'totto_cha@hotmail.com', 
        pass: 'C@nelit0'
    }
});

module.exports = {
    sendMail: (mailOptions) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.log(error)
            else console.log(`Email sent: ${info.response}`)
        });
    }
}
*/