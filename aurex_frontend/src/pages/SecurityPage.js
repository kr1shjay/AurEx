import React, { useEffect } from "react";

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Header from "components/Header/Header.js";
import HeaderLinksAfterlogin from "components/Header/HeaderLinksAfterlogin.js";
import Announcement from '../components/Announcement'
import Security from "../components/Security";
import { useTranslation } from 'react-i18next';
import Footer from "../components/Footer/Footer"

const dashboardRoutes = [];

function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title="AUREX"
  }, []);
  return null;
}

const SecurityPage = (props) => {
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
          />

          <div className="settingsContent userPages">
            <div className="container-fluid">
              <div className="p2p_card p2p_card1 border-none min-h-auto">
                <div className="container-fluid">
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={5} lg={5}>
                      <h3 className="dash_title login_title_8">{t('SECURITY_SETTINGS')}</h3>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={7} lg={7}>
                      <Announcement />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <Security />
                    </GridItem>
                  </GridContainer>

                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default SecurityPage;