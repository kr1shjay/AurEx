// import config
import axios from '../config/axios';

export const priceCNVlist = async (reqData) => {
    try {
        const respData = await axios({
            'url': `/adminapi/priceCNV`, //priceCNV -- price conversion
            'method': 'get',
            'params': reqData
        })
        return {
            status: "success",
            loading: false,
            result: respData.data.result
        }
    } catch (err) {
        return {
            status: 'failed',
            loading: false
        }
    }
}

export const priceCNVUpdate = async (data) => {
    try {
        let respData = await axios({
            'method': 'put',
            'url': `/adminapi/priceCNV`, //priceCNV -- price conversion
            'data': data
        });
        return {
            status: "success",
            loading: false,
            message: respData.data.message,
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