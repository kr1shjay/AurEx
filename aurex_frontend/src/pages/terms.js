import React, { useEffect } from "react";
// @material-ui/core components
// import { makeStyles } from "@material-ui/core/styles";
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";

// import styles from "assets/jss/material-kit-react/views/loginPage.js";

// const useStyles = makeStyles(styles);
// function ScrollToTopOnMount() {
// useEffect(() => {
// window.scrollTo(0, 0);
// }, []);
// return null;
// }
export default function Terms(props) {
  // const classes = useStyles();
  // const { ...rest } = props;
  return (
    <div>
      <Header />
      <div className="static_container py-4"><div className="container">
        <h1 className="mb-4 heading-title text-center mb-4" data-aos="fade-up">{t('TERMS')}</h1>
        <div className="row align-items-center mb-5">
          <div className="col-lg-12" data-aos="fade-right">
            <h5 className="mb-3">I. {t('OUR_TERMS')}</h5>
            <p className="mb-5">{t('TERMS_CONTENT_1')}</p>
            <p className="mb-5">{t('TERMS_CONTENT_2')}</p>
            <h5 className="mb-3">2. {t('DEFINITION')}</h5>
            <p className="mb-5">1. {t('TERMS_CONTENT_3')} </p>
            <p className="mb-5">2.  {t('TERMS_CONTENT_4')}</p>
            <p className="mb-5">3.{t('TERMS_CONTENT_5')}</p>
          </div>
        </div>
      </div></div>
      <Footer />
    </div>
  );
}
