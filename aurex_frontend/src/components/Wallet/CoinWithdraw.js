// import package
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import action
import { withdrawRequestCoin } from '../../actions/walletAction';

// import lib
import isEmpty from '../../lib/isEmpty';
import { coinValidation } from './validation'
import { toastAlert } from "../../lib/toastAlert";
import { precentConvetPrice } from '../../lib/calculation';
import { encryptObject } from '../../lib/cryptoJS'

const initialFormValue = {
    'currencyId': '',
    'amount': '',
    'receiverAddress': '',
    'password': '',
    'twoFACode': '',
    'finalAmount': ''
}

const CoinWithdraw = (props) => {
    const { t, i18n } = useTranslation();

    // props
    const { assetData, currency } = props;

    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [validateError, setValidateError] = useState({});
    const [loader, setLoader] = useState(false)

    const {
        currencyId,
        amount,
        receiverAddress,
        password,
        twoFACode,
        finalAmount
    } = formValue;

    // function

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        if (!isEmpty(validateError)) {
            setValidateError({})
        }

        if (name == 'amount') {
            let finalAmountBal = parseFloat(value) + precentConvetPrice(value, currency.withdrawFee);
            let formData = { ...formValue, ...{ [name]: value, 'finalAmount': finalAmountBal } }
            setFormValue(formData)
            return
        }

        if (name == 'twoFACode') {
            if (!(value == '' || (/^[0-9\b]+$/.test(value) && value.length <= 6))) {
                return
            }
        }
        let formData = { ...formValue, ...{ [name]: value } }
        setFormValue(formData)
    }

    const handleSubmit = async () => {
        setLoader(true)
        let reqData = {
            currencyId: currency._id,
            coin: currency.coin,
            tokenType: currency.tokenType,
            minimumWithdraw: currency.minimumWithdraw,
            amount,
            receiverAddress,
            twoFACode,
            finalAmount,
            spotBal: assetData.spotBal
        }

        let validationError = coinValidation(reqData,t)
        if (!isEmpty(validationError)) {
            setValidateError(validationError)
            setLoader(false)
            return
        }

        let encryptToken = {
            token: encryptObject(reqData)
        }

        try {
            const { status, loading, error, message } = await withdrawRequestCoin(encryptToken)
            setLoader(loading)
            if (status == 'success') {
                setFormValue(initialFormValue)
                toastAlert('success', t(message), 'withdraw');
            } else {
                if (error) {
                    setValidateError(error)
                    return
                }
                toastAlert('error', t(message), 'withdraw');
            }
        }
        catch (err) { }
    }

    return (
        <>
            <GridContainer>
                <GridItem xs={12} sm={12} md={6} lg={4}>
                    <div class="form-group">
                        <label>{t("WITHDRAW_AMOUNT")}</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name='amount'
                                value={amount}
                                onChange={handleChange}
                            />
                            <div class="input-group-append">
                                <span className="btnType1">
                                    {currency.coin}
                                </span>
                            </div>
                        </div>
                        {validateError.amount && <p className="error-message">{t(validateError.amount)}</p>}
                    </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={6} lg={5}>
                    <div class="form-group">
                        <label>{t("WITHDRAW_ADDRESS")}</label>
                        <input type="text" className="form-control"
                            name='receiverAddress'
                            value={receiverAddress}
                            onChange={handleChange}
                        />
                        {validateError.receiverAddress && <p className="error-message">{t(validateError.receiverAddress)}</p>}
                    </div>
                </GridItem>
            </GridContainer>
            <GridContainer>
                <GridItem xs={12} sm={12} md={6} lg={4}>
                    <div class="form-group">
                        <label>{t("FINAL_WITHDRAW_AMOUNT")}</label>
                        <div class="input-group disabledGroup">
                            <input type="text" class="form-control" value={finalAmount} disabled />
                            <div class="input-group-append">
                                <span className="btnType1">
                                    {currency.coin}
                                </span>
                            </div>
                        </div>
                        {validateError.finalAmount && <p className="error-message">{t(validateError.finalAmount)}</p>}
                    </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={6} lg={4}>
                    <div class="form-group">
                        <label>{t("ENTER_TWO_FA_CODE")}</label>
                        <input
                            type="text"
                            className="form-control"
                            name='twoFACode'
                            value={twoFACode}
                            onChange={handleChange}
                        />
                        {validateError.twoFACode && <p className="error-message">{t(validateError.twoFACode)}</p>}
                    </div>
                </GridItem>
            </GridContainer>
            <GridContainer>
                <GridItem xs={12} sm={12} md={6} lg={4}>
                    <div className="form-group mb-0 mt-2">
                        <button
                            className="btn btn-primary text-uppercase py-2 m-0 w-100"
                            onClick={handleSubmit}
                        >
                            {loader && <i className="fas fa-spinner fa-spin"></i>}
                            {t("WITHDRAW")}
                        </button>
                    </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={6} lg={8}>
                    <div class="settingsNote">
                        <h6 className="m-0">{t("NOTES")}</h6>
                        <ul>
                            <li>- {t("FIAT_WITHDRAW_DESCRIPTION1")}: {currency.minimumWithdraw}{currency.coin}</li>
                            <li>- {t("FIAT_WITHDRAW_DESCRIPTION2")}</li>
                        </ul>
                    </div>
                </GridItem>
            </GridContainer>
        </>
    )
}

export default CoinWithdraw;