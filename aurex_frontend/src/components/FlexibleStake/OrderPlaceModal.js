// import package
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Modal
} from 'react-bootstrap'
import Checkbox from 'rc-checkbox';
import { useTranslation } from 'react-i18next';
// import action
import { orderPlace, updateStakeOrder } from '../../actions/stakingAction'
import { updateWallet } from '../../actions/walletAction';

// import lib
import isEmpty from '../../lib/isEmpty';
import { toFixed } from '../../lib/roundOf';
import { interestByDays } from '../../lib/calculation'
import { toastAlert } from '../../lib/toastAlert';
import validation from './validation'

const initialFormValue = {
    'price': '',
    'type': 'flexible',
    'isTerms': false,
}

const OrderPlaceModal = (props) => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
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
        if (!isEmpty(value)) {
            setValidateError({})
        }

        let formData = { ...formValue, [name]: value }
        setFormValue(formData)
    }

    const handleCheckBox = (e) => {
        const { name, checked } = e.target
        let formData = { ...formValue, ...{ [name]: checked } }
        setFormValue(formData)
        if (checked) {
            setValidateError({})
        }
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

    const handleClose = () => {
        setValidateError({ })
        onHide()
    }

    useEffect(() => {
        if (!isEmpty(record)) {
            let data = walletData.find(el => el._id == record.currencyId)
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
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            size="md"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {t('SUBSCRIBE')} {record.coin}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="modedl_subscribe_content">
                    <div className="duration_slecys">
                        <label>{t('DURATION_DAYS')}</label>
                        <div className="duratin-a">
                            <p>{t('FLEXIBLE')}</p>
                        </div>
                    </div>
                    <div className="wlleet_ballece">
                        <h3>{t('WALLET_BAL')} <span>{assetData && assetData.spotBal} {record.coin}</span></h3>
                    </div>
                    <div className="entaer_amount">
                        <label>{t('SUBSCRIPTION_AMOUNT')}<a href="#" onClick={() => {
                            let formData = { ...formValue, 'price': assetData.spotBal }
                            setFormValue(formData)
                        }}>{t('ALL')}</a></label>
                        <div className="seacr_box_s d-flex">
                            <input
                                type="text"
                                className="w-100"
                                name="price"
                                value={price}
                                onChange={handleChange}
                            />
                            <span>{record.coin}</span>
                        </div>
                        {validateError.price && <p className="error-message">{t(validateError.price)}</p>}
                    </div>
                    <div className="contsnt_cls_model">

                        <div>
                            <span>{t('APY')}</span>
                            <span>{record.flexibleAPY}%</span>
                        </div>

                        <div>
                            <span>{t('MIN_SUBSCRIPTION')}</span>
                            <span>{record.minimumAmount} {record.coin}</span>
                        </div>

                        <div>
                            <span>{t('MAX_SUBSCRIPTION')}</span>
                            <span>{record.maximumAmount} {record.coin}</span>
                        </div>
                        <div>
                            <span>{t('REDEMPTION_PERIOD')}</span>
                            <span>{record.redemptionPeriod} {"Days"}</span>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-check">
                            <Checkbox
                                name="isTerms"
                                onChange={handleCheckBox}
                                checked={isTerms}
                            />
                            <label className="form-check-label" for="flexCheckDefault">
                                {t('READ_AND_AGREE')} <a href="/stak-terms"> {t('STAKING_TERMS')}</a>
                            </label>
                            {validateError.isTerms && <p className="error-message">{t(validateError.isTerms)}</p>}
                        </div>

                        <button
                            type="button"
                            class="btn btn-primary w-100 mt-3"
                            disabled={loader}
                            onClick={handleFormSubmit}
                        >
                            {t('CONFIRM')}
                        </button>
                    </div>

                </div>
            </Modal.Body>
        </Modal>
    )
}

export default OrderPlaceModal;