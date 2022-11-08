// import lib
import isEmpty from '../../lib/isEmpty';


export const limitOrderValidate = (value) => {
    let errors = {};

    if (isEmpty(value.price)) {
        errors.price = "Price field is Required"
        return errors;
    } else if (isNaN(value.price)) {
        errors.price = "Price only numeric value"
        return errors;
    } else if (parseFloat(value.price) < 0) {
        errors.price = "Prices only positive numeric value";
        return errors;
    }

    if (isEmpty(value.quantity)) {
        errors.quantity = "Quantity field is Required"
        return errors;
    } else if (isNaN(value.quantity)) {
        errors.quantity = "Quantity only numeric value"
        return errors;
    } else if (parseFloat(value.quantity) < 0) {
        errors.quantity = "Quantity only positive numeric value";
        return errors;
    }

    if (isEmpty(value.buyorsell)) {
        errors.buyorsell = "Side field is Required"
        return errors;
    } else if (!['buy', 'sell'].includes(value.buyorsell)) {
        errors.value = "Invalid side"
        return errors;
    }

    if (isEmpty(value.spotPairId)) {
        errors.spotPairId = "Pair field is Required"
        return errors;
    }
}

export const marketOrderValidate = (value) => {
    let errors = {};

    if (isEmpty(value.quantity)) {
        errors.quantity = "Quantity field is Required"
        return errors;
    } else if (isNaN(value.quantity)) {
        errors.quantity = "Quantity only numeric value"
        return errors;
    } else if (parseFloat(value.quantity) < 0) {
        errors.quantity = "Quantity only positive numeric value";
        return errors;
    }

    if (isEmpty(value.buyorsell)) {
        errors.buyorsell = "Side field is Required"
        return errors;
    } else if (!['buy', 'sell'].includes(value.buyorsell)) {
        errors.value = "Invalid side"
        return errors;
    }

    if (isEmpty(value.spotPairId)) {
        errors.spotPairId = "Pair field is Required"
        return errors;
    }
}

export const stopLimitOrdrValidate = (value) => {
    let errors = {};

    if (isEmpty(value.stopPrice)) {
        errors.stopPrice = "Stop price field is Required"
        return errors;
    } else if (isNaN(value.stopPrice)) {
        errors.stopPrice = "Stop price only numeric value"
        return errors;
    } else if (parseFloat(value.stopPrice) < 0) {
        errors.stopPrice = "Stop price only positive numeric value";
        return errors;
    }

    if (isEmpty(value.price)) {
        errors.price = "Price field is Required"
        return errors;
    } else if (isNaN(value.price)) {
        errors.price = "Price only numeric value"
        return errors;
    } else if (parseFloat(value.price) < 0) {
        errors.price = "Price only positive numeric value";
        return errors;
    }

    if (isEmpty(value.quantity)) {
        errors.quantity = "Quantity field is Required"
        return errors;
    } else if (isNaN(value.quantity)) {
        errors.quantity = "Quantity only numeric value"
        return errors;
    } else if (parseFloat(value.quantity) < 0) {
        errors.quantity = "Quantity only positive numeric value";
        return errors;
    }

    if (isEmpty(value.buyorsell)) {
        errors.buyorsell = "Side field is Required"
        return errors;
    } else if (!['buy', 'sell'].includes(value.buyorsell)) {
        errors.value = "Invalid side"
        return errors;
    }

    if (isEmpty(value.spotPairId)) {
        errors.spotPairId = "Pair field is Required"
        return errors;
    }
}

const validation = (value) => {
    if (value.orderType === 'limit') {
        return limitOrderValidate(value)
    } else if (value.orderType === 'market') {
        return marketOrderValidate(value)
    } else if (value.orderType == 'stop_limit') {
        return stopLimitOrdrValidate(value)
    }
}

export default validation;