// import lib
import axios from '../config/axios';

export const spotPairList = async (data) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/adminapi/spotPair`,
            'params': data
        });
        return {
            status: "success",
            loading: false,
            result: respData.data.result
        }
    } catch (err) {
        return {
            status: "failed",
            loading: false,
            error: err.response.data.errors
        }
    }
}

export const addSpotPair = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `/adminapi/spotPair`,
            'data': data
        });
        return {
            status: "success",
            loading: false,
            message: respData.data.message,
            result: respData.data.result
        }
    } catch (err) {
        return {
            status: "failed",
            loading: false,
            message: err.response.data.message,
            error: err.response.data.errors
        }
    }
}

export const editSpotPair = async (data) => {
    try {
        let respData = await axios({
            'method': 'put',
            'url': `/adminapi/spotPair`,
            'data': data
        });
        return {
            status: "success",
            loading: false,
            message: respData.data.message,
            result: respData.data.result
        }
    } catch (err) {
        return {
            status: "failed",
            loading: false,
            message: err.response.data.message,
            error: err.response.data.errors
        }
    }
}
