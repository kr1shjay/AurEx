// import package
import React, { useState, useEffect, useContext, forwardRef, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'classnames';
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
// import context
import SocketContext from '../Context/SocketContext';

// import action
import { getOrderBook, orderBookDetail } from '../../actions/spotTradeAction';

// import lib
import isEmpty from '../../lib/isEmpty';
import { toFixed } from '../../lib/roundOf';

const OrderBook = forwardRef((props, ref) => {
    const socketContext = useContext(SocketContext);
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    // props
    const { setExpandScreen, expandScreen, layout } = props;
     
    // state
    const [orderBook, setOrderBook] = useState({
        "buyOrder": [],
        "sellOrder": [],
    })
    const [orderBookType, setOrderBookType] = useState('all')
    const [showTotal, setShowTotal] = useState(true)
    const [showType, setShowType] = useState('single') // single double

    const { buyOrder, sellOrder } = orderBook

    // redux-state
    const tradePair = useSelector(state => state.tradePair);
    const tickerData = useSelector(state => state.marketPrice);
    const pairData = useSelector(state => state.tradePair);
    

    // function
    const fetchOrderBook = async (pairId) => {
        try {
            const { status, loading, result } = await getOrderBook(pairId);
            if (status == 'success') {
                setOrderBook(result)
            }
        } catch (err) { }
    }

    const handleOrderBook = (type) => {
        setOrderBookType(type)
    }

    useImperativeHandle(
        ref,
        () => ({
            orderBookResize(layout) {
                if (showType == 'double') {
                    if (layout && layout.w >= 4) {
                        setShowTotal(true)
                    } else {
                        setShowTotal(false)
                    }
                }
            }
        }),
    )

    useEffect(() => {
        if (!isEmpty(tradePair) && tradePair.botstatus == 'off') {
            fetchOrderBook(tradePair.pairId)
        }

        if (!isEmpty(tradePair)) {
            // socket
            socketContext.socket.on('orderBook', (result) => {
                if (result.pairId === tradePair.pairId || result.pairSymbol == tradePair.firstCurrencySymbol+tradePair.secondCurrencySymbol) {
                    setOrderBook({
                        'buyOrder': result.buyOrder,
                        'sellOrder': result.sellOrder
                    })
                }
            })
        }
    }, [tradePair])

    // useEffect(() => {
    //     if (showType == 'double') {
    //         if (layout && layout.w >= 4) {
    //             setShowTotal(true)
    //         } else {
    //             setShowTotal(false)
    //         }
    //     }
    // }, [])

    var sellCount = 0, buyCount = 20;
    if (orderBookType == 'sell') {
        buyCount = 0;
    } else if (orderBookType == 'buy') {
        sellCount = 20;
    } else if (orderBookType == 'all') {
        buyCount = 10;
        sellCount = 10;
    }

    return (
        <div className="tradeTableLeftSide darkBox orderBook">
            <div className="tableHead mb-2">
                <h4>Order Book <small>({tradePair && tradePair.firstCurrencySymbol}/{tradePair && tradePair.secondCurrencySymbol})</small></h4>
                <div className="inputGroup">
                    <a className="ml-0 zoomIcon" data-toggle="collapse" href="#settingsOrderBook"><i className="bi bi-gear-fill"></i></a>
                    <div className="collapse" id="settingsOrderBook">
                        <div className="card card-body px-2 py-2">
                            <div className="inputGroup">
                                <button
                                    className="btn ml-0"
                                    onClick={() => { handleOrderBook('buy') }}
                                >
                                    <img src={require("../../assets/images/btn-green-dot.png")} alt="" className="img-fluid" />
                                </button>
                                <button
                                    className="btn ml-0"
                                    onClick={() => { handleOrderBook('sell') }}
                                >
                                    <img src={require("../../assets/images/btn-pink-dot.png")} alt="" className="img-fluid" />
                                </button>
                                <button
                                    className="btn ml-0"
                                    onClick={() => { handleOrderBook('all') }}
                                >
                                    <img src={require("../../assets/images/btn-green-pink-dot.png")} alt="" className="img-fluid" />
                                </button>
                            </div>
                            <FormControl component="fieldset">
                                <RadioGroup
                                    aria-label="buySell"
                                    name="buySell1"
                                    value={showType}
                                    onChange={(e) => {
                                        setShowType(e.target.value)
                                        if (e.target.value === 'single') {
                                            setShowTotal(true)
                                        } else if (layout && layout.w >= 4) {
                                            setShowTotal(true)
                                        } else {
                                            setShowTotal(false)
                                        }
                                    }}
                                >
                                    <FormControlLabel value="single" control={<Radio />} label="Single" />
                                    <FormControlLabel value="double" control={<Radio />} label="Double" />
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div>
                    
                </div>

            </div>


            <div className="tradeTableBody">
                <div className={clsx("orderBookTwoColumn", { "singleColumnOrderBook": showType === 'single' })}>
                    <div className="greenColumn">
                        <div className="tradeTableTitle row w-100 mx-auto">
                            <span className={clsx({ "col-4": showTotal }, { "col-6": !showTotal })}>{t('PRICE')}</span>
                            <span className={clsx({ "col-4": showTotal }, { "col-6": !showTotal }, "text-right")} >{t('SIZE')}</span>
                            {
                                showTotal && <span className="col-4 text-right">Total</span>
                            }
                        </div>
                        {
                            sellOrder && sellOrder.length > 0 && sellOrder.map((item, key) => {
                                return (
                                    <div
                                        className={clsx("tradeTableBodyRow w-100", { "odd": key % 2 === 1 }, { "even": key % 2 === 0 }, "row mx-auto")}
                                    >
                                        <span
                                            className={clsx({ "col-4": showTotal }, { "col-6": !showTotal }, 'pinkText')}
                                            onClick={() => { orderBookDetail(dispatch, { 'price': toFixed(item._id, tradePair.secondFloatDigit) }) }}
                                        >
                                            {toFixed(item._id, tradePair.secondFloatDigit)}
                                        </span>
                                        <span
                                            className={clsx({ "col-4": showTotal }, { "col-6": !showTotal }, 'text-right')}
                                            onClick={() => { orderBookDetail(dispatch, { 'price': toFixed(item._id, tradePair.secondFloatDigit) }) }}
                                        >
                                            {toFixed(item.quantity, tradePair.firstFloatDigit)}
                                        </span>
                                        {
                                            showTotal && <span className={"col-4 text-right"}>{toFixed(item.total, tradePair.firstFloatDigit)}</span>
                                        }

                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="tradeTableBodyRow even highLight row mx-auto w-100">
                        <span className="col-12 pinkText pl-3 font-size-16">
                            <i className="fas fa-caret-down"></i> {toFixed(tickerData.markPrice, pairData.secondFloatDigit)}
                        </span>
                    </div>
                    <div className="redColumn">
                        <div className="tradeTableTitle row w-100 mx-auto">
                            <span className={clsx({ "col-4": showTotal }, { "col-6": !showTotal })}>{t('PRICE')}</span>
                            <span className={clsx({ "col-4": showTotal }, { "col-6": !showTotal }, "text-right")} >{t('SIZE')}</span>
                            {
                                showTotal && <span className="col-4 text-right">{t('TOTAL')}</span>
                            }
                        </div>
                        {
                            buyOrder && buyOrder.length > 0 && buyOrder.map((item, key) => {
                                return (
                                    <div
                                        className={clsx("tradeTableBodyRow w-100", { "odd": key % 2 === 1 }, { "even": key % 2 === 0 }, "row mx-auto")}
                                        data-toggle="tooltip"
                                        data-placement="right"
                                        data-html="true"
                                        title="<b>Avg.Price:</b> = 7,138.75<br /><b>Sum BTC:</b> 1.302019<br /><b>Sum USDT:</b> 14,279.6600000">
                                        <span
                                            className={clsx({ "col-4": showTotal }, { "col-6": !showTotal }, 'greenText')}
                                            onClick={() => { orderBookDetail(dispatch, { 'price': toFixed(item._id, tradePair.secondFloatDigit) }) }}
                                        >
                                            {toFixed(item._id, tradePair.secondFloatDigit)}
                                        </span>
                                        <span
                                            className={clsx({ "col-4": showTotal }, { "col-6": !showTotal }, 'text-right')}
                                            onClick={() => { orderBookDetail(dispatch, { 'price': toFixed(item._id, tradePair.secondFloatDigit) }) }}
                                        >
                                            {toFixed(item.quantity, tradePair.firstFloatDigit)}
                                        </span>
                                        {
                                            showTotal && <span className={"col-4 text-right"}>{toFixed(item.total, tradePair.firstFloatDigit)}</span>
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>


                </div>

            </div>

        </div >
    )
})

export default OrderBook;