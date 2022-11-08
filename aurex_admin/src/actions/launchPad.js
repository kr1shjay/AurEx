// import config
import axios from '../config/axios';

export const addLaunchpad = async (reqData) => {
    try {
        const respData = await axios({
            'url': `/adminapi/launchpad`,
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

export const editLaunchpad = async (reqData) => {
    try {
        const respData = await axios({
            'url': `/adminapi/launchpad`,
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

export const launchpadList = async (reqData) => {
    try {
        const respData = await axios({
            'url': `/adminapi/launchpad`,
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
            loading: false,
            message: err.response.data.message,
            error: err.response.data.errors
        }
    }
}

export const purchaseTknList = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/purchaseToken`,
            'method': 'get',
            'params': data
        })
        if (data.export == 'csv') {
            const url = window.URL.createObjectURL(new Blob([respData.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Staking List.csv');
            document.body.appendChild(link);
            link.click();
        }

        if (data.export == 'xls') {
            const url = window.URL.createObjectURL(new Blob([respData.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Staking List.xls');
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
            loading: false,
        }
    }
}