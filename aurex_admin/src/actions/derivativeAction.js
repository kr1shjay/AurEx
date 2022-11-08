import axios from 'axios'

export const closePosition = async () => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/adminapi/get-position`,
        });
        return {
            status: 'success',
            loading: false,
            result: respData.data.result,
        }
    }
    catch (err) {
        return {
            status: 'failed',
            loading: false,
        }
    }
}