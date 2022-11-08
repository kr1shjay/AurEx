// import package
import React, { useState, useEffect, useContext } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useSelector } from 'react-redux';
import clsx from 'classnames';
import { useTranslation } from 'react-i18next';
// import context
import SocketContext from '../Context/SocketContext';

// import action
import { getOrderBook } from '../../actions/perpetualTradeAction';

// import lib
import isEmpty from '../../lib/isEmpty';
import { toFixed } from '../../lib/roundOf';

const OrderBook = () => {
    const socketContext = useContext(SocketContext)
    const { t, i18n } = useTranslation();
    // state
    const [orderBook, setOrderBook] = useState({
        "buyOrder": [],
        "sellOrder": [],
    })

    const { buyOrder, sellOrder } = orderBook

    // redux-state
    const tradePair = useSelector(state => state.tradePair);
    const tickerData = useSelector(state => state.marketPrice);

    // function
    const fetchOrderBook = async (pairId) => {
        try {
            const { status, loading, result } = await getOrderBook(pairId);
            if (status == 'success') {
                setOrderBook(result)
            }
        } catch (err) { }
    }

    useEffect(() => {
        if (!isEmpty(tradePair)) {
            fetchOrderBook(tradePair.pairId)
        }

        // socket
        socketContext.socket.on('perpetualOrderBook', (result) => {
            if (result.pairId == tradePair.pairId) {
                setOrderBook({
                    'buyOrder': result.buyOrder,
                    'sellOrder': result.sellOrder
                })
            }
        })

    }, [tradePair])

    return (
        <div className="tradeTableLeftSide darkBox orderBook">
            <div className="tableHead">
                <h4>{t('ORDER_BOOK')}</h4>
                <div className="inputGroup">
                    <button className="btn"><img src={require("../../assets/images/btn-green-dot.png")} alt="" className="img-fluid" /></button>
                    <button className="btn"><img src={require("../../assets/images/btn-pink-dot.png")} alt="" className="img-fluid" /></button>
                    <button className="btn"><img src={require("../../assets/images/btn-green-pink-dot.png")} alt="" className="img-fluid" /></button>
                </div>
            </div>
            <div className="tradeTableTitle row mx-auto w-100">
                <span className="col-4">{t('PRICE')}({tradePair && tradePair.secondCurrencySymbol})</span>
                <span className="col-4">{t('AMOUNT')}({tradePair && tradePair.firstCurrencySymbol})</span>
                <span className="col-4">{t('TOTAL')}</span>
            </div>
            <Scrollbars style={{ width: "100%", height: 165 }}>
                <div className="tradeTableBody customScroll derivative_orderbook">

                    {
                        sellOrder && sellOrder.length > 0 && sellOrder.map((item, key) => {
                            return (
                                <div
                                    className={clsx("tradeTableBodyRow", { "odd": key % 2 == 1 }, { "even": key % 2 == 0 }, "row mx-auto")}
                                >
                                    <span className="col-4 pinkText">{toFixed(item._id, tradePair.secondFloatDigit)}</span>
                                    <span className="col-4">{toFixed(item.quantity, tradePair.firstFloatDigit)}</span>
                                    <span className="col-4">{toFixed(item.total, tradePair.firstFloatDigit)}</span>
                                </div>
                            )
                        })
                    }


                    <div className="tradeTableBodyRow even highLight row mx-auto w-100" data-toggle="tooltip" data-placement="right" data-html="true" title="<b>Avg.Price:</b> = 7,138.75<br /><b>Sum BTC:</b> 1.302019<br /><b>Sum USDT:</b> 14,279.6600000">
                        <span className="pinkText pl-5"><i className="fas fa-caret-down"></i> {tickerData.markPrice}</span>
                    </div>

                    {
                        buyOrder && buyOrder.length > 0 && buyOrder.map((item, key) => {
                            return (
                                <div
                                    className={clsx("tradeTableBodyRow", { "odd": key % 2 == 1 }, { "even": key % 2 == 0 }, "row mx-auto")}
                                    data-toggle="tooltip"
                                    data-placement="right"
                                    data-html="true"
                                    title="<b>Avg.Price:</b> = 7,138.75<br /><b>Sum BTC:</b> 1.302019<br /><b>Sum USDT:</b> 14,279.6600000">
                                    <span className="col-4 greenText">{toFixed(item._id, tradePair.secondFloatDigit)}</span>
                                    <span className="col-4">{toFixed(item.quantity, tradePair.firstFloatDigit)}</span>
                                    <span className="col-4">{toFixed(item.total, tradePair.firstFloatDigit)}</span>
                                </div>
                            )
                        })
                    }
                </div>
            </Scrollbars>
        </div>
    )
}

export default OrderBook;