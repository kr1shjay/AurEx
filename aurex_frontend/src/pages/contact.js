import React, { useEffect } from "react";

// import component
import Header from "components/Header/Header.js";
import HeaderLinksAfterlogin from "components/Header/HeaderLinksAfterlogin.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Footer from "components/Footer/Footer.js";
import ContactUs from '../components/ContactUs'


// import action
import { getCMSPage } from '../actions/commonAction';
import { useState } from "react";

const dashboardRoutes = [];

function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}
const ContactPage = (props) => {
  const[content,setContent]=useState()
  const fetchCmsPage = async () => {
    try {
      const { status, loading, result } = await getCMSPage('contact_us');
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
          <div className="profileContent userPages padin_p2p">
            <div className="container-fluid">
              <GridContainer className="justify-content-center">
                <GridItem xs={12} sm={12} md={12} lg={10}>
                  <ContactUs content= {content}/>
                </GridItem>
              </GridContainer>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default ContactPage;