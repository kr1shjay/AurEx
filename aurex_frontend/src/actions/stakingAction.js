// import config
import axios,{handleResp} from '../config/axios';

// import constant
import {
    STAKE_ORDER_LIST_SUCCESS,
    STAKE_ORDER_LIST_ERROR,
    ADD_NEW_STAKE_ORDER,
    CANCEL_STAKE_ORDER
} from '../constant';

export const getStaking = async (data) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/getStaking`,
            'params': data
        });
        return {
            status: 'success',
            loading: false,
            message: respData.data.message,
            result: respData.data.result,
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: 'failed',
            loading: false,
            message: err.response.data.message,
        }
    }
}
export const highYield = async () => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/high-yield`,
        });
        return {
            status: 'success',
            loading: false,
            message: respData.data.message,
            result: respData.data.result,
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: 'failed',
            loading: false,
            message: err.response.data.message,
        }
    }
}
export const orderPlace = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `/api/stake/orderPlace`,
            data
        });
        return {
            status: 'success',
            loading: false,
            message: respData.data.message,
            result: respData.data.result,
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: 'failed',
            loading: false,
            message: err.response.data.message,
        }
    }
}

export const getOrderList = async (dispatch) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/stake/orderList`,
        });

        dispatch({
            type: STAKE_ORDER_LIST_SUCCESS,
            data: {
                loader: false,
                data: respData.data.result
            }
        })
        return true
    }
    catch (err) {
        handleResp(err, 'error')
        dispatch({
            type: STAKE_ORDER_LIST_ERROR,
            loader: false,
        })

        return true
    }
}

export const updateStakeOrder = (dispatch, data, callFrom) => {
    if (callFrom == 'newOrder') {
        dispatch({
            type: ADD_NEW_STAKE_ORDER,
            data,
        })

        return true
    } else if (callFrom == 'cancelOrder') {
        dispatch({
            type: CANCEL_STAKE_ORDER,
            data,
        })

        return true
    }
    return false
}

export const orderCancel = async (stakeId) => {
    try {
        let respData = await axios({
            'method': 'delete',
            'url': `/api/stake/cancel/${stakeId}`,
        });
        return {
            status: 'success',
            loading: false,
            message: respData.data.message,
            result: respData.data.result,
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: 'failed',
            loading: false,
            message: err.response.data.message,
        }
    }
}

export const getStakeHistory = async (data) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/stake/settleHistory`,
            'params': data
        });
        return {
            status: 'success',
            loading: false,
            message: respData.data.message,
            result: respData.data.result,
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: 'failed',
            loading: false,
            message: err.response.data.message,
        }
    }
}

export const orderPlaceLocked = async (data) => {
    try {
        let respData = await axios({
            method: "post",
            url: `/api/orderPlaceLocked`,
            data,
        });
        return {
            status: "success",
            loading: false,
            message: respData.data.message,
            result: respData.data.result,
        };
    } catch (err) {
        handleResp(err, 'error')
        return {
            status: "failed",
            loading: false,
            message: err.response.data.message,
        };
    }
}