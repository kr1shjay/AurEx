// import constant
import {
    SET_USER_ACCOUNT,
    UPDATE_USER_ACCOUNT,
    UPDATE_2FA_STATUS
} from '../constant';

const initialValue = {
    isAuthenticated: false
}
const account = (state = initialValue, action) => {
    switch (action.type) {
        case SET_USER_ACCOUNT:
            return {
                ...state,
                ...action.data
            };
        case UPDATE_USER_ACCOUNT:
            return {
                ...state,
                ...action.data
            };
        case UPDATE_2FA_STATUS:
            return {
                ...state,
                twoFAStatus: action.data
            };
        default:
            return state;
    }
}

export default account;