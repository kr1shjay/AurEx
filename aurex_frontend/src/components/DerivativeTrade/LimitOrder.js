// import package
import React, { useState } from 'react';
import {
    Slider,
    Checkbox,
    Radio,
    RadioGroup,
    FormControlLabel
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom'

// import action
import { orderPlace } from '../../actions/perpetualTradeAction';

// import component
import ViewBalance from './ViewBalance'

// import lib
import isEmpty from '../../lib/isEmpty';
import { encryptObject } from '../../lib/cryptoJS'
import { toastAlert } from '../../lib/toastAlert';
import { toFixed } from '../../lib/roundOf';
import { inverseOrderCost, orderValue } from '../../lib/bybit';

const marks = [
    {
        value: 1,
        label: '1%',
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
    'price': "",
    'quantity': '',
    'total': '',
    'leverage': 1,
    'buyOrderCost': '0',
    'buyOrderValue': '0',
    'sellOrderCost': '0',
    'sellOrderValue': '0',
    'takeProfitPrice': '',
    'stopLossPrice': '',
    'isProfitLoss': false,
    'typeTIF': 'GTC',
}

const LimitOrder = (props) => {
    const { t, i18n } = useTranslation();
    const history = useHistory();

    // props
    const { buyorsell } = props;

    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [sellLoader, setSellLoader] = useState(false)
    const [buyLoader, setBuyLoader] = useState(false)

    const { price, quantity, total, leverage, buyOrderCost, buyOrderValue, sellOrderCost, sellOrderValue, takeProfitPrice, stopLossPrice, isProfitLoss, typeTIF } = formValue;

    // redux-state
    const tradePair = useSelector(state => state.tradePair);
    const marketPriceData = useSelector(state => state.marketPrice);
    const { isAuth } = useSelector(state => state.auth);
    const { firstCurrency, secondCurrency } = useSelector(state => state.tradeAsset);

    // function
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;

        if (!['typeTIF'].includes(name) && !/^\d*\.?\d*$/.test(value)) {
            return
        }
        let formData = { ...formValue, ...{ [name]: value } }

        setFormValue(formData)
        calculateOrderCost(formData.price, formData.quantity, formData.leverage, formData)
    }

    const calculateOrderCost = (price, quantity, leverage) => {
        if (!isEmpty(price) && !isEmpty(quantity) && !isEmpty(leverage) && !isEmpty(tradePair)) {
            setFormValue((el) => {
                return {
                    ...el,
                    'leverage': leverage,
                    'buyOrderCost': inverseOrderCost({
                        price,
                        quantity,
                        leverage,
                        takerFee: tradePair.taker_fees,
                        buyorsell: 'buy'
                    }),
                    'buyOrderValue': orderValue({
                        price,
                        quantity
                    }),
                    'sellOrderCost': inverseOrderCost({
                        price,
                        quantity,
                        leverage,
                        takerFee: tradePair.taker_fees,
                        buyorsell: 'sell'
                    }),
                    'sellOrderValue': orderValue({
                        price,
                        quantity
                    }),
                }
            })
        }
    }

    const handlePercentage = (e, percentage) => {
        calculateOrderCost(price, quantity, percentage, formValue)
    }

    const handleProfitLossCheck = (e) => {
        e.preventDefault();
        const { name, checked } = e.target;
        setFormValue({ ...formValue, [name]: checked })
    }

    const handleSubmit = async (buyorsell) => {
        try {
            // const validateError = await validation(formValue, orderType, buyorsell)
            // if (!isEmpty(validateError)) {
            //     toastAlert('error', validateError[Object.keys(validateError)[0]], 'spotOrder');
            //     return
            // }
            let reqData = {
                price: price,
                quantity: quantity,
                buyorsell: buyorsell,
                orderType: 'limit',
                pairId: tradePair.pairId,
                leverage: leverage,
                typeTIF: typeTIF,
                takeProfitPrice,
                stopLossPrice,
                isProfitLoss,
                'newdate': new Date()
            }

            let encryptToken = {
                token: encryptObject(reqData)
            }

            let { status, loading, message, error, result } = await orderPlace(encryptToken);
            if (buyorsell == 'buy') {
                setBuyLoader(loading)
            } else if (buyorsell == 'sell') {
                setSellLoader(loading)
            }

            if (status == 'success') {
                setFormValue(initialFormValue);
                toastAlert('success', message, 'spotOrder');
            } else {
                toastAlert('error', message, 'spotOrder');
            }
        }
        catch (err) { }
    }

    let isDisabled = false;
    if (buyLoader || sellLoader) {
        isDisabled = true
    }

    return (
        <div className="placeOrderBox contact_form settingsSelect">
            <div className="flexTitle">
                <ViewBalance />

                <a href="#" className="exchangeIcon"><i class="fas fa-exchange-alt"></i></a>
            </div>
            <div className="form-group">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="btnType1">{t("PRICE")}</span>
                    </div>
                    <input
                        type="text"
                        class="form-control text-right borderZero"
                        name="price"
                        value={price}
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
                        <span class="btnType1">{t('SIZE')}</span>
                    </div>
                    <input
                        type="text"
                        class="form-control text-right borderZero"
                        name="quantity"
                        value={quantity}
                        onChange={handleChange}
                    />
                    <div class="input-group-append">
                        <span class="btnType1">{tradePair && tradePair.secondCurrencySymbol}</span>
                    </div>
                </div>
            </div>
            <div className="form-group px-2 mb-0">
                <Slider
                    getAriaValueText={valuetext}
                    aria-labelledby="discrete-slider-custom"
                    step={1}
                    valueLabelDisplay="auto"
                    marks={marks}
                    value={leverage}
                    onChange={handlePercentage}
                    min={1}
                    disabled={!isAuth}
                />
            </div>
            <div className="form-group">
                {/* <div className="form-check mb-0"> */}
                <Checkbox
                    color="primary"
                    className="pl-0"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                    onChange={handleProfitLossCheck}
                    name="isProfitLoss"
                    checked={isProfitLoss}
                />
                <label className="form-check-label pl-0" for="flexCheckDefault">
                    TP/SL
                </label>
                {/* </div> */}
            </div>

            {
                isProfitLoss && <div className="form-group">
                    <div class="input-group">
                        <input
                            type="text"
                            class="form-control"
                            name="takeProfitPrice"
                            value={takeProfitPrice}
                            placeholder={t('TAKER_PRICE')}
                            onChange={handleChange}
                        />
                        <div class="input-group-append">
                            {/* <Select value={10}>
                                <MenuItem value={10}>Mark</MenuItem>
                                <MenuItem value={20}>Limit</MenuItem>
                                <MenuItem value={30}>Stop</MenuItem>
                            </Select> */}
                        </div>
                    </div>
                </div>
            }

            {
                isProfitLoss && <div className="form-group">
                    <div class="input-group">
                        <input
                            type="text"
                            class="form-control"
                            name="stopLossPrice"
                            value={stopLossPrice}
                            placeholder={t('STOP_LOSS')}
                            onChange={handleChange}
                        />
                        <div class="input-group-append">
                            {/* <Select value={10}>
                                <MenuItem value={10}>Mark</MenuItem>
                                <MenuItem value={20}>Limit</MenuItem>
                                <MenuItem value={30}>Stop</MenuItem>
                            </Select> */}
                        </div>
                    </div>
                </div>
            }


            <RadioGroup aria-label="type"
                className="radioGroup"
                name="typeTIF"
                value={typeTIF}
                onChange={handleChange}
            >
                <FormControlLabel className="orderRadio" value="GTC" control={<Radio />} label={t('GTC')} />
                <FormControlLabel className="orderRadio" value="IOC" control={<Radio />} label={t('IOC')} />
                <FormControlLabel className="orderRadio" value="FOK" control={<Radio />} label={t('FOK')} />
            </RadioGroup>

            {
                isAuth && <div className="ButtonFullWidth">
                    <button
                        className="btn BuyNavButton"
                        onClick={() => {
                            setBuyLoader(true)
                            handleSubmit('buy')
                        }}
                        disabled={isDisabled}
                    >
                        {buyLoader && <i class="fas fa-spinner fa-spin"></i>}
                        {t('LONG')}
                    </button>
                    <button
                        className="btn SellNavButton"
                        onClick={() => {
                            setSellLoader(true)
                            handleSubmit('sell')
                        }}
                        disabled={isDisabled}
                    >
                        {sellLoader && <i class="fas fa-spinner fa-spin"></i>}
                        {t('SHORT')}
                    </button>
                </div>
            }

            {
                !isAuth && <div className="ButtonFullWidth px-0">
                    <button className="btn BuyNavButton" onClick={() => history.push('/login')}>{t('LOGIN')}</button>
                </div>
            }

            <ul className="poList">
                <li>
                    <label><small>{t('VALUE')}</small> {toFixed(buyOrderValue, tradePair.firstFloatDigit)} {tradePair && tradePair.firstCurrencySymbol}</label>
                    <span><small>{t('VALUE')}</small> {toFixed(sellOrderValue, tradePair.firstFloatDigit)} {tradePair && tradePair.firstCurrencySymbol}</span>
                </li>

                <li>
                    <label><small>{t('COST')}</small> {toFixed(buyOrderCost, tradePair.firstFloatDigit)} {tradePair && tradePair.firstCurrencySymbol}</label>
                    <span><small>{t('COST')}</small> {toFixed(sellOrderCost, tradePair.firstFloatDigit)} {tradePair && tradePair.firstCurrencySymbol}</span>
                </li>
                {/* <li><label><small>Max</small> 0.0000 USDT</label> <span><small>Max</small> 0.0000 USDT</span></li> */}

            </ul>
            {/* <div className="poContentFlex">
                <h2>Margin Ratio<span>0.00%</span></h2>
                <div className="pocfRight">
                    <p><small>Maintenance Margin</small> 0.0000 USDT</p>
                    <p><small>Margin Balance</small> 0.0000 USDT</p>
                </div>
            </div> */}
        </div>
    )
}

export default LimitOrder;