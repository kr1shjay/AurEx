/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link, useHistory, NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
// import component
import NewsSubscribe from '../NewsSubscribe';

import styles from "assets/jss/material-kit-react/components/footerStyle.js";

// import action
import { getLanguage } from '../../actions/commonAction';
import {newsLetter} from '../../actions/spotTradeAction'
// import lib
import { toastAlert } from '../../lib/toastAlert';
import { capitalize } from '../../lib/stringCase';
import { setLang, getLang } from '../../lib/localStorage';
import isEmpty from "../../lib/isEmpty";
const useStyles = makeStyles(styles);
// const initialFormValue = {
//   'email': '',
//   'formType': 'email',}
export default function BeforeLogin(props) {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const { whiteFont } = props;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  const aClasses = classNames({
    [classes.a]: true,
    [classes.footerWhiteFont]: whiteFont
  });

  // state
  const [langOption, setLangOption] = useState([])
  const [language, setLanguage] = useState('')
  //const [validateError, setValidateError] = useState({});
  const [letter,setLetter]=useState({})
  // redux-state
  const { isAuth } = useSelector(state => state.auth);
  const socialMedia = useSelector(state => state.socialMedia);

  // function
  const handleLanguage = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setLanguage(value)
    setLang(value)
    i18n.changeLanguage(value);
  }

  const emailValidation = (value) => {
    console.log(value,"emailValidation")
    let errors = {};
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;

    if (isEmpty(value.email)) {
      //setValidateError({...validateError,'email' : "REQUIRED"})
     return errors = "email required"
    } else if (!(emailRegex.test(value.email))) {
      //setValidateError({...validateError,'email': "invalid email"})
     return errors ="invalid email"
    }
  }
  const onInputchage=(e)=>{
    setLetter({...letter,[e.target.name]:e.target.value})
  }

  const OnSubmit =async (e)=>{
    e.preventDefault()
   var validateError =await  emailValidation(letter)
   console.log(validateError,"validateError")
    if (isEmpty(validateError)) {
      var res = await newsLetter(letter)
      if (res.status) {
        toastAlert('success', res.message, 'newLetter')
      }
      else {
        toastAlert('error', res.message, 'newsLetter')
      }
    }
    else{
      toastAlert('error', validateError, 'newsLetter')
    }  
  }

  const fetchLanguage = async () => {
    try {
      const { status, loading, result } = await getLanguage(dispatch);
      if (status == 'success') {
        setLangOption(result);
        let lang = getLang();
        if (isEmpty(lang)) {
          let primaryData = result && result.length > 0 && result.find((el => el.isPrimary == true))
          if (primaryData) {
            setLanguage(primaryData.code)
            setLang(primaryData.code)
            i18n.changeLanguage(primaryData.code);
          }
        } else {
          setLanguage(lang)
        }
      }
    } catch (err) { }
  }

  useEffect(() => {
    fetchLanguage();
  }, [])

  return (
    <footer className="mainFooter">
      <div className="container-fluid">
        <div className="footerTop wow fadeInDown">
          <div className="ftLeft">
            <NavLink to="/">
              <img src={require("../../assets/images/logo.png")} className="img-fluid" alt="Logo" />
            </NavLink>
            {/* <ul className="footerTopLinks">
              <li>ACN 644 250 331</li>
              <li>|</li>
              <li>ABN 23 644 250 331</li>
            </ul> */}
          </div>
          <div className="ftRight">
            <div className="d-flex justify-content-between align-items-start">
              <div className="ftRight_left">
                <h3>Join Newsletter</h3>
                <div className="form-group form_grp_newsletr mt-3">
                      <div className="input-group">
                        
                        <input type="email" autoComplete="off" className="form-control" placeholder="Mail Id" name="email" onChange={(e)=>{onInputchage(e)}}/>
                        <div className="input-group-append">
                        <button className="btn btn_green_su btn_green_su_news" href="/" onClick={(e)=>{OnSubmit(e)}}>Submit</button>
                        </div>
                      </div>
                    </div>
                {/* <p>Each Referral get 5 Aurex Coin</p> */}
              </div>
              {/* <NavLink className="primary_btn m-auto" to={isAuth ? "/referral" : "/register"}><span>Start Earning</span></NavLink>               */}
              {/* <NavLink to="/Referral" className="primary_btn m-auto"><span>Start Earning</span></NavLink> */}
            </div>
          </div>
        </div>
        <div className="footerMidd wow fadeIn" data-wow-delay=".5s">
          <div className="footerMidd_left">
            <ul className="footer_links">
              <li><NavLink to="/about">About us</NavLink></li>
              <li><NavLink to="/faq">FAQs</NavLink></li>
              <li><NavLink to="/contact">Contact Us</NavLink></li>
              <li><NavLink to="/terms">Terms & Conditions</NavLink></li>
              <li><NavLink to="/privacy-policy">Privacy Policy</NavLink></li>
            </ul>
            <p class="mt-2 cpy_txt">&copy; Copyright 2022 <NavLink to="/home">Aurex</NavLink> All rights reserved</p>
          </div>  
          <div className="footerMidd_right">
            <h3>Social Media withus:</h3>
            <ul className="socialLinks">
              <li><a href={socialMedia && socialMedia.twitterUrl} target="_blank"><i className="fab fa-twitter"></i></a></li>
              <li><a href={socialMedia && socialMedia.facebookLink} target="_blank"><i className="fab fa-facebook"></i></a></li>
              <li><a href={socialMedia && socialMedia.linkedinLink} target="_blank"><i class="fab fa-linkedin"></i></a></li>
              {/*<li><a href="#" target="_blank"><i class="fab fa-medium-m"></i></a></li>*/}
            </ul>
          </div>        
        </div>    
      </div>
    </footer>
  );
}

BeforeLogin.propTypes = {
  whiteFont: PropTypes.bool
};
