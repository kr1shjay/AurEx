// import Package
import React, { useEffect } from "react";
import { Select, MenuItem } from '@material-ui/core';

// import component
import Header from "components/Header/Header.js";
import HeaderLinksAfterlogin from "components/Header/HeaderLinksAfterlogin.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Announcement from '../components/Announcement';

const dashboardRoutes = [];

function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

const SupportPage = (props) => {
  const { ...rest } = props;

  return (
    <div className="container">
      Test
    </div>
  );
}

export default SupportPage;