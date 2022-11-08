// import constant
import {
    SET_USER_WALLET_LIST,
    UPDATE_USER_WALLET_STAKE,
    HIDE_ZERO
} from '../constant';

const initialValue = []

const wallet = (state = initialValue, action) => {
    console.log("actionactionactionactionaction",action)
    switch (action.type) {
     
        case SET_USER_WALLET_LIST: return action.data
        case HIDE_ZERO: return action.data
        case UPDATE_USER_WALLET_STAKE:
            if (state && state.length > 0) {
                let newRecord = [];
                state.map((item, key) => {
                    if (item._id == action.data.userAssetId) {
                        newRecord.push({
                            ...item,
                            ...{
                                "spotBal": action.data.spotBal
                            }
                        })
                    } else {
                        newRecord.push(item)
                    }
                })

                return newRecord;
            }
            return state
        default:
            return state;
    }
}

export default wallet;