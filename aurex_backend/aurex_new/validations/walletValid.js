// import package
import mongoose from 'mongoose';

// import controller
import { isCryptoAddr } from '../../controllers/coin.controller'

// import lib
import isEmpty from '../../lib/isEmpty';


/** 
 * User Withdraw
 * URL: /api/new/fiatWithdraw
 * METHOD : PATCH
 * BODY: token
*/
export const tokenValid = (req, res, next) => {
    let api_key = req.header("x-api-key");
    let authorization = req.header('Authorization');
    if (api_key !== null && api_key !== undefined && authorization === undefined) {
        return next();
    }
    else {
        let errors = {}, reqBody = req.body;

        if (isEmpty(reqBody.token)) {
            errors.token = "REQUIRED";
        }

        if (!isEmpty(errors)) {
            return res.status(400).json({'statusCode':400, "message": errors.token })
        }

        return next();
    }
}

/** 
 * Coin Withdraw
 * URL: /api/new/coinWithdraw
 * METHOD : POST
 * BODY: currencyId, destTag, amount, receiverAddress, twoFACode
*/
export const coinWithdrawValid = async (req, res, next) => {
    let errors = {}, reqBody = req.body;

    if (isEmpty(reqBody.currencyId)) {
        errors.currencyId = "REQUIRED";
    } else if (!mongoose.Types.ObjectId.isValid(reqBody.currencyId)) {
        errors.currencyId = "Invalid currency id";
    }
    let addressCheck  = await  isCryptoAddr(reqBody.coin, reqBody.receiverAddress, reqBody.currencyId)
    if (isEmpty(reqBody.receiverAddress)) {
        errors.receiverAddress = "REQUIRED";
    } else if (!addressCheck) {
        errors.receiverAddress = `Invalid ${reqBody.coin} Address`;
    }

    if (reqBody.coin == 'XRP') {
        if (isEmpty(reqBody.destTag)) {
            errors.destTag = "REQUIRED";
        }
    }

    if (isEmpty(reqBody.amount)) {
        errors.amount = "REQUIRED";
    } else if (isNaN(reqBody.amount)) {
        errors.amount = "ALLOW_NUMERIC";
    }

    if (isEmpty(reqBody.twoFACode)) {
        errors.twoFACode = "REQUIRED";
    } else if (isNaN(reqBody.twoFACode) || reqBody.twoFACode.length > 6) {
        errors.twoFACode = "INVALID_CODE";
    }

    if (!isEmpty(errors)) {
        return res.status(400).json({ 'statusCode':400,"errors": errors })
    }

    return next();
}