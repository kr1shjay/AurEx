// import constant
import {
    SUPPORT_ICON_BTN
} from '../constant';

const initialValue = {
    'supportBtn': -1
}

const iconBtn = (state = initialValue, action) => {
    switch (action.type) {
        case SUPPORT_ICON_BTN:
            return {
                ...state,
                'supportBtn': state.supportBtn == action.supportBtn ? -1 : action.supportBtn
            }
        default:
            return state;
    }
}

export default iconBtn;