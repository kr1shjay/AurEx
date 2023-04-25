// import package
import React, { useState, useEffect, useContext } from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from 'react-redux';
import clsx from 'classnames';
import { useTranslation } from 'react-i18next';
// import context
import SocketContext from '../Context/SocketContext';


import { Scrollbars } from 'react-custom-scrollbars-2';



// import action
import { getTradeHistory } from '../../actions/spotTradeAction';

// import lib
import isEmpty from '../../lib/isEmpty';
import { capitalize } from '../../lib/stringCase';
import { momentFormat } from '../../lib/dateTimeHelper'

const initialData = {
    currentPage: 1,
    nextPage: true,
    limit: 10,
    count: 0,
    data: []
}

const TradeHistory = () => {
    const socketContext = useContext(SocketContext);

    // state
    const [loader, setLoader] = useState(true)
    const [orderData, setOrderData] = useState(initialData)

    const { currentPage, nextPage, limit, count, data } = orderData

    // redux-state
    const tradePair = useSelector(state => state.tradePair);
    const { isAuth } = useSelector(state => state.auth);
    const { t, i18n } = useTranslation();

    // function
    const fetchTradeHistory = async (reqData, pairId) => {
        try {
            const { status, loading, result } = await getTradeHistory(reqData, pairId);
            setLoader(loading)
            console.log('fetchTradeHistory',result.data)
            if (status == 'success') {
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
        if (data.length === count) {
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
        fetchTradeHistory(reqData, tradePair.pairId)
    };

    useEffect(() => {
        if (!isEmpty(tradePair) && isAuth) {
            setOrderData(initialData)
            let reqData = {
                page: currentPage,
                limit
            }
            fetchTradeHistory(reqData, tradePair.pairId)

            // socket
            socketContext.socket.on('tradeHistory', (result) => {
                if (result.pairId == tradePair.pairId) {
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
            <Scrollbars style={{ width: "100%", height: 310 }}>
                <table id="active0Table" className="table table-striped">
                    <thead>
                        <tr>
                            <th>{t('DATE')}</th>
                            <th>{t('PAIR')}</th>
                            <th>{t('SIDE')}</th>
                            <th>{t('PRICE')}</th>
                            {/* <th>{t('PRICE')}</th> */}
                            <th>{t('FILLED')}</th>
                            <th>{t('FEES')}</th>
                            <th>{t('TOTAL')}</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            !loader && data && data.length > 0 && data.map((item, key) => {
                                console.log(item, '---item')
                                let curFloat = item.buyorsell == 'sell' ? tradePair.firstFloatDigit : tradePair.secondFloatDigit;

                                return (
                                    <tr key={key}>
                                        <td>{momentFormat(item.createdAt, 'YYYY-MM-DD HH:mm')}</td>
                                        <td>{item.firstCurrency}/{item.secondCurrency}</td>
                                        <td className={
                                            clsx(
                                                { "greenText": item.buyorsell === 'buy' },
                                                { "pinkText": item.buyorsell === 'sell' })}
                                        >
                                            {capitalize(item.buyorsell)}
                                        </td>
                                        <td>{Number(item.ExecutedPrice).toFixed(curFloat)}</td>
                                        {/* <td>{item.price}</td> */}
                                        {/* <td>{item.averageTotal / item.filledQuantity}</td> */}
                                        <td>{Number(item.filledQuantity).toFixed(curFloat)}</td>
                                        <td>{Number(item.Fees).toFixed(curFloat)} {item.buyorsell === 'buy' ? item.firstCurrency : item.secondCurrency}</td>
                                        <td>{Number(item.orderValue).toFixed(curFloat)} {item.secondCurrency}</td>
                                    </tr>
                                )
                            })
                        }
                        {
                            !loader && data && data.length === 0 && <tr>
                                <td colspan="8" height="150" className="text-center">-{t('NO_DATA')}-</td>
                            </tr>
                        }
                    </tbody>
                </table>

            </Scrollbars>
        </div>
    )
}

export default TradeHistory;