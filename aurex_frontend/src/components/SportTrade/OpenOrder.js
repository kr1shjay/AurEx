// import package
import React, { useState, useEffect, useContext } from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from 'react-redux';
import clsx from 'classnames';
//Scrollbar
import { Scrollbars } from 'react-custom-scrollbars-2';
// import context
import SocketContext from '../Context/SocketContext';
import { useTranslation } from 'react-i18next';
// import component
import CancelOrder from './CancelOrder';

// import action
import { getOpenOrder } from '../../actions/spotTradeAction';

// import lib
import isEmpty from '../../lib/isEmpty';
import { capitalize } from '../../lib/stringCase';
import { triggerCondition } from '../../lib/displayStatus'
import isLogin from '../../lib/isLogin';
import { momentFormat } from '../../lib/dateTimeHelper'

const initialData = {
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
    const [orderData, setOrderData] = useState(initialData)

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
                setOrderData((prev) => {
                    return {
                        'currentPage': result.currentPage,
                        'nextPage': result.nextPage,
                        'limit': result.limit,
                        'count': result.count,
                        'data': [...prev.data, ...result.data],
                    }
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
        if (!isEmpty(tradePair) && isLogin()) {
            setOrderData(initialData)
            let reqData = {
                page: currentPage,
                limit
            }
            fetchOpenOrder(reqData, tradePair.pairId)

            // socket
            socketContext.socket.on('openOrder', (result) => {
                if (result.pairId == tradePair.pairId) {
                    setOrderData({
                        'currentPage': result.currentPage,
                        'nextPage': result.nextPage,
                        'limit': result.limit,
                        'count': result.count,
                        'data': result.data,
                    })
                    handleCount(result.count)
                }
            })
        }
    }, [tradePair,socketContext.socket])

    return (
        <div className="table-responsive">
            <Scrollbars style={{ width: "100%", height: 342 }}>
                <table id="positionsTable" className="table table-striped">
                    <thead>
                        <tr>
                            <th>{t('DATE')}</th>
                            <th>{t('PAIR')}</th>
                            <th>{t('TYPE')}</th>
                            <th>{t('SIDE')}</th>
                            <th>{t('PRICE')}</th>
                            <th>{t('AMOUNT')}</th>
                            <th>{t('FILLED')}</th>
                            <th>{t('TOTAL')}</th>
                            {/* <th>{t('TRIGGER_CONDITION')}</th> */}
                            <th>{t('ACTION')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            !loader && data && data.length > 0 && data.map((item, key) => {
                                let curFloat = item.buyorsell == 'sell' ? tradePair.firstFloatDigit : tradePair.secondFloatDigit;
                                return (
                                    <tr key={key}>
                                        <td>{momentFormat(item.orderDate, 'YYYY-MM-DD HH:mm')}</td>
                                        <td>{item.firstCurrency}/{item.secondCurrency}</td>
                                        <td>{capitalize(item.orderType)}</td>
                                        <td className={clsx({ "greenText": item.buyorsell === 'buy' }, { "pinkText": item.buyorsell == 'sell' })}>{capitalize(item.buyorsell)}</td>
                                        <td>{Number(item.price).toFixed(curFloat)}</td>
                                        <td>{Number(item.quantity).toFixed(curFloat)}</td>
                                        <td>{item.filledQuantity}</td>
                                        <td>{Number(item.orderValue).toFixed(curFloat)}</td>
                                        {/* <td>{triggerCondition(item.conditionalType, item.stopPrice)}</td> */}
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
                            !loader && data && data.length === 0 && <tr>
                                <td colspan="10" height="150" className="text-center">- {t('NO_DATA')} -</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </Scrollbars>
            {/* <button className="btn btn_green_su" onClick={fetchMoreData}>Load more</button> */}
        </div>
    )
}
export default OpenOrder;