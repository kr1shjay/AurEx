// import package
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import lodash from 'lodash';

// import context
import SocketContext from '../Context/SocketContext';

// import action
import { getPairList, setTradePair, setMarketPrice } from '../../actions/perpetualTradeAction';
import {
    getAssetByCurrency,
    setUserFirstCurrency,
    setUserSecondCurrency
} from '../../actions/walletAction';

// import lib
import isEmpty from '../../lib/isEmpty';
import isLogin from '../../lib/isLogin';
import { useTranslation } from 'react-i18next';
const PairList = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { tikerRoot } = useParams();
    const socketContext = useContext(SocketContext);
    const { t, i18n } = useTranslation();
    // state
    const [pairList, setPairList] = useState([])

    // redux-state
    const tickerData = useSelector(state => state.marketPrice);
    const pairData = useSelector(state => state.tradePair);

    // function
    const fetchAssetByCurrency = async (spotPairId, type) => {
        try {
            if (!isLogin()) {
                return true
            }

            const { status, loading, error, result } = await getAssetByCurrency(spotPairId);
            if (status == 'success') {
                if (type == 'firstCurrency') {
                    setUserFirstCurrency(result, dispatch)
                } else if (type == 'secondCurrency') {
                    setUserSecondCurrency(result, dispatch)
                }
            } else { }
        } catch (err) { }
    }
    const fetchPairList = async () => {
        try {
            const { status, loading, result } = await getPairList();
            if (status == 'success') {
                if (result && result.length > 0) {
                    setPairList(lodash.chain(result)
                        .groupBy("secondCurrencySymbol")
                        .map((value, key) => ({ 'secondCurrencySymbol': key, 'pairData': value }))
                        .value()
                    )

                    if (isEmpty(tikerRoot)) {
                        let pair = `${result[0].firstCurrencySymbol}_${result[0].secondCurrencySymbol}`
                        history.push('/derivative/' + pair)
                        fetchAssetByCurrency(result[0].firstCurrencyId, 'firstCurrency')
                        fetchAssetByCurrency(result[0].secondCurrencyId, 'secondCurrency')
                        setMarketPrice(result[0], dispatch)
                        setTradePair(result[0], dispatch)
                    } else {
                        let currency = tikerRoot.split('_');
                        let pairDetail = result.find((el => el.firstCurrencySymbol == currency[0] && el.secondCurrencySymbol == currency[1]))
                        fetchAssetByCurrency(pairDetail.firstCurrencyId, 'firstCurrency')
                        fetchAssetByCurrency(pairDetail.secondCurrencyId, 'secondCurrency')
                        setTradePair(pairDetail, dispatch)
                        setMarketPrice(pairDetail, dispatch)
                    }
                }
            }
        } catch (err) { }
    }

    const handlePairChange = async (pairData) => {
        let pair = `${pairData.firstCurrencySymbol}_${pairData.secondCurrencySymbol}`
        history.push('/derivative/' + pair)
        if (tikerRoot != pair) {
            await fetchAssetByCurrency(pairData.firstCurrencyId, 'firstCurrency')
            await fetchAssetByCurrency(pairData.secondCurrencyId, 'secondCurrency')
            await setMarketPrice(pairData, dispatch)
            await setTradePair(pairData, dispatch)
            socketContext.socket.off("perpetualMarketPrice");
            socketContext.socket.off("perpetualOrderBook");
            socketContext.socket.off("perpetualRecentTrade");
        }
    }


    useEffect(() => {
        fetchPairList()
        return () => {
            socketContext.socket.off("perpetualMarketPrice");
            socketContext.socket.off("perpetualOrderBook");
            socketContext.socket.off("perpetualRecentTrade");
        }
    }, [])

    return (
        <div className="selectCoinType">
            <img src={pairData.firstCurrencyImage} style={{ 'marginTop': '-19px' }} alt="" className="img-fluid" />
            <div className="btn-group my-0">
                <button type="button"
                    className="selectPair dropdown-toggle"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                >
                    {pairData && pairData.firstCurrencySymbol}/{pairData && pairData.secondCurrencySymbol}<small className="d-block">{t('PERPETUAL')}</small>
                </button>

                <ul className="dropdown-menu pair_list">
                    {
                        pairList && pairList.length > 0 && pairList.map((item, key) => {
                            return (
                                <li className="dropdown-header" key={key}>
                                    <h6>{item.secondCurrencySymbol} {t('PAIRS')}</h6>
                                    <ul>
                                        {
                                            item.pairData && item.pairData.length > 0 && item.pairData.map((el, index) => {
                                                return (
                                                    <li className="active" key={index}>
                                                        <Link to="#" onClick={() => { handlePairChange(el) }}>
                                                            {el.firstCurrencySymbol}/{el.secondCurrencySymbol}
                                                        </Link>
                                                    </li>
                                                )
                                            })
                                        }
                                        {/* 
                                    <li>
                                        <Link to="#">BTC/LTC</Link>
                                    </li> */}
                                    </ul>
                                </li>
                            )
                        })
                    }

                </ul>
            </div>
        </div>
    )
}

export default PairList;