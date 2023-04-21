// import model
import {
    User,
    ApiKey
} from '../models';
import passport from 'passport';
import {  usersAuth } from '../config/passport';
// import lib
import { randomByte } from '../lib/crypto';
import isEmpty from '../lib/isEmpty';
import { IncCntObjId } from '../lib/generalFun';
import { cnvtBoolean } from '../lib/stringCase';
import { findBtwDates, nowDateInUTC } from '../lib/dateHelper';
import { createHash } from '../lib/crypto'
const jwt = require('jsonwebtoken');
import config from '../config';
import { decryptString } from '../lib/cryptoJS';

/** 
 * Create API Management
 * URL : /api/key/manage
 * METHOD : POST
 * BODY : name, ipRestriction, ipList, password
*/
export const newKey = async (req, res) => {
    console.log("varana",req.body)
    try {
        let reqBody = req.body;
        console.log("vanthutanreqBody",reqBody)
        reqBody.ipRestriction = cnvtBoolean(reqBody.ipRestriction)
        let userDoc = await User.findOne({ '_id': req.user.id })
        
        if (!userDoc.authenticate(reqBody.password)) {
            return res.status(400).json({ 'success': false, 'errors': { 'password': "Password incorrect" } });
        }
        

        let secretKey = await randomByte(32)
        if (isEmpty(secretKey)) {
            return res.status(500).json({ 'status': false, 'message': "SOMETHING_WRONG" });
        }

        let newDoc = new ApiKey({
            'userId': req.user.id,
            'name': reqBody.name,
            'ipRestriction': reqBody.ipRestriction,
            'ipList': reqBody.ipRestriction == true ? reqBody.ipList.split(',') : [],
            'secretKey': secretKey,
        })

        newDoc.keyId = IncCntObjId(newDoc._id)

        let newData = await newDoc.save();

        let result = {
            'list': await getKeys(req.user.id),
            'data': {
                'keyId': newData.keyId,
                'secretKey': newData.secretKey,
            }
        }
        return res.status(200).json({ 'status': true, 'message': "Successfully created", result });
    } catch (err) {
        console.log("newKey_newKey",err);
        return res.status(500).json({ 'status': false, 'message': "SOMETHING_WRONG" });
    }
}

export const getKeys = async (userId) => {
    try {
        return await ApiKey.find({ 'userId': userId }, {
            'name': 1,
            'keyId': 1,
            'ipRestriction': 1,
            'createdAt': 1,
            'status': 1,
            'ipList': 1
        })
    } catch (err) {
        return []
    }
}
/** 
 * API Key List
 * URL : /api/key/manage
 * METHOD : GET
*/
export const keyList = async (req, res) => {
    try {
        let data = await getKeys(req.user.id)
        return res.status(200).json({ 'status': true, 'message': "FETCH_SUCCESS", 'result': data });
    } catch (err) {
        return res.status(500).json({ 'status': false, 'message': "SOMETHING_WRONG" });
    }
}

/** 
 * Enable/Disable API Key
 * URL : /api/key/manage
 * METHOD : PATCH
*/
export const changeStatus = async (req, res) => {
    try {
        let keyDoc = await ApiKey.findOne({ "keyId": req.params.keyId, 'userId': req.user.id });
        if (!keyDoc) {
            return res.status(400).json({ 'status': false, 'message': "NO_DATA" });
        }

        if (keyDoc.status == 'active') {
            keyDoc.status = 'deactive'
            await keyDoc.save();
            let data = await getKeys(req.user.id)
            return res.status(200).json({ 'status': true, 'message': "The API key was successfully disabled.", 'result': data });
        } else if (keyDoc.status == 'deactive') {
            keyDoc.status = 'active'
            await keyDoc.save();
            let data = await getKeys(req.user.id)
            return res.status(200).json({ 'status': true, 'message': "The API key was successfully enabled.", 'result': data });
        }
        return res.status(400).json({ 'status': false, 'message': "BAD_REQUEST" });
    } catch (err) {
        return res.status(500).json({ 'status': false, 'message': "SOMETHING_WRONG" });
    }
}

/** 
 * Delete API Key
 * URL : /api/key/manage
 * METHOD : DELETE
*/
export const removeKey = async (req, res) => {
    try {
        let keyDoc = await ApiKey.findOne({ "keyId": req.params.keyId, 'userId': req.user.id });
        if (!keyDoc) {
            return res.status(400).json({ 'status': false, 'message': "NO_DATA" });
        }
        await keyDoc.remove();
        let data = await getKeys(req.user.id)
        return res.status(200).json({ 'status': true, 'message': "The API key was successfully deleted.", 'result': data });
    } catch (err) {
        return res.status(500).json({ 'status': false, 'message': "SOMETHING_WRONG" });
    }
}

/** 
 * Generate Signature
*/
export const v1GenerateSign = (secretKey, verb, path, expires, payload = '') => {
    expires = expires.toString();
    if (payload.constructor === Object) {
        payload = JSON.stringify(payload);
    }

    if (payload.constructor !== Buffer) {
        payload = Buffer.from(payload, 'utf8');
    }

    const signature = createHash('sha256');
    signature.update(verb + path + expires + payload);
    signature.update(new Buffer.from(secretKey, 'utf8'));
    return signature.digest('hex');
}


/** 
 * Version-1 Verify Signature
 * HEADER : api-expires, api-key, api-signature
*/
export const v1VerifySign = async (req, res, next) => {
    try {
        let payload = req.body;
        payload = isEmpty(payload) ? '' : payload;
        let header = req.headers;

        if (isEmpty(header['api-expires'])) {
            return res.status(400).json({ 'success': false, 'message': 'MISSING_API_EXPIRES' })
        }

        if (isEmpty(header['api-key'])) {
            return res.status(400).json({ 'success': false, 'message': 'MISSING_API_KEY' })
        }

        if (isEmpty(header['api-signature'])) {
            return res.status(400).json({ 'success': false, 'message': 'MISSING_API_SIGNATURE' })
        }

        let diffInMinute = findBtwDates(new Date(header['api-expires'] * 1000), nowDateInUTC(), 'minutes')
        if (diffInMinute > 5) {
            return res.status(400).json({ 'success': false, 'message': 'API_EXPIRES' })
        }

        let keyData = await ApiKey.findOne({ '_id': header['api-key'] }, { "secretKey": 1, 'ipRestriction': 1, 'ipList': 1 }).populate({ path: "userId", select: "_id" })

        if (!keyData) {
            return res.status(400).json({ 'success': false, 'message': 'MISMATCH_API_KEY' })
        }

        if (keyData && !keyData.userId) {
            return res.status(400).json({ 'success': false, 'message': 'MISMATCH_USER_API_KEY' })
        }

        if (keyData && keyData.ipRestriction == true) {
            let clientIp = req.clientIp;
            if (isEmpty(clientIp)) {
                return res.status(400).json({ 'success': false, 'message': 'MISSING_IP_ADDRESS' })
            }
            clientIp = clientIp.replace('::ffff:', '');
            if (keyData.ipList && keyData.ipList.length > 0) {
                if (!keyData.ipList.includes(clientIp)) {
                    return res.status(400).json({ 'success': false, 'message': 'MISMATCH_IP_ADDRESS' })
                }
            } else {
                return res.status(400).json({ 'success': false, 'message': 'MISSING_IP_ADDRESS' })
            }
        }

        let createSign = v1GenerateSign(keyData.secretKey, req.method, req.originalUrl, header['api-expires'], payload)
        if (createSign != header['api-signature']) {
            return res.status(400).json({ 'success': false, 'message': 'MISMATCH_API_SIGNATURE' })
        }

        req.user = {
            id: keyData.userId._id
        }
        return next()
    } catch (err) {
        return res.status(500).json({ 'success': false, 'message': 'SOMETHING_WRONG' })
    }
}

export const testKey = (req, res) => {
    return res.status(200).json({ 'message': "success" })
}


export const apikey= async(apikey,next,res)=>{
    console.log("demochecking")
    // let api_key = req.header("x-api-key");
    // console.log("apiii",api_key)
    let userDetails = await ApiKey.findOne({'secretKey':apikey}).populate({ path: "userId", select:"_id userId type email google2Fa status"});
    console.log("usersss",userDetails)
    if(userDetails && userDetails.userId){
        let datas = {
            id: userDetails.userId._id,
            userId: userDetails.userId.userId,
            type: userDetails.userId.type,
            email: userDetails.userId.email,
            google2Fa: userDetails.userId.google2Fa,
            withdraw: userDetails.withdraw,
            deposit: userDetails.deposit,
            trade: userDetails.trade
           
        }
        return next(null, datas);
    }
    else{
      res.send("Key not found")
    }
}



export const verifyToken = (req, res, next) => {
    const token = req.header('Authorization').split('Bearer ').join('');

    console.log("token",token)
    try {
        // var decrypt=decryptString(token,true);
        // console.log("decrypt",decrypt,"priya")
        var decrypt = jwt.decode(token);
        console.log(decrypt);
        const decoded = jwt.verify(token, config.cryptoSecretKey);
        console.log(decoded,"decoded");
    } catch (err) {
        console.log("error",err)
        return res.status(401).send("Invalid Token");
    }
    return next();
}



const passportAuth = passport.authenticate("usersAuth", { session: false });
export const authorization = async(req,res,next)=>{
    let api_key = req.header("x-api-key");
    console.log("passport--->",api_key,api_key!== undefined)

    if(api_key!==null && api_key!== undefined){
        console.log("passport--->",api_key,api_key!== undefined)
        await apikey(api_key,next,res)
    }
    else{
        console.log("passport--->",api_key,api_key!== undefined)
        usersAuth(passportAuth);
    }
}


