// import constant
import {
    STAKE_ORDER_LIST_SUCCESS,
    STAKE_ORDER_LIST_ERROR,
    ADD_NEW_STAKE_ORDER,
    CANCEL_STAKE_ORDER
} from '../constant';

const initialValue = {
    loader: true,
    data: []
}

const stakeOrder = (state = initialValue, action) => {
    switch (action.type) {
        case STAKE_ORDER_LIST_SUCCESS:
            return {
                ...state,
                ...action.data
            };

        case STAKE_ORDER_LIST_ERROR:
            return {
                loader: false,
                data: []
            };

        case ADD_NEW_STAKE_ORDER:
            return {
                ...state,
                ...{
                    data: [
                        ...[action.data],
                        ...state.data
                    ]
                }
            }

        case CANCEL_STAKE_ORDER:
            let { data } = state;

            if (data && data.length > 0) {
                let newRecord = [];
                data.map((item, key) => {
                    if (item._id == action.data._id) {
                        newRecord.push(action.data)
                    } else {
                        newRecord.push(item)
                    }
                })

                return {
                    ...state,
                    ...{ data: newRecord }
                };
            }
            return state
        default:
            return state;
    }
}

export default stakeOrder;