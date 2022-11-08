// import lib
import isEmpty from '../../lib/isEmpty';

const validation = value => {
    let errors = {};

    if (isEmpty(value.newPhoneCode)) {
        errors.newPhoneCode = "REQUIRED"
    }

    if (isEmpty(value.newPhoneNo)) {
        errors.newPhoneNo = "REQUIRED"
    }

    if (isEmpty(value.otp)) {
        errors.otp = "REQUIRED"
    }

    return errors;
}

export default validation;