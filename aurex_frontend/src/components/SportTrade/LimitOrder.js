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
import { toFixed } from '../../lib/roundOf';
import validation from './validation'

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
let initialPrice = ''

function valuetext(value) {
    return `${value}%`;
}

const initialFormValue = {
    'price': "",
    'quantity': '',
    'total': ''
}

const LimitOrder = (props) => {
    const history = useHistory();
    const { t, i18n } = useTranslation();
    // props
    const { buyorsell } = props;

    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [loader, setLoader] = useState();

    const { price, quantity, total } = formValue;

    // redux-state
    const tradePair = useSelector(state => state.tradePair);
    const marketPriceData = useSelector(state => state.marketPrice);
    const { isAuth } = useSelector(state => state.auth);
    const orderBookDetail = useSelector(state => state.orderBookDetail);
    const { firstCurrency, secondCurrency } = useSelector(state => state.tradeAsset);

    console.log(tradePair,'tradePair')

    // function
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        

        if (!/^\d*\.?\d*$/.test(value)) {
            return
        }
         let curFloat = buyorsell == 'sell' ? tradePair.firstFloatDigit : tradePair.secondFloatDigit;
        let formData = { ...formValue, ...{ [name]: value } }
        if (!isEmpty(formData.price) && !isEmpty(formData.quantity)) {
            let totalPrice = formData.price * formData.quantity
            formData = { ...formData, ...{ ['total']: totalPrice } }
        }
        setFormValue(formData)
    }

    const handlePercentage = (e, percentage) => {
        let priceValue = 0, formData = {};
        if (!isEmpty(price) && !isNaN(price)) {
            priceValue = price;
        } else if (!isEmpty(marketPriceData.markPrice) && !isNaN(marketPriceData.markPrice)) {
            priceValue = marketPriceData.markPrice;
            formData['price'] = marketPriceData.markPrice;;
        }

        if (buyorsell == 'buy') {
            let userBalance = secondCurrency && secondCurrency.spotBal > 0 ? secondCurrency.spotBal : 0;
            formData['total'] = toFixed(userBalance * (percentage / 100), tradePair.secondFloatDigit);
            formData['quantity'] = toFixed(formData['total'] / priceValue, tradePair.firstFloatDigit);
        } else if (buyorsell == 'sell') {
            let userBalance = firstCurrency && firstCurrency.spotBal > 0 ? firstCurrency.spotBal : 0;
            formData['quantity'] = toFixed(userBalance * (percentage / 100), tradePair.firstFloatDigit);
            formData['total'] = toFixed(formData['quantity'] * priceValue, tradePair.secondFloatDigit);
        }
        setFormValue({ ...formValue, ...formData })
    }

    const handleSubmit = async (buyorsell) => {
        try {
            let reqData = {
                price: price,
                quantity: quantity,
                buyorsell: buyorsell,
                orderType: 'limit',
                spotPairId: tradePair.pairId,
                'newdate': new Date()
            }
            const validateError = await validation(reqData)
            if (!isEmpty(validateError)) {
                toastAlert('error', validateError[Object.keys(validateError)[0]], 'limitOrder');
                return
            }
            setLoader(true)

            let encryptToken = {
                token: encryptObject(reqData)
            }

            let { status, loading, message, error, result } = await orderPlace(encryptToken);
            setLoader(loading)
            if (status == 'success') {
                
                let formData = initialFormValue
                formData = { ...formData, ...{ 'price': marketPriceData.markPrice } }
                setFormValue(formData);
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

    useEffect(() => {
        let formData = formValue;
        if (isEmpty(initialPrice) && !isEmpty(marketPriceData)) {
            initialPrice = marketPriceData.markPrice;
            formData = { ...formData, ...{ 'price': marketPriceData.markPrice } }
            setFormValue(formData)
        }
    }, [marketPriceData, formValue])

    useEffect(() => {
        let formData = initialFormValue;
        if (!isEmpty(tradePair) && !isEmpty(marketPriceData)) {
            formData = { ...initialFormValue, ...{ 'price': marketPriceData.markPrice } }
            setFormValue(formData)
        }
    }, [tradePair])

    useEffect(() => {
        if (orderBookDetail && !isEmpty(orderBookDetail.price)) {
            console.log(orderBookDetail,'orderBookDetail')
            let total = 0
            if (!isEmpty(orderBookDetail.quantity)) {
                total = orderBookDetail.price * orderBookDetail.quantity
            }
            setFormValue((prev) => {
                return { ...prev, 'price': orderBookDetail.price,'quantity':orderBookDetail.quantity,'total':total }
            })
        }
    }, [orderBookDetail])
    let curFloat = buyorsell == 'sell' ? tradePair.firstFloatDigit : tradePair.secondFloatDigit;
    return (
        <div className="placeOrderBox contact_form">
            <ViewBalance
                buyorsell={buyorsell}
            />
            <div className="form-group">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="btnType1">{t('PRICE')}</span>
                    </div>
                    <input
                        type="text"
                        className="form-control text-right borderZero"
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
                    <input type="text"
                        className="form-control text-right borderZero"
                        name="quantity"
                        value={quantity}
                        onChange={handleChange}
                    />
                    <div className="input-group-append">
                        <span className="btnType1">{tradePair && tradePair.firstCurrencySymbol}</span>
                    </div>
                </div>
            </div>
            {/*<div className="form-group px-3">
                <Slider
                    getAriaValueText={valuetext}
                    aria-labelledby="discrete-slider-custom"
                    step={1}
                    valueLabelDisplay="auto"
                    marks={marks}
                    defaultValue={0}
                    onChange={handlePercentage}
                    disabled={!isAuth}
                />
            </div>*/}
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
                    {buyorsell == 'buy' && <button className="btn BuyNavButton" disabled={loader} onClick={() => handleSubmit('buy')}>{loader && <i className="fas fa-spinner fa-spin"></i>} {t('BUY')} {tradePair && tradePair.firstCurrencySymbol}</button>}
                    {buyorsell == 'sell' && <button className="btn SellNavButton" disabled={loader} onClick={() => handleSubmit('sell')} >{loader && <i className="fas fa-spinner fa-spin"></i>} {t('SELL')} {tradePair && tradePair.firstCurrencySymbol}</button>}
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

export default LimitOrder;