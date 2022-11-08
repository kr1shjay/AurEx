// import package
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from "prop-types";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";


import styles from "assets/jss/material-kit-react/components/footerStyle.js";
// import config
import config from '../../config'

// import action
import { getLanguage } from '../../actions/commonAction';

// import lib
import { setLang, getLang } from '../../lib/localStorage';
import isEmpty from "../../lib/isEmpty";

const useStyles = makeStyles(styles);

export default function AfterLogin(props) {
    const classes = useStyles();
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

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
    const socialMedia = useSelector(state => state.socialMedia);

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
                                <li className="pr-4"><a href={socialMedia && socialMedia.twitterUrl} target="_blank"><i className="fab fa-twitter-f"></i></a></li>
                                <li className="pr-4"><a href={socialMedia && socialMedia.facebookLink} target="_blank"><i className="fab fa-facebook"></i></a></li>
                                <li className="pr-4"><a href={socialMedia && socialMedia.linkedinLink}  target="_blank"><i className="fab fa-linkedin-in"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

AfterLogin.propTypes = {
    whiteFont: PropTypes.bool
};
