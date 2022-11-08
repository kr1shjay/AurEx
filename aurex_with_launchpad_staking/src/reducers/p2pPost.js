// import constant
import {
    P2P_POST_LIST_SUCCESS,
    P2P_POST_LIST_ERROR,
} from '../constant';

const initialValue = {
    loader: true,
    count: 0,
    data: []
}

const p2pPost = (state = initialValue, action) => {
    switch (action.type) {
        case P2P_POST_LIST_SUCCESS:
            return {
                ...state,
                ...{
                    loader: action.loader,
                    count: action.count,
                    data: action.data
                }
            };

        case P2P_POST_LIST_ERROR:
            return {
                loader: false,
                data: []
            };
        default:
            return state;
    }
}

export default p2pPost;