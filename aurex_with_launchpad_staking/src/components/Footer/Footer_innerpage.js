/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";


import styles from "assets/jss/material-kit-react/components/footerStyle.js";

// import action
import { getLanguage } from '../../actions/commonAction';

// import lib
import { capitalize } from '../../lib/stringCase';
import { setLang, getLang } from '../../lib/localStorage';
import isEmpty from "../../lib/isEmpty";

const useStyles = makeStyles(styles);

export default function Footer(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { t, i18n } = useTranslation();
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

  // redux-state
  const { isAuth } = useSelector(state => state.auth);

  // function
  const handleLanguage = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setLanguage(value)
    setLang(value)
    i18n.changeLanguage(value);
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
    <footer className="footer_inner_border">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 d-flex justify-content-center ">
            <div>
              <ul className="list-inline d-flex align-items-baseline link_foore_inner">
                <li><Link to="/">{t("HOME")} </Link></li><i>|</i>
                <li><Link to="/fees">{t("FEES")} </Link></li><i>|</i>
                <li><Link to="/faq">{t("FAQ")} </Link></li><i>|</i>
                <li><Link to="/terms">{t("TERMS_CONDITION")} </Link></li><i></i>
                <li><Link to="/privacy-policy">{t("PRIVACY_POLICY")} </Link></li>
              </ul>
              <ul className="list-inline d-flex social_media footer_inner_icin">
                <li className="pr-4"><Link to=""><i className="fab fa-telegram-plane"></i></Link></li>
                <li className="pr-4"><Link to=""><i className="fab fa-twitter"></i></Link></li>
                <li className="pr-4"><Link to=""><i className="fab fa-linkedin-in"></i></Link></li>
                <li className="pr-4"><Link to=""><i className="fab fa-reddit-alien"></i></Link></li>
                <li><Link to=""><i className="fab fa-youtube"></i></Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  whiteFont: PropTypes.bool
};
