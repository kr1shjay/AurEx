// import axios from "axios";

// import config
import axios from '../config/axios';

export const addStaking = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/staking`,
            'method': 'post',
            data
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
};

export const stakingList = async (data) => {
    try {
        
        const respData = await axios({
            'url': `/adminapi/staking`,
            'method': 'get',
            'params':data
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
            message: err.response.data.message,
        }
    }
};

export const editStaking = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/staking`,
            'method': 'put',
            data
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
};


export const StakeSettlement = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/settlementHistory`,
            'method': 'get',
            'params':data
            
        })
        return {
            status: "success",
            loading: false,
            message: respData.data.message,
            result: respData.data.result,
        }
    } catch (err) {
        return {
            status: 'failed',
            loading: false,
            message: err.response.data.message,
            error: err.response.data.errors
        }
    }
};



export const StakeHistory = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi//orderHistory`,
            'method': 'get',
            'params':data
            
        })
        return {
            status: "success",
            loading: false,
            message: respData.data.message,
            result: respData.data.result,
        }
    } catch (err) {
        return {
            status: 'failed',
            loading: false,
            message: err.response.data.message,
            error: err.response.data.errors
        }
    }
};
