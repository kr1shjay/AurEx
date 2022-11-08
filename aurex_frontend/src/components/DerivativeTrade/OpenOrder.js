// import package
import React, { useState, useEffect, useContext } from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from 'react-redux';
import clsx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Scrollbars } from 'react-custom-scrollbars-2';

// import context
import SocketContext from '../Context/SocketContext';

// import component
import CancelOrder from './CancelOrder';

// import action
import { getOpenOrder } from '../../actions/perpetualTradeAction';

// import lib
import isEmpty from '../../lib/isEmpty';
import { capitalize } from '../../lib/stringCase';

const initialOrderForm = {
    currentPage: 1,
    nextPage: true,
    limit: 10,
    count: 0,
    data: []
}

const OpenOrder = (props) => {
    const socketContext = useContext(SocketContext)
    const { t, i18n } = useTranslation();
    // props
    const { handleCount } = props

    // state
    const [loader, setLoader] = useState(true)
    const [orderData, setOrderData] = useState(initialOrderForm)

    const { currentPage, nextPage, limit, count, data } = orderData

    // redux-state
    const tradePair = useSelector(state => state.tradePair);
    const { isAuth } = useSelector(state => state.auth);

    // function
    const fetchOpenOrder = async (reqData, pairId) => {
        try {
            const { status, loading, result } = await getOpenOrder(reqData, pairId);
            setLoader(loading)
            if (status == 'success') {
                handleCount(result.count)
                setOrderData({
                    'currentPage': result.currentPage,
                    'nextPage': result.nextPage,
                    'limit': result.limit,
                    'count': result.count,
                    'data': [...data, ...result.data],
                })
            } else {
                setOrderData({
                    ...orderData,
                    ...{ 'nextPage': false }
                })
            }
        } catch (err) { }
    }

    const fetchMoreData = () => {
        if (data.length == count) {
            setOrderData({
                ...orderData,
                ...{ 'nextPage': false }
            })
            return;
        }

        let reqData = {
            page: currentPage + 1,
            limit
        }
        fetchOpenOrder(reqData, tradePair.pairId)
    };

    useEffect(() => {
        if (!isEmpty(tradePair) && isAuth) {
            let reqData = {
                page: currentPage,
                limit
            }
            fetchOpenOrder(reqData, tradePair.pairId)
            setOrderData(initialOrderForm)

            // socket
            socketContext.socket.on('perpetualOpenOrder', (result) => {
                if (result.pairId == tradePair.pairId) {
                    handleCount(result.count)
                    setOrderData({
                        'currentPage': result.currentPage,
                        'nextPage': result.nextPage,
                        'limit': result.limit,
                        'count': result.count,
                        'data': result.data,
                    })
                }
            })
        }
    }, [tradePair, isAuth])

    return (
        <div className="table-responsive">

            <Scrollbars style={{ width: "100%", height: 180 }}>
                <table id="positionsTable" className="table table-striped">
                    <thead>
                        <tr>
                            <th>{t('CONTRACTS')}</th>
                            <th>{t('QTY')}</th>
                            <th>{t('ORDER_PRICE')}</th>
                            <th>{t('FILLED_TOTAL')}</th>
                            <th>{t('TRADE_TYPE')}</th>
                            <th>{t('TP_SL')}</th>
                            <th>{t('ORDER_TYPE')}</th>
                            <th>{t('STATUS')}</th>
                            <th>{t('ORDER_NO')}</th>
                            <th>{t('ORDER_TIME')}</th>
                            <th>{t('ACTION')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            !loader && data && data.length > 0 && data.map((item, key) => {
                                return (
                                    <tr key={key}>
                                        <td className={
                                            clsx({ "greenText": item.buyorsell == 'buy' }, { "pinkText": item.buyorsell == 'sell' })
                                        }>
                                            {item.firstCurrency}/{item.secondCurrency}
                                        </td>
                                        <td>{item.quantity}</td>
                                        <td>{item.price}</td>
                                        <td>{item.quantity}/{item.filledQuantity}</td>
                                        <td className={clsx({ "greenText": item.buyorsell == 'buy' }, { "pinkText": item.buyorsell == 'sell' })}>{capitalize(item.buyorsell)}</td>
                                        {
                                            item.isProfitLoss && <td>{item.takeProfitPrice}/{item.stopLossPrice}</td>
                                        }

                                        {
                                            !item.isProfitLoss && <td>-</td>
                                        }

                                        <td>{capitalize(item.orderType)}</td>
                                        <td>{item.status}</td>
                                        <td>{item._id}</td>
                                        <td>{item.orderDate}</td>
                                        <td>
                                            <CancelOrder
                                                orderId={item._id}
                                            />
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        {
                            !loader && data && data.length == 0 && <tr>
                                <td colspan="8" height="150" className="text-center">- {t('NO_DATA')} -</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </Scrollbars>
        </div>
    )
}

export default OpenOrder;