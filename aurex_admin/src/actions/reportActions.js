// import config
import axios from '../config/axios';

export const spotOrderHistory = async (data) => {

    try {
        let respData = await axios({
            'method': 'get',
            'url': `/adminapi/spotOrderHistory`,
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

export const spotTradeHistory = async (data) => {

    try {
        let respData = await axios({
            'method': 'get',
            'url': `/adminapi/spotTradeHistory`,
            'params': data
        });

        if (data.exports == 'csv') {
            const url = window.URL.createObjectURL(new Blob([respData.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'spotTradeHistory.csv');
            document.body.appendChild(link);
            link.click();
        }

        if (data.exports == 'xls') {
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
            result: respData.data.result,
        }
    } catch (err) {
        return {
            status: "failed",
            loading: false,
            error: err.response.data.errors
        }
    }
}

export const perpetualOrderHistory = async (data) => {

    try {
        let respData = await axios({
            'method': 'get',
            'url': `/adminapi/perpetualOrderHistory`,
            'params': data
        });
        if (data.export == 'csv') {
            const url = window.URL.createObjectURL(new Blob([respData.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'perpetualOrderHistory .csv');
            document.body.appendChild(link);
            link.click();
        }

        if (data.export == 'xls') {
            const url = window.URL.createObjectURL(new Blob([respData.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'perpetualOrderHistory .xls');
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

export const perpetualTradeHistory = async (data) => {

    try {
        let respData = await axios({
            'method': 'get',
            'url': `/adminapi/perpetualTradeHistory`,
            'params': data
        });

        if (data.export == 'csv') {
            const url = window.URL.createObjectURL(new Blob([respData.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'perpetualTradeHistorycsv');
            document.body.appendChild(link);
            link.click();
        }

        if (data.export == 'xls') {
            const url = window.URL.createObjectURL(new Blob([respData.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'perpetualTradeHistory.xls');
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


export const passBookHistory = async (data) => {

    try {
        console.log('dataaaaaaaaa',data)
        let respData = await axios({
            'method': 'get',
            'url': `/adminapi/userPassBookHistory`,
            'params': data
        });
        console.log('respData',respData)
        return {
            status: "success",
            loading: false,
            result: respData.data.result,
            count: respData.data.count
        }
    } catch (err) {
        return {
            status: "failed",
            loading: false,
            error: err.response.data.errors
        }
    }
}