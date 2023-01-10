// import package
import React, { useEffect } from "react";
import { Button } from "@material-ui/core";

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Header from "components/Header/Header.js";
import HeaderLinksAfterlogin from "components/Header/HeaderLinksAfterlogin.js";

// import component
import Announcement from '../components/Announcement/Announcement';
import Launchpad from '../components/Launchpad/Launchpad';

const dashboardRoutes = [];

// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title="AUREX"
  }, []);
  return null;
}

const LaunchpadPage = (props) => {

  const { ...rest } = props;

  return (
    <div className="dashboard_container page_wrap">
      <ScrollToTopOnMount />
      <div className="dashboardMain">
        <div className="dashboardRight afterLoginHeader">
          <Header
            color="transparent"
            routes={dashboardRoutes}
            brand={<img src={require("../assets/images/logo.png")} alt="logo" />}
            rightLinks={<HeaderLinksAfterlogin />}
            fixed
            changeColorOnScroll={{
              height: 50,
              color: "dark",
            }}
            {...rest}
          />

          <div className="settingsContent userPages pb-0">
            <div className="inner_wrapper">
              <div className="inner_pageheader container-fluid px-0">

               

                <div className="inner_content_wrapper">
                  <Launchpad />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default LaunchpadPage;