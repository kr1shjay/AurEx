// import constant
import {
    SET_THEME,
} from '../constant';

// import { getTheme } from '../lib/localStorage';

const initialState = ''; //getTheme();

const themeReducers = (state = initialState, action) => {
    switch (action.type) {
        case SET_THEME:
            return action.theme;
        default:
            return state;
    }

}

export default themeReducers;