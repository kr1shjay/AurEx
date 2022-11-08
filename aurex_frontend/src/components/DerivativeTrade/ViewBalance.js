// import package
import React from 'react';
import { useSelector } from 'react-redux';

// import lib
import isEmpty from '../../lib/isEmpty';

const ViewBalance = () => {
    // redux-state
    const tradePair = useSelector(state => state.tradePair);
    const { firstCurrency, secondCurrency } = useSelector(state => state.tradeAsset);

    return (
        <h3>
            <small>{"Balance"}</small> 
            {
                !isEmpty(tradePair) && !isEmpty(firstCurrency) && <p>{tradePair.firstCurrencySymbol} :{firstCurrency && firstCurrency.derivativeBal} </p>
            }
        </h3>
    )
}

export default ViewBalance;