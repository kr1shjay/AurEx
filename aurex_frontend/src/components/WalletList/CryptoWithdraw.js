// import package
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Button, Select, MenuItem } from "@material-ui/core";

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import action
import { withdrawRequestCoin } from "../../actions/walletAction";

// import lib
import isEmpty from "../../lib/isEmpty";
import { coinValidation } from "./validation";
import { toastAlert } from "../../lib/toastAlert";
import { precentConvetPrice } from "../../lib/calculation";
import { encryptObject } from "../../lib/cryptoJS";
import { toFixed } from "lib/roundOf";

const initialFormValue = {
  currencyId: "",
  amount: "",
  receiverAddress: "",
  password: "",
  twoFACode: "",
  finalAmount: "",
};

const CryptoWithdraw = (props) => {
  const { t, i18n } = useTranslation();

  // props
  const { show, assetData, currency, onHide } = props;

  // state
  const [formValue, setFormValue] = useState(initialFormValue);
  const [validateError, setValidateError] = useState({});
  const [loader, setLoader] = useState(false);

  const {
    currencyId,
    amount,
    receiverAddress,
    password,
    twoFACode,
    finalAmount,
  } = formValue;

  // function
  const handleClose = () => {
    setFormValue(initialFormValue);
    setValidateError({});
    onHide();
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (!isEmpty(validateError)) {
      setValidateError({});
    }

    if (name == "amount") {
      if (!/^\d*\.?\d*$/.test(value)) {
        return;
      }
      let finalAmountBal = parseFloat(value) + parseFloat(currency.withdrawFee);
      let formData = {
        ...formValue,
        ...{ [name]: value, finalAmount: finalAmountBal },
      };
      setFormValue(formData);
      return;
    }

    if (name == "twoFACode") {
      if (!(value == "" || (/^[0-9\b]+$/.test(value) && value.length <= 6))) {
        return;
      }
    }
    let formData = { ...formValue, ...{ [name]: value } };
    setFormValue(formData);
  };

  const handleSubmit = async () => {
    setLoader(true);
    let reqData = {
      currencyId: currency._id,
      coin: currency.coin,
      tokenType: currency.tokenType,
      minimumWithdraw: currency.minimumWithdraw,
      amount,
      receiverAddress,
      twoFACode,
      finalAmount,
      spotBal: assetData.spotBal,
    };
 let newDoc ={
    "title" : "withdraw request",
    "description" : "withdraw request send Successfully",
    "isRead" : false,
    "trxId" : "",
    "currencySymbol" : "",
    "amount" : 0,
    "paymentType" : "coin_deposit",
    "status" : "new",
 }
    let validationError = coinValidation(reqData, t);
    console.log(validationError,'------------101')
    if (!isEmpty(validationError)) {
      setValidateError(validationError);
      setLoader(false);
      return;
    }

    let encryptToken = {
      token: encryptObject(reqData),
    };

    try {
      const { status, loading, error, message } = await withdrawRequestCoin(
        encryptToken
      );
      setLoader(loading);
      if (status == "success") {
        setFormValue(initialFormValue);
        handleClose();
        toastAlert("success", t(message), "withdraw");
      } else {
        if (error) {
          setValidateError(error);
          return;
        }
        toastAlert("error", t(message), "withdraw");
      }
    } catch (err) {}
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{t("WITHDRAW CRYPTO")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12} lg={6}>
            <label>{t("AMOUNT")}</label>
            <div className="form-group  ">
              <div class="seacr_box_s padd_right_input">
                <input
                  type="text"
                  placeholder=""
                  name="amount"
                  value={amount}
                  onChange={handleChange}
                />
                <i class="">{assetData && assetData.coin}</i>
              </div>
            </div>
            {validateError.amount && (
              <p className="error-message">{t(validateError.amount)}</p>
            )}
          </GridItem>
          <GridItem xs={12} sm={12} md={12} lg={6}>
            <label>{t("WITHDRAW_ADDRESS")}</label>
            <div class="form-group">
              <div class="seacr_box_s">
                <input
                  type="text"
                  // name=""
                  name="receiverAddress"
                  value={receiverAddress}
                  onChange={handleChange}
                />
              </div>
              {validateError.receiverAddress && (
                <p className="error-message">
                  {t(validateError.receiverAddress)}
                </p>
              )}
            </div>
          </GridItem>
          <GridItem xs={12} sm={12} md={12} lg={12}>
            <div className="wallwt_balance">
              <p>
                {t("WALLET_BALANCE")}
                <span>
                  {assetData && assetData.spotBal} {assetData.coin}
                </span>
              </p>
            </div>
          </GridItem>
          <GridItem xs={12} sm={12} md={12} lg={6}>
            <label>{t("FINAL_WITHDRAW_AMOUNT_WITH_FEE")}</label>
            <div className="form-group  ">
              <div class="seacr_box_s padd_right_input">
                <input
                  type="text"
                  placeholder=""
                  value={finalAmount}
                  disabled
                />
                <i class="">{assetData.coin}</i>
              </div>
            </div>
          </GridItem>
          <GridItem xs={12} sm={12} md={12} lg={6}>
            <label>{t("ENTER2FA_CODE")}</label>
            <div className="form-group  ">
              <div class="seacr_box_s">
                <input
                  type="text"
                  placeholder=""
                  name="twoFACode"
                  value={twoFACode}
                  onChange={handleChange}
                />
              </div>
            </div>
            {validateError.twoFACode && (
              <p className="error-message">{t(validateError.twoFACode)}</p>
            )}
          </GridItem>
          <GridItem md={12}>
            <div className="submit_btn w-100">
              <Button
                className="w-100"
                onClick={handleSubmit}
                disabled={loader}
              >
                {loader && <i className="fas fa-spinner fa-spin"></i>}
                {t("WITHDRAW")}
              </Button>
            </div>
          </GridItem>
          <GridItem md={12}>
            <div className="notes_section px-0">
              <p>{t("NOTES")}</p>
              <ul>
                <li>
                  1. {t("MIN_WITHDRAW_LIMIT")}
                  {currency && toFixed(currency.minimumWithdraw,8)}
                </li>
                <li>2. {t("WITHDRAW_PROCESS")}</li>
                <li>3. {t("WITHDRAW_TIME")}</li>
                <li>4. {t("WITHDRAW_PROCESS2")}</li>
              </ul>
            </div>
          </GridItem>
        </GridContainer>
      </Modal.Body>
    </Modal>
  );
};

export default CryptoWithdraw;
