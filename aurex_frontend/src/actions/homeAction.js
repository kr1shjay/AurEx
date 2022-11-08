// import config
import axios,{  handleResp} from '../config/axios'

export const getMarketTrend = async () => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/getMarketTrend`,
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

export const getCmsData = async () => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/getCmsData`,
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

export const getFaqTrend = async () => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/getFaqTrend`,
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
