// import constant
import {
    SET_SPOT_ORDER_BOOK,
} from '../constant';

const initialState = {
    'price': ''
}

const orderBookDetail = (state = initialState, action) => {
    switch (action.type) {
        case SET_SPOT_ORDER_BOOK:
            return {
                ...state,
                ...action.data
            }
        default:
            return state;
    }

}

export default orderBookDetail;