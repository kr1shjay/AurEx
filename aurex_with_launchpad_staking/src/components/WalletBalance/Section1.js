// import package
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next';

// import lib
import isEmpty from '../../lib/isEmpty'
import { toFixed } from '../../lib/roundOf'
import { currencySymbol } from '../../lib/pairHelper';

const Section1 = (props) => {
    const { t, i18n } = useTranslation();
    
    // props
    const { firstCoin, secondCoin } = props;

    // state
    const [totalBals, setTotalBals] = useState(0);  // Balance Loader
    const [estBal, setEstBal] = useState(0);  // Estimated Balance

    // redux
    const walletData = useSelector(state => state.wallet)
    const priceConversion = useSelector(state => state.priceConversion)
    const userSetting = useSelector(state => state.userSetting)
    const currencyData = useSelector(state => state.currency)

    // function
    useEffect(() => {
        if (userSetting && priceConversion && priceConversion.length > 0 && walletData && walletData.length > 0 && currencyData && currencyData.length > 0) {

            let estBal = 0;
            walletData.map(item => {
                let currency = currencyData.find(el => el.coin == item.coin && el.type == 'fiat')
                if (currency) {
                    if (item.coin == userSetting.currencySymbol) {
                        estBal = estBal + (item.derivativeBal + item.spotBal + item.p2pBal)
                    } else {
                        let CNVPriceData = priceConversion.find(el => el.baseSymbol == firstCoin && el.convertSymbol == item.coin)
                        if (CNVPriceData) {
                            let bal = ((item.derivativeBal + item.spotBal + item.p2pBal) / CNVPriceData.convertPrice)

                            let CNVPrice = priceConversion.find(el => el.baseSymbol == firstCoin && el.convertSymbol == userSetting.currencySymbol)
                            if (CNVPrice) {
                                estBal = estBal + (bal * CNVPrice.convertPrice)
                            }
                        }
                    }
                } else {
                    let CNVPriceData = priceConversion.find(el => el.baseSymbol == item.coin && el.convertSymbol == userSetting.currencySymbol)
                    if (CNVPriceData) {
                        estBal = estBal + ((item.derivativeBal + item.spotBal + item.p2pBal) * CNVPriceData.convertPrice)
                    }
                }
            })
            setEstBal(estBal)

            let firPriceCNV = priceConversion.find(el => el.baseSymbol == firstCoin && el.convertSymbol == userSetting.currencySymbol)

            if (firPriceCNV) {
                setTotalBals((estBal / firPriceCNV.convertPrice))
            }
        }
    }, [userSetting, priceConversion, walletData, currencyData])

    return (
        <div className="bor_bottom_s">
            <div className="wallwet_balance_section">
                <small>{t("TOTAL")}</small>
                <h3>{toFixed(totalBals, 8)}<span>{firstCoin}</span></h3>
                <span>= {currencySymbol(userSetting.currencySymbol)}{toFixed(estBal, 2)}</span>
            </div>
            {/* <div className="button_clas_wallert">
                <div className="data_inside">
                    <span>24H P&L</span>
                    <div><span> $2.25</span><span>+1.25%</span></div>

                </div>
                <div className="data_inside">
                    <span>Total P&L</span>
                    <div><span>$100.50</span><span> +2.5%</span></div>

                </div>
            </div> */}
        </div>
    )
}

export default Section1;