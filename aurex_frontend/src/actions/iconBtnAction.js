// import constant
import {
    SUPPORT_ICON_BTN,
} from '../constant';

export const supportIcon = (dispatch, eventKey) => {
    dispatch({
        type: SUPPORT_ICON_BTN,
        supportBtn: eventKey
    })
    return true
}