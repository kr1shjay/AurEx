// import package
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
    const { assetData, currency } = props

    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [validateError, setValidateError] = useState({});
    const [loader, setLoader] = useState(false)

    const { amount, image } = formValue;

    // function
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
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
        <>
            <GridContainer>
                <GridItem xs={12} sm={12} md={6} lg={4}>
                    <div class="form-group">
                        <label>{t("DEPOSIT_AMOUNT")}</label>
                        <div class="input-group">
                            <input
                                type="text"
                                class="form-control"
                                name="amount"
                                value={amount}
                                onChange={handleChange}
                            />
                            <div class="input-group-append">
                                <span className="btnType1">{assetData.currencySymbol}</span>
                            </div>
                        </div>
                        {validateError.amount && <p className="error-message text-left">{t(validateError.amount)}</p>}
                    </div>
                    <div className="form-group">
                        <label>{t("UPLOAD_PROOF")}</label>
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
                    </div>
                    <div className="form-group mb-0 mt-2">
                        <button
                            className="btn btn-primary text-uppercase py-2 m-0 w-100"
                            onClick={handleSubmit}
                            disabled={loader}
                        >
                            {loader && <i class="fas fa-spinner fa-spin"></i>}
                            {t("DEPOSIT")}
                        </button>
                    </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={6} lg={6}>
                    <div className="adminAccountCard">
                        <div className="form-group">
                            <label>{t("ADMIN_ACCOUNT")}</label>
                            <div className="adminAccountDetails">
                                <ul>
                                    <li><span className="aaLabel">{t("BANK_NAME")}</span> {currency.bankDetails && currency.bankDetails.bankName} </li>
                                    <li><span className="aaLabel">{t("NAME")}</span> {currency.bankDetails && currency.bankDetails.holderName}</li>
                                    <li><span className="aaLabel">{t("ACCOUNT_NO")}</span> {currency.bankDetails && currency.bankDetails.accountNo}</li>
                                    <li><span className="aaLabel">{t("IBAN_CODE")}</span> {currency.bankDetails && currency.bankDetails.bankcode}</li>
                                    <li><span className="aaLabel">{t("COUNTRY")}</span> {currency.bankDetails && currency.bankDetails.country}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="settingsNote">
                        <h6 className="m-0">{t("NOTES")}</h6>
                        <ul>
                            {/* <li>- {t("FIAT_DEPOSIT_DESCRIPTION1")}</li> */}
                            <li>- {t("FIAT_DEPOSIT_DESCRIPTION2")}</li>
                        </ul>
                    </div>
                </GridItem>
            </GridContainer>
        </>
    )
}

export default FiatDeposit;