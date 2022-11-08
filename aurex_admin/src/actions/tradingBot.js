// import lib
import axios from '../config/axios';

export const newTradeBot = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `/adminapi/spotPair`,
            'params': data
        });
        return {
            status: "success",
            loading: false,
            message: respData.data.message,
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