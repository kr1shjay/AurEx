// import config
import axios,{  handleResp} from '../config/axios'

export const newApiKey = async (data) => {
    try {
        let respData = await axios({
            'url': `/api/key/manage`,
            'method': 'post',
            'data': data
        });
        return {
            status: "success",
            loading: false,
            message: respData.data.message,
            result: respData.data.result
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: "failed",
            loading: false,
            message: err.response.data.message,
            error: err.response.data.errors
        }
    }
}

export const keyList = async (data) => {
    try {
        let respData = await axios({
            'url': `/api/key/manage`,
            'method': 'get',
            'data': data
        });
        return {
            status: "success",
            loading: false,
            message: respData.data.message,
            result: respData.data.result
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: "failed",
            loading: false,
            message: err.response.data.message,
            error: err.response.data.errors
        }
    }
}

export const changeStatus = async (keyId) => {
    try {
        let respData = await axios({
            'url': `/api/key/manage/${keyId}`,
            'method': 'patch',
        });
        return {
            status: "success",
            loading: false,
            message: respData.data.message,
            result: respData.data.result
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: "failed",
            loading: false,
            message: err.response.data.message,
            error: err.response.data.errors
        }
    }
}

export const removeKey = async (keyId) => {
    try {
        let respData = await axios({
            'url': `/api/key/manage/${keyId}`,
            'method': 'delete',
        });
        return {
            status: "success",
            loading: false,
            message: respData.data.message,
            result: respData.data.result
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: "failed",
            loading: false,
            message: err.response.data.message,
            error: err.response.data.errors
        }
    }
}