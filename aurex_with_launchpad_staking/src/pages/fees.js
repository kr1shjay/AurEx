import React, { useEffect } from "react";
// @material-ui/core components
import Header from "components/Header/Header.js";
import HeaderLinksAfterlogin from "components/Header/HeaderLinksAfterlogin.js";
import { Link } from "react-router-dom";

import ReactTooltip from 'react-tooltip';

import UserLoginHistory from "../components/Dashboard/UserLoginHistory"
import { useTranslation } from 'react-i18next';

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import FeesTable from '../components/FeesTable';
import Footer from "components/Footer/Footer.js";
const dashboardRoutes = [];

function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}






const FeesPage = (props) => {

  const { ...rest } = props;
  const { t, i18n } = useTranslation();
  return (
    <div className="dashboard_container page_wrap">
      <ScrollToTopOnMount />
      <div className="dashboardMain">
        <div className="dashboardRight afterLoginHeader">
          <Header className="header"
            color="transparent"
            routes={dashboardRoutes}
            brand={<img src={require("../assets/images/logo.png")} alt="logo" className="img-fluid" />}
            rightLinks={<HeaderLinksAfterlogin />}
            fixed
            changeColorOnScroll={{
              height: 20,
              color: "dark",
            }}
            {...rest} />

          <div className="settingsContent userPages">
            <div className="container-fluid">
              <div className="p2p_card p2p_card1 border-none min-h-auto">
                <div className="container-fluid">
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <h3 className="dash_title login_title_8">{t('FEES')}</h3>
                      <p>{t('FEE_CONTENT')}</p>
                    </GridItem>

                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <FeesTable />
                    </GridItem>
                  </GridContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default FeesPage;