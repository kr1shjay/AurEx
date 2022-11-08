// import config
import axios from '../config/axios';

export const currencyList = async (reqData) => {
    try {
        const respData = await axios({
            'url': `/adminapi/currency`,
            'method': 'get',
            'params': reqData
        })

        if (reqData.export == 'csv') {
            const url = window.URL.createObjectURL(new Blob([respData.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'currency List.csv');
            document.body.appendChild(link);
            link.click();
        }

        if (reqData.export == 'xls') {
            const url = window.URL.createObjectURL(new Blob([respData.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'currency List.xls');
            document.body.appendChild(link);
            link.click();
        }
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

export const addCurrency = async (reqData) => {
    try {
        const respData = await axios({
            'url': `/adminapi/currency`,
            'method': 'post',
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

export const updateCurrency = async (reqData) => {
    try {
        const respData = await axios({
            'url': `/adminapi/currency`,
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

export const getCurrency = async () => {
    try {
        const respData = await axios({
            'url': `/adminapi/getCurrency`,
            'method': 'get',
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