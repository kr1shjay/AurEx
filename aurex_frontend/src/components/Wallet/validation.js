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
    } else if (value.minimumWithdraw > value.amount) {
        errors.amount = t("MINIMUM_WITHDRAW", { "AMOUNT": value.minimumWithdraw, "COIN": value.coin })
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
    let imageFormat = /\.(jpg|JPG|jpeg|JPEG|png|PNG|pdf|PDF)$/;

    if (isEmpty(value.amount)) {
        errors.amount = "REQUIRED"
    } else if (isNaN(value.amount)) {
        errors.amount = "ALLOW_NUMERIC"
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
        errors.amount = t("MINIMUM_WITHDRAW", { "AMOUNT": value.minimumWithdraw, "COIN": value.coin })
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

export const walletTransferValidation = value => {
    let errors = {};

    if (isEmpty(value.toType)) {
        errors.toType = "REQUIRED"
    } else if (!['spot', 'derivative'].includes(value.toType)) {
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