// import config
import axios from "../config/axios";

export const addPair = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `/adminApi/p2pPair`,
            'data': data
        });

        return {
            status: 'success',
            loading: false,
            message: respData.data.message
        }
    } catch (err) {
        return {
            status: "failed",
            loading: false,
            message: err.response.data.message,
            error: err.response.data.errors
        }
    }
}

export const editPair = async (data) => {
    try {
        let respData = await axios({
            'method': 'put',
            'url': `/adminApi/p2pPair`,
            'data': data
        });
        return {
            status: "success",
            loading: false,
            message: respData.data.message,
            result: respData.data.result
        }
    } catch (err) {
        return {
            status: "failed",
            loading: false,
            message: err.response.data.message,
            error: err.response.data.errors
        }
    }
}

export const pairList = async (data) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/adminapi/p2pPair`,
            'params': data
        });
        if (data.export == 'csv') {
            const url = window.URL.createObjectURL(new Blob([respData.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'p2pPair List.csv');
            document.body.appendChild(link);
            link.click();
        }

        if (data.export == 'xls') {
            const url = window.URL.createObjectURL(new Blob([respData.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'p2pPair List.xls');
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
            status: "failed",
            loading: false,
            error: err.response.data.errors
        }
    }
}

export const orderReport = async (data) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/adminapi/p2p/orderReport`,
            'params':data
        });

        if (data.export == 'csv') {
            const url = window.URL.createObjectURL(new Blob([respData.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'p2p Trade List.csv');
            document.body.appendChild(link);
            link.click();
        }

        if (data.export == 'xls') {
            const url = window.URL.createObjectURL(new Blob([respData.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'p2p Trade List.xls');
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
            message: err.response.data.message
        }
    }
}

export const getOrderReport = async (orderId) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/adminapi/p2p/getOrderReport/${orderId}`,
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
            message: err.response.data.message
        }
    }
}

export const adminConversation = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `/adminapi/p2p/adminConversation`,
            'data': data
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
            errors:err.response.data.error
        }
    }
}

export const disputeResolve = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `/adminapi/p2p/disputeResolve`,
            'data': data
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
            message: err.response.data.message
        }
    }
}

export const disputeList = async () => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/adminapi/p2p/disputeList`,
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
            message: err.response.data.message
        }
    }
}