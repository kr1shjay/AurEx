// import package
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from "@material-ui/core";
import { useTranslation } from 'react-i18next';
// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import action
import { cancelPost } from '../../actions/p2pAction'

// import lib
import { toastAlert } from '../../lib/toastAlert'

const CanelPostModal = (props) => {
    // props
    const { show, onHide, record, refetch } = props;
    const { t, i18n } = useTranslation();
    // state
    const [loader, setLoader] = useState(false);

    // function
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            let reqData = {
                id: record._id
            }
            setLoader(true)
            const { status, loading, message, error } = await cancelPost(reqData);
            setLoader(loading)
            if (status == 'success') {
                toastAlert('success', message, 'editPost')
                handleClose()
                refetch()
            } else {
                toastAlert('error', message, 'editPost')
            }
        } catch (err) {
        }
    }

    const handleClose = () => {
        onHide('cancelModal')
    }

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{t('CANCEL_POST')}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="model_content">
                    <div className="model_content_table">
                        <span className="color_Ash_txt">{t('USER_ID')}</span>
                        <span className="color_blue_txt">{record && record.postId}</span>
                        <span className="color_Ash_txt">{t('PRICE')}</span>
                        <span className="color_blue_txt">${record && record.price}</span>
                        <span className="color_Ash_txt">{t('AVAILABLE')}</span>
                        <span className="color_blue_txt">{record && record.quantity} {record && record.firstCoin}</span>
                        <span className="color_Ash_txt">{t('SELLER_PAYMENT_TYPE')}</span>
                        <span className="color_blue_txt">{record && record.payBy}</span>
                        <span className="color_Ash_txt">{t('PAYMENT_TIME_LIMIT')}</span>
                        <span className="color_blue_txt">30 {t('MINUTES')}</span>
                        <span className="color_Ash_txt">{t('TRADE_LIMIT')}</span>
                        <span className="color_blue_txt">Min: {record && record.minLimit} - Max: {record && record.maxLimit}</span>
                    </div>
                </div>
                <div>
                  {t('CALNEL_AD')}
                </div>
                <GridContainer className="for_pading_po">
                    <GridItem xs={12} sm={12} md={12} lg={6}>
                        <div className="support_section d-flex justify-content-center button_aling_vl">
                            <Button onClick={handleClose}>{t('CANCEL')}</Button>
                        </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={6}>
                        <div className="support_section d-flex justify-content-center bg_blue button_aling_vl">
                            <Button onClick={handleSubmit} disabled={loader}>
                                {loader && <i class="fas fa-spinner fa-spin"></i>}{t('CONFIRM')}
                            </Button>
                        </div>
                    </GridItem>

                </GridContainer>
            </Modal.Body>

        </Modal>
    )
}

export default CanelPostModal;