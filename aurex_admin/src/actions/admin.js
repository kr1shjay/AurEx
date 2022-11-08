// import action
import { decodeJwt } from './jsonWebToken';

// import config
import axios, { setAuthorization } from '../config/axios';
import Config from '../config/index';

// import lib
import { setAuthToken } from '../lib/localStorage';





export const login = async (data, dispatch) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `/adminapi/login`,
            data
        });
        if (respData.data.status == 'TWO_FA') {
            return {
                status: "TWO_FA",
                loading: false,
                message: respData.data.message
            }
        }

        setAuthorization(respData.data.token)
        setAuthToken(respData.data.token)
        decodeJwt(respData.data.token, dispatch)

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

export const list = async () => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/adminapi/subAdmin`,
        });

        return {
            status: "success",
            loading: false,
            result: respData.data.result
        }
    } catch (err) {
        return {
            status: 'failed',
            loading: false,
        }
    }
}

export const creatAdmin = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `/adminapi/sub-admin`,
            data
        });


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



export const EditAdmin = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `/adminapi/edit-admin`,
            data
        });


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


export const getGeoInfoData = async () => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${Config.getGeoInfo}`,

        });


        return {
            status: "success",
            loading: false,
            message: respData.data.message,
            result: respData.data
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

export const loginHisPagination = async (data) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/adminapi/login-history`,
            'params':data

        });


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

export const changePassword = async (data) => {
    try {
        let respData = await axios({
            'method': 'put',
            'url': `/adminapi/change-password`,
            data

        });


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

export const getProfile = async () => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/adminapi/get-profile`,

        });


        return {
            status: respData.data.status,
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

export const sendMail = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `/adminapi/send-mail`,
            data

        });


        return {
            status: respData.data.status,
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



export const editProfile = async (data) => {
    try {
        let respData = await axios({
            'method': 'put',
            'url': `/adminapi/edit-profile`,
            data

        });


        return {
            status: respData.data.status,
            loading: false,
            message: respData.data.message,
            result: respData.data.result
        }
    } catch (err) {
        return {
            status: err.response.data.status,
            loading: false,
            message: err.response.data.message,
            error: err.response.data.errors
        }
    }
}



