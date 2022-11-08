import isEmpty from '../../lib/isEmpty';

const validation = value => {
    let errors = {};

    if (isEmpty(value.price)) {
        errors.price = "REQUIRED"
    } else if (isNaN(value.price)) {
        errors.price = "ONLY_NUMERIC"
    }

    if (isEmpty(value.payBy)) {
        errors.payBy = "REQUIRED"
    }

    if (isEmpty(value.firstCoinId)) {
        errors.firstCoin = "REQUIRED"
    }

    if (isEmpty(value.secondCoinId)) {
        errors.secondCoin = "REQUIRED"
    }

    if (isEmpty(value.price)) {
        errors.price = "REQUIRED"
    } else if (isNaN(value.price)) {
        errors.price = "ONLY_NUMERIC"
    } else if (value.price <= 0) {
        errors.price = "ONLY_NUMERIC_POSITIVE"
    }

    if (isEmpty(value.quantity)) {
        errors.quantity = "QUANTITY_REQUIRED"
    } else if (isNaN(value.quantity)) {
        errors.quantity = "QUANTITY_ONLY_NUMERIC"
    } else if (value.quantity <= 0) {
        errors.quantity = "ONLY_NUMERIC_POSITIVE"
    }

    if (isEmpty(value.side)) {
        errors.side = "SIDE_REQUIRED"
    } else if (!['buy', 'sell'].includes(value.side)) {
        errors.value = "INVALID_SIDE"
    }

    if (isEmpty(value.minLimit)) {
        errors.minLimit = "MIN_LIMIT_REQUIRED"
    } else if (isNaN(value.minLimit)) {
        errors.minLimit = "MIN_LIMIT_REQUIRED"
    } else if (value.minLimit <= 0) {
        errors.minLimit = "ONLY_NUMERIC_POSITIVE"
    } else if (value.maxLimit < value.minLimit) {
        errors.minLimit = "LESS_LIMIT_PURCHASE"
    }

    if (isEmpty(value.maxLimit)) {
        errors.maxLimit = "MAX_LIMIT_REQUIRED"
    } else if (isNaN(value.maxLimit)) {
        errors.maxLimit = "MAX_LIMIT_REQUIRED"
    } else if (value.maxLimit <= 0) {
        errors.maxLimit = "ONLY_NUMERIC_POSITIVE"
    }

    if (value.endDate == "") {
        errors.endDate = "SELECT_DATE";
    } else if (new Date(value.endDate) < new Date()) {
        errors.endDate = "GREATER_THEN_CURRENT";
    }

    if (value.isTerms != true) {
        errors.isTerms = "ACCEPT_TERMS";
    }


    return errors;
}

export default validation;