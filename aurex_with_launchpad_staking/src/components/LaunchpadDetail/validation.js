// import lib
import isEmpty from '../../lib/isEmpty';

const validation = (value, t) => {
    let errors = {};

    if (isEmpty(value.price)) {
        errors.price = t("PRICE_REQUIRED")
    } else if (isNaN(value.price)) {
        errors.price = t("ALLOW_NUMERIC")
    } else if (parseFloat(value.price) <= 0) {
        errors.price = t("ALLOW_POSITIVE_NUMERIC")
    }

    if (isEmpty(value.quantity)) {
        errors.quantity = t("PRICE_REQUIRED")
    } else if (isNaN(value.quantity)) {
        errors.quantity = t("ALLOW_NUMERIC")
    } else if (parseFloat(value.quantity) <= 0) {
        errors.quantity = t("ALLOW_POSITIVE_NUMERIC")
    }

    if (isEmpty(value.currencyId)) {
        errors.currencyId = t("REQUIRED")
    }

    if (!isEmpty(value.quantity) && value.quantity < value.minAmount) {
        errors.minAmount = t("MINIMUM_QUANTITY", { "QUANTITY": value.minAmount })
    }


    if (value.spotBal <= 0) {
        errors.spotBal = t("NOT_AVAILABLE_BALANCE")
    } else if (value.total > value.spotBal) {
        errors.spotBal = t("INSUFFICIENT_BALANCE")
    }

    return errors;
}

export default validation;