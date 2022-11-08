// import config
import axios from '../config/axios';
import {
    GET_ERRORS,
    FAQ_ADD,
    FAQ_UPDATE
} from "./types";
import keys from "./config";
const url = keys.baseUrl;

export const faqCategoryList = async () => {
    try {
        const respData = await axios({
            'url': `/adminapi/faqCategory`,
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

export const faqCategoryAdd = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/faqCategory`,
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
            error: err.response.data.error
        }
    }
}

export const faqCategoryEdit = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/faqCategory`,
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
            error: err.response.data.error
        }
    }
}
export const getFaqCategory = async () => {
    try {
        const respData = await axios({
            'url': `/adminapi/getFaqCategory`,
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
            loading: false
        }
    }
}


export const faqList = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/faq`,
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

export const faqAdd = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/faq`,
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



export const faqUpdate = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/faq`,
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
            error: err.response.data.error
        }
    }
};

export const getFaqDropdown = async () => {
    try {
        const respData = await axios({
            'url': `/adminapi/getFaqDropdown`,
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