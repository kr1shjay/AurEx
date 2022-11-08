// import packate
import React, { useEffect } from 'react';

// import Package
import { Select, MenuItem } from '@material-ui/core';

// import component
import Header from "components/Header/Header.js";
import HeaderLinksAfterlogin from "components/Header/HeaderLinksAfterlogin.js";

const dashboardRoutes = [];

function ScrollToTopOnMount() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return null;
}

const GlobalLayout = (props) => {
    return (
        <div className="dashboard_container page_wrap">
            <ScrollToTopOnMount />
            <div className="dashboardMain">
                <div className="dashboardRight afterLoginHeader">
                    <Header className="header"
                        color="transparent"
                        routes={dashboardRoutes}
                        brand={<img src={require("../../assets/images/logo.png")} alt="logo" className="img-fluid" />}
                        rightLinks={<HeaderLinksAfterlogin />}
                        fixed
                        changeColorOnScroll={{
                            height: 20,
                            color: "dark",
                        }}
                    />
                    <div className="dashboardContent userPages">
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GlobalLayout;