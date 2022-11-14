// import package
import React, { useState, useEffect } from 'react';
import { Button } from "@material-ui/core";
import clsx from 'classnames'
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import BuyConfirm from './BuyConfirm';

// import action
import { purchaseToken, addListPurchase } from '../../actions/launchpad'
import { updateWallet } from '../../actions/walletAction'

// import lib
import isEmpty from '../../lib/isEmpty';
import { toastAlert } from '../../lib/toastAlert';
import validation from './validation';
import { withoutServiceFee } from '../../lib/calculation'
import { toFixed } from "../../lib/roundOf"
const marks = [
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

const initialFormValue = {
    'price': '',
    'quantity': '',
    'coin': '',
    'total': '',
}
let decimalETH;
let decimalUSDT;

const BuyToken = (props) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

   const [shows, buyShow] = useState(false); 

    // props
    const { data, setData } = props;

    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [asset, setAsset] = useState({})
    const [loader, setLoader] = useState(false);

    const { price, quantity, coin, total } = formValue;

    // redux-state
    const walletData = useSelector(state => state.wallet);
    const priceConversion = useSelector(state => state.priceConversion)
    const currency = useSelector(state => state.currency)

    // function

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        if (!/^\d*\.?\d*$/.test(value)) {
            return
        }
        let formData = { ...formValue, [name]: value }
        calculation(formData.price, formData.quantity, formData.coin, 'quantity')
    }

    const handleAsset = (coin) => {
        if (!isEmpty(walletData)) {
            let assetData = walletData.find(el => el.coin == coin);
            if (assetData) {
                setAsset(assetData)
            }
        }
    }

    const calculation = (price, quantity, coin, type = 'price') => {
        console.log("calculation : ",priceConversion)
        if (type == 'price' && !isEmpty(priceConversion)) {
            let conversionData = priceConversion.find(el => el.baseSymbol == coin && el.convertSymbol == data.launchCoin);
            if (conversionData) {
                price = price / conversionData.convertPrice
                let formData = {
                    ...formValue,
                    "price": price,
                    "quantity": quantity,
                    "coin": coin,
                    "total": price * quantity,
                }

                if (!isEmpty(data.discount) && !isNaN(data.discount) && data.discount > 0) {
                    formData['total'] = withoutServiceFee({
                        'price': formData['total'],
                        'serviceFee': data.discount
                    })
                }
                setFormValue(formData)
            }
        } else if (type == 'quantity' && !isEmpty(price)) {
            let formData = {
                ...formValue,
                "quantity": quantity,
                "coin": coin,
                "total": price * quantity,
            }

            if (!isEmpty(data.discount) && !isNaN(data.discount) && data.discount > 0) {
                formData['total'] = withoutServiceFee({
                    'price': formData['total'],
                    'serviceFee': data.discount
                })
            }
            setFormValue(formData)
        }
    }

    const handlePercentage = (percentage) => {
        if (asset) {
            let formData = { ...formValue }
            if (!isEmpty(formData.price) && !isNaN(formData.price)) {
                let userBalance = asset.spotBal > 0 ? asset.spotBal : 0;
                formData['total'] = userBalance * (percentage / 100);
                formData['quantity'] = formData['total'] / formData['price'];
                setFormValue(formData)
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let reqData = {
                'quantity': quantity,
                'currencyId': asset._id,
                'launchId': data._id
            }
            const validateError = validation({
                ...reqData,
                'price': price,
                'minAmount': data.minAmount,
                'spotBal': asset.spotBal,
                'total': toFixed(total, decimalETH != '' ? decimalETH : 0)
            }, t)

            if (!isEmpty(validateError)) {
                toastAlert('error', validateError[Object.keys(validateError)[0]], 'limitOrder');
                return
            }
            setLoader(true)
            const { status, loading, message, result } = await purchaseToken(reqData);
            setLoader(loading)
            if (status == 'success') {
                toastAlert('success', t(message))
                setData({ ...data, ...result.tokenDetail })
                calculation(data.launchPrice, data.minAmount, data.availableCoin[0], 'price')
                updateWallet(dispatch, result.wallet, 'launchpad')
                addListPurchase(dispatch, result.purchaseToken)
            } else {
                toastAlert('error', t(message))
            }

        } catch (err) {
        }
    }

    useEffect(() => {
        handleAsset(data.availableCoin[0])
    }, [walletData])

    useEffect(() => {
        calculation(data.launchPrice, data.minAmount, data.availableCoin[0], 'price')
        currency && currency.length > 0 && currency.map(item => {
            if (item.symbol == 'ETH') {
                return decimalETH = item.decimal
            }
            if (item.symbol == 'USDT') {
                return decimalUSDT = item.decimal
            }

        })
    }, [priceConversion])
    return (
        <div className="contact_form form_append_grey">
            <ul className="choose_coin_list">
                {
                    data.availableCoin && data.availableCoin.length > 0 && data.availableCoin.map((item, key) => {
                        return (
                            <li>
                                <a
                                    href="#"
                                    className={clsx({ 'active': coin == item })}
                                    onClick={() => {
                                        let formData = {
                                            ...initialFormValue,
                                            "price": data.launchPrice,
                                            "quantity": data.minAmount,
                                            "coin": item
                                        }
                                        handleAsset(formData.coin)
                                        calculation(formData.price, formData.quantity, formData.coin, 'price')
                                    }}
                                >
                                    {item}
                                </a>
                            </li>
                        )
                    })
                }
            </ul>
            <div className="form-group mt-5">
                <label>Price</label>
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="0.00"
                        name="price"
                        value={price && parseFloat(price).toFixed(3) <= parseFloat(0) ? parseFloat(price).toFixed(8) : parseFloat(price).toFixed(3)}
                        disabled={true}
                    />
                    <div className="input-group-append"> <span className="input-group-text">{coin}</span></div>
                </div>
                <div className="btnGroupPercent">
                    {
                        marks && marks.length > 0 && marks.map((item, key) => {
                            return (
                                <Button key={key}
                                    className="btn btn-primary mb-2"
                                    onClick={() => handlePercentage(item.value)}
                                >
                                    {item.label}
                                </Button>
                            )
                        })
                    }
                </div>
            </div>
            <div className="form-group">
                <label>Amount</label>
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="0.00"
                        name="quantity"
                        value={quantity && parseFloat(quantity).toFixed(3) <= parseFloat(0) ? parseFloat(quantity).toFixed(8) : parseFloat(quantity).toFixed(3)}
                        onChange={handleChange}
                    />
                    <div className="input-group-append"> <span className="input-group-text">{data.coin}</span></div>
                </div>
            </div>
            <div className="form-group">
                <label>Total</label>
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="0.00"
                        value={total && parseFloat(total).toFixed(3) <= parseFloat(0) ? parseFloat(total).toFixed(8) : parseFloat(total).toFixed(3)}

                    />
                    <div className="input-group-append"> <span className="input-group-text">{coin}</span></div>
                </div>
            </div>
            <div className="form-group">
                <label>Balance : <span>{asset.spotBal}</span></label>
            </div>
            {
                data.dateStatus == 'active' && <div className="text-left">
                    {/* <Button
                        className="btn btn-primary mb-3 px-4"
                        onClick={handleSubmit}
                        disabled={loader}
                    >
                        {loader && <i class="fas fa-spinner fa-spin"></i>}
                        Buy Token
                    </Button> */}  {shows && <BuyConfirm total={total} coin={coin} onSumbit={handleSubmit} onDismiss = {() => buyShow(false) }/>}
                    <Button className="btn btn-primary mb-3 px-4" onClick={()=>buyShow(true)}>Buy {data.symbol}</Button>
                 
                                    </div>
            }

        </div>
    )
}

export default BuyToken;