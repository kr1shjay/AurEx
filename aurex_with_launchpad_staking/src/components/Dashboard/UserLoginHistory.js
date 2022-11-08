// import package
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// import action
import { getLoginHistory } from '../../actions/dashboardAction';

// import lib
import { dateTimeFormat ,momentFormat} from '../../lib/dateTimeHelper';

const UserLoginHistory = () => {
    const { t, i18n } = useTranslation();

    // state
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(true);

    // function
    const fetchLoginHistory = async () => {
        try {
            const { status, loading, result } = await getLoginHistory();
            setLoader(loading)
            if (status == 'success') {
                setData(result)
            }
        } catch (err) { }
    }
    useEffect(() => {
        fetchLoginHistory()
    }, [])

    return (

        <div className="table-responsive">
            <table className="table mb-0">
                <thead>
                    <tr>
                        <th>{t("DATE")}</th>
                        <th>{t("IP_ADDRESS")}</th>
                        <th>{t("LOCATION")}</th>
                        <th>{t("DEVICE")}</th>
                        <th>{t("STATUS")}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        loader && <tr>
                        <td colSpan={5} className="text-center">{t('LOADING')}</td>
                        </tr>
                    }
                    {
                        !loader && data && data.length > 0 && data.map((item, key) => {
                            return (
                                <tr key={key}>
                                    <td>{momentFormat(item.createdDate, 'YYYY-MM-DD HH:mm')}</td>
                                    <td>{item.ipaddress}</td>
                                    <td>{item.regionName}, {item.countryName}</td>
                                    <td>{item.broswername}, {item.os}</td>
                                    <td>{item.status}</td>
                                </tr>
                            )
                        })
                    }
                    {
                        !loader && data && data.length <= 0 && 
                        <tr>
                        <td colSpan={5} className="text-center">{t('NO_RECORD')}</td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}

export default UserLoginHistory;