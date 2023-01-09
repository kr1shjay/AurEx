// import package
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import {
    MenuItem, Select
} from "@material-ui/core/";

// import action
import { getStakeHistory } from '../../actions/stakingAction';
import { useTranslation } from 'react-i18next';

const stakingHistory = [
    { date: "11-05-2021 15:15", crypto: "Bitcoin", amount: "0.00215487 BTC", apy: "7.25%", interestEarned: "0.00000254 BTC", status: <div className="textStatusGreen">Success</div>, },
    { date: "11-05-2021 15:15", crypto: "Ethereum", amount: "0.00215487 BTC", apy: "7.25%", interestEarned: "0.00000254 BTC", status: <div className="textStatusGreen">Success</div>, },
    { date: "11-05-2021 15:15", crypto: "Ripple", amount: "0.00215487 BTC", apy: "7.25%", interestEarned: "0.00000254 BTC", status: <div className="textStatusOrange">Redeemed</div>, },
    { date: "11-05-2021 15:15", crypto: "Tether Coin", amount: "0.00215487 BTC", apy: "7.25%", interestEarned: "0.00000254 BTC", status: <div className="textStatusOrange">Redeemed</div>, },
    { date: "11-05-2021 15:15", crypto: "Ripple", amount: "0.00215487 BTC", apy: "7.25%", interestEarned: "0.00000254 BTC", status: <div className="textStatusGreen">Success</div>, }
];
const stakingHistoryColumns = [
    {
        name: 'Date',
        selector: 'date',
        sortable: false,
    },
    {
        name: 'Crypto',
        selector: 'crypto',
        sortable: false,
    },
    {
        name: 'Amount',
        selector: 'amount',
        sortable: false,
    },
    {
        name: 'APY',
        selector: 'apy',
        sortable: false,
    },
    {
        name: 'Interest Earned',
        selector: 'interestEarned',
        sortable: false,
    },
    {
        name: 'Type',
        selector: 'type',
        sortable: false,
    },

];
const StakeHistory = () => {
    // state
    const [loader, setLoader] = useState(true)
    const [orderData, setOrderData] = useState({
        currentPage: 1,
        nextPage: true,
        limit: 10,
        count: 0,
        data: []
    })
    const { t, i18n } = useTranslation();
    const { currentPage, nextPage, limit, count, data } = orderData
    
    // function
    const fetchHistory = async (reqData) => {
        try {
            const { status, loading, result } = await getStakeHistory(reqData);
            if (status == 'success') {
                let newRecord = [];

                result.data && result.data.length > 0 && result.data.map((item, key) => {
                    newRecord.push({
                        "date": item.settleDate,
                        "crypto": item.currencyName,
                        "amount": `${item.stakeAmount} ${item.currencySymbol}`,
                        "apy": `${item.APY}%`,
                        "interestEarned": `${item.amount} ${item.currencySymbol}`,
                        "type": item.type
                    })
                })


                setOrderData({
                    'currentPage': result.currentPage,
                    'nextPage': result.nextPage,
                    'limit': result.limit,
                    'count': result.count,
                    'data': [...data, ...newRecord],
                })
            } else {
                setOrderData({
                    ...orderData,
                    ...{ 'nextPage': false }
                })
            }
        } catch (err) { }
    }

    useEffect(() => {
        let reqData = {
            page: currentPage + 1,
            limit
        }

        fetchHistory(reqData);
    }, [])

    return (
        <>
            <div class="row align-items-center">
                <div class="col-lg-12">
                    <h3 class="dash_title mb-3">{t('STAKING_HISTORY')}</h3>
                </div>
            </div>
            <div className="dashboard_box stakingHistoryTable">
                <div className="newUsersFilter contact_form settingsSelect mb-0">
                    <div className="newsSelectGroup">
                        <label>{t('FILTER_BY')}</label>
                        <Select value="0">
                            <MenuItem value={0}>{t('BITCOIN')}</MenuItem>
                            <MenuItem value={20}>{t('ETHEREUM')}</MenuItem>
                            <MenuItem value={30}>{t('RIPPLE')}</MenuItem>
                            <MenuItem value={40}>{t('LITE_COION')}</MenuItem>
                            <MenuItem value={50}>{t('TETHER_COIN')}</MenuItem>
                        </Select>
                        <div className="tableSearchBox">
                            <div class="input-group">
                                <input type="text" class="form-control" placeholder="Search by Date / Amount" />
                                <div class="input-group-append">
                                    <span class="btnType1"><i class="fas fa-search"></i></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="newsSelectGroup">
                        {/* <button className="btn btn-outline text-uppercase py-1 m-0">Download PDF</button> */}
                    </div>
                </div>
                <DataTable
                    columns={stakingHistoryColumns}
                    data={data}
                    noHeader
                />
            </div>
        </>
    )
}

export default StakeHistory;