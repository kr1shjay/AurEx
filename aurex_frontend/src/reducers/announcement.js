// import constant
import {
    SET_ANNOUNCEMENT,
} from '../constant';

const initialValue = []

const announcement = (state = initialValue, action) => {
    switch (action.type) {

        case SET_ANNOUNCEMENT:
            return [
                ...action.data
            ];
        default:
            return state;
    }
}

export default announcement;