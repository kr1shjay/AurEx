// import constant
import {
    P2P_SET_PAIR_LIST
} from '../constant';

const initialValue = []

const p2pPair = (state = initialValue, action) => {
    switch (action.type) {
        case P2P_SET_PAIR_LIST:
            return action.pairList
        default:
            return state;
    }
}

export default p2pPair;