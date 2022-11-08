// import package
import mongoose from 'mongoose';

// import lib
import isEmpty from '../lib/isEmpty';

/** 
 * Add Launchpad
 * URL : /adminapi/launchpad
 * METHOD : POST
 * BODY : currencyId, availableCoin(array), whitePaper, launchPrice, launchCoin, minAmount, discount, availableSupply, maxSupply, industry, website, startTimeStamp, endTimeStamp, telegram, twitter, facebook, youtube, linkedIn, content
*/
export const addValid = (req, res, next) => {
    let errors = {}, reqBody = req.body, reqFile = req.files;

    if (isEmpty(reqBody.currencyId)) {
        errors.currencyId = "CurrencyId field is required";
    } else if (!(mongoose.Types.ObjectId.isValid(reqBody.currencyId))) {
        errors.currencyId = "CurrencyId is invalid";
    }

    if (isEmpty(reqBody.availableCoin)) {
        errors.availableCoin = "Available coin field is required";
    }

    if (isEmpty(reqFile.whitePaper)) {
        errors.whitePaper = "REQUIRED";
    }

    if (isEmpty(reqBody.launchPrice)) {
        errors.launchPrice = "Launch price field is required";
    } else if (isNaN(reqBody.launchPrice)) {
        errors.launchPrice = "Only allow numberic value";
    } else if (parseFloat(reqBody.launchPrice) <= 0) {
        errors.launchPrice = "Only allow positive numberic value";
    }

    if (isEmpty(reqBody.launchCoin)) {
        errors.launchCoin = "Launch coin field is required";
    }

    if (isEmpty(reqBody.minAmount)) {
        errors.minAmount = "Minimum amount field is required";
    } else if (isNaN(reqBody.minAmount)) {
        errors.minAmount = "Only allow numberic value";
    } else if (parseFloat(reqBody.minAmount) <= 0) {
        errors.minAmount = "Only allow positive numberic value";
    }

    if (!isEmpty(reqBody.discount)) {
        if (isNaN(reqBody.discount)) {
            errors.discount = "Only allow numberic value";
        } else if (parseFloat(reqBody.discount) <= 0) {
            errors.discount = "Only allow positive numberic value";
        }
    }

    if (isEmpty(reqBody.availableSupply)) {
        errors.availableSupply = "Available supply field is required";
    } else if (isNaN(reqBody.availableSupply)) {
        errors.availableSupply = "Only allow numberic value";
    } else if (parseFloat(reqBody.availableSupply) <= 0) {
        errors.availableSupply = "Only allow positive numberic value";
    }

    if (isEmpty(reqBody.maxSupply)) {
        errors.maxSupply = "Maximum supply field is required";
    } else if (isNaN(reqBody.maxSupply)) {
        errors.maxSupply = "Only allow numberic value";
    } else if (parseFloat(reqBody.maxSupply) <= 0) {
        errors.maxSupply = "Only allow positive numberic value";
    }

    if (isEmpty(reqBody.industry)) {
        errors.industry = "Industry field is required";
    }

    if (isEmpty(reqBody.website)) {
        errors.website = "Website field is required";
    }

    if (isEmpty(reqBody.startTimeStamp)) {
        errors.startTimeStamp = "Start time stamp field is required";
    } else if (isNaN(reqBody.startTimeStamp)) {
        errors.startTimeStamp = "Invalid time stamp";
    } else if (parseFloat(reqBody.startTimeStamp) <= 0) {
        errors.startTimeStamp = "Invalid time stamp";
    }

    if (isEmpty(reqBody.endTimeStamp)) {
        errors.endTimeStamp = "End time stamp field is required";
    } else if (isNaN(reqBody.endTimeStamp)) {
        errors.endTimeStamp = "Invalid time stamp";
    } else if (parseFloat(reqBody.endTimeStamp) <= 0) {
        errors.endTimeStamp = "Invalid time stamp";
    } else if (!isEmpty(reqBody.startTimeStamp) && parseFloat(reqBody.startTimeStamp) > parseFloat(reqBody.endTimeStamp)) {
        errors.endTimeStamp = "End date should be higher than start date";
    }

    if (isEmpty(reqBody.telegram)) {
        errors.telegram = "Telegram link field is required";
    }

    if (isEmpty(reqBody.twitter)) {
        errors.twitter = "Twitter link field is required";
    }
    
    if (isEmpty(reqBody.facebook)) {
        errors.facebook = "Facebook link field is required";
    }
    
    if (isEmpty(reqBody.youtube)) {
        errors.youtube = "Youtube link field is required";
    }

    if (isEmpty(reqBody.linkedIn)) {
        errors.linkedIn = "LinkedIn link field is required";
    }

    if (isEmpty(reqBody.content)) {
        errors.content = "Website field is required";
    }

    if (!isEmpty(errors)) {
        return res.status(400).json({ "errors": errors })
    }

    return next();
}

/** 
 * Edit Launchpad
 * URL : /adminapi/launchpad
 * METHOD : POST
 * BODY : launchId, currencyId, availableCoin(array), whitePaper, launchPrice, launchCoin, minAmount, discount, availableSupply, maxSupply, industry, website, startTimeStamp, endTimeStamp, telegram, twitter, facebook, youtube, linkedIn, content
*/
export const editValid = (req, res, next) => {
    let errors = {}, reqBody = req.body;

    if (isEmpty(reqBody.launchId)) {
        errors.launchId = "launchId field is required";
    } else if (!(mongoose.Types.ObjectId.isValid(reqBody.launchId))) {
        errors.launchId = "launchId is invalid";
    }

    if (isEmpty(reqBody.currencyId)) {
        errors.currencyId = "CurrencyId field is required";
    } else if (!(mongoose.Types.ObjectId.isValid(reqBody.currencyId))) {
        errors.currencyId = "CurrencyId is invalid";
    }

    if (isEmpty(reqBody.availableCoin)) {
        errors.availableCoin = "Available coin field is required";
    }

    if (isEmpty(reqBody.launchPrice)) {
        errors.launchPrice = "Launch price field is required";
    } else if (isNaN(reqBody.launchPrice)) {
        errors.launchPrice = "Only allow numberic value";
    } else if (parseFloat(reqBody.launchPrice) <= 0) {
        errors.launchPrice = "Only allow positive numberic value";
    }

    if (isEmpty(reqBody.launchCoin)) {
        errors.launchCoin = "Launch coin field is required";
    }

    if (isEmpty(reqBody.minAmount)) {
        errors.minAmount = "Minimum amount field is required";
    } else if (isNaN(reqBody.minAmount)) {
        errors.minAmount = "Only allow numberic value";
    } else if (parseFloat(reqBody.minAmount) <= 0) {
        errors.minAmount = "Only allow positive numberic value";
    }

    if (!isEmpty(reqBody.discount)) {
        if (isNaN(reqBody.discount)) {
            errors.discount = "Only allow numberic value";
        } 
        else if (parseFloat(reqBody.discount) <= 0) {
            errors.discount = "Only allow positive numberic value";
        }
    }

    if (isEmpty(reqBody.availableSupply)) {
        errors.availableSupply = "Available supply field is required";
    } else if (isNaN(reqBody.availableSupply)) {
        errors.availableSupply = "Only allow numberic value";
    } else if (parseFloat(reqBody.availableSupply) <= 0) {
        errors.availableSupply = "Only allow positive numberic value";
    }

    if (isEmpty(reqBody.maxSupply)) {
        errors.maxSupply = "Maximum supply field is required";
    } else if (isNaN(reqBody.maxSupply)) {
        errors.maxSupply = "Only allow numberic value";
    } else if (parseFloat(reqBody.maxSupply) <= 0) {
        errors.maxSupply = "Only allow positive numberic value";
    }

    if (isEmpty(reqBody.industry)) {
        errors.industry = "Industry field is required";
    }

    if (isEmpty(reqBody.website)) {
        errors.website = "Website field is required";
    }

    if (isEmpty(reqBody.startTimeStamp)) {
        errors.startTimeStamp = "Start time stamp field is required";
    } else if (isNaN(reqBody.startTimeStamp)) {
        errors.startTimeStamp = "Invalid time stamp";
    } else if (parseFloat(reqBody.startTimeStamp) <= 0) {
        errors.startTimeStamp = "Invalid time stamp";
    }

    if (isEmpty(reqBody.endTimeStamp)) {
        errors.endTimeStamp = "End time stamp field is required";
    } else if (isNaN(reqBody.endTimeStamp)) {
        errors.endTimeStamp = "Invalid time stamp";
    } else if (parseFloat(reqBody.endTimeStamp) <= 0) {
        errors.endTimeStamp = "Invalid time stamp";
    } else if (!isEmpty(reqBody.startTimeStamp) && parseFloat(reqBody.startTimeStamp) > parseFloat(reqBody.endTimeStamp)) {
        errors.endTimeStamp = "End date should be higher than start date";
    }

    if (isEmpty(reqBody.telegram)) {
        errors.telegram = "Telegram link field is required";
    }

    if (isEmpty(reqBody.twitter)) {
        errors.twitter = "Twitter link field is required";
    }
    
    if (isEmpty(reqBody.facebook)) {
        errors.facebook = "Facebook link field is required";
    }
    
    if (isEmpty(reqBody.youtube)) {
        errors.youtube = "Youtube link field is required";
    }

    if (isEmpty(reqBody.linkedIn)) {
        errors.linkedIn = "LinkedIn link field is required";
    }
    
    if (isEmpty(reqBody.content)) {
        errors.content = "Website field is required";
    }

    if (!isEmpty(errors)) {
        return res.status(400).json({ "errors": errors })
    }

    return next();
}