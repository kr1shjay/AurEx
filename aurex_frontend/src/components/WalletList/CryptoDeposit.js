// import package
import React from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { CopyToClipboard } from "react-copy-to-clipboard";
import QRCode from "qrcode.react";

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import lib
import { toastAlert } from "../../lib/toastAlert";
import isEmpty from "../../lib/isEmpty";

const CryptoDeposit = (props) => {
  const { t, i18n } = useTranslation();

  // props
  const { show, assetData, currency, onHide } = props;

  // function
  const handleClose = () => {
    onHide();
  };

  // console.log(currency, "currency");

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Crypto Deposit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12} lg={12}>
            <div className="form-group">
              <label>{t("DEPOSIT_CURRENCY")}</label>
              <div className="form-group  ">
                <div class="seacr_box_s">
                  <input
                    type="text"
                    placeholder=""
                    value={assetData && assetData.coin}
                  />
                </div>
              </div>
            </div>
          </GridItem>
          <GridItem xs={12} sm={12} md={12} lg={12}>
            <label>
              {t("YOUR")} {assetData && assetData.coin} {t("WALLET_ADDRESS")}
            </label>
            <div className="form-group  ">
              <div class="seacr_box_s right_qr_input">
                <input
                  type="text"
                  placeholder=""
                  value={assetData && assetData.address}
                />
                {assetData && !isEmpty(assetData.address) && (
                  <CopyToClipboard
                    text={assetData.address}
                    onCopy={() => {
                      toastAlert("success", "Copied", "wallet");
                    }}
                  >
                    <i class="far fa-copy"></i>
                  </CopyToClipboard>
                )}
              </div>
            </div>
          </GridItem>

          {assetData && !isEmpty(assetData.destTag) && (
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <label>{t("MEMO_TAG")}</label>
              <div className="form-group">
                <div class="seacr_box_s right_qr_input">
                  <input
                    type="text"
                    placeholder=""
                    value={assetData && assetData.destTag}
                  />
                  {assetData && !isEmpty(assetData.destTag) && (
                    <CopyToClipboard
                      text={assetData.destTag}
                      onCopy={() => {
                        toastAlert("success", "Copied", "wallet");
                      }}
                    >
                      <i class="far fa-copy"></i>
                    </CopyToClipboard>
                  )}
                </div>
              </div>
            </GridItem>
          )}

          <GridItem xs={12} sm={12} md={12} lg={12}>
            <div className="qr_cenet">
              <label className="text-white mb-3">{t("SCAN_QR_CODE")}</label>
              {!isEmpty(assetData.address) && (
                <QRCode value={assetData.address} />
              )}
              {/* <img src={require("../../assets/images/qr.png")} alt="logo" className="img-fluid" /> */}
            </div>
          </GridItem>

          <GridItem md={12}>
            <div className="notes_section px-0">
              <p>{t("NOTES")}</p>
              <ul>
                <li>
                  1. {t("MIN_DEPOSIT_LIMIT")}{" "}
                  {currency && currency.depositminlimit}
                </li>
                <li>
                  {" "}
                  2. Deposit minimum deposit limit or greaterthan deposit limit
                </li>
                <li>3. {t("DEPOSIT_TIME")}</li>
              </ul>
            </div>
          </GridItem>
        </GridContainer>
      </Modal.Body>
    </Modal>
  );
};

export default CryptoDeposit;
