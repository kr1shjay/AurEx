// import package
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { MenuItem, Select, Button } from '@material-ui/core';

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import action
import { fundTransfer, getAssetData } from '../../actions/walletAction';

// import lib
import { toastAlert } from '../../lib/toastAlert';
import isEmpty from '../../lib/isEmpty';
import { fundValidation } from './validation';
import { precentConvetPrice } from '../../lib/calculation';

const initialFormValue = {
    'amount': '',
    'toUserEmail': '',
    'twoFACode': '',
    'currencyId': '',
    'finalAmount': ''
}

const FundTransfer = (props) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    // props
    const { show, assetData, onHide, currency } = props;

    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [validateError, setValidateError] = useState({});
    const [loader, setLoader] = useState();

    const { amount, toUserEmail, twoFACode, finalAmount } = formValue;

    // function
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;

        if (name == 'amount') {
            let finalAmountBal = parseFloat(value) + precentConvetPrice(value, currency.fundFee);
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
        if (!isEmpty(validateError)) {
            setValidateError({})
        }
    }

    const handleClose = () => {
        setFormValue(initialFormValue)
        onHide()
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true)
        let reqData = {
            currencyId: assetData._id,
            amount,
            toUserEmail,
            twoFACode
        }

        let validationError = fundValidation(reqData)
        if (!isEmpty(validationError)) {
            setValidateError(validationError)
            setLoader(false)
            return
        }

        try {
            const { status, loading, message, error } = await fundTransfer(reqData);
            setLoader(loading)
            if (status == 'success') {
                handleClose()
                getAssetData(dispatch)
                // setFormValue(initialFormValue)
                toastAlert('success', t(message), 'fundTransfer')
            } else {
                if (error) {
                    setValidateError(error)
                    return
                }
                toastAlert('error', t(message), 'fundTransfer')
            }
        } catch (err) { }
    }

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{t('FUND_TRANSFER')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12} lg={6}>
                        <label>{t('AMOUNT')}</label>
                        <div className="form-group  ">
                            <div class="seacr_box_s">
                                <input
                                    type="text"
                                    class="form-control"
                                    name='amount'
                                    value={amount}
                                    onChange={handleChange}
                                />
                                <i class="">{assetData && assetData.coin}</i>
                            </div>
                            {validateError.amount && <p className="error-message">{t(validateError.amount)}</p>}
                        </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={6}>
                        <label>{t('RECEIVER_EMAIL')}</label>
                        <div className="form-group  ">
                            <div class="seacr_box_s">
                                <input
                                    type="text"
                                    class="form-control"
                                    name='toUserEmail'
                                    value={toUserEmail}
                                    onChange={handleChange}
                                />
                            </div>
                            {validateError.toUserEmail && <p className="error-message">{t(validateError.toUserEmail)}</p>}
                        </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={6}>
                        <label>{t('FINAL_WITHDRAW_AMOUNT')}</label>
                        <div className="form-group  ">
                            <div class="seacr_box_s">
                                <input type="text" placeholder="" value={finalAmount} disabled />
                                <i class="">{assetData.coin}</i>
                            </div>
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
                        </div>
                        {validateError.twoFACode && <p className="error-message">{t(validateError.twoFACode)}</p>}
                    </GridItem>

                    <GridItem md={12}>
                        <div className="submit_btn w-100">
                            <Button className="w-100" onClick={handleSubmit} disabled={loader}>
                                {loader && <i class="fas fa-spinner fa-spin"></i>}Transfer
                            </Button>
                        </div>
                    </GridItem>

                </GridContainer>
            </Modal.Body>
        </Modal>
    )
}

export default FundTransfer;