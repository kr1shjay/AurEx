// import lib
import isEmpty, { isBoolean } from '../../lib/isEmpty';

const validation = value => {
    let errors = {};

    if (isEmpty(value.ipRestriction)) {
        errors.ipRestriction = "REQUIRED"
    } else if (!isBoolean(value.ipRestriction)) {
        errors.ipRestriction = "REQUIRED"
    }

    if (value.ipRestriction == 'true') {
        if (isEmpty(value.ipList)) {
            errors.ipList = "REQUIRED"
        } else if (value.ipList.split(',').length > 4) {
            errors.ipList = "MAX_LIMIT_4"
        }
    }

    if (isEmpty(value.password)) {
        errors.password = "REQUIRED"
    }
    if (isEmpty(value.name)){
        errors.name = "REQUIRED"
    }

    return errors;
}

export default validation;