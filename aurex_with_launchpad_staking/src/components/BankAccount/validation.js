// import lib
import isEmpty from '../../lib/isEmpty';

const validation = value => {
    let errors = {};

    if (isEmpty(value.bankName)) {
        errors.bankName = "REQUIRED"
    }

    if (isEmpty(value.accountNo)) {
        errors.accountNo = "REQUIRED"
    }

    if (isEmpty(value.holderName)) {
        errors.holderName = "REQUIRED"
    }

    if (isEmpty(value.bankcode)) {
        errors.bankcode = "REQUIRED"
    }

    if (isEmpty(value.country)) {
        errors.country = "REQUIRED"
    }

    if (isEmpty(value.city)) {
        errors.city = "REQUIRED"
    }

    if (isEmpty(value.bankAddress)) {
        errors.bankAddress = "REQUIRED"
    }

    if (isEmpty(value.currencyId)) {
        errors.currencyId = "REQUIRED"
    }

    return errors;
}

export default validation;