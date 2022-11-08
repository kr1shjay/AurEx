// import config
import axios from '../config/axios';

export const templateList = async (reqData) => {
    try {
        const respData = await axios({
            'url': `/adminapi/emailTemplate`,
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

export const addEmailTemplate = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/emailTemplate`,
            'method': 'post',
            'data': data
        })
        return {
            status: "success",
            loading: false,
            message: respData.data.message
        }
    } catch (err) {
        return {
            status: 'failed',
            loading: false,
            message: err.response.data.message,
            error: err.response.data.errors
        }
    }
}

export const editEmailTemplate = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/emailTemplate`,
            'method': 'put',
            'data': data
        })
        return {
            status: "success",
            loading: false,
            message: respData.data.message
        }
    } catch (err) {
        return {
            status: 'failed',
            loading: false,
            message: err.response.data.message,
            error: err.response.data.errors
        }
    }
}
