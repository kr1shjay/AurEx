// import package
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux'

// import component
import GridItem from "components/Grid/GridItem.js";

// import lib
import { currencySymbol } from '../../lib/pairHelper';
import { toFixed } from '../../lib/roundOf';

const reqData = {
    'firstCurrencySymbol': "BTC",
    'secondCurrencySymmol': "USD"
}

const UserBalance = () => {
    const { t, i18n } = useTranslation();

    // state
    const [firstCurAsset, setFirstCurAsset] = useState({});  // First currency asset data
    const [priceCNV, setPriceCNV] = useState({});  // Price Conversion Data
    const [balLoader, setBalLoader] = useState(true);  // Balance Loader
    const [estLoader, setEstLoader] = useState(true);  // Estimated Loader

    // redux
    const walletData = useSelector(state => state.wallet)
    const priceConversion = useSelector(state => state.priceConversion)
    const userSetting = useSelector(state => state.userSetting)

    // function
    useEffect(() => {
        if (walletData && walletData.length > 0) {
            let firstCurData = walletData.find(el => el.coin == reqData.firstCurrencySymbol)
            if (firstCurData) {
                setFirstCurAsset(firstCurData)
                setBalLoader(false)
            }
        }
    }, [walletData])

    useEffect(() => {
        if (userSetting && priceConversion && priceConversion.length > 0) {
            let CNVPriceData = priceConversion.find(el => el.baseSymbol == reqData.firstCurrencySymbol && el.convertSymbol == userSetting.currencySymbol)
            if (CNVPriceData) {
                setPriceCNV(CNVPriceData)
                setEstLoader(false)
            }
        }
    }, [userSetting, priceConversion])


    return (
        <GridItem xs={12} sm={12} md={12} lg={6}>
            <h5 className="dash_subtitle">{t("YOUR_BALANCE")}</h5>
            <div className="balance_details_panel">
                <div className="balance_details_left">
                    <div className="mb-3">
                        <h3>{t("TOTAL_BALANCE")}</h3>
                        <h2>
                            {balLoader && <i class="fas fa-spinner fa-spin"></i>}
                            {!balLoader && <span>{toFixed(firstCurAsset.spotBal + firstCurAsset.derivativeBal, 8)}{" "}{reqData.firstCurrencySymbol}</span>}
                        </h2>
                    </div>
                    <div>
                        <h3>{t("ESTIMATED_VALUE")}</h3>
                        <h4>{currencySymbol(userSetting.currencySymbol)}
                            {estLoader && <i class="fas fa-spinner fa-spin"></i>}
                            {!estLoader && !balLoader && <span> {" "}{toFixed(((firstCurAsset.spotBal + firstCurAsset.derivativeBal) * priceCNV.convertPrice), 2)}</span>}
                        </h4>
                    </div>
                </div>
            </div>
        </GridItem>
    )
}

export default UserBalance;