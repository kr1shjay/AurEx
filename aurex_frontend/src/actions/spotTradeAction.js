// import config
import axios,{handleResp} from '../config/axios';

// import constant
import {
    SET_SPOT_TRADE_PAIR_LIST,
    SET_SPOT_PAIR_TRADE,
    SET_SPOT_MARKET_PRICE,
    UPDATE_SPOT_ASSET,
    SET_SPOT_ORDER_BOOK
} from '../constant';

export const getPairList = async () => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/spot/tradePair`,
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

export const topGainList = async () => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/top-gain`,
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


export const setPairList = (data, dispatch) => {
    dispatch({
        type: SET_SPOT_TRADE_PAIR_LIST,
        data
    })
}

export const setTradePair = ({
    firstCurrencySymbol,
    firstCurrencyId,
    firstFloatDigit,
    secondCurrencySymbol,
    secondCurrencyId,
    secondFloatDigit,
    botstatus,
    _id
}, dispatch) => {
    dispatch({
        type: SET_SPOT_PAIR_TRADE,
        data: {
            firstCurrencySymbol,
            firstCurrencyId,
            firstFloatDigit,
            secondCurrencySymbol,
            secondCurrencyId,
            secondFloatDigit,
            botstatus,
            pairId: _id
        }
    })
    return true
}

export const orderPlace = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `/api/spot/orderPlace`,
            data
        });
        return {
            status: 'success',
            loading: false,
            message: respData.data.message,
            result: respData.data.result,
        }
    }
    catch (err) {
        handleResp(err, 'error')
        return {
            status: 'failed',
            loading: false,
            message: err.response.data.message,
        }
    }
}

export const getOrderBook = async (pairId) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/spot/ordeBook/${pairId}`,
        });
        return {
            status: 'success',
            loading: false,
            result: respData.data.result,
        }
    } catch (err) {
        handleResp(err, 'error')
        return {
            status: 'failed',
            loading: false,
        }
    }
}

export const getOpenOrder = async (data, pairId) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/spot/openOrder/${pairId}`,
            'params': data
        });
        return {
            status: 'success',
            loading: false,
            result: respData.data.result,
        }
    } catch (err) {
        handleResp(err, 'error')
        return {
            status: 'failed',
            loading: false,
        }
    }
}

export const allOpenOrder = async (data) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/spot/allOpenOrder`,
            'params': data
        });
        return {
            status: 'success',
            loading: false,
            result: respData.data.result,
        }
    } catch (err) {
        handleResp(err, 'error')
        return {
            status: 'failed',
            loading: false,
        }
    }
}

export const allOpenOrderDoc = async (data) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/spot/allOpenOrderDoc`,
            'params': data
        });
        return {
            status: 'success',
            loading: false,
            result: respData.data.result,
        }
    } catch (err) {
        handleResp(err, 'error')
        return {
            status: 'failed',
            loading: false,
        }
    }
}

export const getFilledOrder = async (data, pairId) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/spot/filledOrder/${pairId}`,
            'params': data
        });
        return {
            status: 'success',
            loading: false,
            result: respData.data.result,
        }
    } catch (err) {
        handleResp(err, 'error')
        return {
            status: 'failed',
            loading: false,
        }
    }
}

export const getOrderHistory = async (data, pairId) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/spot/orderHistory/${pairId}`,
            'params': data
        });
        return {
            status: 'success',
            loading: false,
            result: respData.data.result,
        }
    } catch (err) {
        handleResp(err, 'error')
        return {
            status: 'failed',
            loading: false,
        }
    }
}

export const getTradeHistory = async (data, pairId) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/spot/tradeHistory/${pairId}`,
            'params': data
        });
        return {
            status: 'success',
            loading: false,
            result: respData.data.result,
        }
    } catch (err) {
        handleResp(err, 'error')
        return {
            status: 'failed',
            loading: false,
        }
    }
}

export const allTradeOrder = async (data) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/spot/allTradeOrder`,
            'params': data
        });
        return {
            status: 'success',
            loading: false,
            result: respData.data.result,
        }
    } catch (err) {
        handleResp(err, 'error')
        return {
            status: 'failed',
            loading: false,
        }
    }
}

export const allTradeOrderDoc = async (data) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/spot/allTradeOrderDoc`,
            'params': data
        });
        return {
            status: 'success',
            loading: false,
            result: respData.data.result,
        }
    } catch (err) {
        handleResp(err, 'error')
        return {
            status: 'failed',
            loading: false,
        }
    }
}

export const getMarketPrice = async (pairId, dispatch) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/spot/marketPrice/${pairId}`,
        });
        setMarketPrice(respData.data.result, dispatch)
        return true
    } catch (err) {
        handleResp(err, 'error')
        return false
    }
}

export const setMarketPrice = ({
    last,
    markPrice,
    low,
    high,
    firstVolume,
    secondVolume,
    changePrice,
    change,
    botstatus,
    _id,
}, dispatch) => {
    dispatch({
        type: SET_SPOT_MARKET_PRICE,
        data: {
            last,
            markPrice,
            low,
            high,
            firstVolume,
            secondVolume,
            changePrice,
            change,
            botstatus,
            _id,
        }
    })

    return true
}

export const getRecentTrade = async (pairId) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/spot/recentTrade/${pairId}`,
        });
        return {
            status: 'success',
            loading: false,
            result: respData.data.result,
        }
    } catch (err) {
        handleResp(err, 'error')
        return {
            status: 'failed',
            loading: false,
        }
    }
}

export const cancelOrder = async (orderId) => {
    try {
        let respData = await axios({
            'method': 'delete',
            'url': `/api/spot/cancelOrder/${orderId}`,
        });
        return {
            status: 'success',
            loading: false,
            message: respData.data.message,
        }
    } catch (err) {
        handleResp(err, 'error')
        return {
            status: 'failed',
            loading: false,
            message: err.response.data.message,
        }
    }
}

export const updateTradeAsset = (dispatch, data) => {
    dispatch({
        type: UPDATE_SPOT_ASSET,
        data
    })
    return true
}

export const orderBookDetail = (dispatch, data) => {
    dispatch({
        type: SET_SPOT_ORDER_BOOK,
        data
    })
    return true
}