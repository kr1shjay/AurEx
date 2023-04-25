// import package
import React, { useEffect } from "react";

// import component
import Header from "components/Header/Header.js";
import HeaderLinksAfterlogin from "components/Header/HeaderLinksAfterlogin.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import WalletList from '../components/WalletList/WalletList'
import WalletBalance from '../components/WalletBalance/WalletBalance';
import Footer from "../components/Footer/Footer"


const dashboardRoutes = [];

function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title="AUREX"
  }, []);
  return null;
}

const WalletPage = (props) => {

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
              <GridContainer>
                <GridItem xs={12} sm={12} lg={12} xl={12}>
                  <WalletBalance />
                </GridItem>
                <WalletList />
              </GridContainer>
            </div>
          </div>
          <Footer/>
        </div>
      </div>
    </div>
  );
}

export default WalletPage;