// import package
import React, { useEffect, useState } from 'react';
import { Collapse } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

// import component
import FiatWithdraw from './FiatWithdraw';
import FiatDeposit from './FiatDeposit';
import CoinDeposit from './CoinDeposit';
import CoinWithdraw from './CoinWithdraw';

// import lib
import { currencySymbol } from '../../lib/pairHelper';
import { toFixed } from '../../lib/roundOf';

const UserWalletList = () => {
    const { t, i18n } = useTranslation();

    // redux-state
    const walletData = useSelector(state => state.wallet);
    const currencyData = useSelector(state => state.currency)
    const priceConversion = useSelector(state => state.priceConversion)
    const userSetting = useSelector(state => state.userSetting)

    // state
    const [depositKey, setDepositKey] = useState(-1)
    const [withdrawKey, setWithdrawKey] = useState(-1)
    const [assetData, setAsstData] = useState({})

    return (
        <>
            {
                currencyData && currencyData.length > 0 && walletData && walletData.length > 0 && walletData.map((item, key) => {
                    let priceCNV;

                    if (userSetting && priceConversion && priceConversion.length > 0) {
                        priceCNV = priceConversion.find(el => el.baseSymbol == item.coin && el.convertSymbol == userSetting.currencySymbol)
                    }

                    let currency = currencyData.find(el => el._id == item._id)

                    if (currency) {
                        return (
                            <>
                                <div className="dashboard_box mb-2">
                                    <div className="walletCard">
                                        <div className="walletCardLeft">
                                            <div className="currencyName">
                                                <img src={currency.image} alt="" className="img-fluid" />
                                                {currency.name}
                                            </div>
                                            <div className="currencyPrice">
                                                {item.spotBal}{" "}<small>{item.coin}</small>
                                            </div>
                                            <div className="currencyPrice">
                                                {
                                                    priceCNV && <>
                                                        <small>{currencySymbol(userSetting.currencySymbol)}</small>{toFixed((item.spotBal * priceCNV.convertPrice), 2)}
                                                    </>
                                                }
                                            </div>
                                        </div>
                                        <div className="walletCardRight">

                                            <div className="textLinkGroup">
                                                [
                                            <Link href="#"
                                                    onClick={() => {
                                                        setDepositKey(key == depositKey ? -1 : key)
                                                        setAsstData({ ...item, currency })
                                                    }}
                                                >
                                                    Deposit
                                            </Link>
                                            ]
                                            [
                                            <Link href="#"
                                                    onClick={() => {
                                                        setWithdrawKey(key == withdrawKey ? -1 : key)
                                                        setAsstData({ ...item, currency })
                                                    }}
                                                >
                                                    Withdraw
                                            </Link>
                                            ]

                                            {
                                                    ['crypto', 'token'].includes(currency.type) && <>
                                                        {' '}[ <Link to={'/spot'} >Trade</Link> ]
                                                </>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <Collapse in={key == depositKey}>
                                        <div className="collapseWallet">
                                            <div className="contact_form settingsSelect mb-0">

                                                {
                                                    assetData && assetData.currency && ['crypto', 'token'].includes(assetData.currency.type) && <CoinDeposit
                                                        assetData={item}
                                                        currency={currency}
                                                    />
                                                }

                                                {
                                                    ['fiat'].includes(currency.type) && <FiatDeposit
                                                        assetData={item}
                                                        currency={currency}
                                                    />
                                                }

                                            </div>
                                        </div>
                                    </Collapse>

                                    <Collapse in={key == withdrawKey}>
                                        <div className="collapseWallet">
                                            <div className="contact_form settingsSelect mb-0">

                                                {
                                                    assetData && assetData.currency && ['crypto', 'token'].includes(assetData.currency.type) && <CoinWithdraw
                                                        assetData={item}
                                                        currency={currency}
                                                    />
                                                }

                                                {
                                                   ['fiat'].includes(currency.type) && <FiatWithdraw
                                                        assetData={item}
                                                        currency={currency}
                                                    />
                                                }
                                            </div>

                                        </div>
                                    </Collapse>
                                </div>
                            </>
                        )
                    }
                })
            }
        </>
    )
}

export default UserWalletList;