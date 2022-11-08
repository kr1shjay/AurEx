// import config
import axios from '../config/axios';

export const allSubscribed = async (reqData) => {
    try {
        const respData = await axios({
            'url': `/adminapi/subscriber-all`,
            'method': 'get',
        })
        return {
            status: "success",
            loading: false,
            result: respData.data.result
        }
    } catch (err) {
        return {
            status: 'failed',
            loading: false,
            message: err.response.data.message,
        }
    }
}

export const sendNews = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/subscriber/sendNews`,
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
            errors: err.response.data.errors
        }
    }
}