// import package
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import Checkbox from 'rc-checkbox';
import { useTranslation } from 'react-i18next';
import {
    Modal
} from 'react-bootstrap'
import { Slider } from '@material-ui/core';

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import action
import { orderPlace, updateStakeOrder } from '../../actions/stakingAction'
import { updateWallet } from '../../actions/walletAction';

// import lib
import isEmpty from '../../lib/isEmpty';
import { toFixed } from '../../lib/roundOf';
import { interestByDays } from '../../lib/calculation'
import { toastAlert } from '../../lib/toastAlert';
import validation from './validation'


const marks = [
    {
        value: 0,
        label: '0%',
    },
    {
        value: 15,
        label: '15%',
    },
    {
        value: 30,
        label: '30%',
    },
    {
        value: 50,
        label: '50%',
    },
    {
        value: 65,
        label: '65%',
    },
    {
        value: 80,
        label: '80%',
    },
    {
        value: 100,
        label: '100%',
    },
];

function valuetext(value) {
    return `${value}%`;
}

const initialFormValue = {
    'price': '',
    'type': 'flexible',
    'isTerms': false,
}

const OrderPlaceModal = (props) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    // props
    const { isShow, record, onHide } = props;

    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [assetData, setAssetData] = useState({})
    const [pricePct, setPricePct] = useState(0) // Balance Percentage
    const [validateError, setValidateError] = useState({});
    const [loader, setLoader] = useState();

    const { price, type, isTerms } = formValue;

    // redux-state
    const walletData = useSelector(state => state.wallet);

    // function
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        if (name == 'price' && !/^\d*\.?\d*$/.test(value)) {
            return
        }

        if (name == 'price' && assetData && assetData.spotBal) {
            let balancePct = (value / assetData.spotBal) * 100
            setPricePct(toFixed(balancePct, 2))
        }

        let formData = { ...formValue, ...{ [name]: value } }
        setFormValue(formData)
    }

    const handleCheckBox = (e) => {
        const { name, checked } = e.target
        let formData = { ...formValue, ...{ [name]: checked } }
        setFormValue(formData)
    }

    const handlePercentage = (e, percentage) => {
        if (assetData && assetData.spotBal) {
            let formData = {
                ...formValue,
                ...{
                    'price': assetData.spotBal * (percentage / 100)
                }
            }
            setPricePct(percentage)
            setFormValue(formData)
        }
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoader(true)
        let reqData = {
            stakeId: record._id,
            price,
            type,
            isTerms
        }

        let validationError = validation(reqData)
        if (!isEmpty(validationError)) {
            setValidateError(validationError)
            setLoader(false)
            return
        }

        try {
            let { status, loading, message, error, result } = await orderPlace(reqData);
            setLoader(loading);
            if (status == 'success') {
                updateWallet(dispatch, result.wallet, 'stake')
                updateStakeOrder(dispatch, result.orderData, 'newOrder')
                setFormValue(initialFormValue)
                toastAlert('success', message, 'stakeOrder');
                onHide()
            } else {
                if (error) {
                    setValidateError(error);
                }
                toastAlert('error', message, 'stakeOrder');
            }
        } catch (err) { }
    }

    useEffect(() => {
        if (!isEmpty(record)) {
            let data = walletData.find(el => el.currency._id == record.currencyId)
            if (!isEmpty(data)) {
                setAssetData(data)
                return
            }
            // onHide()
        }
    }, [record])

    return (
        <Modal
            show={isShow}
            onHide={onHide}
            backdrop="static"
            keyboard={false}
            size="md"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <h4 className="modal-title mt-0">{t('TRANSFER_BITCOIN')}</h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <GridContainer>
                    <GridItem sm={12} md={7}>
                        <div className="stakePopDetails contact_form settingsSelect">
                            <div className="flexText">
                                <label>{t('WALLET_BAL')}</label>
                                <h4>{assetData && assetData.spotBal} {assetData && assetData.currencySymbol}</h4>
                            </div>
                            <div className="form-group">
                                <label class="flexLabel">
                                    <span>{t('AMOUNT_TO_STAKE')}</span>
                                    <Link to="/wallet">{t('DEPOSIT')}</Link>
                                </label>
                                <Slider
                                    getAriaValueText={valuetext}
                                    aria-labelledby="discrete-slider-custom"
                                    step={1}
                                    valueLabelDisplay="auto"
                                    marks={marks}
                                    value={pricePct}
                                    onChange={handlePercentage}
                                />
                            </div>
                            <div className="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="btnType1">{t('STAKE_AMOUNT')}</span>
                                    </div>
                                    <input
                                        type="text"
                                        class="form-control text-right borderZero"
                                        name="price"
                                        value={price}
                                        onChange={handleChange}
                                    />
                                    <div class="input-group-append">
                                        <span class="btnType1">{t('BTC')}</span>
                                    </div>

                                    {validateError.price && <p className="error-message">{t(validateError.price)}</p>}
                                </div>
                            </div>
                            <div className="form-group mb-0">
                                <div className="form-check">

                                    <Checkbox
                                        name="isTerms"
                                        onChange={handleCheckBox}
                                        checked={isTerms}
                                    />
                                    <label className="form-check-label" for="flexCheckDefault">{t('T_HAVE_READ')}<a href="#">{t('TERMS_CONDITION')}</a></label>
                                    {validateError.isTerms && <p className="error-message">{t(validateError.isTerms)}</p>}
                                </div>
                            </div>
                            <div className="form-group">
                                <button
                                    className="btn btn-primary text-uppercase w-100"
                                    disabled={loader}
                                    onClick={handleFormSubmit}
                                >
                                    {loader && <i className="fas fa-spinner fa-spin"></i>}
                                 {t('TRANSFER_CONFIRM')}
                                </button>
                            </div>
                        </div>
                    </GridItem>
                    <GridItem sm={12} md={5}>
                        <div className="stakeDetailsRight">
                            <h4>{t('STAKING_DELAILS')}</h4>
                            <ul>
                                <li>
                                    <label>7-{t('DAY_APY')}</label>
                                    <span className="textDepositGreen">{record.flexibleAPY}%</span>
                                </li>
                                <li>
                                    <label>{t('FLEXIBLE_INTERESTED')}</label>
                                    <span>{toFixed(interestByDays(1000, record.flexibleAPY, 365), 4)} {record.currencySymbol}</span>
                                </li>
                                <li>
                                    <label>{t('MIN_SUBSCRIPTION')}</label>
                                    <span>{record.minimumAmount} {record.currencySymbol}</span>
                                </li>
                                <li>
                                    <label>{t('MAX_SUBSCRIPTION')}</label>
                                    <span>{record.maximumAmount} {record.currencySymbol}</span>
                                </li>
                                {/* <li>
                                    <label>Value date</label>
                                    <span>24-05-2021 15:15</span>
                                </li> */}
                            </ul>
                        </div>
                    </GridItem>
                </GridContainer>

            </Modal.Body>

        </Modal>


    )
}

export default OrderPlaceModal;