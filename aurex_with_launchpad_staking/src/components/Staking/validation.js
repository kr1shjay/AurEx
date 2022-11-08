// import lib
import isEmpty from '../../lib/isEmpty';

const validation = value => {
    let errors = {};
    
    if (isEmpty(value.price)) {
        errors.price = "REQUIRED"
    } else if (isNaN(value.price)) {
        errors.price = "PRICE_ONLY_NUMERIC"
    }


    if (!(value.isTerms == true)) {
        errors.isTerms = "REQUIRED"
    }

    return errors;
}

export default validation;