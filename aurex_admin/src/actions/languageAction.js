// import config
import axios from '../config/axios';

export const languageList = async () => {
    try {
        const respData = await axios({
            'url': `/adminapi/language`,
            'method': 'get'
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

export const addLanguage = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/language`,
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

export const editLanguage = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/language`,
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

export const getLanguage = async () => {
    try {
        const respData = await axios({
            'url': `/adminapi/getLanguage`,
            'method': 'get'
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