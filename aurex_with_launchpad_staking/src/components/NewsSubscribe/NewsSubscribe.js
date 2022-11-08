// import package
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// import action
import { subscribe } from '../../actions/newsLetterAction'

// import lib
import validation from './validation';
import isEmpty from '../../lib/isEmpty'
import { toastAlert } from '../../lib/toastAlert';

const initialFormValue = {
    'email': '',
}

const NewsSubscribe = () => {
    const { t, i18n } = useTranslation();

    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [validateError, setValidateError] = useState({});
    const [loader, setLoader] = useState();

    const { email } = formValue;

    // function
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let formData = { ...formValue, [name]: value }
        setFormValue(formData)
        if(value){
            setValidateError({})
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true)
        let reqData = {
            email
        }

        let validationError = validation(reqData)
        if (!isEmpty(validationError)) {
            setValidateError(validationError)
            setLoader(false)
            return
        }

        let { status, loading, message, error } = await subscribe(reqData);
        setLoader(loading);
        if (status == 'success') {
            setFormValue(initialFormValue)
            toastAlert('success', message, 'signup');
        } else {
            if (error) {
                setValidateError(error);
                return
            }
            toastAlert('error', message, 'signup');
        }
    }

    return (
        <div className="col-lg-6 ">
            <h1 className="footer_form">{t("NEWS_UPDATE_TITLE")}</h1>
            <div className="inut_fone">

                <input
                    type="text"
                    className="form-control"
                    placeholder={t("EMAIL_PLACEHOLDER")}
                    name="email"
                    value={email}
                    onChange={handleChange}

                /><br></br>

                <button onClick={handleSubmit}>
                    {loader && <i class="fas fa-spinner fa-spin"></i>}{t("Submit")}
                </button>

            </div>
            {
                validateError.email && <p className="error-message" style={{ marginLeft: '160px' }}>{t(validateError.email)}</p>
            }
        </div>
    )
}

export default NewsSubscribe;