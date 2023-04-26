//import package
import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { CountryDropdown } from 'react-country-region-selector';
import clsx from 'classnames';
import { useDispatch } from 'react-redux';

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import action
import { editUserProfile, showBtn } from '../../actions/users'

// import lib
import { toastAlert } from '../../lib/toastAlert';
import isEmpty from '../../lib/isEmpty';
import validation from './validation';
import { objectUrl } from '../../lib/fileObjectUrl'

// import asset
import profileImg from '../../assets/images/default.jpeg'

const initialFormValue = {
    'firstName': '',
    'lastName': '',
    'email': '',
    'blockNo': '',
    'address': '',
    'country': '',
    'state': '',
    'city': '',
    'postalCode': '',
    'profileImage': ''
}

const EditDetail = forwardRef((props, ref) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch()
    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [validateError, setValidateError] = useState({});
    const [loader, setLoader] = useState();
    const [editForm, setEditForm] = useState(true);
    const [hide, setHide] = useState('false')

    const { firstName, lastName, blockNo, address, country, state, city, postalCode, profileImage } = formValue;

    // function
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let formData = { ...formValue, ...{ [name]: value } }
        setFormValue(formData)
        if (!isEmpty(validateError)) {
            setValidateError({})

        }
    }

    const handleCountry = (value) => {
        let formData = { ...formValue, ...{ 'country': value } }
        setFormValue(formData)
        if (!isEmpty(validateError)) {
            setValidateError({})
        }
        // setValidateError(validation(formData))
    }

    const handleFile = async (e) => {
        const { name, files } = e.target;
        let formData = { ...formValue, ...{ [name]: files[0] } }
        setFormValue(formData)
        if (!isEmpty(validateError)) {
            setValidateError({})
        }
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        let reqData = {
            firstName,
            lastName,
            blockNo,
            address,
            country,
            state,
            city,
            profileImage,
            postalCode
        }
        let validationError = validation(reqData)
        if (!isEmpty(validationError)) {
            setValidateError(validationError)
            return
        }
        setLoader(true)

        const formData = new FormData();
        formData.append('firstName', reqData.firstName);
        formData.append('lastName', reqData.lastName);
        formData.append('blockNo', reqData.blockNo);
        formData.append('address', reqData.address);
        formData.append('country', reqData.country);
        formData.append('state', reqData.state);
        formData.append('city', reqData.city);
        formData.append('postalCode', reqData.postalCode);
        formData.append('profileImage', reqData.profileImage);

        try {
            const { status, loading, message, error } = await editUserProfile(formData, dispatch)
            setLoader(loading)
            if (status == 'success') {
                setEditForm(true)
                setFormValue(initialFormValue)
                toastAlert('success', t(message), 'editProfile');
                if (hide == 'false') {
                    window.location.reload()
                }
            } else {
                if (error) {
                    setValidateError(error)
                    return
                }
                toastAlert('error', t(message), 'editProfile');
            }
        } catch (err) { }
    }

    useImperativeHandle(
        ref,
        () => ({
            editForm(data) {
                setEditForm(false)
                let formData = {
                    'firstName': data.firstName,
                    'lastName': data.lastName,
                    'email': data.email,
                    'blockNo': data.blockNo,
                    'address': data.address,
                    'country': data.country,
                    'state': data.state,
                    'city': data.city,
                    'postalCode': data.postalCode,
                    'profileImage': data.profileImage
                }
                setFormValue(formData)
            }
        }),
    )

    const show = async () => {
        let { result, status } = await showBtn()
        if (status == 'success') {
            setHide(result.status)
        }
    }
    useEffect(() => {
        show()
    }, [])

    return (
        <form className={clsx("contact_form", { "disabledForm": editForm }, "mb-0")}>
            <GridContainer>
                {/* <GridItem xs={12} sm={6} md={6} lg={3}>
                    <div className="profile_name">
                        <div>
                            <img
                                src={objectUrl(profileImage, profileImg)}
                                // src={require("../../assets/images/circle_card_section.png")}
                                alt="logo"
                                className="img-fluid"
                            />
                        </div>
                        <div>
                            <label>{t("PROFILE_IMAGE")}</label>
                            <div className="custom-file">
                                <input
                                    type="file"
                                    className="custom-file-input"
                                    aria-describedby="inputGroupFileAddon01"
                                    name="profileImage"
                                    disabled={editForm}
                                    onChange={handleFile}
                                />
                                <label className="custom-file-label">
                                    {t("FILE_FORMAT1", { "SIZE": "2MB" })}
                                </label>
                                {validateError.profileImage && <p className="error-message">{t(validateError.profileImage)}</p>}
                            </div>
                        </div>
                    </div>
                </GridItem> */}
                <GridItem xs={12} sm={12} md={12} lg={12}>
                    <GridContainer>
                        <GridItem xs={12} sm={6} md={6} lg={3}>
                            <div className="form-group">
                                <label>{t('FIRST_NAME')}<span className="textRed">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name={"firstName"}
                                    value={firstName}
                                    maxLength={20}
                                    onChange={handleChange}
                                // disabled={editForm}
                                />
                                {validateError.firstName && <p className="error-message">{t(validateError.firstName)}</p>}
                            </div>
                        </GridItem>
                        <GridItem xs={12} sm={6} md={6} lg={3}>
                            <div className="form-group">
                                <label>{t('LAST_NAME')}<span className="textRed">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name={"lastName"}
                                    value={lastName}
                                    maxLength={20}
                                    onChange={handleChange}
                                // disabled={editForm}
                                />
                                {validateError.lastName && <p className="error-message">{t(validateError.lastName)}</p>}
                            </div>
                        </GridItem>
                        <GridItem xs={12} sm={6} md={6} lg={3}>
                            <div className="form-group">
                                <label>{t('BUILDING_BLOCK')}</label><span className="textRed">*</span>
                                <input
                                    type="text"
                                    className="form-control"
                                    name={"blockNo"}
                                    value={blockNo}
                                    onChange={handleChange}
                                />
                                {validateError.blockNo && <p className="error-message">{t(validateError.blockNo)}</p>}
                            </div>
                        </GridItem>
                        <GridItem xs={12} sm={6} md={6} lg={3}>
                            <div className="form-group">
                                <label>{t('ADDRESS')}<span className="textRed">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name={"address"}
                                    value={address}
                                    onChange={handleChange}
                                // disabled={editForm}
                                />
                                {validateError.address && <p className="error-message">{t(validateError.address)}</p>}
                            </div>
                        </GridItem>
                        <GridItem xs={12} sm={6} md={6} lg={3}>
                            <div className="form-group">
                                <label>{t('CITY')}<span className="textRed">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name={"city"}
                                    value={city}
                                    onChange={handleChange}
                                // disabled={editForm}
                                />
                                {validateError.city && <p className="error-message">{t(validateError.city)}</p>}
                            </div>
                        </GridItem>
                        <GridItem xs={12} sm={6} md={6} lg={3}>
                            <div className="form-group">
                                <label>{t('POSTAL_CODE')}<span className="textRed">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name={"postalCode"}
                                    value={postalCode}
                                    onChange={handleChange}
                                // disabled={editForm}
                                />
                                {validateError.postalCode && <p className="error-message">{t(validateError.postalCode)}</p>}
                            </div>
                        </GridItem>
                        <GridItem xs={12} sm={6} md={6} lg={3}>
                            <div className="form-group">
                                <label>{t("STATE_PROVISION")}</label><span className="textRed">*</span>
                                <input
                                    type="text"
                                    className="form-control"
                                    name={"state"}
                                    value={state}
                                    onChange={handleChange}
                                // disabled={editForm}
                                />
                                {validateError.state && <p className="error-message">{t(validateError.state)}</p>}
                            </div>
                        </GridItem>
                        <GridItem xs={12} sm={6} md={6} lg={3}>
                            <div className="form-group">
                                <label>{t("COUNTRY")}<span className="textRed">*</span></label>
                                <CountryDropdown
                                    value={country}
                                    onChange={handleCountry}
                                    // onBlur={handleBlurCountry}
                                    className="country_dropdown form-control"
                                // disabled={editForm}
                                />
                                {validateError.country && <p className="error-message">{t(validateError.country)}</p>}
                            </div>
                        </GridItem>

                        <GridItem xs={12} sm={12} md={12} lg={12}>
                            {

                                !editForm && <div className="form-group mb-0 ">
                                    <button
                                        type="button"
                                        className="btn btn-primary text-uppercase py-2 button_profile_width"
                                        onClick={handleFormSubmit}
                                    >
                                        {loader && <i className="fas fa-spinner fa-spin"></i>} {t('SUBMIT')}
                                    </button>
                                </div>
                            }
                            {
                                hide == 'false' ?
                                    <button
                                        type="button"
                                        className="btn btn-primary text-uppercase py-2 button_profile_width"
                                        onClick={handleFormSubmit}
                                    >
                                        {loader && <i className="fas fa-spinner fa-spin"></i>} {t('Submit')}
                                    </button> : null
                            }
                        </GridItem>
                    </GridContainer>
                </GridItem>
            </GridContainer>

        </form>
    )
})

export default EditDetail;