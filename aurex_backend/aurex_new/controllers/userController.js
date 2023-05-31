import mongoose from 'mongoose';
import * as smsHelper from '../../lib/smsGateway';
import { encryptString, decryptString } from '../../lib/cryptoJS';
import { mailTemplateLang } from '../../controllers/emailTemplate.controller';
import { newNotification } from '../../controllers/notification.controller'
import isEmpty from '../../lib/isEmpty';
import node2fa from 'node-2fa';
import moment from 'moment';
import multer from 'multer';
import path from 'path';
// import config
import config from '../../config';
import { socketEmitOne } from '../../config/socketIO';

// import modal
import {
    User,
    UserToken,
    UserSetting,
    UserKyc,
    Currency,
    Language,
    Assets,
    SiteSetting,
    Wallet,
    Newsletter,
    SpotTrade,
    PerpetualOrder,
    P2pOrder,
    P2pPost
} from '../../models';
const ObjectId = mongoose.Types.ObjectId;

/**
 * User Login
 * METHOD : POST
 * URL : /api/new/login 
 * BODY : email, phoneCode, phoneNo, formType, password, loginHistory, langCode, twoFACode
*/
export const userLogin = async (req, res) => {
    try {

        let reqBody = req.body, checkUser;
        let isLoginHistory = !isEmpty(req.body.loginHistory)

        if (reqBody.formType == 'email') {
            reqBody.email = reqBody.email.toLowerCase();
            checkUser = await User.findOne({ 'email': reqBody.email })
            if (!checkUser) {
                return res.status(400).json({ 'statusCode':400,'success': false, 'errors': { 'email': "Email not found" } });
            }
        } else if (reqBody.formType == 'mobile') {
            checkUser = await User.findOne({ 'phoneCode': reqBody.phoneCode, 'phoneNo': reqBody.phoneNo })
            if (!checkUser) {
                return res.status(400).json({ 'statusCode':400, 'success': false, 'errors': { 'phoneNo': "Mobile number not found" } });
            }
            if (isEmpty(reqBody.twoFACode) && !isEmpty(reqBody.otp)) {
                let to = `+${reqBody.phoneCode}${reqBody.phoneNo}`;
                let { smsStatus } = await smsHelper.verifyOtp(to, reqBody.otp);
                if (!smsStatus) {
                    return res.status(500).json({ 'statusCode':500,"success": false, "message": "Invalid OTP" });
                }
            }

        }

        if (checkUser.status != 'verified') {
            return res.status(400).json({ 'success': false, 'message': "Your account still not activated" });
        }

        if (checkUser.hash == "" && checkUser.hash == "") {
            let encryptToken = encryptString(checkUser._id, true)
            checkUser.mailToken = encryptToken;
            await checkUser.save();
            return res.status(400).json({ 'statusCode':400,'success': false, 'message': "Your Password is Old Please Reset Your Password", "authToken": encryptToken });
        }
        if (!checkUser.authenticate(reqBody.password)) {
            loginHistory({ ...reqBody.loginHistory, ...{ "status": 'Failed', "reason": "Password incorrect", "userId": checkUser._id } })
            return res.status(400).json({ 'statusCode':400,'success': false, 'errors': { 'password': "Password incorrect" } });
        }


        if (checkUser.google2Fa && !isEmpty(checkUser.google2Fa.secret)) {
            if (isEmpty(reqBody.twoFACode)) {
                return res.status(200).json({ 'statusCode':200, 'success': true, 'status': 'TWO_FA', 'message': "Please Enter Your 2 FA Code" })
            } else {
                let check2Fa = node2fa.verifyToken(checkUser.google2Fa.secret, reqBody.twoFACode)
                if (!(check2Fa && check2Fa.delta == 0)) {
                    return res.status(400).json({ 'statusCode':400,'success': false, 'errors': { 'twoFACode': "INVALID_CODE" } })
                }

            }
        }
        
        let tokenId = ObjectId()
        let payloadData = {
            "_id": checkUser._id,
            'uniqueId': checkUser.userId,
            'tokenId': tokenId
        }
        let token = new User().generateJWT(payloadData);
        await UserToken.findOneAndUpdate({ 'userId': checkUser._id, 'userCode': checkUser.userId }, { 'tokenId': tokenId, 'token': token }, { 'upsert': true })
        socketEmitOne('FORCE_LOGOUT', token, checkUser._id)

        if (isLoginHistory) {
            loginHistory({ ...reqBody.loginHistory, ...{ "status": 'Success', "reason": "", "userId": checkUser._id } })
        }

        if (reqBody.formType == 'email') {
            let content = {
                'broswername': reqBody.loginHistory && reqBody.loginHistory.broswername,
                'ipaddress': reqBody.loginHistory && reqBody.loginHistory.ipaddress,
                'countryName': reqBody.loginHistory && reqBody.loginHistory.countryName,
                'date': new Date(),
            };

            mailTemplateLang({
                'userId': checkUser._id,
                'identifier': 'Login_notification',
                'toEmail': checkUser.email,
                content
            })
        }
        let doc = {
            'userId': checkUser._id,
            'title': 'User Login',
            'description': 'Login Successfully',
        }
        newNotification(doc)
        // mailTemplate('Login_notification', reqBody.langCode, checkUser.email, content)
        let result = userProfileDetail(checkUser)
        let userSetting = await UserSetting.findOne({ "userId": checkUser._id }, {
            "_id": 0, "theme": 1, "afterLogin": 1
        })

        return res.status(200).json({ 'statusCode':200 ,'success': true, 'status': "SUCCESS", 'message': "Login successfully", token, result, userSetting })

    } catch (err) {
        console.log(err, '-----------------error on server')
        return res.status(500).json({ 'statusCode':500,"success": false, 'message': "Error on server" })
    }
}

const loginHistory = ({
    countryName,
    countryCode,
    ipaddress,
    region, // regionName
    broswername,
    ismobile,
    os,
    status,
    reason,
    userId
}) => {

    let data = {
        countryName,
        countryCode,
        ipaddress,
        regionName: region,
        broswername,
        ismobile,
        os,
        status,
        reason,
    }

    User.update({ '_id': userId }, {
        '$push': {
            'loginhistory': data,
        },
    }, (err, data) => { })
}


const userProfileDetail = (userData) => {
    let data = {
        'userId': userData.userId,
        'firstName': userData.firstName,
        'lastName': userData.lastName,
        'email': userData.email,
        'profileImage': `${config.SERVER_URL}${config.IMAGE.PROFILE_URL_PATH}${userData.profileImage}`,
        'blockNo': userData.blockNo,
        'address': userData.address,
        'city': userData.city,
        'state': userData.state,
        'country': userData.country,
        'postalCode': userData.postalCode,
        'emailStatus': userData.emailStatus,
        'phoneStatus': userData.phoneStatus,
        'phoneCode': userData.phoneCode,
        'phoneNo': userData.phoneNo,
        'type': userData.type,
        'twoFAStatus': !isEmpty(userData.google2Fa.secret) ? 'enabled' : 'disabled',
        'createAt': moment(userData.createAt).format('DD MMM YYYY'),
        'loginHistory': (userData.loginhistory && userData.loginhistory.slice(-1).length > 0) ? userData.loginhistory.slice(-1)[0] : {},
        'bankDetail': {},
    }

    if (userData.bankDetails && userData.bankDetails.length > 0) {
        let bankDetail = userData.bankDetails.find((el => el.isPrimary == true))
        if (bankDetail) {
            data.bankDetail['bankName'] = bankDetail.bankName;
            data.bankDetail['accountNo'] = bankDetail.accountNo;
            data.bankDetail['holderName'] = bankDetail.holderName;
            data.bankDetail['bankcode'] = bankDetail.bankcode;
            data.bankDetail['country'] = bankDetail.country;
            data.bankDetail['city'] = bankDetail.city;
        }
    }

    return data
}