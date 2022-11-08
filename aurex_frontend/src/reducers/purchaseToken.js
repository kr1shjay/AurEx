// import constant
import {
    PURCHASE_TOKEN_LIST_SUCCESS,
    PURCHASE_TOKEN_LIST_ERROR,
    PURCHASE_TOKEN_ADD_LIST
} from '../constant';

const initialValue = {
    loader: true,
    data: []
}

const purchaseToken = (state = initialValue, action) => {
    switch (action.type) {
        case PURCHASE_TOKEN_LIST_SUCCESS:
            return {
                ...state,
                ...action.data
            };

        case PURCHASE_TOKEN_LIST_ERROR:
            return {
                loader: false,
                data: []
            };

        case PURCHASE_TOKEN_ADD_LIST:
            return {
                loader: false,
                data: [...action.data, ...state.data]
            }

        default:
            return state;
    }
}

export default purchaseToken;