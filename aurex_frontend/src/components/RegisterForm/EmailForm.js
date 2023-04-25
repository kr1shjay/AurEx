// import package
import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import Checkbox from 'rc-checkbox';
import clsx from 'classnames';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

// import action
import { createUser } from '../../actions/users';

// import lib
import validation from './validation';
import isEmpty from '../../lib/isEmpty';
import { toastAlert } from '../../lib/toastAlert';
import { getLang } from '../../lib/localStorage';

const initialFormValue = {
    'email': '',
    'formType': 'email',
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

const EmailForm = () => {
    const { t, i18n } = useTranslation();
    const { executeRecaptcha } = useGoogleReCaptcha();
    const query = useQuery();

    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    // const [reCaptcha, setReCaptcha] = useState('');
    const [toched, setToched] = useState({});
    const [validateError, setValidateError] = useState({});
    const [loader, setLoader] = useState();
    const [isShow, setShow] = useState(false);
    const { email, formType, password, confirmPassword, isTerms, showPassword, showConfirmPassword, referenceCode } = formValue;
    const [emailchecked, setemailchecked] = useState(true);
    const [mobilechecked, setmobilechecked] = useState(false);

    // function
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
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
        let formData = { ...formValue, [name]: checked }
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
            toastAlert('error', 'Invalid ReCaptcha', 'signup', 'TOP_RIGHT');
            return
        }

        setLoader(true)

        let reqData = {
            email,
            formType,
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
            toastAlert('success', message, 'signup', 'TOP_RIGHT');
        } else {
            if (error) {
                setValidateError(error);
            }
            toastAlert('error', message, 'signup', 'TOP_RIGHT');
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

    const handleClick = (e) => {
        const { name, checked } = e.target

        if (name == "email") {

            // setmobilechecked(false);
            // setemailchecked(true);

        }
        else if (name == "mobile") {

            // setmobilechecked(true);
            // setemailchecked(false);

        }

        // if()

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
            <span className="login_label">{t('EMAIL_PLACEHOLDER')}</span>

                <div className="input_box_poa">
                    <input
                        type="text"
                        className="form-control"
                        placeholder={t('EMAIL_PLACEHOLDER')}
                        name="email"
                        value={email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </div>
                {toched.email && validateError.email && <p className="error-message">{t(validateError.email)}</p>}
            </div>

            <div className="form-group">
                <span className="login_label">{t('ENTER_PASSWORD')}</span>
                <div className="input-group regGroupInput mt-2">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder={t('PASSWORD')}
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
                {toched.password && validateError.password && <p className="error-message">{t(validateError.password)}</p>}
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
                {toched.confirmPassword && validateError.confirmPassword && <p className="error-message">{t(validateError.confirmPassword)}</p>}
            </div>

            {/* <div className="form-group">
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
            </div> */}

            <div className="form-group">
                <div className="form-check d-flex">
                    <Checkbox
                        name="isTerms"
                        onChange={handleCheckBox}
                        checked={isTerms}
                    />
                    <label className="form-check-label font_siz" for="flexCheckDefault">
                       {t('I_AGREE')} <Link to="/terms" className="color_lonks">{t('TERMS')}</Link> {t('AND')} <Link to="/privacy-policy" className="color_lonks">{t('PRIVACY')}</Link>
                    </label>
                    {validateError.isTerms && <p className="error-message">{t(validateError.isTerms)}</p>}
                </div>
            </div>
            <div className="form-group">
                <Button
                    onClick={handleFormSubmit}
                    disabled={!isEmpty(validateError) || loader}
                >
                    {loader && <i class="fas fa-spinner fa-spin"></i>} {t('REGISTER')}
                </Button>
            </div>
        </Fragment>
    )
}

export default EmailForm;