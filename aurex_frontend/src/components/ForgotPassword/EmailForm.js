
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
import validation from './validation';
import isEmpty from '../../lib/isEmpty';
import { toastAlert } from '../../lib/toastAlert';


let initialFormValue = {
    phoneCode: '',
    phoneNo: '',
    otp: '',
    email: ''
}

const EmailForm = () => {
    const { t, i18n } = useTranslation();
    let history = useHistory()
    // states
    const [formValue, setFormValue] = useState(initialFormValue);
    const [reCaptcha, setReCaptcha] = useState('');
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
        setValidateError(validation(formData))
    }

    const handleBlur = (e) => {
        const { name } = e.target;
        setToched({ ...toched, ...{ [name]: true } })
    }



    const handleFormSubmit = async (e) => {
        e.preventDefault();
        // if (isEmpty(reCaptcha)) {
        //     toastAlert('error', 'Invalid ReCaptcha', 'forgotPassword');
        //     return
        // }
        setLoader(true)
        let reqData = {
            phoneCode,
            phoneNo,
            otp,
            email,
            reCaptcha,
            type: 'email'
        }
        let { status, loading, error, message, result } = await forgotPassword(reqData);
        setLoader(loading);
        setReCaptcha('')
        if (status) {
            setFormValue(initialFormValue)
            setToched({})
            setValidateError({})
            toastAlert('success', message, 'forgotPassword');
            // history.push('/reset-password/' + result)
        } else {
            toastAlert('error', message, 'forgotPassword');
        }
        if (!isEmpty(error)) {
            setValidateError(error)
        }
    }

    const handleReCaptcha = useCallback((token) => {
        if (isEmpty(reCaptcha)) {
            setReCaptcha(token)
        }
    }, [])

    useEffect(() => {
        // setValidateError(validation(formValue))
    }, [reCaptcha])
    return (
        <GoogleReCaptchaProvider reCaptchaKey={config.RECAPTCHA_SITE_KEY}>
            <Fragment>


                <p className="paraLabel text-center mb-3 forhet_txtx">{t('EMAIL_PLACEHOLDER')}</p>
                <div className="form-group">
                    <input
                        className="form-control"
                        placeholder=""
                        name="email"
                        value={email}
                        type="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    {/* {
                        toched.email && validateError.email && <p className="error-message">{t(validateError.email)}</p>
                    } */}
                    <span style={{ color: 'red' }}>{validateError && t(validateError.email)}</span>
                </div>
                <div className="form-group">
                    <Button
                        onClick={handleFormSubmit}
                        disabled={!isEmpty(validateError) || loader}
                    >
                        {loader && <i class="fas fa-spinner fa-spin"></i>} {t('Submit')}
                    </Button>
                </div>
            </Fragment >

            <GoogleReCaptcha
                onVerify={handleReCaptcha}
            />
        </GoogleReCaptchaProvider>
    )
}

export default EmailForm;