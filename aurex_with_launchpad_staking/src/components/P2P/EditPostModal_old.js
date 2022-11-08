// import package
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from "@material-ui/core";
import { MenuItem, Select } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import isEmpty from 'lib/isEmpty';

// import action
import { editPost } from '../../actions/p2pAction'

// import lib
import { toastAlert } from '../../lib/toastAlert'

const initialFormValue = {
    'id': '',
    'side': 'sell',
    "firstCoin": ' ',
    "firstCoinId": '',
    "secondCoin": '',
    "secondCoinId": '',
    "payBy": ' ',
    "price": '',
    "quantity": '',
    'minLimit': '',
    'maxLimit': '',
}

const EditPostModal = (props) => {
    // props
    const { show, onHide, record, refetch } = props;
    const { t, i18n } = useTranslation();
    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [validateError, setValidateError] = useState({});
    const [pairData, setPairData] = useState({})
    const [loader, setLoader] = useState(false);

    // redux
    const p2pPair = useSelector(state => state.p2pPair)

    const { id, side, firstCoin, secondCoin, payBy, price, quantity, minLimit, maxLimit } = formValue;

    // function
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let formData = { ...formValue, [name]: value }
        formData[name] = value
        setFormValue(formData)
        calcMaxOrder(formData.price, formData.quantity)
    }

    const calcMaxOrder = (price, quantity) => {
        if (!isEmpty(price) && !isNaN(price) && !isEmpty(quantity) && !isNaN(quantity)) {
            setFormValue((el) => {
                return { ...el, ...{ "maxLimit": price * quantity } }
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            let reqData = {
                id,
                quantity,
                price,
                minLimit,
                maxLimit,
                payBy
            }
            setLoader(true)
            const { status, loading, message, error } = await editPost(reqData);
            setLoader(loading)
            if (status == 'success') {
                toastAlert('success', message, 'editPost')
                setFormValue(initialFormValue)
                onHide()
                refetch()
            } else {
                if (error) {
                    setValidateError(error);
                    return
                }
                toastAlert('error', message, 'editPost')
            }
        } catch (err) {
        }
    }

    useEffect(() => {
        if (!isEmpty(record) && !isEmpty(p2pPair)) {
            setFormValue({
                'id': record._id,
                'side': record.side,
                'firstCoin': record.firstCoin,
                'price': record.price,
                'quantity': record.quantity,
                'minLimit': record.minLimit,
                'maxLimit': record.maxLimit,
                'payBy': record.payBy
            })

            let getPairList = p2pPair.find(el => el._id.firstCoin == record.firstCoin)
            if (getPairList) {
                let data = getPairList.pair.find(el => el.secondCoin == record.secondCoin)
                setPairData(data)
            }
        }
    }, [record, p2pPair])

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{t('EDIT_MY_POST')}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="model_content">
                    <div className="model_content_table">
                        <span className="color_Ash_txt">{t('TYPE')}</span>
                        <span className="color_blue_txt">{side}</span>
                        <span className="color_Ash_txt">{t('CRYPTO_CURRENCY')}</span>
                        <span className="color_blue_txt">{firstCoin}</span>

                        <span className="color_Ash_txt">{t('QUANTITY')}</span>
                        <span className="color_blue_txt">
                            <div className="form-group d-flex_p2p d-flex_p2p_23">
                                <div class="input-group ">
                                    <input type="text" class="form-control"
                                        name={'quantity'}
                                        value={quantity}
                                        onChange={handleChange}
                                    />
                                </div>
                                {validateError.quantity && <p className="error-message">{t(validateError.quantity)}</p>}
                            </div>
                        </span>

                        <span className="color_Ash_txt">{t('PRICE')}</span>
                        <span className="color_blue_txt">
                            <div className="form-group d-flex_p2p d-flex_p2p_23">
                                <div class="input-group">
                                    <input type="text" className="form-control"
                                        name={'price'}
                                        value={price}
                                        onChange={handleChange}
                                    />
                                </div>
                                {validateError.price && <p className="error-message">{t(validateError.price)}</p>}
                            </div>
                        </span>

                        <span className="color_Ash_txt">{t('PRICE_LIMIT_FROM')}:</span>
                        <span className="color_blue_txt">
                            <div className="form-group d-flex_p2p d-flex_p2p_23 flort_lesttd ">
                                <div class="input-group ">
                                    <input type="text" class="form-control"
                                        name={'minLimit'}
                                        value={minLimit}
                                        onChange={handleChange}
                                    />
                                    {validateError.minLimit && <p className="error-message">{t(validateError.minLimit)}</p>}
                                </div>
                            </div>
                        </span>

                        <span className="color_Ash_txt">{t('PRICE_LIMIT_TO')}:</span>
                        <span className="color_blue_txt">
                            <div className="form-group d-flex_p2p d-flex_p2p_23 flort_lesttd ">
                                <div class="input-group ">
                                    <input type="text" class="form-control"
                                        name={'maxLimit'}
                                        value={maxLimit}
                                        disabled={true}
                                    // onChange={handleChange}
                                    />
                                    <div class="input-group-append">
                                        <button type="button" className="inpor_inside_buttons">{secondCoin}</button>
                                    </div>
                                </div>
                                {validateError.maxLimit && <p className="error-message">{t(validateError.maxLimit)}</p>}
                            </div>
                        </span>

                        <span className="color_Ash_txt">{t('PAYMENT_TYPE')}</span>
                        <span className="color_blue_txt">
                            <div className="form-group d-flex_p2p  whithAutft select_width">
                                <select
                                    name="payBy"
                                    value={payBy}
                                    onChange={handleChange}
                                >
                                    <option value={' '}>{t('SELECT_PAYMENT')}</option>
                                    {
                                        pairData && pairData.payment && pairData.payment.length > 0 && pairData.payment.map((item, key) => {
                                            return (
                                                <option key={key} value={item}>{item}</option>
                                            )
                                        })
                                    }

                                </select>
                                {validateError.payBy && <p className="error-message">{t(validateError.payBy)}</p>}
                            </div>
                        </span>
                    </div>
                </div>
                <GridContainer className="for_pading_po">
                    <GridItem xs={12} sm={12} md={12} lg={6}>
                        <div className="support_section d-flex justify-content-center button_aling_vl">
                            <Button onClick={() => onHide()}>{t('CANCEL')}</Button>
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

export default EditPostModal;