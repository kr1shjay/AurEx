// import lib
import isEmpty from '../../lib/isEmpty';

export const fiatValidation = (value, t) => {
    let errors = {};

    if (isEmpty(value.currencyId)) {
        errors.currencyId = "REQUIRED"
    }

    if (isEmpty(value.bankId)) {
        errors.bankId = "REQUIRED"
    }

    if (isEmpty(value.amount)) {
        errors.amount = "REQUIRED"
    } else if (isNaN(value.amount)) {
        errors.amount = "ALLOW_NUMERIC"
    } else if (value.amount <= 0) {
        errors.amount = "Please Enter Valid Amount"
    } else if (value.minimumWithdraw > value.amount) {
        errors.amount = t(`MINIMUM WITHDRAW ${value.minimumWithdraw}`, { "AMOUNT": value.minimumWithdraw, "COIN": value.coin })
    }

    if (!isEmpty(value.amount) && !isNaN(value.amount) && value.finalAmount > value.spotBal) {
        errors.finalAmount = "INSUFFICIENT_BALANCE"
    }

    if (isEmpty(value.twoFACode)) {
        errors.twoFACode = "REQUIRED"
    } else if (isNaN(value.twoFACode)) {
        errors.twoFACode = "ALLOW_NUMERIC"
    }

    return errors;
}

export const fiatDepositValidation = value => {
    let errors = {};
    let imageFormat = /\.(jpg|JPG|png|PNG|pdf|PDF)$/;

    if (isEmpty(value.amount)) {
        errors.amount = "REQUIRED"
    } else if (isNaN(value.amount)) {
        errors.amount = "ALLOW_NUMERIC"
    }  else if (value.amount <= 0) {
        errors.amount = "Enter Valid Amount"
    } /* else if (parseFloat(value.minimumDeposit) > parseFloat(value.amount)) {
        errors.amount = "DEPOSIT_TOO_LOW"
    } */



    if (value.image && value.image.size) {
        if (value.image.size > 1000000) {
            errors.image = "TOO_LARGE"
        } else if (!imageFormat.test(value.image.name)) {
            errors.image = "INVALID_IMAGE"
        }
    } else {
        errors.image = "REQUIRED";
    }

    return errors;
}


export const coinValidation = (value, t) => {
    let errors = {};

    if (isEmpty(value.currencyId)) {
        errors.currencyId = "REQUIRED"
    }

    if (isEmpty(value.receiverAddress)) {
        errors.receiverAddress = "REQUIRED"
    }

    if (isEmpty(value.amount)) {
        errors.amount = "REQUIRED"
    } else if (isNaN(value.amount)) {
        errors.amount = "ALLOW_NUMERIC"
    } else if (value.minimumWithdraw > value.amount) {
        errors.amount = t(`MINIMUM WITHDRAW ${value.minimumWithdraw}`, { "AMOUNT": value.minimumWithdraw, "COIN": value.coin })
    } else if (value.amount <= 0) {
        errors.amount = "Pleae Enter Valid Amount"
    }

    if (!isEmpty(value.amount) && !isNaN(value.amount) && value.finalAmount > value.spotBal) {
        errors.amount = "INSUFFICIENT_BALANCE"
    }

    if (isEmpty(value.twoFACode)) {
        errors.twoFACode = "REQUIRED"
    } else if (isNaN(value.twoFACode)) {
        errors.twoFACode = "ALLOW_NUMERIC"
    }

    return errors;
}

export const walletTransferValidation = value => {
    let errors = {};

    if (isEmpty(value.fromType)) {
        errors.fromType = "REQUIRED"
    } else if (!['spot', 'derivative', 'p2p'].includes(value.fromType)) {
        errors.fromType = "INVALID_WALLET_TYPE"
    }

    if (isEmpty(value.toType)) {
        errors.toType = "REQUIRED"
    } else if (!['spot', 'derivative', 'p2p'].includes(value.toType)) {
        errors.toType = "INVALID_WALLET_TYPE"
    } else if (value.fromType == value.toType) {
        errors.toType = "WALLET_MIS_MATCH"
    }

    if (isEmpty(value.userAssetId)) {
        errors.userAssetId = "REQUIRED"
    }

    if (isEmpty(value.amount)) {
        errors.amount = "REQUIRED"
    } else if (isNaN(value.amount)) {
        errors.amount = "ALLOW_NUMERIC"
    } else if (parseFloat(value.amount) <= 0) {
        errors.amount = "MUST_BE_GREATER"
    }



    return errors;
}

export const fundValidation = value => {
    let errors = {},
        emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;

    if (isEmpty(value.currencyId)) {
        errors.currencyId = "REQUIRED"
    }

    if (isEmpty(value.amount)) {
        errors.amount = "REQUIRED"
    } else if (isNaN(value.amount)) {
        errors.amount = "ALLOW_NUMERIC"
    } else if (value.amount <= 0) {
        errors.amount = "INSUFFICIENT_BALANCE"
    }

    if (isEmpty(value.toUserEmail)) {
        errors.toUserEmail = "REQUIRED"
    } else if (!(emailRegex.test(value.toUserEmail))) {
        errors.toUserEmail = "INVALID_EMAIL"
    }

    if (isEmpty(value.twoFACode)) {
        errors.twoFACode = "REQUIRED"
    } else if (isNaN(value.twoFACode)) {
        errors.twoFACode = "ALLOW_NUMERIC"
    }

    return errors;
}