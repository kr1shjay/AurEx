// import config
import axios,{  handleResp} from "../config/axios";

// import constant
import {
    PURCHASE_TOKEN_LIST_SUCCESS,
    PURCHASE_TOKEN_LIST_ERROR,
    PURCHASE_TOKEN_ADD_LIST
} from '../constant';

export const launchpadList = async (listType, data) => {
    try {
        let respData = await axios({
            'url': `api/launchpad/list/${listType}`,
            'method': 'get',
            'params': data
        });
        return {
            status: "success",
            loading: false,
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

export const getLaunchpad = async (id) => {
    try {
        let respData = await axios({
            'url': `api/launchpad/${id}`,
            'method': 'get',
        });
        return {
            status: "success",
            loading: false,
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

export const purchaseToken = async (data) => {
    try {
        let respData = await axios({
            'url': `api/purchaseToken`,
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
        }
    }
}

export const getPurchaseTkn = async (id, dispatch) => {
    try {
        let respData = await axios({
            'url': `api/getPurchaseTkn/${id}`,
            'method': 'get',
        });
        
        // console.log('respData.data.result ----',respData.data.result)
        dispatch({
            type: PURCHASE_TOKEN_LIST_SUCCESS,
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
            type: PURCHASE_TOKEN_LIST_ERROR,
            loader: false,
        })

        return true
    }
}

export const addListPurchase = (dispatch, data) => {
    try {
        dispatch({
            type: PURCHASE_TOKEN_ADD_LIST,
            data: [data]
        })
        return true
    } catch (err) {
        handleResp(err, 'error')
        return false
    }
}