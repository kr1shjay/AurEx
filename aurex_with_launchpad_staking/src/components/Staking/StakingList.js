// import package
import React, { useEffect, useState } from 'react';
import {
    Switch
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";

// import component
import OrderPlaceModal from './OrderPlaceModal';

// import action
import { getStaking } from '../../actions/stakingAction'

// import lib
import { interestByDays } from '../../lib/calculation';
import { toFixed } from '../../lib/roundOf';
import { useTranslation } from 'react-i18next';
const initialFormValue = {
    'isModalOpen': false,
    'record': {}
}

const StakingList = () => {
    const history = useHistory();
    const { t, i18n } = useTranslation();
    // state
    const [list, setList] = useState([])
    const [loader, setLoader] = useState(true)
    const [stakeData, setStakeData] = useState(initialFormValue)

    // redux-state
    const { isAuth } = useSelector(state => state.auth);

    // function
    const fetchStaking = async () => {
        try {
            const { status, loading, message, result } = await getStaking();
            setLoader(loading)
            if (status == 'success') {
                setList(result)
            }
        } catch (err) { }
    }

    const handleCloseModal = () => {
        setStakeData({ 'isModalOpen': false, 'record': {} })
    }

    useEffect(() => {
        fetchStaking()
    }, [])

    return (
        <div className="dashboard_box">

            <OrderPlaceModal
                isShow={stakeData.isModalOpen}
                record={stakeData.record}
                onHide={handleCloseModal}
            />

            <div className="table-responsive stakingCurrencyList">
                <table className="table table-striped mb-0">
                    <thead>
                        <tr>
                            <th>{t('COIN')}</th>
                            <th>7-{t('DAY_APY')}</th>
                            <th>{t('YESTERDAY_APY')}</th>
                            <th>{t('FLEXIBLE_INTERESTED')}</th>
                            {/* <th>Auto Transfer</th> */}
                            <th>{t('ACTION')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            !loader && list && list.length > 0 && list.map((item, key) => {
                                if (item.type.includes('flexible')) {
                                    return (
                                        <tr key={key}>
                                            <td>
                                                <img src={item.currencyImage}
                                                    alt="" className="img-fluid"
                                                />
                                                {item.currencyName}
                                            </td>
                                            <td className="textDepositGreen">{item.flexibleAPY}%</td>
                                            <td>{item.flexibleAPY}%</td>
                                            <td>{toFixed(interestByDays(1000, item.flexibleAPY, 365), 4)} {item.currencySymbol}</td>
                                            {/* <td>
                                                <Switch
                                                    checked={state.checkedB}
                                                    onChange={handleChange}
                                                    color="primary"
                                                    name="checkedB"
                                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                                />
                                            </td> */}
                                            <td>
                                                <button
                                                    className="btn btn-primary text-uppercase py-2 m-0"
                                                    onClick={() => {
                                                        if (isAuth) {
                                                            setStakeData({
                                                                'isModalOpen': true,
                                                                'record': item
                                                            })
                                                        } else {
                                                            history.push('/login')
                                                        }
                                                    }}
                                                >
                                                  {t('STAKE_NOW')}
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                }
                            })
                        }
                        {
                            !loader && list && list.length == 0 && <tr><td colSpan={5}>{t('NO_RECORD')}</td></tr>
                        }
                        {
                            loader && <tr>{t('LOADING')}</tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default StakingList;