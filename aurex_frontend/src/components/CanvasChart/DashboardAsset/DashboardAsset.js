import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

// import context
import SocketContext from '../Context/SocketContext';

// import component
import DoughnutChart from './DoughnutChart';
import ConversationalPrice from './ConversationalPrice';
import { useTranslation } from 'react-i18next';
// import action
import { getUserAsset } from '../../actions/userAssets';
import roundOf from '../../lib/roundOf'

const chartColor = [
    "#4661EE",
    "#EC5657",
    "#1BCDD1",
    "#8FAABB",
    "#B08BEB",
    "#3EA0DD",
    "#F5A52A",
    "#23BFAA",
    "#FAA586",
    "#EB8CC6",
]
const DashboardAsset = () => {
    const socketContext = useContext(SocketContext)
    const { t, i18n } = useTranslation();
    // state
    const [userAsset, setUserAsset] = useState([])
    const [currencyType, setCurrencyType] = useState('crypto') // crypto, fiat
    const [cryptoAsset, setCryptoAsset] = useState([])
    const [fiatAsset, setFiatAsset] = useState([])

    // function
    const fetchUserAsset = async () => {
        try {
            const { status, loading, error, result } = await getUserAsset()
            if (status == 'success') {
                const { cryptoData, fiatData } = result;
                setCryptoAsset(cryptoData)
                setFiatAsset(fiatData)
                let currencyList = []

                if(currencyType == 'crypto'){
                    cryptoData && cryptoData.length > 0 && cryptoData.map((el) => {
                        currencyList.push(el.currencySymbol)
                    })
                    setUserAsset(cryptoData)
                } else if(currencyType =='fiat'){
                    fiatData && fiatData.length > 0 && fiatData.map((el) => {
                        currencyList.push(el.currencySymbol)
                    })
                    setUserAsset(fiatData)
                }

                socketContext.socket.emit('binancePriceList', currencyList)
                
            }
        } catch (err) { }
    }

    const handleCurrencyType = (type) => {
        setCurrencyType(type)

        let currencyList = []

        if(type == 'crypto'){
            cryptoAsset && cryptoAsset.length > 0 && cryptoAsset.map((el) => {
                currencyList.push(el.currencySymbol)
            })
            setUserAsset(cryptoAsset)
        } else if(type =='fiat'){
            fiatAsset && fiatAsset.length > 0 && fiatAsset.map((el) => {
                currencyList.push(el.currencySymbol)
            })
            setUserAsset(fiatAsset)
        }
        socketContext.socket.emit('binancePriceList', currencyList)

    }

    useEffect(() => {
        fetchUserAsset()
    }, [])

    return (
        <div className="row">
            <DoughnutChart
                userAsset={userAsset}
                chartColor={chartColor}
                currencyType={currencyType}
            />

            <div className="col-md-7">
                <div className="dtbRight">
                    <nav className="dashMainTab">
                        <div className="nav nav-tabs dashNewMainTab" id="nav-tab" role="tablist">
                            <a
                                className="nav-item nav-link active"
                                id="nav-crypto-tab" data-toggle="tab"
                                href="#nav-crypto" role="tab"
                                aria-controls="nav-crypto"
                                aria-selected="true"
                                onClick={() => { handleCurrencyType('crypto') }}
                            >
                                {t('CRYPTO')}
                            </a>
                            <a
                                className="nav-item nav-link"
                                id="nav-fiat-tab"
                                data-toggle="tab"
                                href="#nav-fiat"
                                role="tab"
                                aria-controls="nav-fiat"
                                aria-selected="false"
                                onClick={() => { handleCurrencyType('fiat') }}
                            >
                                {t('FIAT')}
                            </a>
                        </div>
                    </nav>
                    <div className="tab-content pb-3 px-3 px-sm-0" id="nav-tabContent">
                        {/* <div className="tab-pane fade show active" id="nav-crypto" role="tabpanel" aria-labelledby="nav-crypto-tab"> */}
                        <div class="table-responsive">
                            <table class="table dashBalanceTable">
                                <thead>
                                    <tr>
                                        <th>{t('COIN')}</th>
                                        <th>{t('BALANCE')}</th>
                                        <th>{t('USD')}</th>
                                        {/* <th>P&L</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        userAsset && userAsset.length > 0 && userAsset.map((item, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td>
                                                        <p>
                                                            <span className="boxYellow" style={{ 'background': chartColor[key] }}></span>
                                                            <img src={item.currencyimage} alt="" className="img-fluid" />
                                                            <label>{item.currencySymbol}</label>
                                                        </p>
                                                    </td>
                                                    <td><h4>{roundOf(item.spotwallet, 4, currencyType)} <small>{item.currencySymbol}</small></h4></td>
                                                    <td>
                                                        <p>
                                                            <ConversationalPrice
                                                                currencySymbol={item.currencySymbol}
                                                                price={item.spotwallet}
                                                            />
                                                        </p>
                                                    </td>
                                                    <td>
                                                        {/* <h6 class="textGreen">+$350.50</h6> */}
                                                        <p>
                                                            <Link to={'/wallet'} className="depositImg">{t('DEPOSIT')}</Link>
                                                            <Link to={'/wallet'} className="withdrawImg">{t('WITHDRAW')}</Link>
                                                            <Link to={'/wallet'} className="transferImg">{t('TRANSFER')}</Link>
                                                        </p>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        {/* </div> */}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardAsset;