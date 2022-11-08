// import package
import mongoose from 'mongoose';

// import lib
import isEmpty from '../lib/isEmpty';

/** 
 * Add Staking
 * URL : /adminapi/staking
 * METHOD : POST
 * BODY : currencyId, minimumAmount, maximumAmount, redemptionPeriod, type(fixed,flexible), flexibleAPY, flexibleAPY, periodList(days,APY)
*/
export const addStakeValid = (req, res, next) => {
    let errors = {}, reqBody = req.body;
    console.log('reqBody.minimumAmount',)
    console.log('reqBody.maximumAmount', reqBody)
    if (isEmpty(reqBody.currencyId)) {
        errors.currencyId = "Currency id field is required";
    } else if (!(mongoose.Types.ObjectId.isValid(reqBody.currencyId))) {
        errors.currencyId = "Currency id is invalid";
    }

    if (isEmpty(reqBody.minimumAmount)) {
        errors.minimumAmount = "Minimum amount field is required";
    } else if (isNaN(reqBody.minimumAmount)) {
        errors.minimumAmount = "Only allow numeric";
    } else if (reqBody.minimumAmount <= 0) {
        errors.minimumAmount = "invalid value";
    }


    if (isEmpty(reqBody.maximumAmount)) {
        errors.maximumAmount = "Maximum amount field is required";
    } else if (isNaN(reqBody.maximumAmount)) {
        errors.maximumAmount = "Only allow numeric";
    } else if (reqBody.maximumAmount <= 0) {
        errors.maximumAmount = "invalid value";
    }

    if (parseInt(reqBody.minimumAmount) > parseInt(reqBody.maximumAmount)) {
        errors.maximumAmount = "Amount is less then Minimum Amount";
    }

    if (isEmpty(reqBody.redemptionPeriod)) {
        errors.redemptionPeriod = "Redemption period field is required";
    } else if (isNaN(reqBody.redemptionPeriod)) {
        errors.redemptionPeriod = "Only allow numeric";
    } else if (reqBody.redemptionPeriod <= 0) {
        errors.redemptionPeriod = "invalid Value";

    }

    if (isEmpty(reqBody.type)) {
        errors.type = "Type field is required";
    } else if (!Array.isArray(reqBody.type)) {
        errors.type = "Type field is required";
    } else if (!(reqBody.type.some(r => ['fixed', 'flexible'].includes(r)))) {
        errors.type = "Type is invalid";
    }

    if (!isEmpty(reqBody.type) && reqBody.type.some(r => ['fixed'].includes(r))) {
        if (isEmpty(reqBody.periodList)) {
            errors.periodList = "PeriodList field is required";
        } else if (!Array.isArray(reqBody.periodList)) {
            errors.periodList = "PeriodList field only allow array";
        } else if (reqBody.periodList.length == 0) {
            errors.periodList = "PeriodList array is empty";
        } else if (isEmpty(reqBody.periodList[0].days)) {
            errors.periodListDay = "Required";
        }
        // else if (reqBody.periodList[0].days <= 0) {
        //     errors.periodListDay = "invalid value";
        // }
        else if (isNaN(reqBody.periodList[0].days)) {
            errors.periodListDay = "only allow numeric";
        }
        if (isEmpty(reqBody.periodList[0].APY)) {
            errors.periodList = "Required";
        } else if (isNaN(reqBody.periodList[0].APY)) {
            errors.periodList = "only allow numeric";
        } else if (isNaN(reqBody.periodList[0].APY)) {
            errors.periodList = "only allow numeric";
        }
        // else if (isNaN(reqBody.periodList[0].APY <= 0)) {
        //     errors.periodList = "invalid value";
        // }

        for (var i = 0; i < reqBody.periodList.length; i++) {
            if (isEmpty(reqBody.periodList[i].APY)) {
                errors.periodList = 'Required'

            } else if (reqBody.periodList[i].APY <= 0) {
                errors.periodList = 'invalid value'

            }
            if (isEmpty(reqBody.periodList[i].days)) {
                errors.periodListDay = 'Required'
            } else if (reqBody.periodList[i].days <= 0) {
                errors.periodListDay = 'invalid value'

            }
        }


    }

    if (!isEmpty(reqBody.type) && reqBody.type.some(r => ['flexible'].includes(r))) {
        if (isEmpty(reqBody.flexibleAPY)) {
            errors.flexibleAPY = "flexibleAPY field is required";
        } else if (isNaN(reqBody.flexibleAPY)) {
            errors.flexibleAPY = "flexibleAPY field is required";
        } else if (reqBody.flexibleAPY <= 0) {
            errors.flexibleAPY = "invalid value";
        }
    }

    if (!isEmpty(errors)) {
        return res.status(400).json({ "errors": errors })
    }

    return next();
}

/** 
 * Edit Staking
 * URL : /adminapi/staking
 * METHOD : PUT
 * BODY : stakingId, currencyId, minimumAmount, maximumAmount, redemptionPeriod, type(fixed,flexible), flexibleAPY, flexibleAPY, periodList(days,APY), status
*/
export const editStakeValid = (req, res, next) => {
    let errors = {}, reqBody = req.body;

    if (isEmpty(reqBody.stakingId)) {
        errors.stakingId = "Staking id field is required";
    } else if (!(mongoose.Types.ObjectId.isValid(reqBody.stakingId))) {
        errors.stakingId = "Staking id is invalid";
    }

    if (isEmpty(reqBody.currencyId)) {
        errors.currencyId = "Currency id field is required";
    } else if (!(mongoose.Types.ObjectId.isValid(reqBody.currencyId))) {
        errors.currencyId = "Currency id is invalid";
    }

    if (isEmpty(reqBody.minimumAmount)) {
        errors.minimumAmount = "Minimum amount field is required";
    } else if (isNaN(reqBody.minimumAmount)) {
        errors.minimumAmount = "Only allow numeric";
    } else if (reqBody.minimumAmount <= 0) {
        errors.minimumAmount = "invalid value";
    }

    if (isEmpty(reqBody.maximumAmount)) {
        errors.maximumAmount = "Maximum amount field is required";
    } else if (isNaN(reqBody.maximumAmount)) {
        errors.maximumAmount = "Only allow numeric";
    } else if (reqBody.maximumAmount <= 0) {
        errors.maximumAmount = "invalid value";
    }
    if (parseInt(reqBody.minimumAmount) > parseInt(reqBody.maximumAmount)) {
        errors.maximumAmount = "Amount is less then Minimum Amount";
    }

    if (isEmpty(reqBody.redemptionPeriod)) {
        errors.redemptionPeriod = "Redemption period field is required";
    } else if (isNaN(reqBody.redemptionPeriod)) {
        errors.redemptionPeriod = "Only allow numeric";
    } else if (reqBody.redemptionPeriod <= 0) {
        errors.redemptionPeriod = "invalid Value";
    }

    if (isEmpty(reqBody.type)) {
        errors.type = "Type field is required";
    } else if (!Array.isArray(reqBody.type)) {
        errors.type = "Type field is required";
    } else if (!(reqBody.type.some(r => ['fixed', 'flexible'].includes(r)))) {
        errors.type = "Type is invalid";
    }

    if (!isEmpty(reqBody.type) && reqBody.type.some(r => ['fixed'].includes(r))) {
        if (isEmpty(reqBody.periodList)) {
            errors.periodList = "PeriodList field is required";
        } else if (!Array.isArray(reqBody.periodList)) {
            errors.periodList = "PeriodList field only allow array";
        } else if (reqBody.periodList.length == 0) {
            errors.periodList = "PeriodList array is empty";
        } else if (isEmpty(reqBody.periodList[0].days)) {
            errors.periodList = "PeriodList days field is required";
        } else if (isNaN(reqBody.periodList[0].days)) {
            errors.periodList = "PeriodList days only allow numeric";
        } else if (isEmpty(reqBody.periodList[0].APY)) {
            errors.periodList = "PeriodList APY field is required";
        } else if (isNaN(reqBody.periodList[0].APY)) {
            errors.periodList = "PeriodList APY only allow numeric";
        }

        for (var i = 0; i < reqBody.periodList.length; i++) {
            if (isEmpty(reqBody.periodList[i].APY)) {
                errors.periodList = 'Required'

            } else if (reqBody.periodList[i].APY <= 0) {
                errors.periodList = 'invalid value'

            }
            if (isEmpty(reqBody.periodList[i].days)) {
                errors.periodListDay = 'Required'
            } else if (reqBody.periodList[i].days <= 0) {
                errors.periodListDay = 'invalid value'

            }
        }

    }

    if (!isEmpty(reqBody.type) && reqBody.type.some(r => ['flexible'].includes(r))) {
        if (isEmpty(reqBody.flexibleAPY)) {
            errors.flexibleAPY = "flexibleAPY field is required";
        } else if (isNaN(reqBody.flexibleAPY)) {
            errors.flexibleAPY = "flexibleAPY field is required";
        } else if (reqBody.flexibleAPY <= 0) {
            errors.flexibleAPY = "invalid value";
        }
    }

    if (isEmpty(reqBody.status)) {
        errors.status = "status field is required";
    } else if (!(['active', 'deactive'].includes(reqBody.status))) {
        errors.status = "Invalid status";
    }

    if (!isEmpty(errors)) {
        return res.status(400).json({ "errors": errors })
    }

    return next();
}
