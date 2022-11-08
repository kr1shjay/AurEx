// import package
import React, { useState } from 'react';
import { MenuItem, Select } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import action
import { walletTransfer, getAssetData } from '../../actions/walletAction';

// import lib
import { toastAlert } from '../../lib/toastAlert';
import isEmpty from '../../lib/isEmpty';
import { walletTransferValidation } from './validation';

const initialFormValue = {
    'fromType': "spot",
    'toType': 'derivative',
    'userAssetId': ' ',
    'amount': '',
}

const WalletTransfer = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    // redux-state
    const walletData = useSelector(state => state.wallet);

    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [validateError, setValidateError] = useState({});
    const [loader, setLoader] = useState();

    const { fromType, toType, userAssetId, amount } = formValue;

    // function
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let formData = { ...formValue, ...{ [name]: value } }
        setFormValue(formData)
        if (!isEmpty(validateError)) {
            setValidateError({})
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true)
        let reqData = {
            userAssetId,
            fromType,
            toType,
            amount
        }

        let validationError = walletTransferValidation(reqData)
        if (!isEmpty(validationError)) {
            setValidateError(validationError)
            setLoader(false)
            return
        }

        try {
            const { status, loading, message, error } = await walletTransfer(reqData);
            setLoader(loading)
            if (status == 'success') {
                getAssetData(dispatch)
                setFormValue(initialFormValue)
                toastAlert('success', t(message), 'walletTransfer')
            } else {
                if (error) {
                    setValidateError(error)
                }
                toastAlert('error', t(message), 'walletTransfer')
            }
        } catch (err) { }
    }

    return (
        <GridItem xs={12} sm={12} md={12} lg={6}>
            <h5 className="dash_subtitle">{t('TRANS_WALLET_AMOUNT')}</h5>
            <div className="contact_form settingsSelect mb-0">
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12} lg={4}>
                        <div className="form-group">
                            <label>{t('FORM')}</label>
                            <Select
                                name="fromType"
                                value={fromType}
                                onChange={handleChange}
                            >
                                <MenuItem value={'spot'}>{t('SPOT_WALLET')}</MenuItem>
                                <MenuItem value={'derivative'}>{t('SPOT_WALLET')}</MenuItem>
                            </Select>
                            {validateError.fromType && <p className="error-message text-left">{t(validateError.fromType)}</p>}
                        </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={4}>
                        <div class="form-group disabledGroup">
                            <label>{t('TO')}</label>
                            <Select
                                name="toType"
                                value={toType}
                                onChange={handleChange}
                            >
                                <MenuItem value={'spot'}>{t('SPOT_WALLET')}</MenuItem>
                                <MenuItem value={'derivative'}>{t('SPOT_WALLET')}</MenuItem>
                            </Select>
                            {validateError.toType && <p className="error-message text-left">{t(validateError.toType)}</p>}
                        </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={4}>
                        <div className="form-group">
                            <label>{t("AMOUNT")}</label>
                            <input
                                type="text"
                                class="form-control"
                                name='amount'
                                value={amount}
                                onChange={handleChange}
                            />

                            {validateError.amount && <p className="error-message">{t(validateError.amount)}</p>}
                        </div>
                    </GridItem>

                    <GridItem xs={12} sm={12} md={12} lg={4}>
                        <div class="form-group">
                            <Select
                                name="userAssetId"
                                value={userAssetId}
                                onChange={handleChange}
                            >
                                <MenuItem value={' '}>{t("SELECT_CURRENCY")}</MenuItem>
                                {
                                    walletData && walletData.length > 0 && walletData.map((item, key) => {
                                        return <MenuItem value={item._id}> {item.coin}</MenuItem>
                                    })
                                }
                            </Select>
                            {validateError.userAssetId && <p className="error-message text-left">{t(validateError.userAssetId)}</p>}
                        </div>
                    </GridItem>

                    <GridItem xs={12} sm={12} md={12} lg={12}>
                        <div className="form-group mb-0">
                            <button
                                className="btn btn-primary text-uppercase py-2 m-0"
                                onClick={handleSubmit}
                                disabled={loader}
                            >
                                {loader && <i class="fas fa-spinner fa-spin"></i>}
                                {t('TRANSFER_FUND')}
                            </button>
                        </div>
                    </GridItem>
                </GridContainer>
            </div>
        </GridItem>
    )
}

export default WalletTransfer;