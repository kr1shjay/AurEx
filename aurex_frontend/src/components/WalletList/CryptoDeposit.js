// import package
import React, { useEffect, useState } from "react";
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
import { createNotification } from '../../actions/notificationAction'
import { getAddress } from "actions/walletAction";
import { useDispatch } from "react-redux";

const CryptoDeposit = (props) => {
  const { t, i18n } = useTranslation();
  const [Asset, setAsset] = useState({})
  const dispatch = useDispatch()
  // props
  const { show, assetData, currency, onHide } = props;
  useEffect(() => {
    console.log(assetData, 'Asset')
    if(!isEmpty(assetData)){
      generateAddress()
    }
    
  }, [assetData])

  const generateAddress = async () => {
    try {
      let data = {
        currencyId: assetData?._id
      }
      // if (isEmpty(assetData.address)) {
        let Asset = await getAddress(data,dispatch)
        setAsset(Asset)
      // } else {
      //   setAsset(assetData)
      // }

    } catch (err) {
      console.log(err, 'generateAddress__err')
    }
  }
  // function
  const handleClose = () => {
    onHide();
  };

  // console.log(currency, "currency");

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
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
                    value={Asset && Asset.coin}
                  />
                </div>
              </div>
            </div>
          </GridItem>
          <GridItem xs={12} sm={12} md={12} lg={12}>
            <label>
              {t("YOUR")} {Asset && Asset.coin} {t("WALLET_ADDRESS")}
            </label>
            <div className="form-group  ">
              <div class="seacr_box_s right_qr_input">
                <input
                  type="text"
                  placeholder=""
                  value={Asset && Asset.address}
                />
                {Asset && !isEmpty(Asset.address) && (
                  <CopyToClipboard
                    text={Asset.address}
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

          {Asset && !isEmpty(Asset.destTag) && (
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <label>{t("MEMO_TAG")}</label>
              <div className="form-group">
                <div class="seacr_box_s right_qr_input">
                  <input
                    type="text"
                    placeholder=""
                    value={Asset && Asset.destTag}
                  />
                  {Asset && !isEmpty(Asset.destTag) && (
                    <CopyToClipboard
                      text={Asset.destTag}
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
              {!isEmpty(Asset.address) && (
                <QRCode value={Asset.address} />
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
                  2. Deposit minimum deposit limit or greater than deposit limit
                </li>
                <li>3. {t("DEPOSIT_TIME")}</li>
                <li>4.Deposit the selected currency only to this address. Other than depositing the selected currencies the fund will not be deposited to platform </li>
              </ul>
            </div>
          </GridItem>
        </GridContainer>
      </Modal.Body>
    </Modal>
  );
};

export default CryptoDeposit;
