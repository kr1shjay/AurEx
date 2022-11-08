import React, { useState, useEffect, useMemo } from 'react';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { RadioGroup, FormControlLabel, Radio } from '@material-ui/core'
import $ from "jquery";
// import component
import EmailForm from './EmailForm';
import MobileForm from './MobileForm';
const ForgotPassword = () => {
    const { t, i18n } = useTranslation();
    const { executeRecaptcha } = useGoogleReCaptcha();

    // state
    const [formType, setFormType] = useState('email')

    // function
    // const handleReCaptcha = async () => {
    //     try {
    //         if (!executeRecaptcha) {
    //             toastAlert('error', 'Recaptcha error')
    //             return '';
    //         }
    //         return await executeRecaptcha('register');
    //     } catch (err) {
    //         toastAlert('error', err.toString())
    //         return ''
    //     }
    // }

    const handleFormType = (e) => {
        e.preventDefault()
        const { name, value } = e.target;
        setFormType(value)
    }

    useEffect(() => {
        loadScript()
    }, []);

    function loadScript() {
        $(".radio_inp_email").click(function () {
            $(".radio_inp_email").addClass('active');
            $(".radio_inp_mobile").removeClass('active');
        });
        $(".radio_inp_mobile").click(function () {
            $(".radio_inp_mobile").addClass('active');
            $(".radio_inp_email").removeClass('active');
        });
    }
    return (
        <div className="login_container">
            <div className="row w-100">
                <div className="col-lg-4 col-md-6 m-auto">
                    <form className="login_form p-4 mb-4" data-aos="fade-up">
                        <h3 className="login_title_8">{t("FORGOT_PASSWORD")}</h3>
                        <div className="flex_inpur_sect">
                            <RadioGroup aria-label="formType" name="formType" value={formType} onChange={handleFormType}>
                                <FormControlLabel value="email" control={<Radio />} label="Email" className="radio_inp_email active" />
                                <FormControlLabel value="mobile" control={<Radio />} label="Mobile" className="radio_inp_mobile" />
                            </RadioGroup>
                        </div>


                        {
                            formType == 'email' && <EmailForm
                            // handleReCaptcha={handleReCaptcha}
                            />
                        }

                        {
                            formType == 'mobile' && <MobileForm
                            // handleReCaptcha={handleReCaptcha}
                            />
                        }


                        <div className="d-flex">
                            <Link to="/" className="mr-auto">{t('HOME')}</Link>
                            <Link to="/login" className="ml-auto">{t('LOGIN')}</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>


    )
}

export default ForgotPassword;