// import config
import axios , {handleResp} from '../config/axios'

// import constant
import {
    SET_USER_WALLET_LIST,
    SET_USER_FIRST_CURRENCY,
    SET_USER_SECOND_CURRENCY,
    UPDATE_USER_WALLET_STAKE,
    HIDE_ZERO
} from '../constant';

export const getAddress  = async(data,dispatch)=>{
    try {
        console.log('getAddress',data)
        let respData = await axios({
            'method': 'post',
            'url': `/api/getWalletAddress`,
            data:data
        });
        dispatch(userWalletList(respData.data.result))
        console.log("respDatarespDatarespDatarespData",respData.data)
        return respData.data.assetData
    }
    catch (err) {
        handleResp(err, 'error')
        return false
    }
}

export const getAssetData = async (dispatch) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/getAssetsDetails`,
        });

        console.log("respDatarespDatarespDatarespData",respData.data)
        dispatch(userWalletList(respData.data.result))
       
        return true
    }
    catch (err) {
        handleResp(err, 'error')
        return false
    }
}

export const gethideZeroStatus=async()=>{

    try{
        let respData = await axios({
            'method': 'get',
            'url': `/api/getHideoZeroStatus`,
        });

        return {
            result:respData.data.hideZeroStatus
        }
    }catch(err){
        handleResp(err, 'error')
        return false

    }
}

export const updateHideZeroStatus=async(data)=>{

    try{
        let respData = await axios({
            'method': 'put',
            'url': `/api/getHideoZeroStatus`,
            data:data
        });
        return {
            status:true,
            message:respData.data.message
        }
    }catch(err){
        handleResp(err, 'error')
        return false

    }
}
export const checkDeposit = async (dispatch) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/check-deposit`,
        });
        return true
    }
    catch (err) {
        handleResp(err, 'error')
        return false
    }
}

export const updateWallet = async (dispatch, data, callFrom) => {
    if (callFrom == 'stake') {
        dispatch({
            type: UPDATE_USER_WALLET_STAKE,
            data
        })
    }
    return false

}

export const userWalletList = (data) => {
    return {
        type: SET_USER_WALLET_LIST,
        data
    }
}

export const withdrawRequestFiat = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `/api/fiatWithdraw`,
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

export const fiatRequestVerify = async (data) => {
    try {
        let respData = await axios({
            'method': 'patch',
            'url': `/api/fiatWithdraw`,
            'data': data
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
        }
    }
}

export const withdrawRequestCoin = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `/api/coinWithdraw`,
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

export const coinRequestVerify = async (data) => {
    try {
        let respData = await axios({
            'method': 'patch',
            'url': `/api/coinWithdraw`,
            'data': data
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
        }
    }
}

export const coinWithdrawApprove = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `/api/WithdrawApprove`,
            'data': data
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
        }
    }
}

export const coinWithdrawCancel = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `/api/WithdrawCancel`,
            'data': data
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
        }
    }
}

export const fiatDepositRequest = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `/api/fiatDeposit`,
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

export const walletTransfer = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `/api/walletTransfer`,
            'data': data
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
            error: err.response.data.errors
        }
    }
}

export const fundTransfer = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `/api/fundTransfer`,
            'data': data
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
            error: err.response.data.errors
        }
    }
}

export const getAssetByCurrency = async (currencyId) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/getAsset/` + currencyId
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
        }
    }
}

export const setUserFirstCurrency = (assetData, dispatch) => {
    dispatch({
        type: SET_USER_FIRST_CURRENCY,
        data: assetData
    })
}

export const setUserSecondCurrency = (assetData, dispatch) => {
    dispatch({
        type: SET_USER_SECOND_CURRENCY,
        data: assetData
    })
}

export const getTrnxHistory = async (params, query) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/history/transaction/` + params,
            'params': query
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
        }
    }
}

export const checkEmail =async()=>{
    console.log("checkEmail action")
    let respData = await axios({
        'method': 'post',
        'url': `/api/checkEmail`,
    });
    console.log(respData.data.result,"checkEmail")
    return respData.data.result
}