// import package
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { MenuItem, Select, Button } from '@material-ui/core';

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

const WalletTransfer = (props) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    // props
    const { show, assetData, onHide } = props;

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

    const handleClose = () => {
        setFormValue(initialFormValue)
        onHide()
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true)
        let reqData = {
            userAssetId: assetData._id,
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
                handleClose()
                getAssetData(dispatch)
                // setFormValue(initialFormValue)
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
        <Modal
            show={show}
            onHide={handleClose}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{t('WALLET_TRANSFER')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <GridContainer>
                    {/* <GridItem xs={12} sm={12} md={12} lg={6}>
                        <div className="form-group select_lable_ ">
                            <label>Select Crypto</label>
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
                    </GridItem> */}
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                        <label>{t('AMOUNT')}</label>
                        <div className="form-group  ">
                            <div class="seacr_box_s">
                                <input
                                    type="text"
                                    class="form-control"
                                    name='amount'
                                    value={amount}
                                    onChange={handleChange}
                                />
                                <i class="">{assetData && assetData.coin}</i>
                            </div>
                            {validateError.amount && <p className="error-message">{t(validateError.amount)}</p>}
                        </div>

                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={5}>
                        <div className="form-group select_lable_ ">
                            <label>{t('FROM_WALLET')}</label>
                            <Select
                                name="fromType"
                                value={fromType}
                                onChange={handleChange}
                            >
                                <MenuItem value={'spot'}>{t('SPOT_WALLET')}</MenuItem>
                                <MenuItem value={'derivative'}>{t('DERIVATIVE_WALLET')}</MenuItem>
                                <MenuItem value={'p2p'}>{t('P2P_WALLET')}</MenuItem>
                            </Select>
                            {validateError.fromType && <p className="error-message text-left">{t(validateError.fromType)}</p>}
                        </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={2}>
                        <div className="transfer-secito">
                            <i class="fas fa-exchange-alt"></i>
                        </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={5}>
                        <div className="form-group select_lable_ ">
                            <label>{t('TO_WALLET')}</label>
                            <Select
                                name="toType"
                                value={toType}
                                onChange={handleChange}
                            >
                                <MenuItem value={'spot'}>{t('SPOT_WALLET')}</MenuItem>
                                <MenuItem value={'derivative'}>{t('DERIVATIVE_WALLET')}</MenuItem>
                                <MenuItem value={'p2p'}>{t('P2P_WALLET')}</MenuItem>
                            </Select>
                            {validateError.toType && <p className="error-message text-left">{t(validateError.toType)}</p>}
                        </div>
                    </GridItem>
                    <GridItem md={12}>
                        <div className="submit_btn w-100">
                            <Button className="w-100" onClick={handleSubmit} disabled={loader}>
                                {loader && <i class="fas fa-spinner fa-spin"></i>}{t('TRANSFER')}
                            </Button>
                        </div>
                    </GridItem>
                </GridContainer>
            </Modal.Body>
        </Modal>
    )
}

export default WalletTransfer;