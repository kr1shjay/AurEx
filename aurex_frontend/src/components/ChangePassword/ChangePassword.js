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

import { Link } from "react-router-dom";
import clsx from 'classnames';

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
    const [showPassword,setShowPassword] = useState(false)
    const [shownewpassword,setShownewPassword] = useState(false)
    const [showConfirmpassword,setShowconfirmPassword] = useState(false)

    

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
                                        <div className="input-group regGroupInput mt-2">
                                        <input type={showPassword ? "text" : "password"} 
                                        className="form-control"
                                            name="oldPassword"
                                            value={oldPassword}
                                            onChange={handleChange}
                                        />
                                        <div className="input-group-append">
                                        <Link onClick={()=>{setShowPassword(!showPassword)}}>
                                        <i className={clsx("fa", { "fa-eye": showPassword }, { "fa-eye-slash": !showPassword })} aria-hidden="true"></i>
                                        </Link>
                                        </div>
                                        </div>
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
                                        <div className="input-group regGroupInput mt-2">


                                        <input type={shownewpassword ? "text" : "password"} className="form-control"
                                            name="password"
                                            value={password}
                                            onChange={handleChange}
                                        />
                                         <div className="input-group-append">
                                        <Link onClick={()=>{setShownewPassword(!shownewpassword)}}>
                                        <i className={clsx("fa", { "fa-eye": shownewpassword }, { "fa-eye-slash": !shownewpassword })} aria-hidden="true"></i>
                                        </Link>
                                        </div>
                                        </div>
                                        {
                                            validateError.password && <p className="error-message">{t(validateError.password)}</p>
                                        }
                                    </div>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6} lg={6}>
                                    <div className="form-group">
                                        <label>{t('CONFIRM_PASSWORD')}</label>
                                        <div className="input-group regGroupInput mt-2">


                                        <input type={showConfirmpassword ? "text" : "password"} className="form-control"
                                            name="confirmPassword"
                                            value={confirmPassword}
                                            onChange={handleChange}
                                        />
                                        <div className="input-group-append">
                                        <Link onClick={()=>{setShowconfirmPassword(!showConfirmpassword)}}>
                                        <i className={clsx("fa", { "fa-eye": showConfirmpassword }, { "fa-eye-slash": !showConfirmpassword })} aria-hidden="true"></i>
                                        </Link>
                                        </div>
                                        </div>
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