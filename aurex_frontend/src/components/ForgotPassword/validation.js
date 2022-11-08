// import lib
import isEmpty from '../../lib/isEmpty';

const validation = value => {
    let errors = {},
        emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;


    if (isEmpty(value.email)) {
        errors.email = "REQUIRED"
    } else if (!(emailRegex.test(value.email))) {
        errors.email = "INVALID_EMAIL"
    }
   

    // if (isEmpty(value.reCaptcha)) {
    //     errors.reCaptcha = "Required"
    // }


    return errors;
}

export default validation;