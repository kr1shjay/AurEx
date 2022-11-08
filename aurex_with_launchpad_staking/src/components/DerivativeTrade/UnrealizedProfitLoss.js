// import package
import React from 'react';
import { useSelector } from 'react-redux';

// import lib
import { unrealizedPnLPercentage, unrealizedProfitLoss } from '../../lib/bybit';
import { toFixed } from '../../lib/roundOf'

const UnrealizedProfitLoss = (props) => {
    const { positionDetail } = props;

    // redux-state
    const tickerData = useSelector(state => state.marketPrice);
    const tradePair = useSelector(state => state.tradePair);

    return (
        <>
            {toFixed(unrealizedProfitLoss({
                'price': positionDetail.price,
                'quantity': positionDetail.positionQuantity,
                'lastPrice': tickerData.markPrice,
                'buyorsell': positionDetail.buyorsell
            }, tradePair.firstFloatDigit))} {positionDetail.firstCurrency}

            ({toFixed(unrealizedPnLPercentage({
                'price': positionDetail.price,
                'quantity': positionDetail.positionQuantity,
                'lastPrice': tickerData.markPrice,
                'leverage': positionDetail.leverage,
                'takerFee': positionDetail.taker_fees,
                'buyorsell': positionDetail.buyorsell
            }), 2)}%)
        </>
    )
}

export default UnrealizedProfitLoss