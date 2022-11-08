
// import lib
import config from '../config';
import smtpConfig from '../config/smtpConfig.json'
import SendinBlue from '../config/sendinBlue.json'
import { set, get } from '../controllers/redis.controller'

//import package
import nodemailer from 'nodemailer';
const SibApiV3Sdk = require('sib-api-v3-sdk');
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = SendinBlue.apiKey;
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();


export const sendEmail = async (to, content) => {
    try {

        let Redis = await get('SMTP')
        let Type =  JSON.parse(Redis)
        // if (Type.mailType == 'sendinBlue') {
            const { subject, template } = content;
            sendSmtpEmail.subject = subject;
            sendSmtpEmail.htmlContent = template;
            sendSmtpEmail.sender = { "name": SendinBlue.name, email: SendinBlue.email };
            sendSmtpEmail.to = [{ "email": to, "name": to }];
            sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
            apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
                console.log('Message sent: %s' + JSON.stringify(data));
            }, function (error) {
                return console.log(error);
            });

        // } else if (Type.mailType == 'nodeMailer') {
        //     const { subject, template } = content;
        //     let transporter = nodemailer.createTransport(smtpConfig.nodemailer);
        //     let info = await transporter.sendMail({
        //         from: smtpConfig.fromMail,
        //         to,
        //         subject,
        //         html: template
        //     });
        //     console.log("Message sent: %s", info.messageId);
        // }

    }
    catch (err) {
    }
}

// sendEmail(
//     "ajith@britisheducationonline.org",
//     {
//         subject: 'test',
//         template: '<h1>Test</h1>',
//     }
// )