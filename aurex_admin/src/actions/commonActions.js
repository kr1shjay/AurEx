// import config
import axios from '../config/axios';

export const getPairDropdown = async () => {
    try {
        const respData = await axios({
            'url': `/adminapi/getPairDropdown`,
            'method': 'get'
        })
        return {
            status: "success",
            loading: false,
            result: respData.data.result
        }
    } catch (err) {
        return {
            status: 'failed',
            loading: false
        }
    }
}