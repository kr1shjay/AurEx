// import package
import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import Checkbox from 'rc-checkbox';
import clsx from 'classnames';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

// import action
import { createUser, sentOTP } from '../../actions/users';

// import lib
import validation from './validation';
import isEmpty from '../../lib/isEmpty';
import { toastAlert } from '../../lib/toastAlert';
import { getLang } from '../../lib/localStorage';

const initialFormValue = {
    'phoneCode': '',
    'phoneNo': '',
    'formType': 'mobile',
    'otp': '',
    'password': '',
    'confirmPassword': '',
    'referenceCode': '',
    'isTerms': false,
    'showPassword': false,
    'showConfirmPassword': false
}

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

const MobileForm = () => {
    const { t, i18n } = useTranslation();
    const { executeRecaptcha } = useGoogleReCaptcha();
    const query = useQuery();

    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    // const [reCaptcha, setReCaptcha] = useState('');
    const [toched, setToched] = useState({});
    const [validateError, setValidateError] = useState({});
    const [loader, setLoader] = useState();
    const [optStatus, setOtpStatus] = useState(false)
    const { formType, phoneCode, phoneNo, password, confirmPassword, otp, isTerms, showPassword, showConfirmPassword, referenceCode } = formValue;

    // function
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        if(name="otp"){
            if (!(value == '' || (/^[0-9\b]+$/.test(value) && value.length <= 6))) {
                return
            }
        }
        let formData = { ...formValue, ...{ [name]: value } }
        setFormValue(formData)
        setValidateError(validation(formData,t))
    }

    const handleBlur = (e) => {
        const { name } = e.target;
        setToched({ ...toched, ...{ [name]: true } })
    }

    const handleCheckBox = (e) => {
        const { name, checked } = e.target
        let formData = { ...formValue, ...{ [name]: checked } }
        setFormValue(formData)
        setValidateError(validation(formData,t))
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!(isTerms == true)) {
            setValidateError({ 'isTerms': 'ACCEPT_TERMS_MESSAGE' })
            return
        }

        let reCaptcha = await handleReCaptcha()
        if (isEmpty(reCaptcha)) {
            toastAlert('error', 'Invalid ReCaptcha', 'signup', 'TOP_CENTER');
            return
        }

        setLoader(true)

        let reqData = {
            phoneCode,
            phoneNo,
            formType,
            otp,
            password,
            confirmPassword,
            reCaptcha,
            isTerms,
            langCode: getLang(),
            referenceCode
        }
        let { status, loading, message, error } = await createUser(reqData);
        setLoader(loading);
        // setReCaptcha('')
        if (status == 'success') {
            setFormValue(initialFormValue)
            toastAlert('success', message, 'signup', 'TOP_CENTER');
        } else {
            if (error) {
                setValidateError(error);
            }
            toastAlert('error', message, 'signup', 'TOP_CENTER');
        }
    }

    const handleReCaptcha = async () => {
        try {
            if (!executeRecaptcha) {
                toastAlert('error', 'Recaptcha error')
                return '';
            }
            return await executeRecaptcha('register');
        } catch (err) {
            toastAlert('error', err.toString())
            return ''
        }
    }

    const handlePhoneNumber = (value, country) => {
        const { dialCode } = country;
        let newPhoneNo = value;
        let formData = formValue;
        if (dialCode) {
            formData = {
                ...formData,
                phoneCode: dialCode,
                phoneNo: newPhoneNo.slice(dialCode.length)
            }
        } else if (value) {
            formData = { ...formData, ...{ phoneNo: value } }
        }
        setFormValue(formData)
        setValidateError(validation(formData,t))

    }

    const handleBlurPhone = (e) => {
        setToched({ ...toched, ...{ 'phoneNo': true, 'phoneCode': true } })
    }

    const handleSentOTP = async (e) => {
        e.preventDefault();
        let reqData = {
            phoneCode,
            phoneNo,
            type: 'register'
        }
        try {
            let { status, loading, error, message } = await sentOTP(reqData);
            if (status == "success") {
                setOtpStatus(true)
                toastAlert('success', message, 'mobileForm');
            } else {
                if (error) {
                    setValidateError(error)
                    return
                }
                toastAlert('error', message, 'mobileForm');
            }
        } catch (err) { }
    }


    useEffect(() => {
        setValidateError(validation(formValue,t))
        if (query && query.get('referenceCode')) {
            setFormValue((prev) => {
                return { ...prev, 'referenceCode': query.get('referenceCode') }
            })
        }
    }, [])

    return (

        <Fragment>

            <div className="form-group">
                <span className="login_label">{t('MOBILE_NO')}</span>
                <div className="input_box_poa">
                    <PhoneInput
                        placeholder={t('ENTER_MOBILE_NO')}
                        value={phoneCode + phoneNo}
                        onChange={handlePhoneNumber}
                        onBlur={handleBlurPhone}
                        specialLabel={false}
                        country={'in'}
                    />
                    {
                        !optStatus && 
                            <Button
                                onClick={handleSentOTP}
                                disabled={validateError && validateError.phoneCode}
                                className="otp_btn"
                            >
                                {t('SEND_CODE')}
                            </Button>
                        
                    }

                </div>
                {toched.phoneCode && validateError.phoneCode && <p className="error-message">{t(validateError.phoneCode)}</p>}
            </div>

            <div className="form-group">
                <span className="login_label">{t('OTP')}</span>
                <div className="input-group regGroupInput mt-2">

                    <input
                        type={"text"}
                        className="form-control"
                        placeholder={t('VERIFY_CODE')}
                        name="otp"
                        value={otp}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </div>
                {toched.otp && validateError.otp && <p className="error-message">{t(validateError.otp)}</p>}
            </div>


            <div className="form-group">
                <span className="login_label">{t('ENTER_PASSWORD')}</span>
                <div className="input-group regGroupInput mt-2">

                    <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder={t('ENTER_PASSWORD')}
                        name="password"
                        value={password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    <div className="input-group-append">
                        <Link onClick={(e) => {
                            e.preventDefault();
                            setFormValue((el => {
                                return { ...el, ...{ showPassword: !el.showPassword } }
                            }))
                        }}>
                            <i className={clsx("fa", { "fa-eye": showPassword }, { "fa-eye-slash": !showPassword })} aria-hidden="true"></i>
                        </Link>
                    </div>
                </div>
                {toched.password && validateError.password && <p className="error-message">{validateError.password}</p>}
            </div>

            <div className="form-group">
                <span className="login_label">{t('CONFIRM_PASSWORD')}</span>
                <div className="input-group regGroupInput mt-2">

                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control"
                        placeholder={t('CONFIRM_PASSWORD')}
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    <div className="input-group-append">
                        <Link onClick={(e) => {
                            e.preventDefault();
                            setFormValue((el => {
                                return { ...el, ...{ showConfirmPassword: !el.showConfirmPassword } }
                            }))
                        }}>
                            <i className={clsx("fa", { "fa-eye": showConfirmPassword }, { "fa-eye-slash": !showConfirmPassword })} aria-hidden="true"></i>
                        </Link>
                    </div>
                </div>
                {toched.confirmPassword && validateError.confirmPassword && <p className="error-message">{validateError.confirmPassword}</p>}
            </div>

            <div className="form-group">
                <span className="login_label">{t('REFERRAL_CODE')}</span>
                <div className="input-group regGroupInput mt-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder={t('REF_CODE_OPTION')}
                        name="referenceCode"
                        value={referenceCode}
                        onChange={handleChange}
                    />
                </div>
                {validateError.referenceCode && <p className="error-message">{t(validateError.referenceCode)}</p>}
            </div>

            <div className="form-group">
                <div className="form-check d-flex">
                    <Checkbox
                        name="isTerms"
                        onChange={handleCheckBox}
                        checked={isTerms}
                    />
                    <label className="form-check-label font_siz" for="flexCheckDefault">
                        {t('I_AGREE')}<Link to="/terms" className="color_lonks">{t('TERMS')}</Link> {t('AND')} <Link to="/privacy-policy" className="color_lonks">{t('PRIVACY')}</Link>
                    </label>
                    {validateError.isTerms && <p className="error-message">{t(validateError.isTerms)}</p>}
                </div>
            </div>
            {
                optStatus && <div className="form-group">
                    <Button
                        onClick={handleFormSubmit}
                        disabled={!isEmpty(validateError) || loader}
                    >
                        {loader && <i class="fas fa-spinner fa-spin"></i>} {t('REGISTER')}
                    </Button>
                </div>
            }

        </Fragment>
    )
}

export default MobileForm;