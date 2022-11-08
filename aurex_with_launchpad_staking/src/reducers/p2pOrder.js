// import constant
import {
    P2P_ORDER_DETAIL_SUCCESS,
    P2P_ORDER_DETAIL_ERROR,
    P2P_ORDER_DETAIL_CHAT,
    P2P_ORDER_CANCEL,
    P2P_ORDER_TRANSFER_PAYMENT,
    P2P_ORDER_DISPUTE,
    P2P_CHAT_UPDATE_SOCKET,
    P2P_ORDER_DETAIL_SOCKET,
    P2P_ORDER_STOP_TIMER,
    P2P_ORDER_DETAIL_RESET
} from '../constant';

const initialValue = {
    loader: true,
    data: {},
    chat: []
}

const p2pOrder = (state = initialValue, action) => {
    switch (action.type) {
        case P2P_ORDER_DETAIL_SUCCESS:
            return {
                ...state,
                ...{
                    loader: action.loader,
                    data: action.data,
                    chat: action.chat
                }
            };

        case P2P_ORDER_DETAIL_ERROR:
            return {
                loader: false,
                data: {},
                chat: []
            };
        case P2P_ORDER_DETAIL_CHAT:
            return {
                ...state,
                chat: action.chat
            };
        case P2P_ORDER_CANCEL:
            return {
                ...state,
                data: { ...state.data, ...action.data },
                chat: action.chat
            }
        case P2P_ORDER_TRANSFER_PAYMENT:
            return {
                ...state,
                data: { ...state.data, ...action.data },
                chat: action.chat
            }
        case P2P_ORDER_DISPUTE:
            return {
                ...state,
                data: { ...state.data, ...action.data },
                chat: action.chat
            }
        case P2P_CHAT_UPDATE_SOCKET:
            return {
                ...state,
                chat: action.chat
            }
        case P2P_ORDER_DETAIL_SOCKET:
            return {
                ...state,
                data: { ...state.data, ...action.data },
                chat: action.chat
            }
        case P2P_ORDER_STOP_TIMER:
            return {
                ...state,
                data: { ...state.data, "duration": 0 }
            }
        case P2P_ORDER_DETAIL_RESET:
            return {
                loader: false,
                data: {},
                chat: []
            };
        default:
            return state;
    }
}

export default p2pOrder;
