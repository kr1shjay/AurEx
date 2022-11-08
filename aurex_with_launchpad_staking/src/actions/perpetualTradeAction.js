// import config
import axios,{handleResp} from '../config/axios';

// import constant
import {
    SET_SPOT_TRADE_PAIR_LIST,
    SET_PERPETUAL_PAIR_TRADE,
    SET_PERPETUAL_MARKET_PRICE
} from '../constant';

export const getPairList = async () => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/perpetual/tradePair`,
        });
        console.log('-----',respData.data.result)
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
    maker_rebate,
    taker_fees,
    firstCurrencyImage,
    _id,
}, dispatch) => {
    dispatch({
        type: SET_PERPETUAL_PAIR_TRADE,
        data: {
            firstCurrencyImage,
            firstCurrencySymbol,
            firstCurrencyId,
            firstFloatDigit,
            secondCurrencySymbol,
            secondCurrencyId,
            secondFloatDigit,
            botstatus,
            maker_rebate,
            taker_fees,
            pairId: _id
        }
    })
}

export const orderPlace = async (data) => {
    try {
        let respData = await axios({
            'method': 'post',
            'url': `/api/perpetual/orderPlace`,
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
            'url': `/api/perpetual/ordeBook/${pairId}`,
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
            'url': `/api/perpetual/openOrder/${pairId}`,
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
            'url': `/api/perpetual/allOpenOrder`,
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
            'url': `/api/perpetual/allOpenOrderDoc`,
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
            'url': `/api/perpetual/filledOrder/${pairId}`,
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
            'url': `/api/perpetual/tradeHistory/${pairId}`,
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

export const allTradeHist = async (data) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/perpetual/allTradeHist`,
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

export const allTradeHistDoc = async (data) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/perpetual/allTradeHistDoc`,
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

export const getPositionOrder = async (pairId) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/perpetual/positionOrder/${pairId}`,
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
            'url': `/api/perpetual/marketPrice/${pairId}`,
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
        type: SET_PERPETUAL_MARKET_PRICE,
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
}

export const getRecentTrade = async (pairId) => {
    try {
        let respData = await axios({
            'method': 'get',
            'url': `/api/perpetual/recentTrade/${pairId}`,
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
            'url': `/api/perpetual/cancelOrder/${orderId}`,
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