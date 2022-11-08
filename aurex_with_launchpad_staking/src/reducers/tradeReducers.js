// import constant
import {
    SET_LAST_PRICE,
    SET_SPOT_TRADE_PAIR_LIST,
    SET_THEME
} from '../constant';

const initialValue = {
    lastPrice: 0,
    tradeList: [],
    theme:'dark'
}
const spotTrade = (state = initialValue, action) => {
    switch (action.type) {
        case SET_LAST_PRICE:
            return {
                ...state,
                ...{
                    lastPrice: action.lastPrice
                }
            };
        case SET_SPOT_TRADE_PAIR_LIST:
            return {
                ...state,
                ...{
                    tradeList: action.tradeList
                }
            };
        case SET_THEME:
            return {
                ...state,
                ...{
                    theme: action.theme
                }
            };
        default:
            return state;
    }
}

export default spotTrade;