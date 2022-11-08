import React, { useEffect, useState } from "react";

// import component
import Header from "components/Header/Header.js";
import HeaderLinksAfterlogin from "components/Header/HeaderLinksAfterlogin.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Footer from "components/Footer/Footer.js";

// import action
import { getCMSPage } from '../actions/commonAction';

const dashboardRoutes = [];

function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

const PrivacyPolicyPage = (props) => {

   // state
   const [content, setContent] = useState('');

   // function
   const fetchCmsPage = async () => {
       try {
           const { status, loading, result } = await getCMSPage('privacy_policy');
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
          />
          <div className="profileContent userPages padin_p2p terms_page">
            <div className="container">
            <div className="px-2 px-sm-3">
            <div dangerouslySetInnerHTML={{ '__html': content }} />
              </div>
            </div>
          </div>
          <Footer />

        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;


