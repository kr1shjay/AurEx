// import package
import React, { useState, useEffect } from 'react';
import { MenuItem, Select } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import action
import { withdrawRequestFiat } from '../../actions/walletAction';

// import lib
import isEmpty from '../../lib/isEmpty';
import { fiatValidation } from './validation'
import { toastAlert } from "../../lib/toastAlert";
import { precentConvetPrice } from '../../lib/calculation';
import { encryptObject } from '../../lib/cryptoJS'

const initialFormValue = {
    'currencyId': '',
    'amount': '',
    'twoFACode': '',
    'bankId': '',
    'finalAmount': '',
}

const FiatWithdraw = (props) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    // props
    const { assetData, currency } = props

    // redux-state
    const bankDetail = useSelector(state => state.bankDetail);

    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [bankOption, setBankOption] = useState([])
    const [validateError, setValidateError] = useState({});
    const [loader, setLoader] = useState(false)

    const {
        amount,
        twoFACode,
        bankId,
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
            currencyId: assetData._id,
            minimumWithdraw: currency.minimumWithdraw,
            coin: currency.coin,
            amount,
            bankId,
            twoFACode,
            finalAmount,
            spotBal: assetData.spotBal,
            timeStamp: new Date().getTime()
        }

        let validationError = fiatValidation(reqData, t)
        if (!isEmpty(validationError)) {
            setValidateError(validationError)
            setLoader(false)
            return
        }

        let encryptToken = {
            token: encryptObject(reqData)
        }

        try {
            const { status, loading, error, message } = await withdrawRequestFiat(encryptToken, dispatch)
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

    useEffect(() => {
        if (bankDetail && bankDetail.result && bankDetail.result.length > 0) {
            setBankOption(bankDetail.result)
            let defaultBank = bankDetail.result.find(el => el.isPrimary == true);
            if (defaultBank) {
                setFormValue({ ...formValue, ...{ 'bankId': defaultBank._id } })
            }
        }
    }, [bankDetail])

    return (
        <>
            <GridContainer>
                <GridItem xs={12} sm={12} md={6} lg={4}>
                    <div class="form-group">
                        <label>{t("WITHDRAW_AMOUNT")}</label>
                        <div class="input-group">
                            <input
                                type="text"
                                class="form-control"
                                name='amount'
                                value={amount}
                                onChange={handleChange}
                            />
                            <div class="input-group-append"><span className="btnType1">
                                {currency.coin}
                            </span></div>
                        </div>
                        {validateError.amount && <p className="error-message">{t(validateError.amount)}</p>}
                    </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={6} lg={5}>
                    <div class="form-group">
                        <label className="flexLabel">
                            <span>{t("WITHDRAW_ACCOUNT")}</span>
                            <Link to={'/profile'}>+ {t("ADD_BANK")}</Link>
                        </label>
                        <Select
                            name={"bankId"}
                            value={bankId}
                            onChange={handleChange}
                        >
                            {
                                bankOption && bankOption.length > 0 && bankOption.map((el, index) => {
                                    return (
                                        <MenuItem key={index} value={el._id}>
                                            {el.bankName}{' '}{el.accountNo}
                                        </MenuItem>
                                    )
                                })
                            }
                        </Select>
                        {validateError.bankId && <p className="error-message">{t(validateError.bankId)}</p>}
                    </div>
                </GridItem>
            </GridContainer>
            <GridContainer>
                <GridItem xs={12} sm={12} md={6} lg={4}>
                    <div class="form-group">
                        <label>{t("FINAL_WITHDRAW_AMOUNT")}</label>
                        <div class="input-group disabledGroup">
                            <input type="text"
                                class="form-control"
                                value={finalAmount} disabled />
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
                        <label>{t('ENTER_TWO_FA_CODE')}</label>
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
                            disabled={loader}
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

export default FiatWithdraw;