// import package

// import modal
import {
    NewsLetter
} from '../models';

// import controller
import { mailTemplateLang } from './emailTemplate.controller';

// import lib
import isEmpty from '../lib/isEmpty';

/**
 * Add Newsletter
 * METHOD : POST
 * URL : /api/newsSubscribe 
 * BODY : email
*/
export const newSubscribe = async (req, res) => {
    console.log("req",req.body)
    try {
        let reqBody = req.body;
        let checkDoc = await NewsLetter.findOne({ 'email': reqBody.email })
        if (checkDoc) {
            return res.status(400).json({ 'status': false, 'message':  'Email already Subscribed'  })
        }
        let newDoc = new NewsLetter({
            'email': reqBody.email
        })

        await newDoc.save();

        return res.status(200).json({ 'status': true, 'message': 'Newsletter Subscribe Successfully' })
    } catch (err) {
        console.log(err, 'err')
        return res.status(500).json({ 'status': false, 'message': 'Error on server' })
    }
}

/**
 * Get All Subscribe User
 * METHOD : GET
 * URL : /adminapi/subscriber-all
 * BODY : email
*/
export const allSubscriber = async (req, res) => {
    NewsLetter.find({}, { 'email': 1 }).exec((err, data) => {
        if (err) {
            return res.status(500).json({ 'status': false, 'message': 'Error on server' })
        }
        return res.status(200).json({ 'status': true, 'message': 'FETCH', 'result': data })
    })
}

/**
 * Send news letter for subscriber
 * METHOD : POST
 * URL : /adminapi/subscriber/sendNews
 * BODY : subscribedId, message
*/
export const sendNews = async (req, res) => {
    try {
        let reqBody = req.body;

        const subscriber = await NewsLetter.find({ '_id': { "$in": reqBody.subscribedId } }).distinct('email');
        if (subscriber && subscriber.length > 0) {
            for (let item of subscriber) {
                let datetime = new Date();
                var result = reqBody.message;
                var message = result.replace(/<\/?p[^>]*>/g, "");
                let content = {
                    'message': message,
                    // 'date': datetime.getFullYear() + '/' + (datetime.getMonth() + 1) + '/' + datetime.getDate()
                }
                mailTemplateLang({
                    'identifier': 'newsletter_send',
                    'toEmail': item,
                    content
                })
            }
        }
        return res.status(200).json({ 'status': true, 'message': "Sent newsletter mails sucessfully. Refreshing data..." });
    } catch (err) {
        console.log("🚀 ~ file: newsLetter.controller.js ~ line 84 ~ sendNews ~ err", err)
        return res.status(500).json({ 'status': false, 'message': 'Error on server' })
    }
}