import React, { useEffect, useContext } from "react";
import { useDispatch } from 'react-redux'

// import components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import HeaderLinksAfterlogin from "components/Header/HeaderLinksAfterlogin.js";
import SpotTrade from "../components/SportTrade";

// import context
import SocketContext from '../components/Context/SocketContext';

// import action
import { updateTradeAsset } from '../actions/spotTradeAction'

const dashboardRoutes = [];

function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}
const SpotPage = (props) => {
  const socketContext = useContext(SocketContext);
  const dispatch = useDispatch();

  const { ...rest } = props;

  useEffect(() => {
    // socket
    socketContext.socket.on('updateTradeAsset', (result) => {
      updateTradeAsset(dispatch, result)
    })
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
          <div className="settingsContent userPages tradePages">
            <SpotTrade />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SpotPage;