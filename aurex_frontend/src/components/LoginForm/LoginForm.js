// import package
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RadioGroup, FormControlLabel, Radio } from '@material-ui/core'
import $ from "jquery";
// import component
import EmailForm from './EmailForm';
import MobileForm from './MobileForm';

// import modals
import { getCmsData } from '../../actions/homeAction';


const LoginForm = () => {
    const { t, i18n } = useTranslation();

    // state
    const [formType, setFormType] = useState('email')
    const [cmsData, setCmsData] = useState([])

    // function
    const handleFormType = (e) => {
        e.preventDefault()
        const { name, value } = e.target;
        setFormType(value)
    }

    useEffect(() => {
        loadScript()
        fetchCmsData()
    }, []);

    const fetchCmsData = async () => {
        try {
            let reqData = {

            }
            const { status, loading, result } = await getCmsData();
            if (status == 'success') {
                let loginArray = [];
                result && result.map((item, i) =>{
                    if(item && item.title == "Login_Register"){
                        loginArray.push(item)
                    }
                })
                setCmsData(loginArray)
            }
        } catch (err) { }
    }

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
    const createMarkup = (a) => {
          return { __html: a };
    }
    return (
        <>
            <div className="formBox form_left mt-5 mt-md-5 mb-0 mb-md-0">
                <img src={require("../../assets/images/logo.png")} alt="Banner" className="img-fluid logo_200" />
                {
                    cmsData && cmsData.map((item, i) =>{
                        return(
                            <p dangerouslySetInnerHTML={createMarkup(item.content)} className="mt-4"></p>
                        )
                    })
                }
                {/*<div className="mb-4">
                    <div className="d-flex align-items-baseline flex-wrap">

                        <div className="title_new">
                            <h2>User-friendly</h2>
                            <small>Date: 01.12.21</small>
                        </div>
                    </div>

                    <p>Best exchange for new crypto investors</p>
                    <a href="" className="curson_flor">Read More</a>

                </div>

                <div className="mb-4">
                    <div className="d-flex align-items-baseline">

                        <div className="title_new">
                            <h2>One-step covert to crypto</h2>
                            <small>Date: 01.12.21</small>
                        </div>
                    </div>
                    <p>Complete your first crypto trade in one page</p>
                    <a href="" className="curson_flor">Read More</a>
                </div>

                <div className="mb-4">
                    <div className="d-flex align-items-baseline">
                        <div className="title_new">
                            <h2>Aurex Bank</h2>
                            <small>Date: 01.12.21</small>
                        </div>
                    </div>
                    <p>provide cryptocurrency staking service</p>
                    <a href="" className="curson_flor">Read More</a>
                </div>

                <div className="mb-4">
                    <div className="d-flex align-items-baseline">

                        <div className="title_new">
                            <h2>24/7 online customer service</h2>
                            <small>Date: 01.12.21</small>
                        </div>
                    </div>
                    <p>For any questions, we are always here</p>
                    <a href="" className="curson_flor">Read More</a>
                </div>*/}
            </div>
            <form className="formBox login_form mb-5 mb-md-0">
                <h3 className="login_title_8">{t('LOGIN')}</h3>
                <div className="flex_inpur_sect">
                    <RadioGroup aria-label="formType" name="formType" value={formType} onChange={handleFormType}>
                        <FormControlLabel value="email" control={<Radio />} label="Email" className="radio_inp_email active" />
                        <FormControlLabel value="mobile" control={<Radio />} label="Mobile" className="radio_inp_mobile" />
                    </RadioGroup>

                </div>

                {
                    formType == 'email' && <EmailForm />
                }

                {
                    formType == 'mobile' && <MobileForm />
                }

                <div className="d-flex">
                    <Link to="/recover-password" className="mr-auto">
                        {t('FORGOT_PASSWORD')}?
                    </Link>
                    <Link to="/register" className="ml-auto">
                        {/* {t("DON'T_HAVE_ACCOUNT")}? */}
                        {t('SIGN_IN')}
                    </Link>
                </div>
            </form>
        </>
    )
}

export default LoginForm;