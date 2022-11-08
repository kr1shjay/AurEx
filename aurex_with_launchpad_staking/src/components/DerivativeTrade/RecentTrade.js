// import package
import React, { useEffect, useState, useContext } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useSelector } from 'react-redux';
import clsx from 'classnames';
import { useTranslation } from 'react-i18next';
// import context
import SocketContext from '../Context/SocketContext';

// import action
import { getRecentTrade } from '../../actions/perpetualTradeAction';

// import lib
import isEmpty from '../../lib/isEmpty';
import { currencyFormat, toFixed } from '../../lib/roundOf'

const RecentTrade = (props) => {
    const socketContext = useContext(SocketContext);
    const { t, i18n } = useTranslation();
    // props
    const { setExpandScreen, expandScreen } = props;

    // state
    const [tradeData, setTradeData] = useState([])

    // redux-state
    const tradePair = useSelector(state => state.tradePair);

    // function
    const fetchRecentTrade = async (pairId) => {
        try {
            const { status, loading, result } = await getRecentTrade(pairId);
            if (status === 'success') {
                setTradeData(result)
                fetchRecentTradeWs(result)
            }
        } catch (err) { }
    }

    const fetchRecentTradeWs = (result) => {
        // socket
        if (result.pairId === tradePair.pairId || result.pairSymbol == tradePair.firstCurrencySymbol + tradePair.secondCurrencySymbol) {
            setTradeData(prevMessages => {
                let data = prevMessages
                // data.pop()
                return [...result.data, ...prevMessages].slice(0, 15);
            });
        }
    }

    useEffect(() => {
        if (!isEmpty(tradePair)) {
            fetchRecentTrade(tradePair.pairId)
            socketContext.socket.on('perpetualRecentTrade', fetchRecentTradeWs)
        }
    }, [tradePair])

    return (
        <div className="tradeTableLeftSide darkBox recentTrades">
            <div className="tableHead">
                <h4>{t('RECENT_TRADE')}</h4>
            </div>
            <div className="tradeTableTitle row w-100 mx-auto">
                <span className="col-4">{t('PRICE')}({tradePair && tradePair.secondCurrencySymbol})</span>
                <span className="col-4 text-right text-right">{t('AMOUNT')}({tradePair && tradePair.firstCurrencySymbol})</span>
                <span className="col-4 text-right text-right">{t('TIME')}</span>
            </div>

            <div className="tradeTableBody customScroll">
                <Scrollbars style={{ width: "100%", height: 180 }}>
                    {
                        tradeData && tradeData.length > 0 && tradeData.map((item, key) => {
                            let dataTime = new Date(item.createdAt);
                            let time = dataTime.getHours() + ':' + dataTime.getMinutes() + ':' + dataTime.getSeconds();

                            return (
                                <div className="tradeTableBodyRow odd row mx-auto">
                                    <span className={clsx("col-4",
                                        { ['greenText']: item.Type === 'buy' },
                                        { ['pinkText']: item.Type === 'sell' })}
                                    >
                                        {currencyFormat(toFixed(item.price, tradePair.secondFloatDigit))}
                                    </span>
                                    <span className="col-4 text-right">{item.filledQuantity}</span>
                                    <span className="col-4 text-right">{t('TIME')}</span>
                                </div>
                            )
                        })
                    }
                </Scrollbars>
            </div>
        </div>
    )
}
export default RecentTrade;