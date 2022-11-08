// import lib
import isEmpty from '../../lib/isEmpty';

const validation = value => {
    let errors = {};

    if (isEmpty(value.price)) {
        errors.price = "Required"
    } else if (isNaN(value.price)) {
        errors.price = "Price only numeric value"
    } else if (value.price <= 0) {
        errors.price = 'invalid value'
    }

    if (!(value.isTerms == true)) {
        errors.isTerms = "Required"
    }

    return errors;
}

export default validation;