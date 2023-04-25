//import config
import axios from '../config/axios';

export const anouncementAdd = async (data) => {
    try {
        const respData = await axios({
            'url': `/adminapi/anouncement`,
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