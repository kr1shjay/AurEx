// import constant
import {
    SET_TIME_ZONE,
} from '../constant';

const initialState = [];

const timezone = (state = initialState, action) => {
    switch (action.type) {
        case SET_TIME_ZONE:
            return [
                ...state,
                ...action.data
            ];
        default:
            return state;
    }

}

export default timezone;