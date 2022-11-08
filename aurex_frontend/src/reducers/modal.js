// import constant
import {
    TOGGLE_SIDE_BAR,
    SETTING_MODAL,
} from '../constant';

const initialState = {
    settingModal: false,
    isOpenConfirmModal: false
};

const modal = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_SIDE_BAR:
            return {
                ...state,
                toggleSideBar: action.toggleSideBar
            };
        case SETTING_MODAL:
            return {
                ...state,
                settingModal: action.settingModal
            };
        default:
            return state;
    }

}

export default modal;