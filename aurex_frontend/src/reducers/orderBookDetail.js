// import constant
import {
    SET_SPOT_ORDER_BOOK,
} from '../constant';

const initialState = {
    'price': '',
    'quantity':''
}

const orderBookDetail = (state = initialState, action) => {
    console.log('orderBookDetail',action)
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