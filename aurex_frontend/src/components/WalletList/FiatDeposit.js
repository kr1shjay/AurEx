// import package
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Button } from '@material-ui/core';

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import action
import { fiatDepositRequest } from '../../actions/walletAction';

// import lib
import { toastAlert } from '../../lib/toastAlert';
import isEmpty from '../../lib/isEmpty';
import { fiatDepositValidation } from './validation';

const initialFormValue = {
    'amount': '',
    'image': null,
}

const FiatDeposit = (props) => {
    const { t, i18n } = useTranslation();

    // props
    const { show, assetData, currency, onHide } = props;

    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [validateError, setValidateError] = useState({});
    const [loader, setLoader] = useState(false)

    const { amount, image } = formValue;

    // function
    const handleClose = () => {
        setFormValue(initialFormValue)
        setValidateError({})
        onHide()
    }

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;

        if (!/^\d*\.?\d*$/.test(value)) {
            return
        }
        let formData = { ...formValue, ...{ [name]: value } }
        setFormValue(formData)
        if (!isEmpty(validateError)) {
            setValidateError({})
        }
    }

    const handleFile = async (e) => {
        const { name, files } = e.target;
        let formData = { ...formValue, ...{ [name]: files[0] } }
        setFormValue(formData)
        if (!isEmpty(validateError)) {
            setValidateError({})
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true)
        let reqData = {
            "userAssetId": assetData._id,
            // "minimumDeposit": assetData.currency.minimumDeposit,
            amount,
            image,
        }

        let validationError = fiatDepositValidation(reqData)
        if (!isEmpty(validationError)) {
            setValidateError(validationError)
            setLoader(false)
            return
        }
        try {
            const formData = new FormData();
            formData.append('userAssetId', assetData._id);
            formData.append('amount', amount);
            formData.append('image', image);

            const { status, loading, message, error } = await fiatDepositRequest(formData);
            setLoader(loading)
            if (status == 'success') {
                setFormValue(initialFormValue)
                handleClose()
                toastAlert('success', t(message), 'fiatDeposit')
            } else {
                if (error) {
                    setValidateError(error)
                }
                toastAlert('error', t(message), 'fiatDeposit')
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
                <Modal.Title>{t('FIAT_DEPOSIT')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <GridContainer>
                    {/* <GridItem xs={12} sm={12} md={12} lg={5}>
                        <div className="form-group select_lable_ ">
                            <label>Deposit Currency</label>
                            <Select
                                name="type"
                                label="Locked"
                            >
                                <MenuItem value="">
                                    <em>Locked</em>
                                </MenuItem>
                                <MenuItem value={1}>MANA</MenuItem>
                                <MenuItem value={2}>BTC</MenuItem>
                                <MenuItem value={3}>ETH</MenuItem>
                                <MenuItem value={4}>XRB</MenuItem>
                            </Select>
                        </div>
                    </GridItem> */}
                    <GridItem xs={12} sm={12} md={12} lg={6}>
                        <label>{t('AMOUNT')}</label>
                        <div className="form-group  ">
                            <div class="seacr_box_s padd_right_input">
                                <input type="text" placeholder=""
                                    name="amount"
                                    value={amount}
                                    onChange={handleChange}
                                />
                                <i class="">{assetData && assetData.coin}</i>
                            </div>
                        </div>
                        {validateError.amount && <p className="error-message text-left">{t(validateError.amount)}</p>}
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                        <label>{t('DEPOSIT_BANK_INFO')}</label>
                        <div className="wallwt_balance wallwt_balance_deposit">
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={12} lg={6}>
                                    <div className="wallet_balance_div">
                                        <p>{t('BANK_NAME')}</p>
                                        <span>{currency && currency.bankDetails && currency.bankDetails.bankName}</span>
                                    </div>
                                    <div className="wallet_balance_div">
                                        <p>{t('ACCOUNT_NUMBER')}</p>
                                        <span>{currency && currency.bankDetails && currency.bankDetails.accountNo}</span>                                        
                                    </div>
                                    <div className="wallet_balance_div">
                                        <p>{t('ACCOUNT_HOLDER_NAME')}</p>
                                        <span className="holder_name">{currency && currency.bankDetails && currency.bankDetails.holderName}</span>
                                    </div>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={12} lg={6}>
                                    <div className="wallet_balance_div">
                                        <p>{t('IBAN_SWIF')}</p>
                                        <span>{currency && currency.bankDetails && currency.bankDetails.bankcode}</span>
                                    </div>
                                    {/* <p>Bank City <span>New Delhi</span></p> */}
                                    <div className="wallet_balance_div">
                                        <p>{t('COUNTRY')}</p>
                                        <span>{currency && currency.bankDetails && currency.bankDetails.country}</span>
                                    </div>
                                </GridItem>
                            </GridContainer>

                        </div>
                    </GridItem>
                    {/*  <GridItem xs={12} sm={12} md={12} lg={6}>
                        <label>Deposit Reference</label>
                        <div className="form-group  ">
                            <div class="seacr_box_s">
                                <input type="text" placeholder="" />
                                <i class="">USD</i>
                            </div>
                        </div>
                    </GridItem> */}
                    <GridItem xs={12} sm={12} md={12} lg={6}>
                        <label>{t('UPLOAD_PROOF')}</label>
                        <div className="custom-file">
                            <input
                                type="file"
                                className="custom-file-input"
                                aria-describedby="inputGroupFileAddon01"
                                name="image"
                                onChange={handleFile}
                                onClick={(event) => {
                                    event.target.value = null
                                }}
                            />
                            <label className="custom-file-label">
                                {
                                    image && image.name ? <small>{image.name}</small> : <small>{t("MAX_1MB_IMG")}</small>
                                }
                            </label>
                        </div>
                        {
                            validateError.image && <p className="error-message">{t(validateError.image)}</p>
                        }

                    </GridItem>
                    <GridItem md={12}>
                    <div className="submit_btn w-100 mt-3">
                        <Button className="w-100"
                            onClick={handleSubmit}
                            disabled={loader}
                        >
                            {loader && <i class="fas fa-spinner fa-spin"></i>}
                            {t('DEPOSIT')}
                        </Button>
                    </div>
                    </GridItem>
                    <GridItem md={12}>
                    <div className="notes_section px-0">
                        <p>{t('NOTES')}</p>
                        <ul>
                            {/* <li>1.{t('MIN_DEPOSIT_LIMIT')} $10</li> */}
                            <li>1.{t('DEPOSIT_TIME')}</li>
                        </ul>
                    </div>
                    </GridItem>
                </GridContainer>
            </Modal.Body>
        </Modal>
    )
}
export default FiatDeposit;