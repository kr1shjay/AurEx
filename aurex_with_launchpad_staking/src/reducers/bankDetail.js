// import constant
import {
    SET_BANK_DETAIL,
    SET_BANK_FORM
} from '../constant';

const initialState = {
    formType: '',
    formDisable: true,
    editRecord: {},
    result: []
};

const bankDetail = (state = initialState, action) => {
    switch (action.type) {
        case SET_BANK_DETAIL:
            return {
                ...state,
                ...action.data
            };
        case SET_BANK_FORM:
            return {
                ...state,
                ...action.data
            };
        default:
            return state;
    }

}

export default bankDetail;