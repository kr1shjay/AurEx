// import package
import React, { useState, useEffect } from 'react';
import clsx from 'classnames';
import { useTranslation } from 'react-i18next';

// import action
import { getRecentTransaction } from '../../actions/dashboardAction';

// import lib
import { dateTimeFormat } from '../../lib/dateTimeHelper';
import { transactionStatus } from '../../lib/displayStatus';

const RecentTransaction = () => {
    const { t, i18n } = useTranslation();

    // state
    const [data, setData] = useState([])
    const [loader, setLoader] = useState(true)

    // funtion
    const fetchTransaction = async () => {
        try {
            const { status, loading, result } = await getRecentTransaction();
            setLoader(loading)
            if (status == 'success') {
                setData(result)
            }
        } catch (err) { }
    }

    useEffect(() => {
        fetchTransaction();
    }, [])

    return (
        <div className="table-responsive">
            <table className="table mb-0">
                <thead>
                    <tr>
                        <th>{t("DATE")}</th>
                        <th>{t("TYPE")}</th>
                        <th>{t("SYMBOL")}</th>
                        <th>{t("AMOUNT")}</th>
                        <th>{t("TRANSACTION_REF")}</th>
                        <th>{t("STATUS")}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        loader && 
                            <tr>
                                <td colSpan={6} className="text-center">{t('LOADING')}</td>
                                </tr>
                                
                                
                    }
                    {
                        !loader && data && data.length > 0 && data.map((item, key) => {
                            return (
                                <tr key={key}>
                                    <td>{dateTimeFormat(item.createdAt, 'YYYY-MM-DD HH:mm')}</td>
                                    <td className={clsx({ "textDepositGreen": ['fiat_deposit', 'coin_deposit'].includes(item.paymentType), "textWithdrawRed": ['fiat_withdraw', 'coin_withdraw'].includes(item.paymentType) })}>
                                        {transactionStatus(item.paymentType)}
                                    </td>
                                    <td>{item.coin}</td>
                                    <td>{item.amount}</td>
                                    <td>
                                        {['fiat_deposit', 'fiat_withdraw', 'coin_transfer', 'fiat_transfer'].includes(item.paymentType) && item._id}
                                        {['coin_deposit', 'coin_withdraw'].includes(item.paymentType) && item.txid}
                                    </td>
                                    <td className="textStatusOrange">{item.status}</td>
                                </tr>
                            )
                        })
                    }
                    {
                        !loader && data && data.length <= 0 &&  <tr>
                        <td colSpan={6} className="text-center"> {t("NO_RECORD")}</td>
                        </tr>
                           
                       
                    }
                </tbody>
            </table>
        </div>
    )
}

export default RecentTransaction;