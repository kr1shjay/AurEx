import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';


// import component
import IDProof from '../components/IDProof';
import AddressProof from '../components/AddressProof';
import UserKycDetail from '../components/UserKycDetail';
import UpgradeProfile from '../components/UpgradeProfile';
import Header from "components/Header/Header.js";
import HeaderLinksAfterlogin from "components/Header/HeaderLinksAfterlogin.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Announcement from '../components/Announcement';
import { useTranslation } from 'react-i18next';
// import action
import { getKycDetail } from '../actions/userKyc'

const dashboardRoutes = [];

function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

export default function Kyc(props) {
  const { ...rest } = props;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  useEffect(() => {
    getKycDetail(dispatch)
  }, [])

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
            <div className="container">
              <GridContainer>
                <GridItem xs={12} sm={12} md={5} lg={5}>
                  <h3 className="dash_title">{t('IDENTITY_VERIFICATION')}</h3>
                </GridItem>
                <GridItem xs={12} sm={12} md={7} lg={7}>
                  <Announcement />
                </GridItem>
              </GridContainer>
              <UserKycDetail />
              {/* <UpgradeProfile /> */}

              <IDProof />
              <AddressProof />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
