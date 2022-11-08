// import lib
import isEmpty from '../../lib/isEmpty';

const validation = value => {
    let errors = {};
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;
    let passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\W).{6,18}(?!\S)/g;

    if (isEmpty(value.email)) {
        errors.email = "REQUIRED"
    } else if (!(emailRegex.test(value.email))) {
        errors.email = "Invalid email"
    }

    if (isEmpty(value.password)) {
        errors.password = "REQUIRED"
    } else if (!(passwordRegex.test(value.password))) {
        errors.password = "PASSWORD_MIN_MAX"
    } else if (value.password.length > 18) {
        errors.password = "PASSWORD_MIN_MAX"
    }

    if (isEmpty(value.confirmPassword)) {
        errors.confirmPassword = "REQUIRED"
    } else if (!(isEmpty(value.confirmPassword)) && value.password != value.confirmPassword) {
        errors.confirmPassword = "CONFIRM_PASSWORD_MISMATCH"
    }

    // if (isEmpty(value.reCaptcha)) {
    //     errors.reCaptcha = "REQUIRED"
    // }
    
    // if (!(value.isTerms == true)) {
    //     errors.isTerms = "REQUIRED"
    // }

    return errors;
}

export default validation;