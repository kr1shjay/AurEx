// import constant
import {
    SET_CURRENCY,
} from '../constant';

const initialState = [];

const currency = (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENCY:
            return action.data;
        default:
            return state;
    }

}

export default currency;