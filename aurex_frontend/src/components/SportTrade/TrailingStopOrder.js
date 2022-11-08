// import package
import React, { useState } from 'react';
import { Slider } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
// import action
import { orderPlace } from '../../actions/spotTradeAction';

// import lib
import isEmpty from '../../lib/isEmpty';
import { encryptObject } from '../../lib/cryptoJS'
import { toastAlert } from '../../lib/toastAlert';


const initialFormValue = {
    'stopPrice': "",
    'quantity': '',
    'total': ''
}

const TrailingStopOrder = (props) => {
    const history = useHistory();
    const { t, i18n } = useTranslation();
    // props
    const { buyorsell } = props;

    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [loader, setLoader] = useState();

    const { stopPrice, quantity, total } = formValue;

    // redux-state
    const tradePair = useSelector(state => state.tradePair);
    const { firstCurrency, secondCurrency } = useSelector(state => state.tradeAsset);
    const { isAuth } = useSelector(state => state.auth);

    // function
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;

        if (!/^\d*\.?\d*$/.test(value)) {
            return
        }

        let formData = { ...formValue, ...{ [name]: value } }

        if (!isEmpty(formData.price) && !isEmpty(formData.quantity)) {
            let totalPrice = formData.price * formData.quantity
            formData = { ...formData, ...{ ['total']: totalPrice } }
        }
        setFormValue(formData)
    }

    const handleSubmit = async (buyorsell) => {
        try {
            // const validateError = await validation(formValue, orderType, buyorsell)
            // if (!isEmpty(validateError)) {
            //     toastAlert('error', validateError[Object.keys(validateError)[0]], 'spotOrder');
            //     return
            // }
            setLoader(true)
            let reqData = {
                stopPrice: stopPrice,
                quantity: quantity,
                buyorsell: buyorsell,
                orderType: 'trailing_stop',
                spotPairId: tradePair.pairId,
                'newdate': new Date()
            }

            let encryptToken = {
                token: encryptObject(reqData)
            }

            let { status, loading, message, error, result } = await orderPlace(encryptToken);
            setLoader(loading)
            if (status == 'success') {
                setFormValue(initialFormValue);

                // if (result.userAsset._id == firstCurrency._id) {
                //     setUserFirstCurrency(result.userAsset, dispatch)
                // } else if (result.userAsset._id == secondCurrency._id) {
                //     setUserSecondCurrency(result.userAsset, dispatch)
                // }

                toastAlert('success', message, 'spotOrder');
            } else {
                toastAlert('error', message, 'spotOrder');
            }
        }
        catch (err) { }
    }

    return (
        <div className="placeOrderBox contact_form">
            <h3>
                <small>{t('BALANCE')}</small>
                <p>{tradePair && tradePair.firstCurrencySymbol} : {firstCurrency && firstCurrency.spotBal} </p>
                <p> {tradePair && tradePair.secondCurrencySymbol}:{secondCurrency && secondCurrency.spotBal}</p>
            </h3>
            {/* {
                buyorsell == 'buy' && <h3><small>Balance</small> <span>{secondCurrency && secondCurrency.spotBal} {tradePair && tradePair.secondCurrencySymbol}</span></h3>
            }
            {
                buyorsell == 'sell' && <h3><small>Balance</small> <span>{firstCurrency && firstCurrency.spotBal} {tradePair && tradePair.firstCurrencySymbol}</span></h3>
            } */}

            <div className="form-group">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="btnType1">{t('DISTANCE')}</span>
                    </div>
                    <input type="text" class="form-control text-right borderZero"
                        name="stopPrice"
                        value={stopPrice}
                        onChange={handleChange}
                    />
                    <div class="input-group-append">
                        <span class="btnType1">{tradePair && tradePair.secondCurrencySymbol}</span>
                    </div>
                </div>
            </div>

            <div className="form-group">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="btnType1">{t('AMOUNT')}</span>
                    </div>
                    <input type="text" class="form-control text-right borderZero"
                        name="quantity"
                        value={quantity}
                        onChange={handleChange}
                    />
                    <div class="input-group-append">
                        <span class="btnType1">{tradePair && tradePair.firstCurrencySymbol}</span>
                    </div>
                </div>
            </div>

            <div className="form-group">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="btnType1">{t('TOTAL')}</span>
                    </div>
                    <input type="text" class="form-control text-right borderZero" value="115.50 " />
                    <div class="input-group-append">
                        <span class="btnType1">{tradePair && tradePair.secondCurrencySymbol}</span>
                    </div>
                </div>
            </div>
            {
                isAuth && <div className="ButtonFullWidth px-0">
                    <button className="btn BuyNavButton" onClick={() => handleSubmit('buy')}>{t('BUY')} {tradePair && tradePair.firstCurrencySymbol}</button>
                    <button className="btn SellNavButton" onClick={() => handleSubmit('sell')} >{t('SELL')} {tradePair && tradePair.firstCurrencySymbol}</button>
                </div>
            }

            {
                !isAuth && <div className="ButtonFullWidth px-0">
                    <button className="btn BuyNavButton" onClick={() => history.push('/login')}>{t('LOGIN')}</button>
                </div>
            }
        </div>
    )
}

export default TrailingStopOrder;