// import lib
import isEmpty from '../../lib/isEmpty';

const validation = value => {
    let errors = {},
        passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\W).{6,18}(?!\S)/g;
    console.log('value.password', value.password)
    if (isEmpty(value.password)) {
        errors.password = "REQUIRED"
    } else if (value.password.length < 6) {
        errors.password = "PASSWORD_MIN_MAX"
    }
    else if (value.password.length > 18) {
        errors.password = "PASSWORD_MIN_MAX"
    } else if (!(passwordRegex.test(value.password))) {
        errors.password = "REGEX_PASSWORD"
    }


    if (isEmpty(value.confirmPassword)) {
        errors.confirmPassword = "REQUIRED"
    } else if (!(isEmpty(value.confirmPassword)) && value.password != value.confirmPassword) {
        errors.confirmPassword = "CONFIRM_PASSWORD_MISMATCH"
    }


    return errors;
}

export default validation;