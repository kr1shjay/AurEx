// import package
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import action
import { changePassword } from '../../actions/users';

// import lib
import validation from './validation';
import isEmpty from '../../lib/isEmpty';
import { toastAlert } from '../../lib/toastAlert';

const initialFormValue = {
    'oldPassword': '',
    'password': '',
    'confirmPassword': ''
}

const ChangePassword = () => {
    const { t, i18n } = useTranslation();

    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [validateError, setValidateError] = useState({});
    const [loader, setLoader] = useState();

    const { oldPassword, password, confirmPassword } = formValue;

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

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoader(true)
        let reqData = {
            oldPassword,
            password,
            confirmPassword,
        }
        let validationError = validation(reqData)
        console.log(validationError,'---------error')
        if (!isEmpty(validationError)) {
            setValidateError(validationError)
            setLoader(false)
            return
        }

        try {
            let { status, loading, error, message } = await changePassword(reqData);
            setLoader(loading)
            if (status == "success") {
                setFormValue(initialFormValue)
                toastAlert('success', t(message), 'changePassword', 'TOP_CENTER');
            } else {
                if (error) {
                    setValidateError(error);
                } else if (message) {
                    toastAlert('error', t(message), 'changePassword', 'TOP_CENTER');
                }
            }
        }
        catch (err) { }
    }

    return (
        <div className="profileDetailView">
            {/* <h4>{t("UPDATE_PASSWORD")}</h4> */}
            <GridContainer>
                <GridItem xs={12} sm={12} md={6} lg={6}>
                    <div className="twoFAForm">
                        <form className="contact_form mb-0">
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={6} lg={6}>
                                    <div className="form-group">
                                        <label>{t("CURRENT_PASSWORD")}</label>
                                        <input type="password" className="form-control"
                                            name="oldPassword"
                                            value={oldPassword}
                                            onChange={handleChange}
                                        />
                                        {
                                            validateError.oldPassword && <p className="error-message">{t(validateError.oldPassword)}</p>
                                        }
                                    </div>
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={6} lg={6}>
                                    <div className="form-group">
                                        <label>{t("NEW_PASSWORD")}</label>
                                        <input type="password" className="form-control"
                                            name="password"
                                            value={password}
                                            onChange={handleChange}
                                        />
                                        {
                                            validateError.password && <p className="error-message">{t(validateError.password)}</p>
                                        }
                                    </div>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6} lg={6}>
                                    <div className="form-group">
                                        <label>{t('CONFIRM_PASSWORD')}</label>
                                        <input type="password" className="form-control"
                                            name="confirmPassword"
                                            value={confirmPassword}
                                            onChange={handleChange}
                                        />
                                        {
                                            validateError.confirmPassword && <p className="error-message">{t(validateError.confirmPassword)}</p>
                                        }
                                    </div>
                                </GridItem>
                            </GridContainer>
                            <div className="form-group mb-0">
                                <button
                                    type="button"
                                    onClick={handleFormSubmit}
                                    className="btn btn-primary text-uppercase py-2"
                                >
                                    {loader && <i class="fas fa-spinner fa-spin"></i>}
                                    {t("UPDATE")}
                                </button>
                            </div>
                        </form>
                    </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={6} lg={6}>
                    <div className="settingsNote">
                        <h6>{t("NOTES")}</h6>
                        <p>{t("PASSWORD_TITLE")}</p>
                        <ul>
                            <li>- {t("PASSWORD_DESCRIPTION1")}</li>
                            <li>- {t("PASSWORD_DESCRIPTION5")}</li>
                            <li>- {t("PASSWORD_DESCRIPTION2")}</li>
                            <li>- {t("PASSWORD_DESCRIPTION6")}</li>
                            <li>- {t("PASSWORD_DESCRIPTION3")}</li>
                            <li>- {t("PASSWORD_DESCRIPTION4")}</li>
                        </ul>
                    </div>
                </GridItem>
            </GridContainer>
        </div>
    )
}

export default ChangePassword;