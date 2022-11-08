// import config
import axios, { handleResp } from '../config/axios'

// import constant
import {
    P2P_POST_LIST_SUCCESS,
    P2P_POST_LIST_ERROR,
    P2P_ORDER_DETAIL_SUCCESS,
    P2P_ORDER_DETAIL_RESET,
    P2P_ORDER_DETAIL_ERROR,
    P2P_ORDER_DETAIL_CHAT,
    P2P_ORDER_CANCEL,
    P2P_ORDER_TRANSFER_PAYMENT,
    P2P_ORDER_DISPUTE,
    P2P_CHAT_UPDATE_SOCKET,
    P2P_ORDER_DETAIL_SOCKET,
    P2P_ORDER_STOP_TIMER,
    P2P_SET_PAIR_LIST
} from '../constant';

export const detail = async (data) => {
    try {
        let respData = await axios({
            'url': `/api/p2p/detail`,
            'method': 'get',
            'params': data
        });
        return {
            status: "success",
            loading: false,
            message: respData.data.message,
            result: respData.data.result
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: "failed",
            loading: false,
            message: err.response.data.message,
            error: err.response.data.errors
        }
    }
}

export const allPostAd = async (data) => {
    try {
        let respData = await axios({
            'url': `/api/p2p/allPostAd`,
            'method': 'get',
            'params': data
        });
        return {
            status: "success",
            loading: false,
            message: respData.data.message,
            result: respData.data.result
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: "failed",
            loading: false,
            message: err.response.data.message,
            error: err.response.data.errors
        }
    }
}

export const getPairList = async (dispatch) => {
    try {
        let respData = await axios({
            'url': `/api/p2p/pair`,
            'method': 'get',
        });

        dispatch({
            'type': P2P_SET_PAIR_LIST,
            'pairList': respData.data.result
        })
        return {
            status: "success",
            loading: false,
            message: respData.data.message,
            result: respData.data.result
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: "failed",
            loading: false,
        }
    }
}

export const postOrder = async (data) => {
    try {
        let respData = await axios({
            'url': `/api/p2p/postOrder`,
            'method': 'post',
            'data': data
        });
        return {
            status: "success",
            loading: false,
            message: respData.data.message,
            result: respData.data.result
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: "failed",
            loading: false,
            message: err.response.data.message,
            error: err.response.data.errors
        }
    }
}

export const editPost = async (data) => {
    try {
        let respData = await axios({
            'url': `/api/p2p/postOrder`,
            'method': 'put',
            'data': data
        });
        return {
            status: "success",
            loading: false,
            message: respData.data.message,
            result: respData.data.result
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: "failed",
            loading: false,
            message: err.response.data.message,
            error: err.response.data.errors
        }
    }
}

export const cancelPost = async (data) => {
    try {
        let respData = await axios({
            'url': `/api/p2p/postOrder`,
            'method': 'patch',
            'data': data
        });
        return {
            status: "success",
            loading: false,
            message: respData.data.message,
            result: respData.data.result
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: "failed",
            loading: false,
            message: err.response.data.message,
        }
    }
}

export const postOrderList = async (data, dispatch) => {
    try {
        let respData = await axios({
            'url': `/api/p2p/postOrderList`,
            'method': 'get',
            'params': data
        });

        dispatch({
            type: P2P_POST_LIST_SUCCESS,
            loader: false,
            count: respData.data.result.count,
            data: respData.data.result.data
        })
        return false
    }
    catch (err) {
        handleResp(err, 'error')
        dispatch({
            type: P2P_POST_LIST_ERROR,
            loader: false,
        })
        return true
    }
}

export const orderPlace = async (data) => {
    try {
        let respData = await axios({
            'url': `/api/p2p/orderPlace`,
            'method': 'post',
            'data': data
        });

        return {
            status: "success",
            loading: false,
            message: respData.data.message,
            result: respData.data.result
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: "failed",
            loading: false,
            message: err.response.data.message,
            error: err.response.data.errors
        }
    }
}

export const getOrderDetail = async (orderId, dispatch) => {
    try {
        let respData = await axios({
            'url': `/api/p2p/orderDetail/${orderId}`,
            'method': 'get',
        });

        dispatch({
            type: P2P_ORDER_DETAIL_SUCCESS,
            loader: false,
            data: respData.data.result.detail,
            chat: respData.data.result.chat,
        })
        return true
    }
    catch (err) {
        handleResp(err, 'error')
        dispatch({
            type: P2P_ORDER_DETAIL_ERROR,
            loader: false,
        })
        return false
    }
}

export const resetOrderDetail = async (dispatch) => {
    try {
        dispatch({
            type: P2P_ORDER_DETAIL_RESET,
        })
        return true
    }
    catch (err) {
        handleResp(err, 'error')
    }
}

export const usrConversation = async (data, dispatch) => {
    try {
        let respData = await axios({
            'url': `/api/p2p/conversation`,
            'method': 'post',
            'data': data
        });
        dispatch({
            type: P2P_ORDER_DETAIL_CHAT,
            chat: respData.data.result.chat,
        })
        return {
            status: "success",
            loading: false,
            message: respData.data.message,
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: "failed",
            loading: false,
            message: err.response.data.message,
        }
    }
}

export const cancelOrder = async (orderId, dispatch) => {
    try {
        let respData = await axios({
            'url': `/api/p2p/cancelOrder/${orderId}`,
            'method': 'delete',
        });

        dispatch({
            type: P2P_ORDER_CANCEL,
            data: respData.data.result.detail,
            chat: respData.data.result.chat,
        })
        return {
            status: "success",
            loading: false,
            message: respData.data.message,
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: "failed",
            loading: false,
            message: err.response.data.message,
        }
    }
}

export const transferPayment = async (orderId, dispatch) => {
    try {
        let respData = await axios({
            'url': `/api/p2p/transferPayment/${orderId}`,
            'method': 'post',
        });

        dispatch({
            type: P2P_ORDER_TRANSFER_PAYMENT,
            data: respData.data.result.detail,
            chat: respData.data.result.chat,
        })
        return {
            status: "success",
            loading: false,
            message: respData.data.message,
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: "failed",
            loading: false,
            message: err.response.data.message,
        }
    }
}

export const orderUpdate = (result, type, dispatch) => {
    if (type == 'chat') {
        dispatch({
            type: P2P_CHAT_UPDATE_SOCKET,
            chat: result.chat,
        })
    } else if (type == 'cancelled' || type == 'transferPayment' || type == 'releaseAsset' || type == 'disputed') {
        dispatch({
            type: P2P_ORDER_DETAIL_SOCKET,
            data: result.detail,
            chat: result.chat,
        })
    }
    return true
}

export const releaseAsset = async (data, dispatch) => {
    try {
        let respData = await axios({
            'url': `/api/p2p/releaseAsset`,
            'method': 'post',
            'data': data
        });

        dispatch({
            type: P2P_ORDER_TRANSFER_PAYMENT,
            data: respData.data.result.detail,
            chat: respData.data.result.chat,
        })
        return {
            status: "success",
            loading: false,
            message: respData.data.message,
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: "failed",
            loading: false,
            message: err.response.data.message,
        }
    }
}

export const disputeOrder = async (orderId, dispatch) => {
    try {
        let respData = await axios({
            'url': `/api/p2p/disputeOrder/${orderId}`,
            'method': 'post',
        });

        dispatch({
            type: P2P_ORDER_DISPUTE,
            data: respData.data.result.detail,
            chat: respData.data.result.chat,
        })
        return {
            status: "success",
            loading: false,
            message: respData.data.message,
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: "failed",
            loading: false,
            message: err.response.data.message,
        }
    }
}

export const orderHistory = async (data) => {
    try {
        let respData = await axios({
            'url': `/api/p2p/orderHistory`,
            'method': 'get',
            'params': data
        });

        return {
            status: "success",
            loading: false,
            result: respData.data.result,
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: "failed",
            loading: false,
            message: err.response.data.message,
        }
    }
}

export const orderHistoryDoc = async (data) => {
    try {
        let respData = await axios({
            'url': `/api/p2p/orderHistoryDoc`,
            'method': 'get',
            'params': data
        });

        return {
            status: "success",
            loading: false,
            result: respData.data.result,
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: "failed",
            loading: false,
            message: err.response.data.message,
        }
    }
}

export const stopTimer = (dispatch) => {
    dispatch({
        type: P2P_ORDER_STOP_TIMER,
    })
}