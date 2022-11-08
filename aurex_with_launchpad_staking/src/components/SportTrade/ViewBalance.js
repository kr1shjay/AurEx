// import package
import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
// import lib
import isEmpty from '../../lib/isEmpty';
import { toFixed } from '../../lib/roundOf'

const ViewBalance = (props) => {
    const { buyorsell } = props;

    // redux-state
    const tradePair = useSelector(state => state.tradePair);
    const { firstCurrency, secondCurrency } = useSelector(state => state.tradeAsset);
    console.log(tradePair, 'tradePairtradePairtradePair')
    console.log(firstCurrency, secondCurrency, '-------900909')

    const { t, i18n } = useTranslation();
    return (
        <h3>
            <small>{t('BALANCE')}</small>
            {/* {
                !isEmpty(tradePair) && !isEmpty(firstCurrency) && <p>{tradePair.firstCurrencySymbol} :{firstCurrency && firstCurrency.spotBal} </p>
            }
            {
                !isEmpty(tradePair) && !isEmpty(secondCurrency) && <p>{tradePair.secondCurrencySymbol} :{firstCurrency && secondCurrency.spotBal} </p>
            } */}

            {
                buyorsell == 'sell' && !isEmpty(tradePair) && !isEmpty(firstCurrency) && <p>{tradePair.firstCurrencySymbol} :{firstCurrency && toFixed(firstCurrency.spotBal, tradePair.firstFloatDigit)} </p>
            }
            {
                buyorsell == 'buy' && !isEmpty(tradePair) && !isEmpty(secondCurrency) && <p>{tradePair.secondCurrencySymbol} :{firstCurrency && toFixed(secondCurrency.spotBal, tradePair.secondFloatDigit)} </p>
            }
        </h3>
    )
}

export default ViewBalance;