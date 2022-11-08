// import constant
import {
    SET_PRICE_CONVERSION,
} from '../constant';

const initialValue = []

const priceConversion = (state = initialValue, action) => {
    switch (action.type) {

        case SET_PRICE_CONVERSION:
            return [
                ...action.data
            ];
        default:
            return state;
    }
}

export default priceConversion;