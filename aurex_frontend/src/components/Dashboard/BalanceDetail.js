// import package
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

// import component
import UserBalance from './UserBalance';
import BalanceChart from './BalanceChart';
import BalanceList from './BalanceList';

// import action
import { getDashBal } from '../../actions/dashboardAction';

// import lib
import { currencySymbol } from '../../lib/pairHelper';
import { toFixed } from '../../lib/roundOf';

const BalanceDetail = () => {
    const { t, i18n } = useTranslation();

    // sate
    const [dashList, setDashList] = useState([])

    // redux-state
    const currencyData = useSelector(state => state.currency)
    const priceConversion = useSelector(state => state.priceConversion)
    const userSetting = useSelector(state => state.userSetting)

    // function
    const fetchBalance = async () => {
        try {
            const { status, loading, result } = await getDashBal();
            if (status == 'success') {
                setDashList(result)
            }
        } catch (err) { }
    }

    useEffect(() => {
        fetchBalance()
    }, [])

    return (
        <div className="p2p_card min-h-auto">
            <h5 className="login_title_8 new_dashboard">{t("WALLET_BAL")}</h5>
            <div className="balance_details_panel">
                <UserBalance />
                <BalanceChart
                    result={dashList}
                />

            </div>
            <div className="coin_data_list">
                <div className="coin_list">
                    {
                        currencyData && currencyData.length > 0 && dashList && dashList.length > 0 && dashList.map((item, key) => {
                            let curData = currencyData.find((el) => el.coin == item.coin)
                            let priceCNV;

                            if (userSetting && priceConversion && priceConversion.length > 0) {
                                priceCNV = priceConversion.find(el => el.baseSymbol == item.coin && el.convertSymbol == userSetting.currencySymbol)
                            }
                            if (curData) {
                                return (
                                    <div>
                                        <div>
                                            <img src={curData.image} alt="logo" className="img-fluid" />
                                            <span>
                                                {curData.name}
                                            </span>
                                        </div>
                                        {/* <p>{item.derivativeBal + item.spotBal + item.p2pBal} </p> */}
                                        <p>{toFixed(item.spotBal,8).toLocaleString("en-US")} </p>
                                        {
                                            priceCNV && <small>= {currencySymbol(userSetting.currencySymbol)}{(toFixed(((item.spotBal) * priceCNV.convertPrice), 2)).toLocaleString("en-US")}</small>
                                        }

                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div>
            <div className="table-responsive">
                <BalanceList />
            </div>
        </div>
    )
}

export default BalanceDetail;