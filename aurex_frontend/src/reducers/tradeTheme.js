// import constant
import {
    SET_TRADE_THEME,
} from '../constant';

const initialState = '';

const tradeThemeReducers = (state = initialState, action) => {
    switch (action.type) {
        case SET_TRADE_THEME:
            return action.theme;
        default:
            return state;
    }

}

export default tradeThemeReducers;