import axios from '../config/axios';

export const categoryAdd = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `/adminapi/supportCategory`,
            'data': data
        });

        return {
            status: "success",
            loading: false,
            message: respData.data.result.messages,
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

export const categoryList = async (data) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/adminapi/supportCategory`,
            'params': data
        });

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

export const categoryUpdate = async (data) => {
    try {
        let respData = await axios({
            'method': 'put',
            'url': `/adminapi/supportCategory`,
            'data': data
        });
        return {
            status: "success",
            loading: false,
            message: respData.data.result.messages,
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

export const TicketList = async (params) => {
    try {
        
        let respData = await axios({
            'method': 'get',
            'url': `/adminapi/ticketList`,
            params 
        });

        if (params.export == 'csv') {
            const url = window.URL.createObjectURL(new Blob([respData.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'support Ticket List.csv');
            document.body.appendChild(link);
            link.click();
        }

        if (params.export == 'xls') {
            const url = window.URL.createObjectURL(new Blob([respData.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'support Ticket List.xls');
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
export const getMessage = async (data) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/adminapi/ticketMessage`,
            'params': data
        });

        return {
            status: "success",
            loading: false,
            result: respData.data.result
        }
    } catch (err) {
        return {
            status: "failed",
            loading: false,
        }
    }
}

export const replyMsg = async (data) => {
    try {
        let respData = await axios({
            'method': 'put',
            'url': `/adminapi/ticketMessage`,
            data
        });
        return {
            status: "success",
            loading: false,
            message: respData.data.result.message,
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