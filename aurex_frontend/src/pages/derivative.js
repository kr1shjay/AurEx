import React, { useEffect, useState } from "react";
// @material-ui/core components
import Header from "components/Header/Header.js";
import HeaderLinksAfterlogin from "components/Header/HeaderLinksAfterlogin.js";
// import DerivativeTrade from "pages/layout/DerivativeTrade.js";
import { useTranslation } from 'react-i18next';
// import component
import DerivativeTrade from '../components/DerivativeTrade';

import { Modal } from 'react-bootstrap';
import { Button, Menu } from "@material-ui/core";

const dashboardRoutes = [];

function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}
export default function Derivative(props) {
  const { t, i18n } = useTranslation();
  const { ...rest } = props;
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


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
            <DerivativeTrade />
            {/* <Button variant="primary" onClick={handleShow}>
        Launch demo modal
          </Button> */}
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose} className="derivative_model"   aria-labelledby="contained-modal-title-vcenter"
  centered
>
        <Modal.Header closeButton>
          <Modal.Title>{t('MARKET_CLOSE')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="form-group">
              <label>{t('CLOSE_QTY')}</label>
                <div className="input_filed">
                  <input type="text" value="5" />
                  <div className="button_">
                    <button><i class="fas fa-minus"></i></button>
                    <button><i class="fas fa-plus"></i></button>
                  </div>
                </div>
            </div>

            <div className="slider_dive">
               <div>
                 <button>10%</button>
                 <button>25%</button>
                 <button>50%</button>
                 <button>75%</button>
                 <button className="active">100%</button>
               </div>
            </div>

            <div className="demo_content">
              <p>{t('5CONTRACT_CLOSE')}1.23XRB.({t('INCLUSIVE')} 0.00 XRP)</p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center align-items-center">
          <Button className="btn btn-outline mr-3" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button className="btn btn-primary" variant="primary" onClick={handleClose}>
           Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
