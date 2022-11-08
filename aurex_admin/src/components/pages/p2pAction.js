// import config
import axios from '../config/axios';

export const orderList = async () => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/adminapi/p2p/orderReport`,
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