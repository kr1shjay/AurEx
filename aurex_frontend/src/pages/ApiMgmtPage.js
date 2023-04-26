import React from "react";

// import component
import HeaderLinks from "components/Header/HeaderLinks.js";
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import ApiManagement from '../components/ApiManagement';



const ApiMgmtPage = () => {
    return (
        <div className="dashboard_container page_wrap">
            <Header className="header"
                color="transparent"
                // routes={dashboardRoutes}
                brand={<img src={require("../assets/images/logo.png")} alt="logo" className="img-fluid" />}
                rightLinks={<HeaderLinks />}
                fixed
                changeColorOnScroll={{
                    height: 20,
                    color: "dark",
                }}
            />
            <div className="">
                <ApiManagement />
            </div>
            <Footer />
        </div>
    );
}

export default ApiMgmtPage