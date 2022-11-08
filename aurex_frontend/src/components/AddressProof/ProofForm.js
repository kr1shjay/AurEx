// import package
import React, { useState } from 'react';
import { MenuItem, Select } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import action
import { updateAddressProof } from '../../actions/userKyc';

// import lib
import isEmpty from '../../lib/isEmpty';
import { toastAlert } from '../../lib/toastAlert';
import validation from './validation';

const initialFormValue = {
    'type': "passport",
    'frontImage': '',
}

const ProofForm = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [validateError, setValidateError] = useState({});
    const [loader, setLoader] = useState();

    const { type, frontImage } = formValue;

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

    const handleFile = async (e) => {
        const { name, files } = e.target;
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
            frontImage,
            formType: 'address'
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
            formData.append('frontImage', frontImage);

            const { status, loading, message, error } = await updateAddressProof(formData, dispatch);
            setLoader(loading)
            if (status == 'success') {
                toastAlert('success', t(message), 'idproof')
            } else {
                if (error) {
                    setValidateError(error)
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
                        <label>{t("ADDRESS_DOCUMENT_TITLE2")}</label>
                        <Select
                            name="type"
                            value={type}
                            onChange={handleChange}
                        >
                            <MenuItem value={'passport'}>{t("PASSPORT")}</MenuItem>
                            <MenuItem value={'voter_id'}>{t("VOTER_ID")}</MenuItem>
                            <MenuItem value={'driving_license'}>{t("DRIVING_LICENSE")}</MenuItem>

                        </Select>
                        {
                            validateError.type && <p className="error-message">{t(validateError.type)}</p>
                        }
                    </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={6} lg={6}>
                    <div className="form-group">
                        <label>{t("ADDRESS_DOCUMENT_TITLE3")}</label>
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