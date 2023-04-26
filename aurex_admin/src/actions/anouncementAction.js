//import config
import axios from '../config/axios';

export const anouncementAdd = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/anouncement`,
            'method': 'post',
            'data': data
        })
        return {
            status: "success",
            loading: false,
            message: respData.data.message,
            result: respData.data.result
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

export const getanouncement = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/anouncement`,
            'method': 'get',
            'params': data
        })
        return {
            status: "success",
            loading: false,
            message: respData.data.message,
            result: respData.data.result
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

export const editanouncement = async (reqData) => {
    try {
        const respData = await axios({
            'url': `/adminapi/anouncement`,
            'method': 'put',
            'data': reqData
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

export const deleteanouncement = async (reqData) => {
    try {
        const respData = await axios({
            'url': `/adminapi/anouncement`,
            'method': 'delete',
            'params': reqData
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