// import config
import axios from '../config/axios';

export const getSiteSetting = async () => {
    try {
        const respData = await axios({
            'url': `/adminapi/getSiteSetting`,
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

export const updateSiteSetting = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/updateSiteSetting`,
            'method': 'put',
            'data': data
        })
        return {
            status: "success",
            loading: false,
            result: respData.data.result,
            message: respData.data.message
        }
    } catch (err) {
        return {
            status: 'failed',
            loading: false,
            error: err.response.data.errors,
            message: err.response.data.message
        }
    }
}

export const updateSiteDetails = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/updateSiteDetails`,
            'method': 'put',
            'data': data
        })
        return {
            status: "success",
            loading: true,
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

export const updateUsrDash = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/updateUsrDash`,
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
            errors: err.response.data.errors

        }
    }
}

export const updateSocialMedia = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/updateSocialMedia`,
            'method': 'put',
            'data': data
        })
        return {
            status: "success",
            loading: true,
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



export const getMailIntegrate = async () => {
    try {
        const respData = await axios({
            'url': `/adminapi/getemailintegrate`,
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


export const updateMailIntegrate = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/updatemailintegrate`,
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
            loading: false.valueOf,
            errors: err.response.data.errors
        }
    }
}

export const updateFaqTrend = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/updateFaqTrend`,
            'method': 'put',
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
        }
    }
}