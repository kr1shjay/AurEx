// import package
import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch } from 'react-redux'
import { Button } from "@material-ui/core";
import browser from 'browser-detect';
import Checkbox from 'rc-checkbox';
import { useTranslation } from 'react-i18next';
import { useHistory, Link } from 'react-router-dom';
import clsx from 'classnames';

// import action
import { check2fa, getGeoInfoData, login } from '../../actions/users';

// import lib
import validation from './validation';
import isEmpty from '../../lib/isEmpty';
import { toastAlert } from '../../lib/toastAlert';
import { getLang } from '../../lib/localStorage';

const initialFormValue = {
    'email': '',
    'formType': '',
    'password': '',
    'twoFACode': '',
    'remember': false,
    'showPassword': false
}


const EmailForm = () => {
    const { t, i18n } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();

    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [toched, setToched] = useState({});
    const [validateError, setValidateError] = useState({});
    const [loader, setLoader] = useState();
    const [loginHistory, setLoginHistory] = useState({});
    const [showTwoFA, setShowTowFA] = useState(false)

    const { email, password, formType, showPassword, remember, twoFACode } = formValue;

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        console.log(name, 'handleCheck2fa')
        if (name == 'twoFACode') {
            if (!(value == '' || (/^[0-9\b]+$/.test(value) && value.length <= 6))) {
                return
            }
        }
        if (name == 'email') {
            console.log(value, 'handleCheck2fa')
            handleCheck2fa(value)
        }

        let formData = { ...formValue, ...{ [name]: value } }
        setFormValue(formData)
        setValidateError(validation(formData))
    }

    const handleCheck2fa = async (email) => {
        try {
            console.log(email, 'handleCheck2fa')
            let { status, message } = await check2fa({ email: email })
            if (status == 'TWO_FA') {
                setShowTowFA(true)
            }
        } catch (err) {
            console.log(err, 'handleCheck2fa__err')
        }
    }

    const handleBlur = (e) => {
        const { name } = e.target;
        setToched({ ...toched, [name]: true })
    }

    const handleCheckBox = (e) => {
        const { name, checked } = e.target
        let formData = { ...formValue, [name]: checked }
        setFormValue(formData)
        setValidateError(validation(formData))
    }

    const getGeoInfo = async () => {
        try {
            let { result } = await getGeoInfoData();
            const browserResult = browser();
            setLoginHistory({
                countryName: result.country_name,
                countryCode: result.country_calling_code,
                ipaddress: result.ip,
                region: result.region,
                broswername: browserResult.name,
                ismobile: browserResult.mobile,
                os: browserResult.os,
            })
        }
        catch (err) {
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoader(true)
        if (showTwoFA && isEmpty(twoFACode)) {
            let error = { ...validateError, ['twoFACode']: "2fa is required" }
            setValidateError(error)
            setLoader(false)
            return false
        }

        let reqData = {
            email,
            password,
            remember,
            twoFACode,
            loginHistory,
            langCode: getLang(),
            formType
        }

        let { status, loading, message, userSetting, error, authToken } = await login(reqData, dispatch);
        setLoader(loading);
        if (status == 'success') {
            setFormValue(initialFormValue)
            if (remember) {
                localStorage.setItem("remember", true);
                localStorage.setItem("email_remember", email);
                localStorage.setItem("password_remember", password);
                localStorage.setItem("formType", formType);
            } else {
                localStorage.removeItem("remember");
                localStorage.removeItem("email_remember");
                localStorage.removeItem("password_remember");
            }

            toastAlert('success', message, 'login');
            if (userSetting && userSetting.afterLogin && userSetting.afterLogin != " ") {
                history.push(userSetting.afterLogin.url)
            } else {
                history.push('/profile')
            }
        } else if (status == 'TWO_FA') {
            setShowTowFA(true)
            toastAlert('error', message, 'login');
        } else {
            if (error) {
                setValidateError(error);
            }
            if (message == "Your Password is Old Please Reset Your Password") {
                toastAlert('error', message, 'login');
                history.push("/reset-password/" + authToken)

            }
            toastAlert('error', message, 'login');
        }
    }

    useEffect(() => {
        getGeoInfo()
        let formData = {};
        if (localStorage.getItem("remember") == "true") {
            formData = formValue
            formData['email'] = localStorage.getItem("email_remember");
            formData['password'] = localStorage.getItem("password_remember");
            formData['remember'] = true;
            formData['formType'] = localStorage.getItem("formType");
            setFormValue(formData);
        } else {
            formData = {
                'email': '',
                'password': '',
                'twoFACode': '',
                'remember': false,
                'formType': 'email'
            }
            setFormValue(formData);
        }
        // setValidateError(validation(formData))

    }, [])

    return (
        <Fragment>
            <div className="form-group">

                <span className="login_label">{t('EMAIL_PLACEHOLDER')}</span>
                <input
                    type="text"
                    className="form-control mt-2"
                    placeholder={t('EMAIL_PLACEHOLDER')}
                    name="email"
                    value={email}
                    autoComplete="off"
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {toched.email && validateError.email && <p className="error-message">{t(validateError.email)}</p>}
                {/* <span style={{ color: 'red' }}>{validateError && t(validateError.email)}</span>          */}
            </div>
            <div className="form-group">
                <span className="login_label">{t('PASSWORD')}</span>
                <div className="input-group regGroupInput mt-2">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="form-control mt-2"
                        placeholder={t('PASSWORD_PLACEHOLDER')}
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
                {/* <span style={{ color: 'red' }}>{validateError && validateError.password}</span>   */}
            </div>

            {
                showTwoFA && <div className="form-group">
                    <input
                        type="text"
                        className="form-control mt-2"
                        placeholder={t('ENTER_TWO_FA_CODE')}
                        name="twoFACode"
                        value={twoFACode}
                        onChange={handleChange}
                    />
                    {validateError.twoFACode && <p className="error-message">{t(validateError.twoFACode)}</p>}
                </div>
            }



            <div className="form-group">
                {/* <div class="custom-control custom-checkbox">
  <input type="checkbox" class="custom-control-input" id="customCheck1" />
  <label class="custom-control-label" for="customCheck1">Check this custom checkbox</label>
</div> */}
                <div className="form-check">
                    <Checkbox className='custom_checkbox'
                        name="remember"
                        onChange={handleCheckBox}
                        checked={remember}
                    />
                    <label className="form-check-label" for="flexCheckDefault">
                        {t('KEEP_SIGN_COMPUTER')}
                    </label>
                </div>
            </div>
            <div className="form-group">

                <Button
                    onClick={handleFormSubmit}
                    disabled={!isEmpty(validateError) || loader}
                >
                    {loader && <i class="fas fa-spinner fa-spin"></i>} {t('SIGN_IN_BUTTON')}
                </Button>
            </div>
        </Fragment>
    )
}

export default EmailForm;