// import lib
import isEmpty from '../../lib/isEmpty';

const validation = value => {
    let errors = {};
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;

    if (isEmpty(value.name)) {
        errors.name = "REQUIRED"
    }

    if (isEmpty(value.email)) {
        errors.email = "REQUIRED"
    } else if (!(emailRegex.test(value.email))) {
        errors.email = "Invalid email"
    }

    if (isEmpty(value.subject)) {
        errors.subject = "REQUIRED"
    }

    if (isEmpty(value.message)) {
        errors.message = "REQUIRED"
    }

    return errors;
}

export default validation;