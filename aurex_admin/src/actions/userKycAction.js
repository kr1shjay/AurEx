// import config
import axios from '../config/axios';

export const getAllUserKyc = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/userKyc`,
            'method': 'get',
            'params': data
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

export const approveUserKyc = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/userKyc`,
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
        }
    }
}

export const rejectUserKyc = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/userKyc`,
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

export const changeUserType = async (userid) => {
    try {
        const respData = await axios({
            'url': `/adminapi/changeUsrType/${userid}`,
            'method': 'put',
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
        }
    }
}