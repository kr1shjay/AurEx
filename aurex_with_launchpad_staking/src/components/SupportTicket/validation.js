// import lib
import isEmpty from '../../lib/isEmpty';

const validation = (value, callFrom) => {
    if (callFrom == 'createTicket') {
        return createTicket(value)
    } else if (callFrom == 'replyMsg') {
        return replyMsg(value)
    }
}

export const createTicket = value => {
    let errors = {};

    if (isEmpty(value.categoryId)) {
        errors.categoryId = "REQUIRED"
    }

    if (isEmpty(value.message)) {
        errors.message = "REQUIRED"
    }

    return errors;
}

export const replyMsg = value => {
    let errors = {};

    if (isEmpty(value.message)) {
        errors.message = "REQUIRED"
    }

    // return errors;
}

export default validation;