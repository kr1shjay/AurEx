// import lib
import isEmpty from '../../../lib/isEmpty';

const validation = value => {
    let errors = {};

    if (isEmpty(value.pairId)) {
        errors.pairId = "Pair field is Required"
    }

    if (isEmpty(value.side)) {
        errors.side = "Side field is Required"
    } else if (!['buy', 'sell'].includes(value.side)) {
        errors.side = "invalid side"
    }

    if (isEmpty(value.startPrice)) {
        errors.startPrice = "Start Price field is Required"
    } else if (isNaN(value.startPrice)) {
        errors.startPrice = "Start Price only numeric value"
    } else if (parseFloat(value.startPrice) < 0) {
        errors.startPrice = "Start Price only positive numeric value"
    }

    if (isEmpty(value.endPrice)) {
        errors.endPrice = "End Price field is Required"
    } else if (isNaN(value.endPrice)) {
        errors.endPrice = "End Price only numeric value"
    } else if (parseFloat(value.endPrice) < 0) {
        errors.endPrice = "End Price only positive numeric value"
    } else if (!(isEmpty(value.endPrice)) && value.startPrice < value.endPrice) {
        errors.endPrice = "End Price must less than Start Price"
    }

    if (isEmpty(value.startQuantity)) {
        errors.startQuantity = "Start Quantity field is Required"
    } else if (isNaN(value.startQuantity)) {
        errors.startQuantity = "Start Quantity only numeric value"
    } else if (parseFloat(value.startQuantity) < 0) {
        errors.startQuantity = "Start Quantity only positive numeric value"
    }

    if (isEmpty(value.endQuantity)) {
        errors.endQuantity = "End Quantity field is Required"
    } else if (isNaN(value.endQuantity)) {
        errors.endQuantity = "End Quantity only numeric value"
    } else if (parseFloat(value.endQuantity) < 0) {
        errors.endQuantity = "End Quantity only positive numeric value"
    } else if (!(isEmpty(value.endQuantity)) && value.startQuantity < value.endQuantity) {
        errors.endQuantity = "End Quantity must less than Start Quantity"
    }


    if (isEmpty(value.count)) {
        errors.count = "Count field is Required"
    } else if (isNaN(value.count)) {
        errors.count = "Count only numeric value"
    } else if (parseFloat(value.count) > 0) {
        errors.count = "Count only positive numeric value"
    }

    return errors;
}

export default validation;