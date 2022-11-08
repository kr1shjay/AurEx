// import constant
import {
    SET_SPOT_PAIR_TRADE,
    SET_PERPETUAL_PAIR_TRADE
} from '../constant';

const initialValue = {
}
const tradePair = (state = initialValue, action) => {
    switch (action.type) {
        case SET_SPOT_PAIR_TRADE:
            return {
                ...state,
                ...action.data
            };
        case SET_PERPETUAL_PAIR_TRADE:
            return {
                ...state,
                ...action.data
            };

        default:
            return state;
    }
}

export default tradePair;