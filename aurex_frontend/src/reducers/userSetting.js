// import constant
import {
    SET_USER_SETTING,
} from '../constant';

const initialState = {
};

const userSetting = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_SETTING:
            return {
                ...state,
                ...action.data
            };
        default:
            return state;
    }

}

export default userSetting;