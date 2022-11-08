// import constant
import {
    SET_SPOT_TRADE_PAIR_LIST,
} from '../constant';

const initialValue = []

const pairList = (state = initialValue, action) => {
    switch (action.type) {

        case SET_SPOT_TRADE_PAIR_LIST:
            return [
                ...action.data
            ];
        default:
            return state;
    }
}

export default pairList;