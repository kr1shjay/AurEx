// import package
import React from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from "@material-ui/core";
import { useTranslation } from 'react-i18next';
// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

const ConfirmPayment = (props) => {
    // props
    const { show, onHide, onSubmit } = props;
    const { t, i18n } = useTranslation();
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
                <Modal.Header closeButton>
                    <Modal.Title>{t('CONFIRM_PAYMENT')}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="confirm_model_new">
                        <p>{t('PAYMENT_MADE_SELLER')} <br />
                           {t('ACCOUNT_FROZEN')}</p>

                    </div>
                    <GridContainer className="for_pading_po">
                        <GridItem xs={12} sm={12} md={12} lg={6}>
                            <div className="support_section d-flex justify-content-center button_aling_vl">

                                <Button onClick={onHide}>{t('CANCEL')}</Button>
                            </div>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={12} lg={6}>
                            <div className="support_section d-flex justify-content-center bg_blue button_aling_vl">

                                <Button onClick={onSubmit}>{t('CONFIRM')}</Button>
                            </div>
                        </GridItem>
                    </GridContainer>
                </Modal.Body>
        </Modal>
    )
}

export default ConfirmPayment;