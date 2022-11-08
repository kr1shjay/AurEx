// import config
import axios,{  handleResp} from '../config/axios';

export const subscribe = async (reqData) => {
    try {
        const respData = await axios({
            'url': `/api/newsLetter/subscribe`,
            'method': 'post',
            'data': reqData
        })
        return {
            status: "success",
            loading: false,
            message: respData.data.message
        }
    } catch (err) {
        handleResp(err, 'error')
        return {
            status: 'failed',
            loading: false,
            message: err.response.data.message,
            error: err.response.data.errors,
        }
    }
}