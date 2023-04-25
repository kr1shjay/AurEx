// import Package
import React, { useEffect } from "react";

// import component
import Header from "components/Header/Header.js";
import HeaderLinksAfterlogin from "components/Header/HeaderLinksAfterlogin.js";
import SupportTicket from '../components/SupportTicket';
import Footer from "components/Footer/Footer.js";
const dashboardRoutes = [];

function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title="AUREX"
  }, []);
  return null;
}

const SupportPage = (props) => {
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
          <div className="dashboardContent userPages">
            <SupportTicket />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default SupportPage;