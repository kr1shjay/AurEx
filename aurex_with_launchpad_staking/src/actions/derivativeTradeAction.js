import axios, { handleResp } from '../config/axios'


export const getPairList = async () => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/perpetual/tradePair`,
        });
        return {
            status: 'success',
            loading: false,
            result: respData.data.result,
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: 'failed',
            loading: false,
        }
    }
}
