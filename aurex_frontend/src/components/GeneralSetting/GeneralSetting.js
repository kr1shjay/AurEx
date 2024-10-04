// import package
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import {
    MenuItem,
    Select
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import action
import { getLanguage, getCurrency, setTimeZone } from '../../actions/commonAction';
import { editUserSetting } from '../../actions/users';

// import lib
import isEmpty from '../../lib/isEmpty';
import { capitalize } from '../../lib/stringCase'
import pageList from './pageList.json';
import validation from './validation';
import { toastAlert } from '../../lib/toastAlert';

const initialFormValue = {
    "languageId": '',
    "theme": "light",
    "currencySymbol": "",
    "timeZone": {
        "name": "",
        "GMT": "",
    },
    "afterLogin": {
        "page": "",
        "url": ""
    },
}

const GeneralSetting = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    // state
    const [formValue, setFormValue] = useState(initialFormValue)
    const [validateError, setValidateError] = useState({});
    const [loader, setLoader] = useState();

    const { languageId, theme, currencySymbol, timeZone, afterLogin } = formValue;

    // redux-state
    const languageOption = useSelector(state => state.language)
    const currencyOption = useSelector(state => state.currency)
    // const timezoneOption = useSelector(state => state.timezone)
    const userSetting = useSelector(state => state.userSetting)

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let formData = {}
        /* if (name == 'timeZone') {
            let findTimeZone = timezoneOption.find((el => el.name == value))
            if (findTimeZone) {
                formData = {
                    "timeZone": {
                        "name": findTimeZone.name,
                        "GMT": findTimeZone.GMT,
                    }
                }
            }
        } else  */if (name == 'afterLogin') {
            let findPage = pageList.find((el => el.label == value))
            if (findPage) {
                formData = {
                    "afterLogin": {
                        "page": findPage.label,
                        "url": findPage.url
                    }
                }
            }
        } else {
            formData = { [name]: value }
        }

        setFormValue({ ...formValue, ...formData })
        if (!isEmpty(validateError)) {
            setValidateError({})
        }
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoader(true)
        let reqData = {
            // languageId,
            // theme,
            currencySymbol,
            // timeZone,
            afterLogin
        }
        let validationError = validation(reqData)
        console.log(validationError, '-----------error')
        if (!isEmpty(validationError)) {
            setValidateError(validationError)
            setLoader(false)
            return
        }

        try {
            let { status, loading, error, message, result } = await editUserSetting(reqData, dispatch);
            setLoader(loading)
            if (status == "success") {
                setFormValue(result)
                toastAlert('success', t(message), 'setting');
            } else {
                if (error) {
                    setValidateError(error);
                } else if (message) {
                    toastAlert('error', t(message), 'setting');
                }
            }
        }
        catch (err) { }
    }

    useEffect(() => {
        if (!isEmpty(userSetting)) {
            setFormValue(userSetting)
        }
    }, [userSetting])

    useEffect(() => {
        if (!(languageOption && languageOption.length > 0)) {
            getLanguage(dispatch);
        }

        // if (!(timezoneOption && timezoneOption.length > 0)) {
        //     setTimeZone(dispatch)
        // }
    }, [])

    return (
        <>
            <div className="row align-items-center">
                <div className="col-lg-12">
                    <h3 className="dash_title mb-3">{t('GENERAL_SETTINGS')}</h3>
                </div>
            </div>
            <div className="">
                <form className="contact_form mb-0">
                    <div className="settingsSelect">
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={6} lg={3}>
                                <div className="form-group">
                                    <label>{t('DEFAULT_FIAT_CURRENCY')}</label>
                                    <Select
                                        value={currencySymbol}
                                        name="currencySymbol"
                                        onChange={handleChange}
                                        displayEmpty
                                    >
                                        {
                                            currencyOption && currencyOption.length > 0 && currencyOption.map((item, key) => {
                                                // if (item.type == 'crypto' && item.coin != 'BTC') {
                                                //     return (
                                                //         <MenuItem value={item.coin} key={key}>{item.coin}</MenuItem>
                                                //     )
                                                // }
                                                if (item.type == 'token' && item.coin == 'USDT') {
                                                    return (
                                                        <MenuItem value={item.coin} key={key}>{item.coin}</MenuItem>
                                                    )
                                                }
                                            })
                                        }
                                    </Select>
                                    {
                                        validateError.currencySymbol && <p className="error-message">{t(validateError.currencySymbol)}</p>
                                    }
                                </div>
                            </GridItem>
                            {/* <GridItem xs={12} sm={12} md={6} lg={3}>
                                <div className="form-group">
                                    <label>{t("DEFAULT_THEME")}</label>
                                    <Select
                                        name="theme"
                                        value={theme}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={'light'}>{t("LIGHT_THEME")}</MenuItem>
                                        <MenuItem value={'dark'}>{t("DARK_THEME")}</MenuItem>
                                    </Select>
                                    {
                                        validateError.theme && <p className="error-message">{t(validateError.theme)}</p>
                                    }
                                </div>
                            </GridItem> */}
                            <GridItem xs={12} sm={12} md={6} lg={3}>
                                <div className="form-group">
                                    <label>{t('PAGE_AFTER_LOGIN')}</label>
                                    <Select
                                        name={'afterLogin'}
                                        value={afterLogin.page}
                                        onChange={handleChange}
                                    >
                                        {
                                            //  {
                                            //     "label": "wallet",
                                            //     "url": "/wallet"
                                            // },
                                            // {
                                            //     "label": "spot trade",
                                            //     "url": "/spot"
                                            // }
                                            pageList && pageList.length > 0 && pageList.map((item, key) => {
                                                return (
                                                    <MenuItem value={item.label}>{capitalize(item.label)}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                    {
                                        validateError.afterLogin && <p className="error-message">{t(validateError.afterLogin)}</p>
                                    }
                                </div>
                            </GridItem>
                            {/* <GridItem xs={12} sm={12} md={6} lg={3}>
                                <div className="form-group">
                                    <label>{t('DEFAULT_LANGUAGE')}</label>
                                    <Select
                                        name="languageId"
                                        value={languageId}
                                        onChange={handleChange}
                                    >
                                        {
                                            languageOption && languageOption.length > 0 && languageOption.map((item, key) => {
                                                return (
                                                    <MenuItem value={item._id}>{capitalize(item.name)}</MenuItem>
                                                )
                                            })
                                        }

                                    </Select>
                                    {
                                        validateError.languageId && <p className="error-message">{t(validateError.languageId)}</p>
                                    }
                                </div>
                            </GridItem> */}
                            {/* <GridItem xs={12} sm={12} md={6} lg={6}>
                                <div className="form-group">
                                    <label>My Default Time Zone</label>
                                    <Select
                                        name={'timeZone'}
                                        value={timeZone.name}
                                        onChange={handleChange}
                                    >
                                        {
                                            timezoneOption && timezoneOption.length > 0 && timezoneOption.map((item, key) => {
                                                return (
                                                    <MenuItem key={key} value={item.name}>
                                                        {item.label}
                                                    </MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                    {
                                        validateError.timeZone && <p className="error-message">{t(validateError.timeZone)}</p>
                                    }
                                </div>
                            </GridItem> */}
                        </GridContainer>
                    </div>
                    <div className="form-group mb-0">
                        <button
                            className="btn btn-primary text-uppercase py-2"
                            onClick={handleFormSubmit}
                        >
                            {loader && <i class="fas fa-spinner fa-spin"></i>}
                            {t('Submit')}
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default GeneralSetting;