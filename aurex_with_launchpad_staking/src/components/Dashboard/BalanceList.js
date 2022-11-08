// import package
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux'

// import lib
import { currencySymbol } from '../../lib/pairHelper';
import isEmpty from '../../lib/isEmpty';
import { toFixed } from '../../lib/roundOf';

const reqData = {
    'firstCurrencySymbol': "BTC",
    'secondCurrencySymmol': "USD"
}

const BalanceList = () => {
    const { t, i18n } = useTranslation();

    // state
    const [loader, setLoader] = useState(true)
    const [balData, setBalData] = useState({})

    // redux
    const walletData = useSelector(state => state.wallet)
    const priceConversion = useSelector(state => state.priceConversion)
    const userSetting = useSelector(state => state.userSetting)
    const currencyData = useSelector(state => state.currency)

    // function
    useEffect(() => {
        if (userSetting && priceConversion && priceConversion.length > 0 && walletData && walletData.length > 0 && currencyData && currencyData.length > 0) {
            let estSpotBal = 0, estDerivativeBal = 0, estP2pBal = 0;

            walletData.map(item => {
                let currency = currencyData.find(el => el.coin == item.coin && el.type == 'fiat')
                if (currency) {
                    if (item.coin == userSetting.currencySymbol) {
                        estSpotBal = estSpotBal + item.spotBal
                        estDerivativeBal = estDerivativeBal + item.derivativeBal
                        estP2pBal = estP2pBal + item.p2pBal
                    } else {
                        let CNVPriceData = priceConversion.find(el => el.baseSymbol == reqData.firstCurrencySymbol && el.convertSymbol == item.coin)
                        if (CNVPriceData) {
                            let CNVPrice = priceConversion.find(el => el.baseSymbol == reqData.firstCurrencySymbol && el.convertSymbol == userSetting.currencySymbol)
                            if (CNVPrice) {
                                estSpotBal = estSpotBal + ((item.spotBal / CNVPriceData.convertPrice) * CNVPrice.convertPrice)
                                estDerivativeBal = estDerivativeBal + ((item.derivativeBal / CNVPriceData.convertPrice) * CNVPrice.convertPrice)
                                estP2pBal = estP2pBal + ((item.p2pBal / CNVPriceData.convertPrice) * CNVPrice.convertPrice)
                            }
                        }
                    }
                } else {
                    let CNVPriceData = priceConversion.find(el => el.baseSymbol == item.coin && el.convertSymbol == userSetting.currencySymbol)
                    if (CNVPriceData) {
                        estSpotBal = estSpotBal + (item.spotBal * CNVPriceData.convertPrice)
                        estDerivativeBal = estDerivativeBal + (item.derivativeBal * CNVPriceData.convertPrice)
                        estP2pBal = estP2pBal + (item.p2pBal * CNVPriceData.convertPrice)
                    }
                }
            })

            let firPriceCNV = priceConversion.find(el => el.baseSymbol == reqData.firstCurrencySymbol && el.convertSymbol == userSetting.currencySymbol)
          
            if (firPriceCNV) {
                setBalData({
                    estSpotBal,
                    estDerivativeBal,
                    estP2pBal,
                    spotBal: (estSpotBal / firPriceCNV.convertPrice),
                    derivativeBal: (estDerivativeBal / firPriceCNV.convertPrice),
                    p2pBal: (estP2pBal / firPriceCNV.convertPrice),
                })
                setLoader(false)
            }
        }
    }, [userSetting, priceConversion, walletData, currencyData])


    return (
        <table className="table tabelDashBalance">
            {
                loader && <tbody>
                    <tr>
                    <td colSpan={4}>
                        {t('LOADING')}
                    </td>
                    </tr>
                </tbody>
            }

            {
                !loader && !isEmpty(balData) && <tbody>
                    <tr>
                        <td>{t("SPOT_BALANCE")}</td>
                        <td>{toFixed(balData.spotBal, 8)} {reqData.firstCurrencySymbol}</td>
                        <td>{currencySymbol(userSetting.currencySymbol)}{toFixed(balData.estSpotBal, 2)}</td>
                        <td> <span>[ <Link to={'/wallet'}>{t("DEPOSIT")}</Link> ]</span> <span>[  <Link to={'/wallet'}>{t("WITHDRAW")}</Link> ]</span><span>[ <Link to={'/spot'}>{t("TRADE")}</Link> ]</span></td>
                    </tr>
                    {/* <tr>
                        <td>{t("DERIVATIVE_BAL")}  </td>
                        <td>{toFixed(balData.derivativeBal, 8)} {reqData.firstCurrencySymbol}</td>
                        <td>{currencySymbol(userSetting.currencySymbol)}{toFixed(balData.estDerivativeBal, 2)}</td>
                        <td><span>[ <Link to={'/wallet'}>{t("TRANSFER")}</Link> ]</span></td>
                    </tr>
                    <tr>
                        <td>{t("P2P_BAL")}  </td>
                        <td>{toFixed(balData.p2pBal, 8)} {reqData.firstCurrencySymbol}</td>
                        <td>{currencySymbol(userSetting.currencySymbol)}{toFixed(balData.estP2pBal, 2)}</td>
                        <td><span>[ <Link to={'/wallet'}>{t("TRANSFER")}</Link> ]</span></td>
                    </tr> */}
                </tbody>
            }

        </table>
    )
}

export default BalanceList;