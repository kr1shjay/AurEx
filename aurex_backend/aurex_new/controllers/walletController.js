// import package
import mongoose from 'mongoose';
import node2fa from 'node-2fa';
import multer from 'multer';
import path from 'path';

// import model
import {
    User,
    UserKyc,
    Transaction,
    Currency,
    Wallet
} from '../../models';

// import controller
import { mailTemplateLang } from '../../controllers/emailTemplate.controller';
import { newNotification } from '../../controllers/notification.controller';
import * as coinCtrl from '../../controllers/coin.controller';
import { createPassBook } from '../../controllers/passbook.controller';

// import config
import config from '../../config';
import { autoWithdraw } from '../../config/cron';

// import lib
// import { comparePassword } from '../lib/bcrypt';
import imageFilter from '../../lib/imageFilter';
import isEmpty from '../../lib/isEmpty';
import { paymentType } from '../../lib/displayStatue'
import { encryptString, decryptString, decryptObject } from '../../lib/cryptoJS'
import { precentConvetPrice } from '../../lib/calculation';
import { paginationQuery, filterSearchQuery } from '../../lib/adminHelpers';
import { findBtwDates, getTimeStamp } from '../../lib/dateHelper'
import wallet from '../../models/wallet';


const ObjectId = mongoose.Types.ObjectId;


export const withdrawfee = async (req, res) => {
    try {
        var currencyId=req.body.currencyId
        console.log("currencyId",currencyId)
        var withdrawamount=req.body.amount
        console.log("withdrawamount",withdrawamount)
        let CurrencyData = await Currency.findOne({ '_id': currencyId })
        console.log("Data",CurrencyData)
        let finalAmount = parseFloat(CurrencyData.withdrawFee)
        console.log("withdrawfee",finalAmount)
        return res.statusCode(200).json({ 'success': true, 'messages': "success", 'result': finalAmount })
    }
    catch(err){
        console.log("FeeErr",err)
        return res.statusCode(500).json({ "success": false, 'message': "Error occured" })
    }
}

//walletbalance

export const getbalance = async (req, res) => {
    try {
        let balancedata = await wallet.findOne({ "_id": req.user.id });
        console.log("balance", balancedata)
        if (!balancedata) {
            return res.statusCode(400).json({ 'success': true, 'messages': "USER_NOT_FOUND" })
        }
        let assetDoc = balancedata.assets.find((val) => (val.coin == req.query.symbol));

        console.log("assetDoc", assetDoc)
        if (!assetDoc) {
            return res.statusCode(400).json({ 'success': true, 'messages': "NOT_FOUND" })
        }
        let result = {
            "coin": assetDoc.coin,
            "coinbal": assetDoc.spotBal
        }
        return res.statusCode(200).json({ 'success': true, 'messages': "success", 'result': result })
    }
    catch (err) {
        return res.statusCode(500).json({ 'status': false, 'message': "Error occured" });
    }
}

/** 
 * Coin Withdraw
 * URL: /api/new/coinWithdraw
 * METHOD : POST
 * BODY: currencyId, coin, amount, receiverAddress, twoFACode
*/
export const withdrawCoinRequest = async (req, res) => {
    try {
        let api_key = req.header("x-api-key");
        console.log("orderreq",req.user)
        if(api_key!==null && api_key!== undefined && req.user.withdraw !==true){
             return res.statusCode(400).json({ 'status': false, 'message': "You don't have permission to WithdrawCoinRequest" });      
        }
        else{
        let reqBody = req.body;
        reqBody.amount = parseFloat(reqBody.amount);
        let userData = await User.findOne({ "_id": req.user.id });

        if (userData.google2Fa.secret == '') {
            return res.statusCode(500).json({ "success": false, 'errors': { 'twoFACode': 'TWO_FA_MSG' } })
        }

        let verifyTwoFaCode = node2fa.verifyToken(userData.google2Fa.secret, reqBody.twoFACode);
        if (!(verifyTwoFaCode && verifyTwoFaCode.delta == 0)) {
            return res.statusCode(400).json({ "success": false, 'errors': { 'twoFACode': "INVALID_CODE" } })
        }

        let usrWallet = await Wallet.findOne({
            '_id': req.user.id
        }, {
            '_id': 1,
            'binSubAcctId': 1,
            "assets._id": 1,
            "assets.coin": 1,
            "assets.address": 1,
            "assets.destTag": 1,
            "assets.spotBal": 1,
            "assets.derivativeBal": 1,
            "assets.p2pBal": 1,
        })
        if (!usrWallet) {
            return res.statusCode(400).json({ 'success': false, 'message': 'NO_DATA' })
        }

        let usrAsset = usrWallet.assets.id(reqBody.currencyId);
        if (!usrAsset) {
            return res.statusCode(400).json({ 'success': false, 'message': 'NO_DATA' })
        }

        if (reqBody.coin != 'XRP' && usrAsset.address == reqBody.receiverAddress) {
            return res.statusCode(400).json({ 'success': false, 'errors': { 'receiverAddress': 'RECEIVER_ADDRESS_SHOULD_DIFFER' } })
        }

        if (reqBody.coin == 'XRP' && usrAsset.destTag == reqBody.destTag) {
            return res.statusCode(400).json({ 'success': false, 'errors': { 'destTag': 'RECEIVER_TAG_SHOULD_DIFFER' } })
        }

        let curData = await Currency.findOne({ '_id': reqBody.currencyId })
        if (!curData) {
            return res.statusCode(400).json({ 'success': false, 'message': 'NO_DATA' })
        }

        // let finalAmount = reqBody.amount + precentConvetPrice(reqBody.amount, curData.withdrawFee)
        let finalAmount = reqBody.amount + parseFloat(curData.withdrawFee)
        if (usrAsset.spotBal < finalAmount) {
            return res.statusCode(400).json({ 'success': false, 'errors': { 'finalAmount': 'INSUFFICIENT_BALANCE' } })
        }

        var transactions = new Transaction();
        transactions["userId"] = req.user.userId;
        transactions["currencyId"] = reqBody.currencyId;
        transactions["coin"] = curData.coin;
        transactions["fromAddress"] = usrAsset.address;
        transactions["toAddress"] = reqBody.receiverAddress;
        transactions["destTag"] = isEmpty(reqBody.destTag) ? '' : reqBody.destTag;
        transactions["amount"] = finalAmount;
        transactions["actualAmount"] = reqBody.amount;
        transactions["paymentType"] = 'coin_withdraw';
        transactions["commissionFee"] = curData.withdrawFee;
        transactions["txid"] = '';
        transactions["type"] = curData.depositType;
        transactions["status"] = 'pending';

        // usrAsset.spotBal = usrAsset.spotBal - finalAmount;
        // let updateWallet = await usrWallet.save();
        // let trxData = await transactions.save();

        let beforeBalance = parseFloat(usrAsset.spotBal);
        usrAsset.spotBal = parseFloat(usrAsset.spotBal) - parseFloat(finalAmount);
        let updateWallet = await usrWallet.save();
        let trxData = await transactions.save();

        // CREATE PASS_BOOK
        createPassBook({
            'userId': req.user.id,
            'coin': curData.coin,
            'currencyId': reqBody.currencyId,
            'tableId': trxData._id,
            'beforeBalance': beforeBalance,
            'afterBalance': parseFloat(usrAsset.spotBal),
            'amount': parseFloat(finalAmount),
            'type': 'coin_withdraw_request',
            'category': 'debit'
        })


        let encryptToken = encryptString(trxData._id, true)
        let content = {
            'name': userData.firstName,
            'withdrawApprove': `${config.FRONT_URL}/withdraw-approve/${encryptToken}`,
            'cancelWithdraw': `${config.FRONT_URL}/withdraw-cancel/${encryptToken}`,
        };

        // mailTemplateLang({
        //     'userId': req.user.id,
        //     'identifier': 'withdraw_request',
        //     'toEmail': userData.email,
        //     content
        // })

        // newNotification({
        //     'userId': trxData.userId,
        //     'currencyId': trxData.currencyId,
        //     'transactionId': trxData._id,
        //     'trxId': trxData._id,
        //     'currencySymbol': trxData.currencySymbol,
        //     'amount': trxData.amount,
        //     'paymentType': trxData.paymentType,
        //     'status': trxData.status,
        // })
        return res.statusCode(200).json({ "success": true, 'message': 'VERIFICATION_LINK', 'result': updateWallet.assets })
    }
}
    catch (err) {
        return res.statusCode(500).json({ "success": false, 'message': "SOMETHING_WRONG" })
    }
}

/** 
 * Decrypt Token
 * BODY : token
*/
export const decryptWallet = (req, res, next) => {
    try {
        let api_key = req.header("x-api-key");
        let authorization = req.header('Authorization')
        console.log("orderreq", req.user, req.body,authorization)
        if (api_key !== null && api_key !== undefined && authorization == undefined) {
            return next();
        }
        else{
        let token = decryptObject(req.body.token)
        req.body = token;
        return next();
        }
    } catch (err) {
        return res.status(500).json({ 'status': false, 'message': "SOMETHING_WRONG" });
    }
}
