// import lib
import isEmpty from '../../lib/isEmpty';

const validation = value => {
    let errors = {};
    
    if (isEmpty(value.price)) {
        errors.price = "REQUIRED"
    } else if (isNaN(value.price)) {
        errors.price = "ONLY_NUMERIC"
    }else if (value.price <= 0) {
        errors.price = 'invalid value'
    }


    if (!(value.isTerms == true)) {
        errors.isTerms = "REQUIRED"
    }

    return errors;
}

export default validation;