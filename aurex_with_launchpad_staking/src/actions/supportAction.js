// import config
import axios, {handleResp} from '../config/axios';

/** 
 * Get Support Category
*/
export const getSptCat = async () => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/getSptCat`,
        });
        return {
            status: "success",
            loading: false,
            result: respData.data.result
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: "failed",
            loading: false,
            error: err.response.data.errors
        }
    }
}

export const createNewTicket = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `/api/ticket`,
            data
        });
        return {
            status: "success",
            loading: false,
            message: respData.data.message,
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: "failed",
            loading: false,
            message: err.response.data.message,
            error:err.response.data.errors
        }
    }
}

export const getTicketList = async () => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/ticket`,
        });
        return {
            status: "success",
            loading: false,
            result: respData.data.result
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: "failed",
            loading: false,
            message: err.response.data.message
        }
    }
}

export const replyMessage = async (data) => {
    try {
        let respData = await axios({
            'method': 'put',
            'url': `/api/ticket`,
            data
        });
        return {
            status: "success",
            loading: false,
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

export const closeTicket = async (data) => {
    try {
        let respData = await axios({
            'method': 'patch',
            'url': `/api/ticket`,
            data
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

export const getMessageList = async (data) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/ticketMessage`,
            'params': data
        });
        return {
            status: "success",
            loading: false,
            result: respData.data.result
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: "failed",
            loading: false,
            error: err.response.data.errors
        }
    }
}