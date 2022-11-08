// import constant
import {
    SET_MEDIA,
} from '../constant';

const initialState = {
};

const media = (state = initialState, action) => {
    switch (action.type) {
        case SET_MEDIA:
            return {
                ...state,
                ...action.data
            };
        default:
            return state;
    }

}

export default media;