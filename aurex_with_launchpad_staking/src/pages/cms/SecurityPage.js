import React, { useEffect, useState } from "react";

// import component
import HeaderLinks from "components/Header/HeaderLinks.js";
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";

// import action
import { getCMSPage } from '../../actions/commonAction';

const SecurityPage = (props) => {
    // state
    const [content, setContent] = useState('');

    // function
    const fetchCmsPage = async () => {
        try {
            const { status, loading, result } = await getCMSPage('security');
            if (status == 'success') {
                setContent(result.content)
                document.title = result.title;
            }
        } catch (err) { }
    }

    useEffect(() => {
        fetchCmsPage()
    }, [])

    return (
        <div>
            <Header className="header"
                color="transparent"
                // routes={dashboardRoutes}
                brand={<img src={require("../../assets/images/logo.png")} alt="logo" className="img-fluid" />}
                rightLinks={<HeaderLinks />}
                fixed
                changeColorOnScroll={{
                    height: 20,
                    color: "dark",
                }}
            />

            <div className="static_container py-4">
                <div className="container pt-5">
                    <div dangerouslySetInnerHTML={{ '__html': content }} />
                </div></div>
            <Footer />
        </div>
    );
}

export default SecurityPage