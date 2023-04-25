import React, { useEffect } from "react";
import { useTranslation } from 'react-i18next';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import { ExpandMore } from "@material-ui/icons";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import styles from "assets/jss/material-kit-react/views/loginPage.js";
import Footer from "components/Footer/Footer.js";


// import component
import LoginForm from '../components/LoginForm';

const useStyles = makeStyles(styles);
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title="AUREX"
  }, []);
  return null;
}
const dashboardRoutes = [];
export default function Login(props) {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
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
      <div className="login_container login_box">
       
        <div className="row w-100">
          <div className="col-lg-8 col-md-10 col-sm-12 flexColumn m-auto">
            <LoginForm />
            {/* <p className="text-center"><Link to="">Privacy Policy</Link>&nbsp;|&nbsp;Have an issue with 2-factor authentication?</p> */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
