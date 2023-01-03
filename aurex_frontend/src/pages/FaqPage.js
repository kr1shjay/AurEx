// import page
import React, { useEffect, useState } from "react";
import { Accordion, Card, Button } from 'react-bootstrap';
import clsx from 'classnames';
import { useTranslation } from 'react-i18next';
// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Footer from "components/Footer/Footer.js";
import Header from "components/Header/Header.js";
import HeaderLinksAfterlogin from "components/Header/HeaderLinksAfterlogin.js";

// import action
import { getAllFaq } from '../actions/commonAction'

const dashboardRoutes = [];

function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}


const CardItem = (props) => {
  // props
  const { categorykey, eventKey, data } = props;
  // state
  const [activeKey, setActiveKey] = useState('')

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">
          <Accordion.Toggle as={Button} variant="link" eventKey={eventKey} onClick={() => {
            if (activeKey == eventKey) setActiveKey('')
            else setActiveKey(eventKey)

          }}>
            <span className="question">{categorykey + 1}{'. '}{data.question}</span> <i className={clsx({ "fas fa-plus": activeKey != eventKey }, { "fas fa-minus": activeKey == eventKey })}></i>
          </Accordion.Toggle>
        </h5>
      </Card.Header>
      <Accordion.Collapse eventKey={eventKey}>
        <Card.Body>
          <p>{data.answer}</p>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  )
}

const FaqPage = () => {
  const { t, i18n } = useTranslation();

  // state
  const [data, setData] = useState([])


  // function
  const fetchFaq = async () => {
    try {
      const { status, loading, result } = await getAllFaq()
      if (status == 'success') {
        setData(result)
      }
    } catch (err) { }
  }

  useEffect(() => {
    fetchFaq()
  }, [])
  console.log(data, '-------data')
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

          <div className="settingsContent userPages">
            <div className="container">
              <div className="p2p_card p2p_card1 border-none min-h-auto">
                <div className="container-fluid">
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <h3 className="dash_title login_title_8">{t('FAQ')}</h3>
                    </GridItem>

                  </GridContainer>
                  <GridContainer className="new_faq_img_sectio">
                    {
                      data && data.length > 0 && data.map((item, key) => {
                        return (
                          <GridItem key={key} xs={12} sm={12} md={12} lg={12}>

                            <section className="faq_sec p-0">
                              <div className="container">
                                <div className="row justify-content-center">
                                  <div className="col-lg-12 pb-0">
                                    <div class="accordion md-accordion accordion_padings" id="accordionEx" role="tablist" aria-multiselectable="true">
                                      <h4>{item.categoryName}</h4>
                                      <Accordion className="mt-4">
                                        {
                                          item && item.categoryDetails && item.categoryDetails.length > 0 && item.categoryDetails.map((el, index) => {
                                            let eventKey = `${key}${index}`;
                                            return <CardItem
                                              categorykey={key}
                                              eventKey={eventKey}
                                              data={el}
                                            />
                                          })
                                        }
                                      </Accordion>

                                    </div>
                                  </div>
                                </div>
                              </div>
                            </section>
                          </GridItem>
                        )
                      })
                    }

                  </GridContainer>
                  {/* <div className="dashboard_box">
               
               
              </div> */}
                  {/* <GeneralSetting /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default FaqPage;