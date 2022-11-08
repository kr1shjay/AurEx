// import package
import React, { useState, useEffect } from 'react';
import { MenuItem, Select } from '@material-ui/core';
import Checkbox from 'rc-checkbox';
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from 'react-redux'
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from 'react-i18next';
// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import ConfirmPost from './ConfirmPost';

// import action
import { getPairList, postOrder } from '../../actions/p2pAction'

// import lib
import isEmpty from '../../lib/isEmpty';
import validation from './validation'
import { toastAlert } from '../../lib/toastAlert'

const initialFormValue = {
    "side": 'sell',
    "firstCoin": ' ',
    "firstCoinId": '',
    "secondCoin": '',
    "secondCoinId": '',
    "payBy": ' ',
    "endDate": new Date(),
    "price": '',
    "quantity": '',
    'minLimit': '',
    'maxLimit': '',
    "isTerms": false
}

const PostAds = (props) => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    // props
    const { histRef } = props;

    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [validateError, setValidateError] = useState({});
    const [list, setList] = useState([])
    const [pairList, setPairList] = useState([])
    const [pairData, setPairData] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [pageLoader, setPageLoader] = useState(false);
    const [loader, setLoader] = useState(false);

    const { side, firstCoin, firstCoinId, secondCoin, secondCoinId, payBy,
        endDate, price, quantity, minLimit, maxLimit, isTerms } = formValue;

    // redux
    const p2pPair = useSelector(state => state.p2pPair)

    // function
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let formData = { ...formValue, [name]: value }
        if (name == 'firstCoin') {
            let data = list.find(el => el._id.firstCoin == value)
            if (data) {
                setPairList(data)
                formData['firstCoin'] = data._id.firstCoin
                formData['firstCoinId'] = data._id.firstCoinId
                if (data.pair && data.pair.length > 0) {
                    formData['secondCoin'] = data.pair[0].secondCoin
                    formData['secondCoinId'] = data.pair[0].secondCoinId
                    setPairData(data.pair[0])
                }
            }
        } else if (name == 'secondCoin') {
            let data = pairList.pair.find(el => el.secondCoin == value)
            if (data) {
                formData['secondCoin'] = data.secondCoin
                formData['secondCoinId'] = data.secondCoinId
                formData['payBy'] = ' '
                setPairData(data)
            }
        } else {
            formData[name] = value
        }
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

    const handleDate = (name, value) => {
        let formData = { ...formValue, [name]: value }
        setFormValue(formData)
    }

    const handleCheckBox = (e) => {
        const { name, checked } = e.target
        let formData = { ...formValue, ...{ [name]: checked } }
        setFormValue(formData)
    }

    const closeModal = () => {
        setShowModal(false)
    }

    const fetchPair = async () => {
        try {
            setPageLoader(true)
            const { status, loading, result } = await getPairList(dispatch);
            setPageLoader(loading)
            if (status == 'success') {
                setList(result)
            }
        } catch (err) {
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let reqData = {
                firstCoinId,
                secondCoinId,
                price,
                quantity,
                side,
                minLimit,
                maxLimit,
                payBy,
                endDate,
                isTerms,
            }

            const validateError = validation(reqData)
            if (!isEmpty(validateError)) {
                setValidateError(validateError);
                return
            }

            if (!showModal) {
                setValidateError({});
                setShowModal(true)
                return
            }

            const { status, loading, message, error } = await postOrder(reqData)
            if (status == 'success') {
                toastAlert('success', message, 'PostAds')
                setShowModal(false)
                setFormValue(initialFormValue)
                histRef.current.refetchData()
            } else {
                if (error) {
                    setValidateError(validateError);
                    return
                }
                toastAlert('error', message, 'PostAds')
            }
        } catch (err) {
        }
    }

    useEffect(() => {
        // if (isEmpty(p2pPair)) {
        //     fetchPair()
        // }
        fetchPair()

    }, [])
    return (
        <div className="p2p_card recent_post">
            <ConfirmPost
                show={showModal}
                onHide={closeModal}
                data={formValue}
                onSubmit={handleSubmit}
            />
            <h4 className="login_title_8">{t('POST_AD')}</h4>
            <form className="contact_form mb-0 w100_form_p2p pa125sd">
                <div className="settingsSelect clas_Newselect clas_Newselect124">
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={6} lg={4} className="paddin_gri_po mt-151_15">
                            <div className="form-group">
                                <label className="label_color_78">{t('I_WANT_TO')} </label>
                                <Select value={side} name="side" onChange={handleChange}>
                                    <MenuItem value={'sell'}>{t('SELL')}</MenuItem>
                                    <MenuItem value={'buy'}>{t("BUY")}</MenuItem>
                                </Select>
                                {validateError.side && <p className="error-message">{t(validateError.side)}</p>}
                            </div>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6} lg={4} className="paddin_gri_po mt-151_15">
                            <div className="form-group">
                                <label className="label_color_78">{t('CRYPTO_CURRENCY')}</label>
                                <Select
                                    name={'firstCoin'}
                                    value={firstCoin}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={' '}>{t('SELECT_COIN')}</MenuItem>
                                    {
                                        list && list.length > 0 && list.map((item, key) => {
                                            return (
                                                <MenuItem key={key} value={item._id.firstCoin}>{item._id.firstCoin}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                                {validateError.firstCoin && <p className="error-message">{t(validateError.firstCoin)}</p>}
                            </div>
                        </GridItem>
                        {
                            !isEmpty(firstCoin) && <GridItem xs={12} sm={12} md={6} lg={4} className="mt-151_15">

                                <div className="form-group">
                                    <label className="label_color_78">{t('Quantity')}</label>
                                    <div class="input-group ">

                                        <input type="text" class="form-control"
                                            name={'quantity'}
                                            value={quantity}
                                            onChange={handleChange}
                                        />
                                        <div class="input-group-append">
                                            <button type="button" className="inpor_inside_buttons">{firstCoin}</button>
                                        </div>
                                    </div>
                                    {validateError.quantity && <p className="error-message">{t(validateError.quantity)}</p>}
                                </div>
                            </GridItem>
                        }

                        {
                            !isEmpty(firstCoin) && <GridItem xs={12} sm={12} md={6} lg={3} className="paddin_gri_po mt-151_15">
                                <div className="form-group">
                                    <label className="label_color_78">{t('PRICE_CURRENCY')}</label>
                                    <Select
                                        name={'secondCoin'}
                                        value={secondCoin}
                                        onChange={handleChange}
                                    >
                                        {
                                            pairList && pairList.pair && pairList.pair.length > 0 && pairList.pair.map((item, key) => {
                                                return (
                                                    <MenuItem key={key} value={item.secondCoin}>{item.secondCoin}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                    {validateError.secondCoin && <p className="error-message">{t(validateError.secondCoin)}</p>}
                                </div>
                            </GridItem>
                        }


                        {
                            !isEmpty(firstCoin) && <GridItem xs={12} sm={12} md={6} lg={3} className="paddin_gri_po mt-151_15">
                                <div className="form-group">
                                    <label className="label_color_78">Price Per {pairData.firstCoin}</label>
                                    <div class="input-group">
                                        <input type="text" className="form-control"
                                            name={'price'}
                                            value={price}
                                            onChange={handleChange}
                                        />
                                        <div class="input-group-append">
                                            <button type="button" className="inpor_inside_buttons">{secondCoin}</button>
                                        </div>
                                    </div>
                                    {validateError.price && <p className="error-message">{t(validateError.price)}</p>}
                                </div>
                            </GridItem>
                        }

                        {
                            !isEmpty(firstCoin) && !isEmpty(pairData) && <GridItem xs={12} sm={12} md={12} lg={6} className="paddin_gri_po mt-151_15">
                                <div className="form-group whithAutft">
                                    <label className="label_color_78">{t('CURRENCY_MARKET_PRICE')}</label>
                                    <div className="bitcoin_value_box">
                                        <h3>1 {pairData.firstCoin} = {pairData.markPrice} {pairData.secondCoin}</h3>
                                    </div>
                                </div>
                            </GridItem>
                        }

                        {
                            !isEmpty(firstCoin) && <GridItem xs={12} sm={12} md={12} lg={7} className="mt-151_15 d-flex">

                                <GridContainer>
                                    <GridItem md={6}>
                                        <div className="form-group">
                                            <label className="label_color_78">{t('PRICE_LIMIT_MARKET')}</label>
                                            <div class="input-group ">

                                                <input type="text" class="form-control"
                                                    name={'minLimit'}
                                                    value={minLimit}
                                                    onChange={handleChange}
                                                />
                                                <div class="input-group-append">
                                                    <button type="button" className="inpor_inside_buttons">{secondCoin}</button>
                                                </div>

                                            </div>
                                            {validateError.minLimit && <p className="error-message">{t(validateError.minLimit)}</p>}
                                        </div>
                                    </GridItem>
                                    <GridItem md={6}>
                                        <div className="form-group">
                                            <label className="label_color_78">To</label>
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
                                    </GridItem>
                                </GridContainer>
                            </GridItem>
                        }

                        <GridItem xs={12} sm={12} md={6} lg={5} className="mt-151_15">
                            <div className="form-group w100_form_p2p date-width">
                                <label className="primary_label" htmlFor="minimumbid">{t('SHOW_MY_POST')}</label>
                                <div className="wdth--1001">
                                    <DatePicker className="form-control primary_inp"
                                        selected={endDate}
                                        onChange={(date) => handleDate('endDate', date)}
                                        selectsStart
                                        dateFormat="dd/MM/yyyy h:mm aa"
                                        showTimeInput
                                    >

                                    </DatePicker>
                                    <i class="far fa-calendar-alt"></i>
                                    {validateError.endDate && <p className="error-message">{t(validateError.endDate)}</p>}
                                </div>

                            </div>
                        </GridItem>
                        {
                            !isEmpty(firstCoin) && <GridItem xs={12} sm={12} md={6} lg={12} className="paddin_gri_po mt-151_15">
                                <div className="form-group text_upper">
                                    <label className="label_color_78 width_pwe">{t('PERFERRED_PAYMENTS')}</label>
                                    <div>
                                        <Select
                                            name="payBy"
                                            value={payBy}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value={' '}>{t('SELECT_PAYMENT')}</MenuItem>
                                            {
                                                pairData && pairData.payment && pairData.payment.length > 0 && pairData.payment.map((item, key) => {
                                                    return (
                                                        <MenuItem key={key} value={item}>{item}</MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>

                                    </div>
                                    {validateError.payBy && <p className="error-message">{t(validateError.payBy)}</p>}
                                </div>
                            </GridItem>
                        }

                        <GridItem xs={12} sm={12} md={12} lg={12} className="paddin_gri_po mt-151_15">
                            <p className="ckksdyt_box">
                                <Checkbox
                                    name="isTerms"
                                    onChange={handleCheckBox}
                                    checked={isTerms}
                                />{t('I_AGREE_ESCROW')}<span className="mx-1"><a href="">{t('TERMS')}</a></span>{t('AND')}<span className="mx-1"><a href="">{t('POLICY')}</a></span>
                            </p>
                            {validateError.isTerms && <p className="error-message">{t(validateError.isTerms)}</p>}
                            <button type="button" className="btn btn-primary text-uppercase py-2 display_block_mars"
                                onClick={handleSubmit}
                            >{t('SUBMIT_POST')}</button>
                        </GridItem>
                    </GridContainer>
                </div>
            </form>
        </div>
    )
}

export default PostAds;