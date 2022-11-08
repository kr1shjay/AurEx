// import package
import React from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode.react'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import lib
import { toastAlert } from '../../lib/toastAlert';
import isEmpty from '../../lib/isEmpty';

const CoinDeposit = (props) => {
    const { t, i18n } = useTranslation();

    // props
    const { assetData } = props

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={3} lg={2}>
                <div class="form-group smallScreenCenter">
                    <label>{t('DEPOSIT_QR_CODE')}</label>
                    {
                        !isEmpty(assetData.address) && <QRCode value={assetData.address} />
                    }
                </div>
            </GridItem>
            <GridItem xs={12} sm={12} md={6} lg={6}>
                <div class="form-group">
                    <label className="flexLabel">
                        <span>{t("COIN_ADDRESS")}</span>
                        {
                            !isEmpty(assetData.address) && <CopyToClipboard
                                text={assetData.address}
                                onCopy={() => {
                                    toastAlert('success', 'Copied', 'wallet')
                                }}
                            >
                                <Link to="#">{t("COPY_ADDRESS")}</Link>
                            </CopyToClipboard>
                        }

                    </label>
                    <input type="text" name="" className="form-control" value={assetData.address} />
                </div>
                <div class="settingsNote">
                    <h6 className="m-0">{t("NOTES")}</h6>
                    <ul>
                        <li>- {t("COIN_DEPOSIT_DESCRIPTION1", { "CURRENCY_SYMBOL": assetData.currency && assetData.currency.currencySymbol })}</li>
                        {/* <li>- {t("COIN_DEPOSIT_DESCRIPTION2")}</li> */}
                        <li>- {t("COIN_DEPOSIT_DESCRIPTION3", { "CURRENCY_SYMBOL": assetData.currency && assetData.currency.currencySymbol })}</li>
                    </ul>
                </div>
            </GridItem>
        </GridContainer>

    )
}

export default CoinDeposit;