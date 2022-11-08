// import package
import React, { useState, useEffect } from 'react';
import { Slider } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
// import component
import ViewBalance from './ViewBalance';

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
    'price': "",
    'quantity': '',
    'total': ''
}

const StopLimitOrder = (props) => {
    const history = useHistory();
    const { t, i18n } = useTranslation();
    // props
    const { buyorsell } = props;

    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [loader, setLoader] = useState(false);

    const { stopPrice, price, quantity, total } = formValue;

    // redux-state
    const tradePair = useSelector(state => state.tradePair);
    const { firstCurrency, secondCurrency } = useSelector(state => state.tradeAsset);
    const { isAuth } = useSelector(state => state.auth);
    const orderBookDetail = useSelector(state => state.orderBookDetail);

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
            let reqData = {
                stopPrice: stopPrice,
                price: price,
                quantity: quantity,
                buyorsell: buyorsell,
                orderType: 'stop_limit',
                spotPairId: tradePair.pairId,
                'newdate': new Date()
            }

            const validateError = await validation(reqData)
            if (!isEmpty(validateError)) {
                toastAlert('error', validateError[Object.keys(validateError)[0]], 'stopLimit');
                return
            }

            setLoader(true)

            let encryptToken = {
                token: encryptObject(reqData)
            }

            let { status, loading, message } = await orderPlace(encryptToken);
            setLoader(loading)
            if (status === 'success') {
                setFormValue(initialFormValue);
                toastAlert('success', message, 'stopLimit');
            } else {
                toastAlert('error', message, 'stopLimit');
            }
        }
        catch (err) { }
    }

    useEffect(() => {
        if (orderBookDetail && !isEmpty(orderBookDetail.price)) {
            setFormValue((prev) => {
                return { ...prev, 'price': orderBookDetail.price }
            })
        }
    }, [orderBookDetail])

    return (
        <div className="placeOrderBox contact_form">
            <ViewBalance
                buyorsell={buyorsell}
            />
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
                        <span className="btnType1">{t('LIMIT_PRICE')}</span>
                    </div>
                    <input type="text" className="form-control text-right borderZero"
                        name="price"
                        value={price}
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
            <div className="form-group px-3">
                <Slider
                    defaultValue={0}
                    getAriaValueText={valuetext}
                    aria-labelledby="discrete-slider-custom"
                    step={1}
                    valueLabelDisplay="auto"
                    marks={marks}
                />
            </div>
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
                    {buyorsell == 'buy' && <button className="btn BuyNavButton" onClick={() => handleSubmit('buy')}>{t('BUY')} {tradePair && tradePair.firstCurrencySymbol}</button>}
                    {buyorsell == 'sell' && <button className="btn SellNavButton" onClick={() => handleSubmit('sell')} >{t("SELL")} {tradePair && tradePair.firstCurrencySymbol}</button>}
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

export default StopLimitOrder;