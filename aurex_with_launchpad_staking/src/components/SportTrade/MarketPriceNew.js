// import package
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import lodash from 'lodash';
import { useTranslation } from 'react-i18next';
// import context
import SocketContext from '../Context/SocketContext';

// import action
import { getPairList, setPairList, setTradePair, pairData_Set, getMarketPrice, tickerData_Set } from '../../actions/spotTradeAction';
import {
    getAssetByCurrency,
    setUserFirstCurrency,
    setUserSecondCurrency
} from '../../actions/walletAction';

// import lib
import isEmpty from '../../lib/isEmpty';
import { toFixed } from '../../lib/roundOf';

const MarketPrice = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { tikerRootVal } = useParams();
    const socketContext = useContext(SocketContext);
    const { t, i18n } = useTranslation();
    // state
    const [pairLists, setPairLists] = useState([]);

    var sectionNum = props.sectionNum;
    var tikerRootNew = tikerRootVal;
    var multiChartLoc = localStorage.getItem('multiChartLoc');

    if(multiChartLoc != null) {
        let multiChartLocVal = multiChartLoc.split('-');
        if(sectionNum && multiChartLocVal.length > 0 && multiChartLocVal[sectionNum]) {
            tikerRootNew = multiChartLocVal[sectionNum-1];
        }
    }
    else if(tikerRootNew){
        localStorage.setItem('multiChartLoc', tikerRootNew+'-'+tikerRootNew+'-'+tikerRootNew+'-'+tikerRootNew);
    }
    const [tikerRoot, tikerRoot_Set] = useState(tikerRootNew);
    const [tickerData, tickerData_Set] = useState(0);
    const [pairData, pairData_Set] = useState({});

    const pairListData = useSelector(state => state.pairList);

    const fetchPairList = async () => {
        try {
            const { status, loading, result } = await getPairList();
            if (status == 'success') {
                setPairList(result, dispatch)
                if (result && result.length > 0) {
                    if (isEmpty(tikerRoot)) {
                        let pair = `${result[0].firstCurrencySymbol}_${result[0].secondCurrencySymbol}`
                        await tickerData_Set(result[0], dispatch)
                        await pairData_Set(result[0], dispatch)
                        result[0]['sectionNum'] = sectionNum;
                        await setTradePair(result[0], dispatch)

                        localStorage.setItem('multiChartLoc', pair+'-'+pair+'-'+pair+'-'+pair);
                    } else {
                        let currency = tikerRoot.split('_');
                        let pairDetail = result.find((el => el.firstCurrencySymbol == currency[0] && el.secondCurrencySymbol == currency[1]))
                        await tickerData_Set(pairDetail, dispatch)
                        await pairData_Set(pairDetail, dispatch)
                        pairDetail['sectionNum'] = sectionNum;
                        await setTradePair(pairDetail, dispatch)
                    }
                }
            } else { }
        }
        catch (err) { }
    }

    const handlePairChange = async (pairData) => {
        let pair = `${pairData.firstCurrencySymbol}_${pairData.secondCurrencySymbol}`
        if (tikerRoot != pair) {
            await tikerRoot_Set(pair);
            await tickerData_Set(pairData, dispatch)
            await pairData_Set(pairData, dispatch)

            pairData['sectionNum'] = sectionNum;

            var multiChartLoc = localStorage.getItem('multiChartLoc');
            if(multiChartLoc != null){
                let multiChartLocVal = multiChartLoc.split('-');
                if(sectionNum && multiChartLocVal.length > 0 && multiChartLocVal[sectionNum]) {
                    multiChartLocVal[sectionNum-1] = pair;
                    localStorage.setItem('multiChartLoc', multiChartLocVal[0]+'-'+multiChartLocVal[1]+'-'+multiChartLocVal[2]+'-'+multiChartLocVal[3]);
                }
            }

            await setTradePair(pairData, dispatch)
            socketContext.socket.off("marketPrice");
            socketContext.socket.off("orderBook");
            socketContext.socket.off("recentTrade");
        }
    }

    useEffect(() => {
        if (pairListData && pairListData.length > 0) {
            setPairLists(pairListData)
        }
    }, [pairListData])

    useEffect(() => {
        if (!isEmpty(pairData)) {
            // socket
            socketContext.socket.on('marketPrice', (result) => {
                if (result.pairId == pairData.pairId) {
                    tickerData_Set(result.data, dispatch)
                    let tempPairList = pairLists;
                    let pairIndex = tempPairList.findIndex((el => el._id == result.pairId))
                    if (pairIndex >= 0) {
                        tempPairList[pairIndex] = {
                            ...tempPairList[pairIndex],
                            ...{
                                'markPrice': result.data.markPrice,
                                'change': result.data.change
                            }
                        }
                        setPairLists(tempPairList)
                    }
                }
            })
        }
    }, [pairData])

    useEffect(() => {
        fetchPairList();
        return () => {
            socketContext.socket.off("marketPrice");
            socketContext.socket.off("orderBook");
            socketContext.socket.off("recentTrade");
        }
    }, [])

    return (
        <div className="header-overview">
            <div className="selectCoinType">
                <img src={require("../../assets/images/btcIcon.png")} alt="" className="img-fluid" />
                <div className="btn-group my-0">
                    <button type="button"
                        className="selectPair dropdown-toggle"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        {pairData && pairData.firstCurrencySymbol}/{pairData && pairData.secondCurrencySymbol}
                    </button>
                    <ul className="dropdown-menu">
                        <div className="deopdown_menu clss_789table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>t({"PRICE"})</th>
                                        <th>{t('LATEST_PRICE')}</th>
                                        <th>{t('CHANGE')}</th>
                                        {/* <th>24h Volume</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        pairLists && pairLists.length > 0 && pairLists.map((item, key) => {
                                            return (
                                                <tr key={key} onClick={() => handlePairChange(item)}>
                                                    <td>
                                                        <p>{/* <i className="fas fa-star"></i> */}{item.firstCurrencySymbol}<span>/{item.secondCurrencySymbol}</span></p></td>
                                                    <td className="balance_amt_detail">
                                                        <p><span className="price_increase">{item.markPrice}</span>{/* <span>/$314.5</span> */}</p>
                                                    </td>
                                                    <td><span className="span_menu_gerrn">{item.change}</span></td>
                                                    {/* <td className="buy_button_op">0</td> */}
                                                </tr>
                                            )
                                        })
                                    }

                                </tbody>
                            </table>
                        </div>
                    </ul>

                </div>
                <div className="hoPriceConversion">
                    <h3 className="tradeGreenText">{toFixed(tickerData.markPrice, pairData.secondFloatDigit)}</h3>
                </div>
            </div>
            <div className="headerOverviewGroup">
                <div className="headerOverviewStatus">
                    <h5><small>{t('24H_CHANGE')}</small><span className="tradeRedText">{toFixed(tickerData.changePrice, 2)} ({toFixed(tickerData.change, 2)}%)</span></h5>
                </div>
                {/* <div className="headerOverviewStatus">
                    <h5 className="pinkText"><small>24h High</small>{toFixed(tickerData.high, pairData.secondFloatDigit)}</h5>
                </div>
                <div className="headerOverviewStatus">
                    <h5><small>24h Low</small>{toFixed(tickerData.low, pairData.secondFloatDigit)}</h5>
                </div>
                <div className="headerOverviewStatus">
                    <h5><small>24h Vol({pairData && pairData.firstCurrencySymbol})</small>{toFixed(tickerData.firstVolume, pairData.secondFloatDigit)}</h5>
                </div>

                <div className="headerOverviewStatus">
                    <h5><small>24h Vol({pairData && pairData.secondCurrencySymbol})</small>{toFixed(tickerData.secondVolume, pairData.secondFloatDigit)}</h5>
                </div> */}
            </div>
        </div>
    )
}

export default MarketPrice;