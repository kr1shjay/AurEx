// import package
import React from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from "@material-ui/core";
import { useTranslation } from 'react-i18next';
// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import lib
import { capitalize } from '../../lib/stringCase'

const ConfirmPost = (props) => {
    // props
    const { show, onHide, data, onSubmit } = props;
    console.log("🚀 ~ file: ConfirmPost.js ~ line 16 ~ ConfirmPost ~ data", data)
    const { t, i18n } = useTranslation();
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >

            <Modal.Header closeButton>
                <Modal.Title>{t('CONFIRM_MY_POST')}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="model_content">
                    <div className="model_content_table">
                        <span className="color_Ash_txt">{t('TYPE')}</span>
                        <span className="color_blue_txt">{data && capitalize(data.side)}</span>
                        <span className="color_Ash_txt">{t('CRYPTO_CURRENCY')}</span>
                        <span className="color_blue_txt">{data && data.firstCoin}</span>
                        <span className="color_Ash_txt">{t('PRICE')}</span>
                        <span className="color_blue_txt">{data && data.price} {data && data.secondCoin}</span>
                        <span className="color_Ash_txt">{t('Quantity')}</span>
                        <span className="color_blue_txt"> {data && data.quantity}</span>
                        {/* <span className="color_Ash_txt">{t('LIMIT')}</span>
                        <span className="color_blue_txt">{data && data.minOrderValue} {data && data.secondCoin} - {data && data.maxOrderValue} {data && data.secondCoin}</span> */}
                        <span className="color_Ash_txt">{t('PAYMENT_TYPE')}</span>
                        <span className="color_blue_txt">{data && capitalize(data.payBy)}</span>
                        <span className="color_Ash_txt">Trade Limit Min</span>
                        <span className="color_blue_txt">Min:{data && data.minLimit}</span>
                        <span className="color_Ash_txt">Trade Limit Max</span>
                        <span className="color_blue_txt">Max:{data && data.maxLimit}</span>
                        {/* <span className="color_blue_txt"></span> */}

                        {/* <span className="color_Ash_txt">Post Ad Till</span>
                            <span className="color_blue_txt">{data && data.endDate}</span> */}
                        {/* <span className="color_Ash_txt">Post ID</span>
                            <span className="color_blue_txt">#123456</span> */}
                    </div>
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

export default ConfirmPost;