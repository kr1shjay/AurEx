// import package
import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch } from 'react-redux'
import { Button } from "@material-ui/core";
import browser from 'browser-detect';
import Checkbox from 'rc-checkbox';
import { useTranslation } from 'react-i18next';
import { useHistory,Link } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import clsx from 'classnames';


// import action
import { getGeoInfoData, login, sentOTP } from '../../actions/users';

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
    'twoFACode': '',
    'remember': false
}

const MobileForm = () => {
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
    const [optStatus, setOtpStatus] = useState(false)
    const [buttonName, setButtonName] = useState(false)

    const { phoneCode, phoneNo, otp, formType,showPassword, password, remember, twoFACode } = formValue;

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;

        if (name == 'twoFACode' || name == 'otp') {
            if (!(value == '' || (/^[0-9\b]+$/.test(value) && value.length <= 6))) {
                return
            }
        }

        let formData = { ...formValue, [name]: value }
        setFormValue(formData)
        setValidateError(validation(formData))
    }

    const handleBlur = (e) => {
        const { name } = e.target;
        setToched({ ...toched, [name]: true })
    }

    const handleCheckBox = (e) => {
        const { name, checked } = e.target
        let formData = { ...formValue, ...{ [name]: checked } }
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
        let reqData = {
            phoneCode,
            phoneNo,
            otp,
            password,
            remember,
            twoFACode,
            loginHistory,
            langCode: getLang(),
            formType
        }
        let { status, loading, message, userSetting, authToken, error } = await login(reqData, dispatch);
        setLoader(loading);
        if (status == 'success') {
            setFormValue(initialFormValue)
            if (remember) {
                localStorage.setItem("remember", true);
                localStorage.setItem("phoneCode_remember", phoneCode);
                localStorage.setItem("phoneNo_remember", phoneNo);
                localStorage.setItem("password_remember", password);
            } else {
                localStorage.removeItem("remember");
                localStorage.removeItem("phoneCode_remember");
                localStorage.removeItem("phoneNo_remember");
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
            if(message == "Your Password is Old Please Reset Your Password"){
                toastAlert('error', message, 'login');
                history.push("/reset-password/"+authToken)
 
            }
            toastAlert('error', message, 'login');
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
            formData = { ...formData, phoneNo: value }
        }

        setFormValue(formData)
        setValidateError(validation(formData))

    }

    const handleBlurPhone = (e) => {
        setToched({ ...toched, 'phoneNo': true, 'phoneCode': true })
    }

    const handleSentOTP = async (e) => {
        e.preventDefault();
        let reqData = {
            phoneCode,
            phoneNo,
            password,
            type: 'login',

        }
        try {
            let { status, loading, error, message } = await sentOTP(reqData);
            if (status == "success") {
                setOtpStatus(true)
                setButtonName(false)
                toastAlert('success', message, 'mobileForm');
                setTimeout(() => {
                    setOtpStatus(false)
                    setButtonName(true)
                }, 600000)
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
        getGeoInfo()
        let formData = {};
        if (localStorage.getItem("remember") == "true") {
            formData = formValue
            formData['phoneCode'] = localStorage.getItem("phoneCode_remember");
            formData['phoneNo'] = localStorage.getItem("phoneNo_remember");
            formData['password'] = localStorage.getItem("password_remember");
            formData['remember'] = true;
            setFormValue(formData);
        } else {
            formData = {
                'phoneCode': '',
                'phoneNo': '',
                'password': '',
                'twoFACode': '',
                'formType': 'mobile',
                'remember': false
            }
            setFormValue(formData);
        }
        setValidateError(validation(formData))
    }, [])


    return (
        <Fragment>
            <div className="form-group">

                <span className="login_label">{t('MOBILE_NO')}</span>
                <div className="input_box_poa">
                    <PhoneInput
                        placeholder="Enter mobile number"
                        // value={phoneCode + phoneNo}
                        onChange={handlePhoneNumber}
                        onBlur={handleBlurPhone}
                        specialLabel={false}
                        country={'in'}
                    />
                </div>
                {toched.phoneCode && validateError.phoneNo && <p className="error-message">{t(validateError.phoneNo)}</p>}
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
            </div>

            {
                optStatus && <div className="form-group">
                    <span className="login_label">{t('OTP')}</span>
                    <div className="input-group regGroupInput mt-2">

                        <input
                            type={"text"}
                            className="form-control"
                            placeholder="Verification Code"
                            name="otp"
                            value={otp}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </div>
                    {toched.otp && validateError.otp && <p className="error-message">{t(validateError.otp)}</p>}
                </div>
            }

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
                <div className="form-check">
                    <Checkbox
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
                {
                    !optStatus && <Button
                        onClick={handleSentOTP}
                        disabled={validateError && t(validateError.phoneCode)}
                    >
                        {
                            buttonName == true ?
                                <>
                                    {loader && <i class="fas fa-spinner fa-spin"></i>} {t('RE_SEND_CODE')}
                                </> :
                                <>
                                    {loader && <i class="fas fa-spinner fa-spin"></i>} {t('SEND_CODE')}
                                </>
                        }
                    </Button>
                }
                {
                    optStatus && <Button
                        onClick={handleFormSubmit}
                        disabled={!isEmpty(validateError) || loader}
                    >
                        {loader && <i class="fas fa-spinner fa-spin"></i>} {t('SIGN_IN_BUTTON')}
                    </Button>
                }
            </div>
        </Fragment>
    )
}

export default MobileForm;