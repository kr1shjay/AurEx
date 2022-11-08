import axios from 'axios'



export const DashboardHist = async () => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/adminapi/get-history`,

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

export const totalCount = async () => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/adminapi/total-count`,

        });

        return {
            status: "success",
            loading: false,
            message: respData.data.message,
            result: respData.data.totalCount
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