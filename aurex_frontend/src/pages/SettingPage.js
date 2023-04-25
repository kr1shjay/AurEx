import React, { useEffect } from "react";

// import component
import Header from "components/Header/Header.js";
import HeaderLinksAfterlogin from "components/Header/HeaderLinksAfterlogin.js";
import UserLoginHistory from "../components/Dashboard/UserLoginHistory"
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import GeneralSetting from '../components/GeneralSetting/GeneralSetting';
import Notification from '../components/NotificationHistory';
import Announcement from '../components/Announcement'
import P2pSetting from '../components/P2pSetting';
import { useTranslation } from 'react-i18next';
import Footer from "components/Footer/Footer.js";
const dashboardRoutes = [];

function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title="AUREX"
  }, []);
  return null;
}

const SettingPage = (props) => {
  const { t, i18n } = useTranslation();
  const { ...rest } = props;

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
                    <GridItem xs={12} sm={12} md={5} lg={5}>
                      <h3 className="dash_title login_title_8">{t('GENERAL_SETTINGS')}</h3>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={7} lg={7}>
                      <Announcement />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <div className="table_p2p_section inprofile cion_table_sectio">
                        <div className="d-flex justify-content-between">
                          <ul class="nav nav-tabs ">
                            <li class="active"><a data-toggle="tab" class="active" href="#General">{t('GENERAL')}</a></li>
                            {/* <li><a data-toggle="tab" class="" href="#Notification">Notification</a></li> */}
                            {/* <li><a data-toggle="tab" class="" href="#Login">Login History</a></li> */}
                            {/*<li><a data-toggle="tab" class="" href="#P2P">{t('P2P')}</a></li>*/}
                          </ul>

                          {/* <div className="seacr_box_s">
                            <input type="text" placeholder="Find Coin" />
                            <i class="fas fa-search"></i>
                          </div> */}
                        </div>
                        <div class="tab-content">
                          <div id="General" class="tab-pane fade mt-3 in active show">
                            <GeneralSetting />
                          </div>
                          {/* <div id="Notification" class="tab-pane mt-3 fade">
                            <Notification />
                          </div> */}
                          {/* <div id="Login" class="tab-pane mt-3 fade">
                            <UserLoginHistory />
                          </div> */}
                          {/*<div id="P2P" class="tab-pane mt-3 fade">
                            <P2pSetting />
                          </div>*/}
                        </div>
                      </div>
                    </GridItem>
                  </GridContainer>
                  {/* <div className="dashboard_box">
               
               
              </div> */}
                  {/* <GeneralSetting /> */}
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

export default SettingPage;