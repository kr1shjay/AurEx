// import package
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem, Select } from '@material-ui/core';
import { useDispatch } from 'react-redux';

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import action
import { updateIdProof } from '../../actions/userKyc';

// import lib
import isEmpty from '../../lib/isEmpty';
import { toastAlert } from '../../lib/toastAlert';
import validation from './validation';

const initialFormValue = {
    'type': "driving_license",
    'proofNumber': '',
    'frontImage': '',
    'backImage': '',
    'selfiImage': '',
    'panImage': '',
}

const ProofForm = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [validateError, setValidateError] = useState({});
    const [loader, setLoader] = useState();

    const { type, proofNumber, frontImage, backImage, selfiImage, panImage } = formValue;

    // function
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        if (name == "proofNumber") {
            if (/[^a-zA-Z0-9]/.test(value)) return
        }
        let formData = { ...formValue, ...{ [name]: value } }
        setFormValue(formData)
        if (!isEmpty(validateError)) {
            setValidateError({})
        }
    }

    const handleFile = async (e) => {
        const { name, files } = e.target;
        let fileSize = files[0].size
        let filesize = Math.round(( fileSize/ 1024));
        const maxsize = 9*1024
        if(filesize > maxsize  ){
            setValidateError({...validateError,...{[name]:"image size is large"}})
            return false
        }
        let formData = { ...formValue, ...{ [name]: files[0] } }
        setFormValue(formData)
        if (!isEmpty(validateError)) {
            setValidateError({})
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true)
        let reqData = {
            type,
            proofNumber,
            frontImage,
            backImage,
            selfiImage,
            panImage,
            proofType:'id'
        }

        let validationError = validation(reqData)
        if (!isEmpty(validationError)) {
            setValidateError(validationError)
            setLoader(false)
            return
        }
        try {
            const formData = new FormData();
            formData.append('type', type);
            formData.append('proofNumber', proofNumber);
            formData.append('frontImage', frontImage);
            formData.append('backImage', backImage);
            formData.append('selfiImage', selfiImage);
            formData.append('panImage', panImage);

            const { status, loading, message, error } = await updateIdProof(formData, dispatch);
            setLoader(loading)
            if (status == 'success') {
                toastAlert('success', t(message), 'idproof')
            } else {
                if (error) {
                    setValidateError(error)
                    return
                }
                toastAlert('error', t(message), 'idproof')
            }
        } catch (err) { }
    }

    return (
        <form className="contact_form mb-0 settingsSelect">
            <GridContainer>
                <GridItem xs={12} sm={12} md={6} lg={6}>
                    <div className="form-group">
                        <label>{t("IDENTIFICATION_DOCUMENT")}</label>
                        <Select
                            name="type"
                            value={type}
                            onChange={handleChange}
                        >
                            <MenuItem value={'passport'}>{t("PASSPORT")}</MenuItem>
                            <MenuItem value={'citizenship'}>{t("CITIZEN_SHIP")}</MenuItem>
                            <MenuItem value={'driving_license'}>{t("DRIVING_LICENSE")}</MenuItem>
                        </Select>
                        {
                            validateError.type && <p className="error-message">{t(validateError.type)}</p>
                        }
                    </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={6} lg={6}>
                    <div className="form-group">
                        <label>{t("SELECTED_ID_NUMBER")}</label>
                        <input type="text" className="form-control"
                            name="proofNumber"
                            value={proofNumber}
                            onChange={handleChange}
                        />
                        {
                            validateError.proofNumber && <p className="error-message">{t(validateError.proofNumber)}</p>
                        }
                    </div>
                </GridItem>
            </GridContainer>
            <GridContainer>
                <GridItem xs={12} sm={12} md={6} lg={6}>
                    <div className="form-group">

                        <label>
                            {
                                type == 'passport' ? t("PICTURE_SCAN") : t("FRONT_SIDE")
                            }
                        </label>

                        <div className="custom-file">
                            <input
                                type="file"
                                className="custom-file-input"
                                aria-describedby="inputGroupFileAddon01"
                                name="frontImage"
                                onChange={handleFile}
                            />
                            <label className="custom-file-label">
                                {
                                    frontImage && frontImage.name ? <small>{frontImage.name}</small> : <small>{t("IDENTITY_HINT2")}</small>
                                }
                            </label>
                        </div>
                        <p>{t("IDENTITY_HINT1")}</p>
                        {
                            validateError.frontImage && <p className="error-message">{t(validateError.frontImage)}</p>
                        }
                    </div>
                </GridItem>
                {
                    type != 'passport' && <GridItem xs={12} sm={12} md={6} lg={6}>

                        <div className="form-group">
                            <label>{t("BACK_SIDE")}</label>
                            <div className="custom-file">
                                <input
                                    type="file"
                                    className="custom-file-input"
                                    aria-describedby="inputGroupFileAddon01"
                                    name="backImage"
                                    onChange={handleFile}
                                />
                                <label className="custom-file-label">
                                    {
                                        backImage && backImage.name ? <small>{backImage.name}</small> : <small>{t("IDENTITY_HINT2")}</small>
                                    }
                                </label>
                            </div>
                            <p>{t("IDENTITY_HINT1")}</p>
                            {
                                validateError.backImage && <p className="error-message">{t(validateError.backImage)}</p>
                            }
                        </div>
                    </GridItem>
                }

                <GridItem xs={12} sm={12} md={6} lg={6}>
                    <div className="form-group">
                        <label>{t("SELFIE_SELECTED_ID")}</label>
                        <div className="custom-file">
                            <input
                                type="file"
                                className="custom-file-input"
                                aria-describedby="inputGroupFileAddon01"
                                name="selfiImage"
                                onChange={handleFile}
                            />
                            <label className="custom-file-label">
                                {
                                    selfiImage && selfiImage.name ? <small>{selfiImage.name}</small> : <small>{t("IDENTITY_HINT2")}</small>
                                }
                            </label>
                        </div>
                        <p>{t("IDENTITY_HINT1")}</p>
                        {
                            validateError.selfiImage && <p className="error-message">{t(validateError.selfiImage)}</p>
                        }
                    </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={6} lg={6}>
                    <div className="form-group">
                        <label>{t("PAN_CARD")}</label>
                        <div className="custom-file">
                            <input
                                type="file"
                                className="custom-file-input"
                                aria-describedby="inputGroupFileAddon01"
                                name="panImage"
                                onChange={handleFile}
                            />
                            <label className="custom-file-label">
                                {
                                    panImage && panImage.name ? <small>{panImage.name}</small> : <small>{t("IDENTITY_HINT2")}</small>
                                }
                            </label>
                        </div>
                        <p>{t("IDENTITY_HINT1")}</p>
                        {
                            validateError.panImage && <p className="error-message">{t(validateError.panImage)}</p>
                        }
                    </div>
                </GridItem>
            </GridContainer>
            <div className="form-group mb-0">
                <button
                    className="btn btn-primary text-uppercase py-2 m-0"
                    onClick={handleSubmit}
                >
                    {loader && <i class="fas fa-spinner fa-spin"></i>}
                    {t("Submit")}
                </button>
            </div>
        </form>
    )
}

export default ProofForm;