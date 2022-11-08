import React, { useEffect } from "react";


// @material-ui/core components
import Header from "components/Header/Header.js";
import HeaderLinksAfterlogin from "components/Header/HeaderLinksAfterlogin.js";
import { Button, Menu } from "@material-ui/core";
import { MenuItem, Select } from '@material-ui/core';

import { Link } from "react-router-dom";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import ProfileDetail from '../components/ProfileDetail/ProfileDetail';
import BankAccount from '../components/BankAccount/BankAccount';
import Announcement from '../components/Announcement/Announcement';
import EmailChange from '../components/EmailChange/EmailChange';
import PhoneNoChange from '../components/PhoneNoChange/PhoneNoChange';
import FooterInner from "../components/Footer/Footer_innerpage"

import P2P from '../components/P2P';

const dashboardRoutes = [];

function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}






export default function Profile(props) {

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
          <div className="profileContent userPages padin_p2p">
            <div className="container-fluid">
              <P2P
                type="chat"
              />
            </div>
          </div>

          <FooterInner />

        </div>
      </div>
    </div>
  );
}
