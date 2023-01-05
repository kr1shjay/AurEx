// import package
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import clsx from 'classnames';
import Checkbox from 'rc-checkbox';
import { useDispatch } from 'react-redux';
// import config
import config from '../../config';

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import action
import { get2faCode, update2faCode, disabled2faCode } from '../../actions/users';

// import lib
import { toastAlert } from '../../lib/toastAlert';
import { twoFAStatus } from '../../lib/displayStatus'
import validation from './validation';
import isEmpty from '../../lib/isEmpty';
import { isMobile, mobileType } from '../../lib/browser'

const TwoFA = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch()
    // state
    const [secretData, setSecretData] = useState();
    const [loader, setLoader] = useState();
    const [code, setCode] = useState('')
    const [validateError, setValidateError] = useState({});
    const [checkValue, setCheckValue] = useState(false)

    // function
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        if (!(value == '' || (/^[0-9\b]+$/.test(value) && value.length <= 6))) {
            return
        }
        setCode(value)
        if (!isEmpty(validateError)) {
            setValidateError({})
        }
    }

    const handleCheckBox = (e) => {
        const { name, checked } = e.target
        setCheckValue(checked)
    }

    const fetchTwoFA = async () => {
        try {
            const { status, loading, message, result } = await get2faCode();
            if (status == 'success') {
                setSecretData(result)
            }
        } catch (err) { }
    }

    const disableTwoFa = async (data) => {
        setLoader(true)
        let reqData = {
            "secret": secretData.secret,
            "uri": secretData.uri,
            "code": code
        }
        let validationError = validation(reqData)
        if (!isEmpty(validationError)) {
            setValidateError(validationError)
            setLoader(false)
            return
        }

        try {
            const { status, loading, error, message, result } = await disabled2faCode(reqData,dispatch);
            setLoader(loading)
            if (status == 'success') {
                toastAlert('success', t(message), 'twoFA')
                setCode('')
                setSecretData(result)
            } else {
                if (error) {
                    setValidateError(error)
                } else if (error) {
                    toastAlert('error', t(message), 'twoFA')
                }
            }
        } catch (err) { }
    }

    const enableTwoFa = async () => {
        setLoader(true)

        let reqData = {
            "secret": secretData.secret,
            "uri": secretData.uri,
            "code": code,
            "checkValue": checkValue
        }
        let validationError = validation(reqData)
        if (!isEmpty(validationError)) {
            setValidateError(validationError)
            setLoader(false)
            return
        }

        try {
            const { status, loading, error, message, result } = await update2faCode(reqData,dispatch);
            setLoader(loading)
            if (status == 'success') {
                toastAlert('success', t(message), 'twoFA')
                setCode('')
                setSecretData(result)
            } else {
                if (error) {
                    setValidateError(error)
                } else if (error) {
                    toastAlert('error', t(message), 'twoFA')
                }
            }
        }
        catch (err) { }
    }


    useEffect(() => {
        fetchTwoFA();
    }, [])

    return (
        <div className="profileDetailView ">


            <GridContainer>
                <GridItem xs={12} sm={12} md={6} lg={6}>
                    <h4 className="profileDetailView1">{t("TWO_FA")} <small>{t("STATUS")} - <span
                        className={clsx(
                            { "greenText": secretData && secretData.twoFaStatus == 'enabled' },
                            { "textRed": secretData && secretData.twoFaStatus == 'disable' },
                        )}
                    >{secretData && t(twoFAStatus(secretData.twoFaStatus, 'status'))}</span></small></h4>
                    <div className="twoFAForm">
                        <GridContainer>
                            <GridItem xs={12} sm={5} md={6} lg={5}>
                                <p className="text-center text-white"><small className='text-white'>{t("SCAN_QR_CODE")}</small></p>
                                <div className="qrScanCode">
                                    <img
                                        src={secretData && secretData.imageUrl}
                                        alt="" className="img-fluid" />
                                </div>
                            </GridItem>
                            <GridItem xs={12} sm={7} md={6} lg={6}>
                                <form className="contact_form mb-0">
                                    <div className="form-group">
                                        <label>{t("TWO_FA_CODE")}</label>
                                        <div class="input-group disabledGroup">
                                            <input
                                                type="text"
                                                class="form-control"
                                                value={secretData && secretData.secret}
                                                disabled
                                            />

                                            <div className="input-group-append">
                                                <CopyToClipboard
                                                    text={secretData && secretData.secret}
                                                    onCopy={() => { toastAlert("success", "Copied!", 'twoFa') }}
                                                >
                                                    <a href="#" className="btn btnType1 py-0 my-0 px-2">
                                                        <i class="fas fa-copy"></i>
                                                    </a>
                                                </CopyToClipboard>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>{t("ENTER_TWO_FA_CODE")}</label>
                                        <input type="text" className="form-control"
                                            name="code"
                                            value={code}
                                            onChange={handleChange}
                                        />
                                        {
                                            validateError.code && <p className="error-message">{t(validateError.code)}</p>
                                        }
                                    </div>
                                    <div className="form-group mb-0">

                                        {
                                            secretData && secretData.twoFaStatus == "disabled" && <button
                                                className="btn btn-primary text-uppercase py-2 w-100"
                                                type="button"
                                                onClick={enableTwoFa}
                                            >
                                                {loader && <i class="fas fa-spinner fa-spin"></i>}
                                                {t(twoFAStatus(secretData.twoFaStatus, 'button'))}
                                            </button>
                                        }
                                        {
                                            secretData && secretData.twoFaStatus == "enabled" && <button
                                                className="btn btn-primary text-uppercase py-2 w-100"
                                                type="button"
                                                onClick={disableTwoFa}
                                            >
                                                {loader && <i class="fas fa-spinner fa-spin"></i>}
                                                {t(twoFAStatus(secretData.twoFaStatus, 'button'))}
                                            </button>
                                        }

                                    </div>
                                    <div className="form-check mt-3">
                                        {secretData && secretData.twoFaStatus == "disabled" && <div> <Checkbox
                                            name="CheckValue"
                                            onChange={handleCheckBox}
                                            checked={checkValue}
                                            hidden={true}
                                        /> <label className="form-check-label" for="flexCheckDefault"> {t('HAVE_BACKUP')}</label>

                                            {validateError.checkValue && <p className="error-message">{t(validateError.checkValue)}</p>}
                                        </div>}
                                    </div>
                                </form>
                            </GridItem>
                        </GridContainer>
                    </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={6} lg={6}>
                    <div className="settingsNote">
                        <h6>{t("NOTES")}</h6>
                        <p>
                            {t("TWO_FA_DESCRIPTION1")}{" "}
                            {
                                isMobile() && mobileType() == 'android' && <a href={config.AUTHENTICATOR_URL.PLAY_STORE}>{t("DOWNLOAD_HERE")}</a>
                            }
                            {
                                isMobile() && mobileType() == 'ios' && <a href={config.AUTHENTICATOR_URL.APP_STORE}>{t("DOWNLOAD_HERE")}</a>
                            }
                            {
                                !isMobile() && <a
                                    href={mobileType() == 'mac' ? config.AUTHENTICATOR_URL.APP_STORE : config.AUTHENTICATOR_URL.PLAY_STORE}
                                    target="_blank"
                                >
                                    {t("DOWNLOAD_HERE")}
                                </a>
                            }
                        </p>
                    </div>
                    <div className="settingsNote">
                        <h6>{t("HOW_ENABLE")}</h6>
                        <ul>
                            <li>{t("TWO_FA_DESCRIPTION2")}</li>
                            <li>{t("TWO_FA_DESCRIPTION3")}</li>
                        </ul>
                    </div>
                </GridItem>
            </GridContainer>
        </div>
    )
}

export default TwoFA;