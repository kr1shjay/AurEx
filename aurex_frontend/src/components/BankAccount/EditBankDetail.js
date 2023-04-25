// import package
import React, { useState, useEffect } from "react";
import clsx from 'classnames';
import { MenuItem, Select } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { CountryDropdown } from 'react-country-region-selector';
import { useSelector, useDispatch } from 'react-redux';

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import action
import { updateBankDetail } from '../../actions/users';

// import lib
import validation from './validation';
import isEmpty from '../../lib/isEmpty';
import { toastAlert } from '../../lib/toastAlert';

const initialFormValue = {
    'key': 0,
    'bankId': '',
    'bankName': '',
    'accountNo': '',
    'holderName': '',
    'bankcode': '',
    'country': '',
    'bankAddress': '',
    'city': '',
    'isPrimary': '',
    'currencyId': ' ',
    'currencySymbol': ''
}

const EditBankDetail = (props) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [validateError, setValidateError] = useState({});
    const [loader, setLoader] = useState();

    const { key, bankId, bankName, accountNo, holderName, bankcode, country, city, currencyId, currencySymbol, bankAddress } = formValue;

    // redux-state
    const { formDisable, formType, editRecord } = useSelector(state => state.bankDetail);
    const currencyOption = useSelector(state => state.currency)

    // function
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        if (name == "bankName" || name == "holderName" || name == "city") {
            if (/[^a-zA-Z]/.test(value)) return
        }
        if (name == "accountNo") {
            if (/[^0-9]/.test(value)) return
        }
        if (name == "bankcode") {
            if (/[^a-zA-Z0-9]/.test(value)) return
        }

        let formData = { ...formValue, ...{ [name]: value } }
        setFormValue(formData)
        if (!isEmpty(validateError)) {
            setValidateError({})
        }
    }

    const handleSelect = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let findCurrency = currencyOption.find((el => el.type == 'fiat' && el._id == value))
        if (findCurrency) {
            let formData = {
                ...formValue,
                [name]: value,
                currencySymbol: findCurrency.coin
            }
            setFormValue(formData)
            if (!isEmpty(validateError)) {
                setValidateError({})
            }
        }
    }

    const handleCountry = (value) => {
        let formData = { ...formValue, ...{ 'country': value } }
        setFormValue(formData)
        if (!isEmpty(validateError)) {
            setValidateError({})
        }
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoader(true)
        let reqData = {
            bankId,
            bankName,
            accountNo,
            holderName,
            bankcode,
            country,
            city,
            bankAddress,
            currencyId,
        }
        let validationError = validation(reqData)
        if (!isEmpty(validationError)) {
            setValidateError(validationError)
            setLoader(false)
            return
        }

        try {
            let { status, loading, error, message } = await updateBankDetail(reqData, dispatch);
            setLoader(loading)
            if (status == 'success') {
                toastAlert('success', t(message), 'bankForm')
                setFormValue(initialFormValue);
            } else {
                if (error) {
                    setValidateError(error);
                    return
                }
                toastAlert('error', t(message), 'bankForm')
            }
        } catch (err) { }
    }

    useEffect(() => {
        if (formType == 'edit') {
            let formData = {
                'key': editRecord.key,
                'bankId': editRecord._id,
                'bankName': editRecord.bankName,
                'accountNo': editRecord.accountNo,
                'holderName': editRecord.holderName,
                'bankcode': editRecord.bankcode,
                'country': editRecord.country,
                'city': editRecord.city,
                'bankAddress': editRecord.bankAddress,
                'currencyId': editRecord.currencyId,
                'currencySymbol': editRecord.currencySymbol,
                'isPrimary': editRecord.isPrimary
            }
            setFormValue(formData)
        } else if (formType == 'add' && currencyOption && currencyOption.length > 0) {
            let findCurrency = currencyOption.find((el => el.type == 'fiat'))
            if (findCurrency) {
                setFormValue({
                    ...initialFormValue,
                    'currencyId': findCurrency._id,
                    'currencySymbol': findCurrency.coin
                })
            }
        }
    }, [formType, editRecord, currencyOption])

    return (
        <form className={clsx("contact_form", { "disabledForm": formDisable }, "pt-4")}>
            
            <GridContainer>
                {/* <GridItem xs={12} sm={12} md={6} lg={3} className="settingsSelect">
                    <div className="form-group">
                        <label>Select Currency</label>
                        <Select
                            value={currencyId}
                            name="currencyId"
                            onChange={handleSelect}
                            disabled={formDisable}
                            placeholder={'Select Currency'}
                        >
                            <MenuItem value=" " disabled>Select Currency</MenuItem>
                            {
                                currencyOption && currencyOption.length > 0 && currencyOption.map((item, key) => {
                                    if (item.type == 'fiat') {
                                        return (
                                            <MenuItem key={key} value={item._id}>{item.coin}</MenuItem>
                                        )
                                    }
                                })
                            }
                        </Select>
                    </div>
                </GridItem> */}
            </GridContainer>

            {
                !isEmpty(currencySymbol) && 
                <>
                <h5 className="dash_subtitle pb-3 mb-3">Bank {formType == 'edit' && key}</h5>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={6} lg={3} className="settingsSelect">
                    <div className="form-group">
                        <label>Select Currency</label>
                        <Select
                            value={currencyId}
                            name="currencyId"
                            onChange={handleSelect}
                            disabled={formDisable}
                            placeholder={'Select Currency'}
                        >
                            <MenuItem value=" " disabled>Select Currency</MenuItem>
                            {
                                currencyOption && currencyOption.length > 0 && currencyOption.map((item, key) => {
                                    if (item.type == 'fiat') {
                                        return (
                                            <MenuItem key={key} value={item._id}>{item.coin}</MenuItem>
                                        )
                                    }
                                })
                            }
                        </Select>
                    </div>
                </GridItem>

                    <GridItem xs={12} sm={6} md={6} lg={3}>
                        <div className="form-group">
                            <label>{t("ACCOUNT_HOLDER_NAME")}</label>
                            <input type="text" className="form-control"
                                name="holderName"
                                value={holderName}
                                onChange={handleChange}
                                disabled={formDisable}
                            />
                            {
                                validateError.holderName && <p className="error-message">{t(validateError.holderName)}</p>
                            }
                        </div>
                    </GridItem>

                    <GridItem xs={12} sm={6} md={6} lg={3}>
                        <div className="form-group">
                            <label>{t("BANK_NAME")}</label>
                            <input
                                type="text"
                                className="form-control"
                                name="bankName"
                                value={bankName}
                                onChange={handleChange}
                                disabled={formDisable}
                            />
                            {
                                validateError.bankName && <p className="error-message">{t(validateError.bankName)}</p>
                            }
                        </div>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={6} lg={3}>
                        <div className="form-group">
                            {/* {
                                ['USD', 'INR'].includes(currencySymbol) && <label>{t("ACCOUNT_NUMBER")}</label>
                            }
                            {
                                currencySymbol == 'EUR' && <label>{t("ACCOUNT_NUMBER_EUR")}</label>
                            } */}
                            <label>{t("ACCOUNT_NUMBER")}</label>
                            <input
                                type="text"
                                className="form-control"
                                name="accountNo"
                                value={accountNo}
                                onChange={handleChange}
                                disabled={formDisable}
                            />
                            {
                                validateError.accountNo && <p className="error-message">{t(validateError.accountNo)}</p>
                            }
                        </div>
                    </GridItem>

                    <GridItem xs={12} sm={6} md={6} lg={3}>
                        <div className="form-group">
                            {/* {
                                currencySymbol == 'USD' && <label>{t("ROUTING_NUMBER")}</label>
                            }
                            {
                                currencySymbol == 'EUR' && <label>{t("BIC_SWIFT_CODE")}</label>
                            }
                            {
                                currencySymbol == 'INR' && <label>{t("IBAN_CODE")}</label>
                            } */}
                            <label>{t("IBAN_CODE")}</label>
                            <input type="text" className="form-control"
                                name="bankcode"
                                value={bankcode}
                                onChange={handleChange}
                                disabled={formDisable}
                            />
                            {
                                validateError.bankcode && <p className="error-message">{t(validateError.bankcode)}</p>
                            }
                        </div>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={6} lg={3}>
                        <div className="form-group">
                            <label>{t("BANK")}{" "}{t("COUNTRY")}</label>
                            <CountryDropdown
                                value={country}
                                onChange={handleCountry}
                                className="country_dropdown form-control"
                                disabled={formDisable}
                            />
                            {
                                validateError.country && <p className="error-message">{t(validateError.country)}</p>
                            }
                        </div>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={6} lg={3}>
                        <div className="form-group">
                            <label>{t("BANK")}{" "}{t("ADDRESS")}</label>
                            <input type="text" className="form-control"
                                name="bankAddress"
                                value={bankAddress}
                                onChange={handleChange}
                                disabled={formDisable}
                            />
                            {
                                validateError.bankAddress && <p className="error-message">{t(validateError.bankAddress)}</p>
                            }
                        </div>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={6} lg={3}>
                        <div className="form-group">
                            <label>{t("BANK")}{" "}{t("CITY")}</label>
                            <input type="text" className="form-control"
                                name="city"
                                value={city}
                                onChange={handleChange}
                                disabled={formDisable}
                            />
                            {
                                validateError.city && <p className="error-message">{t(validateError.city)}</p>
                            }
                        </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                        {
                            !formDisable && <div className="form-group">
                                <button
                                    type="button"
                                    onClick={handleFormSubmit}
                                    className="btn btn-primary text-uppercase py-2"
                                >
                                    {loader && <i class="fas fa-spinner fa-spin"></i>}
                                    {t("Submit")}
                                </button>
                            </div>
                        }

                    </GridItem>
                </GridContainer>
                </>
            }
        </form>

    )
}

export default EditBankDetail;