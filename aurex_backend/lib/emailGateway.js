
// import lib
import config from '../config';
import smtpConfig from '../config/smtpConfig.json'
import SendinBlue from '../config/sendinBlue.json'
import { set, get } from '../controllers/redis.controller'

//import package
import nodemailer from 'nodemailer';
 const SibApiV3Sdk = require('sib-api-v3-sdk');
// let defaultClient = SibApiV3Sdk.ApiClient.instance;
// let apiKey = defaultClient.authentications['api-key'];
// apiKey.apiKey = SendinBlue.apiKey;
// let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
// let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();


export const sendEmail = async (to, content) => {
    try {
        return sendMail(to,content);
       // console.log("Send Mail : ",SibApiV3Sdk.ApiClient.instance.authentications)
        let Redis = await get('SMTP')
        let Type =  JSON.parse(Redis)
        // if (Type.mailType == 'sendinBlue') {
            const { subject, template } = content;
            sendSmtpEmail.subject = subject;
            sendSmtpEmail.htmlContent = template;
            sendSmtpEmail.sender = { "name": SendinBlue.name, email: SendinBlue.email };
            sendSmtpEmail.to = [{ "email": to, "name": to }];
            sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
            await apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
                console.log('Message sent: %s' + JSON.stringify(data));
                return data;
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
        console.log("sebd in vlue : ",err)
    }
}

// sendEmail(
//     "ajith@britisheducationonline.org",
//     {
//         subject: 'test',
//         template: '<h1>Test</h1>',
//     }
// )


export const sendMail = async (to, content) => {
    const { subject, template } = content;
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = SendinBlue.apiKey;
// SendinBlue.apiKey
new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail(
  {
    'subject': subject,
    'sender' : {'email':SendinBlue.email, 'name': SendinBlue.name},
    'replyTo' : {'email': SendinBlue.email, 'name':SendinBlue.name},
    'to' : [{'name': to, 'email': to}],
    'htmlContent' : template,
    'params' : {'bodyMessage':'subject'}
  }
).then(function(data) {
  console.log("New Mailer :",data);
}, function(error) {
  console.error(error);
});
}