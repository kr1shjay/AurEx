import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
// import component
import ForgotPassword from '../components/ForgotPassword';
import Footer from "components/Footer/Footer.js";

    
import styles from "assets/jss/material-kit-react/views/loginPage.js";

const useStyles = makeStyles(styles);
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}
const dashboardRoutes = [];
export default function ForgotPasswordPage(props) {
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
      <ForgotPassword />
      <Footer />
    </div>
  );
}
