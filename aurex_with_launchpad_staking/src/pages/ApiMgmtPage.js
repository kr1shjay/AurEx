import React from "react";

// import component
import HeaderLinks from "components/Header/HeaderLinks.js";
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import ApiManagement from '../components/ApiManagement';



const ApiMgmtPage = () => {
    return (
        <div>
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
            <div className="static_container py-4">
                <ApiManagement />
            </div>
            <Footer />
        </div>
    );
}

export default ApiMgmtPage