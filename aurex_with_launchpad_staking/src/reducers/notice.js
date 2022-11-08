// import constant
import {
    SET_UNREAD_NOTICE,
    UPDATE_NOTICE_POPUP,
    RESET_NOTICE
} from '../constant';

const initialValue = {
    unread: [],
    isOpen: false
}

const notice = (state = initialValue, action) => {
    switch (action.type) {

        case SET_UNREAD_NOTICE:
            return {
                ...state,
                unread: action.notice
            };
        case UPDATE_NOTICE_POPUP: {
            return {
                ...state,
                isOpen: action.isOpen
            }
        }
        case RESET_NOTICE: {
            return initialValue
        }
        default:
            return state;
    }
}

export default notice;