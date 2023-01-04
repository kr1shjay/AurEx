// import package
import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Button, Select, MenuItem } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

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
import {toFixed} from '../../lib/roundOf'

const initialFormValue = {
    'currencyId': '',
    'amount': '',
    'twoFACode': '',
    'bankId': '',
    'finalAmount': '',
}

const FiatWithdraw = (props) => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    // props
    const { show, assetData, currency, onHide } = props;

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

    // redux-state
    const bankDetail = useSelector(state => state.bankDetail);

    // function
    const handleClose = () => {
        setFormValue(initialFormValue)
        setValidateError({})
        onHide()
    }

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        if (!isEmpty(validateError)) {
            setValidateError({})
        }

        if (name == 'amount') {
            if (!/^\d*\.?\d*$/.test(value)) {
                return
            }
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
                handleClose()
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
                setFormValue((el) => {
                    return { ...el, 'bankId': defaultBank._id }
                })
            }
        }
    }, [bankDetail])

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{t('WITHDRAW_FIAT')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <GridContainer>
                    <GridItem xs={12} sm={12} md={6} lg={6}>
                        <div class="form-group select_lable_">
                            <label>
                            {t("WITHDRAW_ACCOUNT")}
                                {/* <Link to={'/profile'}>+ {t("ADD_BANK")}</Link> */}
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
                    <GridItem xs={12} sm={12} md={12} lg={6}>
                        <label>{t('AMOUNT')}</label>
                        <div className="form-group  ">
                            <div class="seacr_box_s">
                                <input type="text" placeholder=""
                                    name='amount'
                                    value={amount}
                                    onChange={handleChange}
                                />
                                <i class="">{assetData && assetData.coin}</i>
                            </div>
                            {validateError.amount && <p className="error-message">{t(validateError.amount)}</p>}
                        </div>
                        
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                        <div className="wallwt_balance">
                            <p>{t('WALLET_BALANCE')} <span>{assetData && assetData.spotBal} {assetData && assetData.coin}</span></p>
                        </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={6}>
                        <label>{t('FINAL_WITHDRAW_AMOUNT_WITH_FEE')}</label>
                        <div className="form-group  ">
                            <div class="seacr_box_s">
                                <input type="text" placeholder=""
                                    value={finalAmount}
                                    disabled
                                />
                                <i class="">{assetData && assetData.coin}</i>
                            </div>
                            {validateError.finalAmount && <p className="error-message">{t(validateError.finalAmount)}</p>}
                        </div>
                        
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={6}>
                        <label>{t('ENTER2FA_CODE')}</label>
                        <div className="form-group  ">
                            <div class="seacr_box_s">
                                <input type="text"
                                    placeholder=""
                                    name='twoFACode'
                                    value={twoFACode}
                                    onChange={handleChange}
                                />
                            </div>
                            {validateError.twoFACode && <p className="error-message">{t(validateError.twoFACode)}</p>}
                        </div>
                        
                    </GridItem>
                    <div className="submit_btn w-100 mx-3">
                        <Button className="w-100"
                            onClick={handleSubmit}
                            disabled={loader}
                        >
                            {loader && <i className="fas fa-spinner fa-spin"></i>}
                            {t("WITHDRAW")}
                        </Button>
                    </div>

                    <div className="notes_section">
                        <p>{t('NOTES')}</p>
                        <ul>
                            <li>1. {t('MIN_WITHDRAW_LIMIT')} {currency && toFixed(currency.minimumWithdraw,8)}</li>
                            <li>2. {t('WITHDRAW_TIME_TAKE')}</li>
                        </ul>
                    </div>
                </GridContainer>
            </Modal.Body >
        </Modal >
    )
}

export default FiatWithdraw;