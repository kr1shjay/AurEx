// import constant
import {
    SET_SPOT_MARKET_PRICE,
    SET_PERPETUAL_MARKET_PRICE
} from '../constant';

const initialValue = {
}
const marketPrice = (state = initialValue, action) => {
    switch (action.type) {
        case SET_SPOT_MARKET_PRICE:
            return {
                ...state,
                ...action.data
            };
        case SET_PERPETUAL_MARKET_PRICE:
            return {
                ...state,
                ...action.data
            };
        default:
            return state;
    }
}

export default marketPrice;