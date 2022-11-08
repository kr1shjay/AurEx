// import package
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Button, Menu } from "@material-ui/core";
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import validation from './validation'

// import action
import { orderPlace } from '../../actions/p2pAction'

// import lib
import isEmpty from '../../lib/isEmpty';
import { toFixed } from '../../lib/roundOf';
import { toastAlert } from '../../lib/toastAlert'

const initialFormValue = {
    'payValue': '',
    "receiveValue": ''
}

const ConfirmOrder = (props) => {
    const history = useHistory();
    const { t, i18n } = useTranslation();
    const [validErr, setValidErr] = useState({})
    // props
    const { show, onHide, record } = props;
    // states
    const [formValue, setFormValue] = useState(initialFormValue);

    const { payValue, receiveValue } = formValue;

    // function
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let formData = { ...formValue, [name]: value }
        setFormValue(formData)
        calcReceiveValue(formData.payValue)
        if (!isEmpty(value)) {
            setValidErr({})
        }
    }

    const calcReceiveValue = (payValue) => {
        if (!isEmpty(payValue) && !isNaN(payValue)) {
            setFormValue((el) => {
                return {
                    ...el, receiveValue: toFixed(payValue / record.price, 8)
                }
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let reqData = {
                id: record._id,
                payValue,
                receiveValue,
                side: record.side == 'buy' ? 'sell' : 'buy'
            }

            const { status, loading, message, error, result } = await orderPlace(reqData);
            if (status == 'success') {
                toastAlert('success', message, 'confirmOrder')
                history.push(`/chat/${result.orderData.id}`)
                setValidErr({})
            } else {
                if (error) {
                    setValidErr(error)
                }
                toastAlert('error', message, 'confirmOrder')
            }
        } catch (err) {
        }
    }

    const handleClose = () => {
        onHide()
        setValidErr({})
        setFormValue(initialFormValue)
    }

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            backdrop="static"
        >

            <Modal.Header closeButton>
                <Modal.Title>{record && record.side == 'buy' ? 'Sell' : 'Buy'} </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="model_content">
                    <div className="model_content_table">
                        <span className="color_Ash_txt">{t('USER_ID')}</span>
                        <span className="color_blue_txt">{record && record.postId}</span>
                        <span className="color_Ash_txt">{t('PRICE')}</span>
                        <span className="color_blue_txt">${record && record.price}</span>
                        <span className="color_Ash_txt">{t('AVAILABLE')}</span>
                        <span className="color_blue_txt">{record && record.remainingQty} {record && record.firstCoin}</span>
                        <span className="color_Ash_txt">{t('SELLER_PAYMENT_TYPE')}</span>
                        <span className="color_blue_txt">{record && record.payBy}</span>
                        <span className="color_Ash_txt">{t('PAYMENT_TIME_LIMIT')}</span>
                        <span className="color_blue_txt">30 {t('MINUTES')}</span>
                        <span className="color_Ash_txt">{t('TRADE_LIMIT')}</span>
                        <span className="color_blue_txt">Min: {record && record.minLimit} - Max: {record && record.maxLimit}</span>
                    </div>
                </div>
                <GridContainer className="for_pading_po">
                    <GridItem xs={12} sm={12} md={12} lg={6}>
                        {
                            record.side == 'sell' && <label>{t('WANT_PAY')}</label>
                        }

                        {
                            record.side == 'buy' && <label>{t("RECEIVE")}</label>
                        }

                        <div className="model_input_with_lable">
                            <input
                                type="text"
                                name="payValue"
                                value={payValue}
                                onChange={handleChange}
                            />
                            <span>{record && record.secondCoin}</span>
                        </div>
                        <span style={{ color: 'red' }}>{validErr && validErr.payValue}</span>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={6}>
                        {
                            record.side == 'sell' && <label>{t('RECEIVE')}</label>
                        }

                        {
                            record.side == 'buy' && <label>{t("WANT_SELL")}</label>
                        }
                        <div className="model_input_with_lable">
                            <input
                                type="text"
                                name="receiveValue"
                                value={receiveValue}
                                disabled={true}
                            />
                            <span>{record && record.firstCoin}</span>
                        </div>
                        <span style={{ color: 'red' }}>{validErr && validErr.receiveValue}</span>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                        <div className="buy_button">
                            {
                                record && record.side == 'sell' && <Button onClick={handleSubmit} >{t('BUY')}</Button>
                            }
                            {
                                record && record.side == 'buy' && <Button className="sell" onClick={handleSubmit}>{t('SELL')}</Button>
                            }
                        </div>
                        <p className="button_cls_p">Notes</p>
                        <ol className="ol_list_section">

                            <li>{t('PAY_WITH_TIME_LIMIT')}</li>
                            <li>{t('PAY_TRADE_TERMS')}</li>

                        </ol>
                    </GridItem>
                </GridContainer>
            </Modal.Body>

        </Modal>
    )
}

export default ConfirmOrder;