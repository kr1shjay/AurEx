import React, { useEffect } from "react";
import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import clsx from 'classnames';
import { useTranslation } from 'react-i18next';

// import component
import Header from "components/Header/Header.js";
import HeaderLinksAfterlogin from "components/Header/HeaderLinksAfterlogin.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import ProfileDetail from '../components/ProfileDetail/ProfileDetail';
import BankAccount from '../components/BankAccount/BankAccount';
import Announcement from '../components/Announcement/Announcement';
import EmailChange from '../components/EmailChange/EmailChange';
import PhoneNoChange from '../components/PhoneNoChange/PhoneNoChange';
import UserKycDetail from '../components/UserKycDetail/UserKycDetail'
import IDProof from '../components/IDProof/IDProof';
import AddressProof from '../components/AddressProof/AddressProof';
import Footer from "../components/Footer/Footer"

// import action
import { getKycDetail } from '../actions/userKyc'

const dashboardRoutes = [];

function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}
const ProfilePage = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const { ...rest } = props;

  useEffect(() => {
    getKycDetail(dispatch)
    document.title="AUREX"
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
          <div className="profileContent userPages px-3">

            <div className="container-fluid p2p_card border-none">

              <div className="">

                <GridContainer>
                  <GridItem xs={12} sm={12} md={5} lg={5}>
                    <h3 className="dash_title login_title_8">{t("PROFILE")}</h3>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={7} lg={7}>
                    <Announcement />
                  </GridItem>
                </GridContainer>
                <div className="table_p2p_section inprofile">
                  <ul class="nav nav-tabs">
                    <li class="active"><a data-toggle="tab" className={clsx({ "active": location.pathname == '/profile' })} href="#Profile">{t("PERSONAL")}</a></li>
                    <li><a data-toggle="tab" className={clsx({ "active": location.pathname == '/bank' })} href="#Bank">{t("Bank")}</a></li>
                    <li><a data-toggle="tab" className={clsx({ "active": location.pathname == '/kyc' })} href="#KYC">{t("KYC")}</a></li>
                  </ul>

                  <div class="tab-content">
                    <div id="Profile" class="tab-pane fade in active show">
                      <ProfileDetail />
                      <div className="row align-items-center">
                        <div className="col-lg-12">
                          <h3 className="dash_title mb-3">{t("CONTACT_DETAILS")}</h3>
                        </div>
                      </div>
                      <div className="">
                        <div className="contact_form">
                          <GridContainer>
                            <EmailChange />
                            <PhoneNoChange />
                          </GridContainer>
                        </div>

                      </div>
                    </div>
                    <div id="Bank" class="tab-pane fade pt-2">
                      <div className="row align-items-center">
                        <div className="col-lg-12">
                          <h3 className="dash_title mb-3">{t("BANK_ACCOUNT_DETAIL")}</h3>
                        </div>
                      </div>
                      <BankAccount />
                    </div>
                    <div id="KYC" class="tab-pane fade">
                      <UserKycDetail />
                      <IDProof />
                      <AddressProof />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div >

  );
}

export default ProfilePage;