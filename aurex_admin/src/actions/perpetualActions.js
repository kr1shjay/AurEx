import axios from "../config/axios";
export const addPerpetualPair = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `/adminapi/perptualPair`,
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

export const perpetualPairList = async (data) => {

    try {
        let respData = await axios({
            'method': 'get',
            'url': `/adminapi/perptualPair`,
            'params': data
        });

        if (data.export == 'csv') {
            const url = window.URL.createObjectURL(new Blob([respData.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'spotTradeHistory.csv');
            document.body.appendChild(link);
            link.click();
        }

        if (data.export == 'xls') {
            const url = window.URL.createObjectURL(new Blob([respData.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'spotTradeHistory.xls');
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

export const editPerpetualPair = async (data) => {
    try {
        let respData = await axios({
            'method': 'put',
            'url': `/adminapi/perptualPair`,
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