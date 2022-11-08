// import package
import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'classnames';
import { useTranslation } from 'react-i18next';
// import context
import SocketContext from '../Context/SocketContext';

import { Scrollbars } from 'react-custom-scrollbars-2';


// import component
import UnrealizedProfitLoss from './UnrealizedProfitLoss';

// import action
import { getPositionOrder } from '../../actions/perpetualTradeAction';

// import lib
import isEmpty from '../../lib/isEmpty';
import { inversePositionMargin } from '../../lib/bybit';
import { toFixed } from '../../lib/roundOf'

const PositionOrder = () => {
    const socketContext = useContext(SocketContext);
    const { t, i18n } = useTranslation();
    // state
    const [loader, setLoader] = useState(true)
    const [positionDetail, setPositionDetail] = useState({})

    // redux-state
    const tradePair = useSelector(state => state.tradePair);

    // function
    const fetchPositionOrder = async (reqData, pairId) => {
        try {
            const { status, loading, result } = await getPositionOrder(reqData, pairId);
            setLoader(loading)
            if (status == 'success') {
                setPositionDetail(result)
            }
        } catch (err) { }
    }

    const tpSL = (tpSLData) => {
        if (tpSLData) {
            let data = tpSLData.findLast((el) => el.isProfitLoss == true);
            if (data) {
                return `${data.takeProfitPrice}/${data.stopLossPrice}`
            }
            return '-'
        }
        return '-'
    }

    useEffect(() => {
        if (!isEmpty(tradePair)) {
            fetchPositionOrder(tradePair.pairId)

            // socket
            socketContext.socket.on('perpetualPositionOrder', (result) => {
                if (result.pairId == tradePair.pairId) {
                    setPositionDetail(result.data)
                }
            })
        }
    }, [tradePair])

    return (
        <Scrollbars style={{ width: "100%", height: 180 }}>
            <div className="table-responsive">
                <table id="active0Table" className="table table-striped">
                    <thead>
                        <tr>
                            <th>{t('CONTRACTS')}</th>
                            <th>{t('QTY')}</th>
                            <th>{t('VALUE')}</th>
                            <th>{t('ENTYRY_PRICE')}</th>
                            <th>{t('LIQ_PRICE')}</th>
                            <th>{t('POSITION_MARGIN')}</th>
                            <th>{t('UNREALIZED')}</th>
                            <th>{t('DAILY_REALIZED')}</th>
                            <th>{t('TP_SL')}</th>
                            {/* <th>{t('TRAILING_STOP')}</th> */}
                            <th>{t('CLOSED_BY')}</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            !loader && !isEmpty(positionDetail) && <tr>
                                <td className={
                                    clsx({ "greenText": positionDetail.buyorsell == 'buy' }, { "pinkText": positionDetail.buyorsell == 'sell' })
                                }>
                                    {positionDetail.firstCurrency}/{positionDetail.secondCurrency}
                                </td>
                                <td className={
                                    clsx({ "greenText": positionDetail.buyorsell == 'buy' }, { "pinkText": positionDetail.buyorsell == 'sell' })
                                }>
                                    {positionDetail.positionQuantity}
                                </td>
                                <td>{positionDetail.positionQuantity / positionDetail.price}</td>
                                <td>{positionDetail.price}</td>
                                <td>{toFixed(positionDetail.liquidityPrice, tradePair.firstFloatDigit)}</td>
                                <td>{toFixed(inversePositionMargin({
                                    'price': positionDetail.price,
                                    'quantity': positionDetail.positionQuantity,
                                    'leverage': positionDetail.leverage,
                                    'takerFee': positionDetail.taker_fees,
                                    'buyorsell': positionDetail.buyorsell
                                }), tradePair.firstFloatDigit)} {positionDetail.firstCurrency}</td>
                                <td>{ }
                                    <UnrealizedProfitLoss
                                        positionDetail={positionDetail}
                                    />
                                </td>
                                <td>{positionDetail.positionMargin}</td>
                                <td>{positionDetail.initialMargin}</td>
                                <td>{tpSL(positionDetail.tpSL)}</td>
                                {/* <td></td> */}
                                <td></td>
                            </tr>


                        }

                        {
                            !loader && isEmpty(positionDetail) && <tr>
                                <td colspan="8" height="150" className="text-center">- {t('NO_DATA')} -</td>
                            </tr>
                        }

                    </tbody>
                </table>
            </div>
        </Scrollbars>


    )
}

export default PositionOrder;