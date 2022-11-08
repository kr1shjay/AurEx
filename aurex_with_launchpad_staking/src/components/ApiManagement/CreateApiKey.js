// import package
import React, { useState } from 'react';

import {
    Radio,
    RadioGroup,
    FormControlLabel
} from '@material-ui/core';
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

const initialFormValue = {
    'name': '',
    'ipRestriction': false,
    'password': '',
    'ipList': ''
}

const CreateApiKey = (props) => {
    const { t, i18n } = useTranslation();

    // props
    const { handleList } = props;

    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [loader, setLoader] = useState(false)
    const [validateError, setValidateError] = useState({});
    const [newRecord, setNewRecord] = useState({})

    const { name, ipRestriction, password, ipList } = formValue;

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
            ipList
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
            } else {
                if (error) {

                } else {
                    toastAlert('error', message, 'apiKey')
                }
            }
        } catch (err) { }
    }

    return (
        <>
            <h5 class="dash_subtitle">Create an API Key</h5>
            <form className="contact_form settingsSelect apiForm  mb-0">
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
                            <p className="mb-0"><small>{t('REF_KEY_LATER')}</small></p>
                        </div>
                    </GridItem>
                </GridContainer>
                <GridContainer>
                    <GridItem xs={12} sm={6} md={6} lg={6}>
                        <div className="form-group">
                            <label>{t('IP_RESTRICTION')}</label>
                            <RadioGroup name="ipRestriction" value={ipRestriction.toString()} onChange={handleChange}>
                                <FormControlLabel
                                    value={'false'}
                                    control={<Radio />}
                                    label="Unrestricted (Less Secure)  This API key allows access from any IP address. This is not recommended."
                                />
                                <FormControlLabel
                                    value={'true'}
                                    control={<Radio />}
                                    label="Restrict access to trusted IPs only (Recommended)"
                                />
                            </RadioGroup>
                            {
                                validateError.ipRestriction && <p className="error-message">{t(validateError.ipRestriction)}</p>
                            }

                            {
                                ipRestriction == 'true' && <><input
                                    type="text"
                                    className="form-control w-50"
                                    name='ipList'
                                    value={ipList}
                                    onChange={handleChange}
                                />
                                    <p><small>{t('SECURITY_REASONS')}</small></p>

                                    {
                                        validateError.ipList && <p className="error-message">{t(validateError.ipList)}</p>
                                    }
                                </>
                            }

                        </div>
                    </GridItem>
                </GridContainer>

                <GridContainer>
                    <GridItem xs={12} sm={6} md={6} lg={6}>
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
                                <label>{t('PASSWORD')}</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={password}
                                    onChange={handleChange}
                                />
                                {
                                    validateError.password && <p className="error-message">{t(validateError.password)}</p>
                                }
                            </div>

                            <div className="form-group mb-0 mt-2">
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
                !isEmpty(newRecord) && <div>
                    <h3>{t('WRITE_SECRET_KEY')}</h3>
                    <p>{t('SOMEWHERE_SAFE')}</p>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="checkbox pt-2"><label>{t('ID')}:</label></div>
                            </div>
                            <div className="col-md-8">
                                <div>
                                    <input type="test" defaultValue={newRecord.keyId} disabled={true} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="checkbox pt-2"><label>{t('SECRET')}:</label></div>
                            </div>
                            <div className="col-md-8">
                                <div>
                                    <input type="test" defaultValue={newRecord.secretKey} disabled={true} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

        </>
    )
}

export default CreateApiKey;