// import lib
import isEmpty from '../../lib/isEmpty';

const validation = value => {
    if (value.formType == 'email') {
        return emailValidation(value)
    } else if (value.formType == 'mobile') {
        return mobileValidation(value)
    }
}

export const emailValidation = (value) => {
    let errors = {};
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;

    if (isEmpty(value.email)) {
        errors.email = "REQUIRED"
    } else if (!(emailRegex.test(value.email))) {
        errors.email = "invalid email"
    }

    if (isEmpty(value.password)) {
        errors.password = "REQUIRED"
    }

    // if (!(value.isTerms == true)) {
    //     errors.isTerms = "REQUIRED"
    // }

    return errors;
}

export const mobileValidation = (value) => {
    let errors = {};

    if (isEmpty(value.phoneCode)) {
        errors.phoneCode = "Phone number field is required"
    }

    if (isEmpty(value.phoneNo)) {
        errors.phoneNo = "Phone number field is required"
    }

    if (isEmpty(value.otp)) {
        errors.otp = "REQUIRED"
    } else if (isNaN(value.otp)) {
        errors.otp = "ONLY_NUMERIC"
    } else if (value.otp.length > 6) {
        errors.otp = "INVALID_OTP"
    }

    if (isEmpty(value.password)) {
        errors.password = "REQUIRED"
    }

    // if (!(value.isTerms == true)) {
    //     errors.isTerms = "REQUIRED"
    // }

    return errors;
}

export default validation;