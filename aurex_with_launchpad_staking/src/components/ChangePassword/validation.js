// import lib
import isEmpty from '../../lib/isEmpty';

const validation = value => {
    let errors = {},
        passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\W).{6,18}(?!\S)/;

    if (isEmpty(value.oldPassword)) {
        errors.oldPassword = "REQUIRED"
    } 
    // else if (value.oldPassword.length > 18) {
    //     errors.oldPassword = "PASSWORD_MIN_MAX"
    // } else if (value.oldPassword.length < 6) {
    //     errors.oldPassword = "PASSWORD_MIN_MAX"
    // } else if (!(passwordRegex.test(value.oldPassword))) {
    //     errors.oldPassword = "REGEX_PASSWORD"
    // }

    if (isEmpty(value.password)) {
        errors.password = "REQUIRED"
    } else if (value.password.length > 18) {
        errors.password = "PASSWORD_MIN_MAX"
    } else if (value.password.length < 6) {
        errors.password = "PASSWORD_MIN_MAX"
    } else if (!(passwordRegex.test(value.password))) {
        errors.password = "REGEX_PASSWORD"
    }


    if (isEmpty(value.confirmPassword)) {
        errors.confirmPassword = "REQUIRED"
    } else if (value.confirmPassword.length > 18) {
        errors.confirmPassword = "PASSWORD_MIN_MAX"
    } else if (value.confirmPassword.length < 6) {
        errors.confirmPassword = "PASSWORD_MIN_MAX"
    } else if (!(isEmpty(value.confirmPassword)) && value.password != value.confirmPassword) {
        errors.confirmPassword = "CONFIRM_PASSWORD_MISMATCH"
    }
    else if (!(passwordRegex.test(value.confirmPassword))) {
        errors.confirmPassword = "REGEX_PASSWORD"
    }

    return errors;
}

export default validation;