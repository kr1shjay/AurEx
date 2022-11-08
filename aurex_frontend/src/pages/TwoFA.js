import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

// import component
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";


// import components
import TowFa from '../components/TowFAform/TowFAform';


function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}
const dashboardRoutes = [];

const RegisterPage = (props) => {
  const { t, i18n } = useTranslation();

  const { ...rest } = props;

  return (
    <div className="page_wrap">
      <ScrollToTopOnMount />
      <Header className="header"
        color="transparent"
        routes={dashboardRoutes}
        brand={<img src={require("../assets/images/logo.png")} alt="logo" className="img-fluid" />}
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 20,
          color: "dark",
        }}
        {...rest} />
      <div className="login_container">
        {/* <h2 className="text-center mb-md-4 pb-3" data-aos="fade-up">{t("REGISTER_TITLE_1")}</h2> */}
        <div className="row w-100">
          <div className="col-lg-4 col-md-6 m-auto">
            <TowFa />
            {/* <p className="text-center"><Link to="">Privacy Policy</Link>&nbsp;|&nbsp;Have an issue with 2-factor authentication?</p> */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default RegisterPage;