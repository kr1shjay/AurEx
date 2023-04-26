// import package
import React, { useEffect, useState, Fragment } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router';

// import lib
import { currencySymbol } from '../../lib/pairHelper';
import { toFixed } from '../../lib/roundOf';

const reqData = {
    'firstCurrencySymbol': "BTC",
    'secondCurrencySymmol': "USD"
}

const UserBalance = () => {
    const { t, i18n } = useTranslation();
    const history = useHistory()

    // state
    const [totalBals, setTotalBals] = useState(0);  // Balance Loader
    const [estBal, setEstBal] = useState(0);  // Estimated Balance
    const [balLoader, setBalLoader] = useState(true);  // Balance Loader
    const [estLoader, setEstLoader] = useState(true);  // Estimated Loader

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
                let currency = currencyData.find(el => el.coin == item.coin && el.type == 'crypto')
                console.log('currency',currency)
                if (currency) {
                    if (item.coin == userSetting.currencySymbol) {
                        console.log( estBal + item.spotBal,'itemssssssssssss')
                        estBal = estBal + item.spotBal
                    } else {
                        let CNVPriceData = priceConversion.find(el => el.baseSymbol == reqData.firstCurrencySymbol && el.convertSymbol == item.coin)
                        console.log("itemssssssssssss",item.spotBal,item.coin,CNVPriceData)

                        if (CNVPriceData) {

                            let bal = (item.spotBal / CNVPriceData.convertPrice)
                            let CNVPrice = priceConversion.find(el => el.baseSymbol == reqData.firstCurrencySymbol && el.convertSymbol == userSetting.currencySymbol)
                            if (CNVPrice) {
                                estBal = estBal + (bal * CNVPrice.convertPrice)
                            }
                        }
                    }
                } else {
                    let CNVPriceData = priceConversion.find(el => el.baseSymbol == item.coin && el.convertSymbol == userSetting.currencySymbol)
                    // console.log("CNVPriceDataCNVPriceDataCNVPriceData",CNVPriceData,item.coin)
                    if (CNVPriceData) {
                        estBal = estBal + (item.spotBal * CNVPriceData.convertPrice)
                    }
                }
            })
            setEstBal(estBal)
            
            console.log("estBalestBalestBal",estBal)
            
            console.log("proiceconversionssssssssssssssssssssssss", priceConversion,userSetting.currencySymbol)
            priceConversion.find(el => 
                {
                //     console.log("aaaaaaaaaaaaaaaaaaaaaaaaa",
                //     el.baseSymbol,
                //     el.convertSymbol,
                //    el. convertPrice,
                //     // el.convertSymbol, 
                //     userSetting.currencySymbol
                //     )
                }

                
                
                // el.baseSymbol == reqData.firstCurrencySymbol && el.convertSymbol == userSetting.currencySymbol
                )
            let firPriceCNV = priceConversion.find(el => el.baseSymbol == reqData.firstCurrencySymbol && el.convertSymbol == userSetting.currencySymbol)
            console.log(firPriceCNV,'firPriceCNV1')
            if (firPriceCNV) {
                console.log(firPriceCNV,'firPriceCNV')
                setTotalBals((estBal / firPriceCNV.convertPrice))
                setEstLoader(false)
                setBalLoader(false)
            }
        }
    }, [userSetting, priceConversion, walletData, currencyData])
    return (
        <div className="balance_details_left">
            <div className="new_balance_section">
                <h1>
                    {
                        console.log("balLoaderbalLoader",balLoader)
                    }
                    {balLoader && <i class="fas fa-spinner fa-spin"></i>}
                    {!balLoader && <Fragment>{toFixed(totalBals, 8)}<span>{reqData.firstCurrencySymbol}</span></Fragment>}
                </h1>
                {estLoader && <i class="fas fa-spinner fa-spin"></i>}
                {!estLoader && !balLoader && <small>= {currencySymbol(userSetting.currencySymbol)}    {toFixed(estBal, 2)}</small>}
            </div>
            <div className="Subscribe pb-3">
                <Button onClick={() => history.push('/wallet')}>{t("DEPOSIT")}</Button>
                <Button onClick={() => history.push('/wallet')} className="ml-1">{t("WITHDRAW")}</Button>
                <Button onClick={() => history.push('/spot')} className="ml-1">Trade</Button>
                {/*<Button onClick={() => history.push('/wallet')} className="ml-1">{t("TRANSFER")}</Button>*/}
            </div>
        </div>
    )
}

export default UserBalance;