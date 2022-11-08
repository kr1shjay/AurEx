import axios from 'axios'

export const TwoFAAction = async () => {
    try {
        const respData = await axios({
            'url': `/adminApi/security`,
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



export const updateTwoFA = async (data) => {

    try {
        const respData = await axios({
            'url': `/adminApi/update2FA`,
            'method': 'post',
            data
        })
        return {
            status: "success",
            loading: false,
            result: respData.data.result,
            message: respData.data.message

        }
    } catch (err) {
        return {
            status: 'failed',
            loading: false,
            error: err.response.data.errors,
            message: err.response.data.message

        }
    }
}


export const disabled2faCode = async (data) => {

    try {
        const respData = await axios({
            'url': `/adminApi/disabled2FA`,
            'method': 'post',
            data
        })
        return {
            status: "success",
            loading: false,
            result: respData.data.result,
            message: respData.data.message
        }
    } catch (err) {
        return {
            status: 'failed',
            loading: false,
            error: err.response.data.errors,
            message: err.response.data.message
        }
    }
}

