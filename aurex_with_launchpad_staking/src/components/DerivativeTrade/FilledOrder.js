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
import { getFilledOrder } from '../../actions/perpetualTradeAction';

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

const FilledOrder = () => {
    const socketContext = useContext(SocketContext)
    const { t, i18n } = useTranslation();

    // state
    const [loader, setLoader] = useState(true)
    const [orderData, setOrderData] = useState(initialOrderForm)

    const { currentPage, nextPage, limit, count, data } = orderData

    // redux-state
    const tradePair = useSelector(state => state.tradePair);

    // function
    const fetchFilledOrder = async (reqData, pairId) => {
        try {
            const { status, loading, result } = await getFilledOrder(reqData, pairId);
            setLoader(loading)
            if (status == 'success') {
                setOrderData({
                    'currentPage': result.currentPage,
                    'nextPage': result.count == result.data.length ? false : true,
                    'limit': result.limit,
                    'count': result.count,
                    'data': [...data, ...result.data],
                })
            }
        } catch (err) { }
    }

    const fetchMoreData = () => {
        if (data.length == count) {
            setOrderData({
                ...orderData,
                'nextPage': false
            })
            return;
        }

        let reqData = {
            page: currentPage + 1,
            limit
        }
        fetchFilledOrder(reqData, tradePair.pairId)
    };

    useEffect(() => {
        if (!isEmpty(tradePair)) {
            let reqData = {
                page: currentPage,
                limit
            }
            fetchFilledOrder(reqData, tradePair.pairId)

            // socket
            socketContext.socket.on('perpetualFilledOrder', (result) => {
                if (result.pairId == tradePair.pairId) {
                    setOrderData({
                        'currentPage': result.currentPage,
                        'nextPage': result.count == result.data.length ? false : true,
                        'limit': result.limit,
                        'count': result.count,
                        'data': result.data,
                    })
                }
            })
        }
    }, [tradePair])

    return (
        <div className="table-responsive">
         
                   <Scrollbars style={{ width: "100%", height: 180 }}>
                <table id="closedPLTable" className="table table-striped">
                    <thead>
                        <tr>
                            <th>{t('CONTRACTS')}</th>
                            <th>{t('FILLED_TOTAL')}</th>
                            <th>{t('FILLED_PRICE')}</th>
                            <th>{t('ORDER_PRICE')}</th>
                            <th>{t('TRADE_TYPE')}</th>
                            <th>{t('ORDER_TYPE')}</th>
                            <th>{t('ORDER_NO')}</th>
                            <th>{t('ORDER_TIME')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data && data.length > 0 && data.map((item, key) => {
                                return (
                                    <tr key={key}>
                                        <td className={clsx({ "greenText": item.buyorsell == 'buy' }, { "pinkText": item.buyorsell == 'sell' })}>
                                            {item.firstCurrency}/{item.secondCurrency}
                                        </td>
                                        <td>{item.filledQuantity}/{item.quantity}</td>
                                        <td>{item.price}</td>
                                        <td>{item.price}</td>
                                        <td className={clsx({ "greenText": item.buyorsell == 'buy' }, { "pinkText": item.buyorsell == 'sell' })}>{capitalize(item.buyorsell)}</td>
                                        <td>{capitalize(item.orderType)}</td>
                                        <td>{item._id}</td>
                                        <td>{item.orderDate}</td>
                                    </tr>
                                )
                            })
                        }

                        {
                            !loader && data && data.length == 0 && <tr>
                                <td colspan="8" height="150" className="text-center">- {t('NO_DATA')}-</td>
                            </tr>
                        }

                    </tbody>
                </table>
                </Scrollbars>
        </div>
    )
}

export default FilledOrder;