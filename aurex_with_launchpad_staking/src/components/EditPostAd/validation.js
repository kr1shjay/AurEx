import isEmpty from '../../lib/isEmpty';

const validation = value => {
    let errors = {};

    if (isEmpty(value.price)) {
        errors.price = "PRICE_REQUIRED";
    } else if (isNaN(value.price)) {
        errors.price = "ONLY_NUMERIC";
    } else if (parseFloat(value.price) <= 0) {
        errors.price = "ONLY_NUMERIC_POSITIVE";
    }

    if (isEmpty(value.quantity)) {
        errors.quantity = "QUANTITY_REQUIRED";
    } else if (isNaN(value.quantity)) {
        errors.quantity = "ONLY_NUMERIC";
    } else if (parseFloat(value.quantity) <= 0) {
        errors.quantity = "ONLY_NUMERIC_POSITIVE";
    }

    if (isEmpty(value.minLimit)) {
        errors.minLimit = "Min limit field is required";
    } else if (isNaN(value.minLimit)) {
        errors.minLimit = "ONLY_NUMERIC";
    } else if (parseFloat(value.minLimit) <= 0) {
        errors.minLimit = "Only allowed positive numeric values";
    }

    if (isEmpty(value.maxLimit)) {
        errors.maxLimit = "MAX_LIMIT_REQUIRED"
    } else if (isNaN(value.maxLimit)) {
        errors.maxLimit = "ONLY_NUMERIC";
    } else if (parseFloat(value.maxLimit) <= 0) {
        errors.maxLimit = "ONLY_NUMERIC_POSITIVE";
    }

    if (isEmpty(value.payBy)) {
        errors.payBy = "REQUIRED"
    }

    return errors;
}

export default validation;