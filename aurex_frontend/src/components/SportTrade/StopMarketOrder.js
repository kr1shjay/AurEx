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
import validation from './validation';

const marks = [
    {
        value: 0,
        label: '0%',
    },
    {
        value: 25,
        label: '25%',
    },
    {
        value: 50,
        label: '50%',
    },
    {
        value: 75,
        label: '75%',
    },
    {
        value: 100,
        label: '100%',
    },
];

function valuetext(value) {
    return `${value}%`;
}

const initialFormValue = {
    'stopPrice': "",
    'quantity': '',
    'price':'',
    'total': ''
}

const SpotMarketOrder = (props) => {
    const history = useHistory();
    const { t, i18n } = useTranslation();
    // props
    const { buyorsell } = props;

    // state
    const [formValue, setFormValue] = useState(initialFormValue);

    const { stopPrice,price, quantity , total } = formValue;

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

        if (!isEmpty(formData.stopPrice) && !isEmpty(formData.quantity)) {
            let totalPrice = formData.stopPrice * formData.quantity
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
            
            

            let reqData = {
                stopPrice: stopPrice,
                quantity: quantity,
                buyorsell: buyorsell,
                orderType: 'stop_market',
                spotPairId: tradePair.pairId,
                price:price,
                'newdate': new Date()
            }
           
            const validateError = await validation(reqData)
            if (!isEmpty(validateError)) {
                toastAlert('error', validateError[Object.keys(validateError)[0]], 'spotOrder');
                return
            }

            let encryptToken = {
                token: encryptObject(reqData)
            }

            let { status, message } = await orderPlace(encryptToken);
            if (status === 'success') {
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
            {
                buyorsell === 'buy' && <h3><small>{t('BALANCE')}</small> <span>{secondCurrency && secondCurrency.spotBal} {tradePair && tradePair.secondCurrencySymbol}</span></h3>
            }
            {
                buyorsell === 'sell' && <h3><small>{t('BALANCE')}</small> <span>{firstCurrency && firstCurrency.spotBal} {tradePair && tradePair.firstCurrencySymbol}</span></h3>
            }

            <div className="form-group">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="btnType1">{t('STOP_PRICE')}</span>
                    </div>
                    <input type="text" className="form-control text-right borderZero"
                        name="stopPrice"
                        value={stopPrice}
                        onChange={handleChange}
                    />
                    <div className="input-group-append">
                        <span className="btnType1">{tradePair && tradePair.secondCurrencySymbol}</span>
                    </div>
                </div>
            </div>

            <div className="form-group">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="btnType1">{t('AMOUNT')}</span>
                    </div>
                    <input type="text" className="form-control text-right borderZero"
                        name="quantity"
                        value={quantity}
                        onChange={handleChange}
                    />
                    <div className="input-group-append">
                        <span className="btnType1">{tradePair && tradePair.firstCurrencySymbol}</span>
                    </div>
                </div>
            </div>
            {/* <div className="form-group px-3">
                <Slider
                    defaultValue={0}
                    getAriaValueText={valuetext}
                    aria-labelledby="discrete-slider-custom"
                    step={1}
                    valueLabelDisplay="auto"
                    marks={marks}
                />
            </div> */}
            <div className="form-group">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="btnType1">{t('TOTAL')}</span>
                    </div>
                    <input type="text" className="form-control text-right borderZero" value={total} />
                    <div className="input-group-append">
                        <span className="btnType1">{tradePair && tradePair.secondCurrencySymbol}</span>
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

export default SpotMarketOrder;