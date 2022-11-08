// import package
import React, { useCallback, useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom'
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { GoogleReCaptchaProvider, GoogleReCaptcha } from 'react-google-recaptcha-v3';
import PhoneInput from 'react-phone-input-2'
// import config
import config from '../../config';

// import action
import { forgotPassword, sentOTP } from '../../actions/users';

// import lib
// import validation from './validation';
import isEmpty from '../../lib/isEmpty';
import { toastAlert } from '../../lib/toastAlert';

let initialFormValue = {
    phoneCode: '',
    phoneNo: '',
    otp: '',
    email: ''
}

const MobileForm = () => {
    const { t, i18n } = useTranslation();
    let history = useHistory()
    // states
    const [formValue, setFormValue] = useState(initialFormValue);
    const [reCaptcha, setReCaptcha] = useState('');
    const [optStatus, setOtpStatus] = useState(false)
    const [toched, setToched] = useState({});
    const [validateError, setValidateError] = useState({});
    const [loader, setLoader] = useState();

    const { phoneCode, phoneNo, otp, email } = formValue;

    // function
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let formData = { ...formValue, ...{ [name]: value } }
        setFormValue(formData)
        if (value) {
            setValidateError({})
            setOtpStatus(true)
        }
        // setValidateError(validation(formData))
    }

    // const handleBlur = (e) => {
    //     const { name } = e.target;
    //     setToched({ ...toched, ...{ [name]: true } })
    // }

    const handleSentOTP = async (e) => {
        e.preventDefault();

        let reqData = {
            phoneCode,
            phoneNo,
            type:'forgot'
        }
        let { status, loading, error, message } = await sentOTP(reqData);
        if (status == "success") {
            toastAlert('success', message, 'mobileForm');
            setOtpStatus(true)
        }
        if (error) {
            setValidateError(error)
        }
    }


    const handleFormSubmit = async (e) => {
        e.preventDefault();

        setLoader(true)
        let reqData = {
            phoneCode,
            phoneNo,
            otp,
            type: 'mobile'
        }
        let { status, loading, error, message, result } = await forgotPassword(reqData);
        setLoader(loading);
        setReCaptcha('')
        if (status == 'success') {
            setFormValue(initialFormValue)
            setToched({})
            // setValidateError(validation(initialFormValue))
            toastAlert('success', message, 'forgotPassword');
            history.push('/reset-password/' + result)
        } else {
            toastAlert('error', message, 'forgotPassword');
        }
        if (error) {
            setValidateError(error);
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
            setOtpStatus(true)
        }
        if (value && country) {
            setValidateError({})
        }
        setFormValue(formData)
        // setValidateError(validation(formData))
    }

    const handleReCaptcha = useCallback((token) => {
        if (isEmpty(reCaptcha)) {
            setReCaptcha(token)
        }
    }, [reCaptcha])

    useEffect(() => {
        // setValidateError(validation(formValue))
    }, [])
    
    return (
        <Fragment>
            <p className="paraLabel text-center mb-3 forhet_txtx">{t('MOBILE_NO')}</p>
            <div className="form-group">
                <PhoneInput
                    placeholder={t('ENTER_MOBILE_NO')}
                    value={phoneCode + phoneNo}
                    onChange={handlePhoneNumber}
                    // onBlur={handleBlur}
                    specialLabel={false}
                    // className="form-control"
                    country={'in'}
                />
                {/* {toched.phoneCode && validateError.phoneCode && <p className="error-message">{validateError.phoneCode}</p>} */}
                {validateError && validateError.phone && <p className="error-message">{validateError.phone}</p>}
                {validateError && validateError.phoneNo && <p className="error-message">{validateError.phoneNo}</p>}

                <Button
                    onClick={handleSentOTP}
                    // disabled={validateError && validateError.phoneCode}
                    className="otp_btn"
                >
                    {t('SEND_CODE')}
                </Button>

            </div>
            {optStatus && optStatus == true ?
                <>
                    <div className="form-group">

                        <>
                            <span className="login_label">{t('OTP')}</span>
                            <input
                                type={"text"}
                                className="form-control"
                                placeholder={t('VERIFY_CODE')}
                                name="otp"
                                value={otp}
                                onChange={handleChange}
                            // onBlur={handleBlur}
                            />
                            {/* <div className="input-group regGroupInput mt-2">
    </div> */}
                        </>
                        {validateError && validateError.otp && <p className="error-message">{t(validateError.otp)}</p>}
                    </div>
                </> : null

            }





            <div className="form-group">
                <Button
                    onClick={handleFormSubmit}
                    disabled={optStatus == false || loader}
                >
                    {loader && <i class="fas fa-spinner fa-spin"></i>} {t('Submit')}
                </Button>
            </div>
        </Fragment>
    )
}

export default MobileForm;