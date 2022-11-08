// import package
import React, { createRef, useState, useEffect, useCallback } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import Checkbox from 'rc-checkbox';
import clsx from 'classnames';
import { useTranslation } from 'react-i18next';
import { GoogleReCaptchaProvider, GoogleReCaptcha } from 'react-google-recaptcha-v3';

// import config
import config from '../../config';

// import action
import { createUser } from '../../actions/users';

// import lib
import validation from './validation';
import isEmpty from '../../lib/isEmpty';
import { toastAlert } from '../../lib/toastAlert';
import { getLang } from '../../lib/localStorage';

const initialFormValue = {
    'email': '',
    'password': '',
    'confirmPassword': '',
    'isTerms': false,
    'showPassword': false,
    'showConfirmPassword': false
}

const RegisterForm = () => {
    const { t, i18n } = useTranslation();

    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [reCaptcha, setReCaptcha] = useState('');
    const [toched, setToched] = useState({});
    const [validateError, setValidateError] = useState({});
    const [loader, setLoader] = useState();
    const { email, password, confirmPassword, isTerms, showPassword, showConfirmPassword } = formValue;

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

    const handleCheckBox = (e) => {
        const { name, checked } = e.target
        let formData = { ...formValue, ...{ [name]: checked } }
        setFormValue(formData)
        setValidateError(validation(formData))
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!(isTerms == true)) {
            setValidateError({ 'isTerms': 'ACCEPT_TERMS_MESSAGE' })
            return
        } else if (isEmpty(reCaptcha)) {
            toastAlert('error', 'Invalid ReCaptcha', 'signup', 'TOP_CENTER');
            return
        }

        setLoader(true)

        let reqData = {
            email,
            password,
            confirmPassword,
            reCaptcha,
            isTerms,
            langCode: getLang()
        }
        let { status, loading, message, error } = await createUser(reqData);
        setLoader(loading);
        setReCaptcha('')
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

    const handleReCaptcha = useCallback((token) => {
        if (isEmpty(reCaptcha)) {
            setReCaptcha(token)
        }
    }, [reCaptcha])

    useEffect(() => {
        setValidateError(validation(formValue))
    }, [])

    return (
        <GoogleReCaptchaProvider reCaptchaKey={config.RECAPTCHA_SITE_KEY}>
            <form className="login_form p-4 mb-4" data-aos="fade-up">
        
            <h3 className="login_title_8">{t('2FA_HEADING')}</h3>
            
                <div className="form-group">
                <span className="login_label">{t('DIGITAL_CODE')}</span>
                    <div className="input_box_poa mt-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder=""
                        name="email"
                        value={email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    <span>{t('PASTE_CODE')}</span>
                     </div>
                    {toched.email && validateError.email && <p className="error-message">{t(validateError.email)}</p>}
                   
                   
                </div>
               
               
              


              

               
                <div className="form-group">
                    <Button
                        onClick={handleFormSubmit}
                        disabled={!isEmpty(validateError) || loader}
                    >
                        {loader && <i class="fas fa-spinner fa-spin"></i>} {t('CONFIRM')}
                    </Button>
                </div>
                {/* <div className="d-flex">
                    <Link to="/recover-password" className="mr-auto">Forgot password?</Link>
                    <Link to="/login" className="ml-auto">Already have an account?</Link>
                </div> */}
                <div className="d-flex justify-content-center">
                    <Link to="/" className="mr-auto color_lonks_a"> {t('BACK')}</Link>
                    
                </div>
            </form>
            <GoogleReCaptcha
                onVerify={handleReCaptcha}
            />
        </GoogleReCaptchaProvider>
    )
}

export default RegisterForm;