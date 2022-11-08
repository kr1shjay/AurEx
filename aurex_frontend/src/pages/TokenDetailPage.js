import React, { useEffect } from "react";

// import component
import Header from "components/Header/Header.js";
import HeaderLinksAfterlogin from "components/Header/HeaderLinksAfterlogin.js";
import LaunchpadDetail from '../components/LaunchpadDetail/LaunchpadDetail';


const dashboardRoutes = [];


// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

const TokenDetailPage = () => {



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
          />
          <div className="settingsContent userPages">
            <div className="inner_wrapper">
              <div className="inner_pageheader container-fluid px-0">
                <div className="inner_content_wrapper">


                  <LaunchpadDetail />

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokenDetailPage;