// import package
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import clsx from 'classnames';

import {
    Radio,
    RadioGroup,
    FormControlLabel
} from '@material-ui/core';

// import Checkbox from 'rc-checkbox'; 

import Checkbox from '@material-ui/core/Checkbox';

import { useTranslation } from 'react-i18next';

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import action
import { newApiKey } from '../../actions/apiMgmtAction'

// import lib
import { toastAlert } from '../../lib/toastAlert';
import validation from './validation';
import isEmpty from '../../lib/isEmpty';
import { useSelector, useDispatch } from 'react-redux'

const initialFormValue = {
    'name': '',
    'ipRestriction': false,
    'password': '',
    'ipList': '',
    "showPassword": false,
    'withdraw': false,
    'deposit': false,
    'trade': false
}

const CreateApiKey = (props) => {
    const { t, i18n } = useTranslation();

    // props
    const { handleList, record } = props;

    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [loader, setLoader] = useState(false)
    const [validateError, setValidateError] = useState({});
    const [newRecord, setNewRecord] = useState({})
    const [showSecret,setShow]=useState(false)
    const selector = useSelector(state => state.apikey)
    console.log("selector", selector)

    const { name, ipRestriction, password, showPassword, showConfirmPassword, ipList, withdraw, trade } = formValue;

    // function
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let formData = { ...formValue, ...{ [name]: value } }
        setFormValue(formData)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let reqData = {
            name,
            ipRestriction,
            password,
            ipList,
            withdraw,
            trade
        }

        let validationError = validation(reqData)
        if (!isEmpty(validationError)) {
            setValidateError(validationError)
            setLoader(false)
            return
        }

        try {
            setLoader(true)
            const { status, loading, message, error, result } = await newApiKey(reqData);
            setLoader(loading)
            if (status == 'success') {
                handleList(result.list)
                setNewRecord(result.data)
                toastAlert('success', message, 'apiKey')
                setFormValue(initialFormValue)
                setValidateError({})
            } else {
                if (error) {
                    setValidateError(error)
                } else {
                    toastAlert('error', message, 'apiKey')
                }
            }
        } catch (err) { }
    }
    useEffect(() => {
        console.log('record', selector)
        setNewRecord({})
    }, [selector])


    return (
        <>
            <div>
                <div>

                    <div>
                        <GridContainer>
                            <GridItem lg={12}>
                                <div className="launchpadCoinName">
                                    <h3 className='login_title_8'>Create an API Key
                                        {/* <small className='text_sm_white mb-0'>{data.coin}</small> */}
                                    </h3>
                                </div>
                            </GridItem>
                        </GridContainer>
                    </div>
                    <form className="contact_form settingsSelect apiForm  mb-0 mt-5">
                        <GridContainer>
                            <GridItem xs={12} sm={6} md={6} lg={6}>
                                <div className="form-group">
                                    <label>{t('NAME')}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={name}
                                        onChange={handleChange}
                                    />
                                    <p className="mb-0 mt-1">{t('REF_KEY_LATER')}</p>
                                    {
                                        validateError.name && <p className="error-message">{t(validateError.name)}</p>
                                    }
                                </div>
                            </GridItem>

                            <GridItem xs={12} sm={6} md={6} lg={6}>
                                <div className="form-group">
                                    <label>{t('PASSWORD')}</label>
                                    <div className='input-group input_grp_style_new1'>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="form-control"
                                            name="password"
                                            value={password}
                                            onChange={handleChange}
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
                                    {
                                        validateError.password && <p className="error-message">{t(validateError.password)}</p>
                                    }
                                </div>
                            </GridItem>
                        </GridContainer>
                        <div className='profileDetailView mt-3'>
                            <h4>{t('IP_RESTRICTION')}</h4>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={12} lg={12}>
                                    <div className="form-group">




                                        <RadioGroup name="ipRestriction" value={ipRestriction.toString()} onChange={handleChange} className='row radio_row_werp'>
                                            <FormControlLabel
                                                value={'false'}
                                                className="orderRadio col-12 col-md-6"
                                                control={<Radio />}
                                                label="Unrestricted (Less Secure)  This API key allows access from any IP address. This is not recommended."
                                            />
                                            <FormControlLabel
                                                value={'true'}
                                                className="orderRadio labelspan_cjk  col-12 col-md-6 col_no_span_labl"
                                                control={<Radio />}
                                                label="Restrict access to trusted IPs only (Recommended)"
                                            />
                                        </RadioGroup>
                                        {
                                            validateError.ipRestriction && <p className="error-message">{t(validateError.ipRestriction)}</p>
                                        }
                                        <div className='row'>
                                            <div className='col-12 col-md-6 offset-md-6'>
                                                {
                                                    ipRestriction == 'true' && <><input
                                                        type="text"
                                                        className="form-control"
                                                        name='ipList'
                                                        value={ipList}
                                                        onChange={handleChange}
                                                    />
                                                        <p className='mt-1'>{t('SECURITY_REASONS')}</p>

                                                        {
                                                            validateError.ipList && <p className="error-message">{t(validateError.ipList)}</p>
                                                        }
                                                    </>
                                                }
                                            </div>
                                        </div>


                                    </div>
                                </GridItem>
                            </GridContainer>
                        </div>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={12} lg={12}>
                                <div className="form-group">
                                    {/* <label>Key Permissions</label>
                        <Select value={5} className="w-50">
                            <MenuItem value={5}>-</MenuItem>
                            <MenuItem value={10}>Order</MenuItem>
                            <MenuItem value={20}>Order - cancel</MenuItem>
                        </Select>
                        <p className="mb-0 mt-1">
                            <small className="d-block">Set "Order" to allow usage of all <span className="bgHighlight">/order</span> and <span className="bgHighlight">/position</span> routes.</small>
                            <small className="d-block">Set "Order Cancel" to allow <b>only</b> the cancelation of orders.</small>
                        </p>
                        <div className="form-group">
                            <div className="form-check mb-0">u
                                <Checkbox
                                    color="primary"
                                    className="pl-0"
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    name=""
                                />
                                <label className="form-check-label pl-0" for="flexCheckDefault">
                                    Withdraw
                                </label>
                            </div>
                        </div> */}
                                    {/* <p className="noteText">Set to allow the creation and confirmation of withdrawals.</p> */}

                                    <div className="form-group">
                                        <GridContainer>
                                            <GridItem xs={12} sm={3} md={3} lg={3}>
                                                <div className="form-check mb-0">
                                                    <Checkbox

                                                        color="primary"
                                                        className="pl-0"
                                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                        name="withdraw"
                                                        value={withdraw}
                                                        onChange={() => setFormValue({ ...formValue, ...{ withdraw: !withdraw } })}
                                                    />
                                                    <label className="form-check-label pl-0 mb-0" for="flexCheckDefault">{t('WITHDRAW')}
                                                    </label>
                                                </div>
                                            </GridItem>
                                            <GridItem xs={12} sm={3} md={3} lg={3}>
                                                <div className="form-check mb-0">
                                                    <Checkbox
                                                        color="primary"
                                                        className="pl-0"
                                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                        name="trade"
                                                        value={trade}
                                                        onChange={() => setFormValue({ ...formValue, ...{ trade: !trade } })}

                                                    />
                                                    <label className="form-check-label pl-0 mb-0" for="flexCheckDefault">{t('TRADE')}
                                                    </label>
                                                </div>
                                            </GridItem>
                                        </GridContainer>





                                        {/* {
                                    validateError.password && <p className="error-message">{t(validateError.password)}</p>
                                } */}
                                    </div>








                                    <div className="form-group mb-0 mt-3 text-center">
                                        <button
                                            className="btn btn-primary text-uppercase py-2 m-0"
                                            type="button"
                                            onClick={handleSubmit}
                                            disabled={loader}
                                        >
                                            {t('CREATE_API_KEY')}
                                        </button>
                                    </div>
                                </div>
                            </GridItem>
                        </GridContainer>
                    </form>

                    {
                        !isEmpty(newRecord) && newRecord && <div>
                            <div className='profileDetailView mt-3 '>
                                <h4>{t('WRITE_SECRET_KEY')}</h4>
                            </div>
                            <p>{t('SOMEWHERE_SAFE')}</p>
                            <div className='contact_form mt-3'>
                                <GridContainer>
                                    <GridItem xs={12} sm={6} md={6} lg={6}>
                                        <div className="form-group">
                                            <label>{t('ID')}</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="id"
                                                onChange={handleChange}
                                                defaultValue={newRecord.keyId} disabled={true}
                                            />

                                        </div>
                                    </GridItem>
                                    <GridItem xs={12} sm={6} md={6} lg={6}>
                                    <label>{t('SECRET')}</label>

                                        <div className="input-group input_grp_style_new1 input_grp_style_new_pad_rem">
                                            <input
                                                type={showSecret ? "text":"password"}
                                                className="form-control"
                                                name="secret"
                                                onChange={handleChange}
                                                defaultValue={newRecord.secretKey} disabled={true}
                                            />
                                            <Link className="input_grp_appe_secret_align" onClick={(e) => {
                                                e.preventDefault();
                                                setShow(!showSecret)
                                            }}>
                                                <i className={clsx("fa", { "fa-eye": showSecret }, { "fa-eye-slash": !showSecret })} aria-hidden="true"></i>
                                            </Link>
                                        </div>
                                        {/* <div className="input-group-append">
                                            
                                        </div> */}
                                    </GridItem>
                                    <GridItem xs={12} sm={6} md={6} lg={6}>
                                        <div className="form-group">
                                            <label>{t('API_KEY')}</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="api"
                                                onChange={handleChange}
                                                defaultValue={newRecord.apiKey} disabled={true}
                                            />

                                        </div>
                                    </GridItem>
                                </GridContainer>
                            </div>



                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default CreateApiKey;