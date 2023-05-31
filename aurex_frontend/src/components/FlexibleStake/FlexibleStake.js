
// import package
import React, { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Button } from "react-bootstrap";
import OrderPlaceModal from './OrderPlaceModal';
import { useTranslation } from 'react-i18next';
import { toFixed } from "../../lib/roundOf";
import { interestByDays } from "../../lib/calculation";

// import action
import { getStaking } from '../../actions/stakingAction'

const stakingHistoryColumns = [
    {
        name: 'Coin',
        selector: 'Coin',
        sortable: false,
    },
    {
        name: 'APY',
        selector: 'APY',
        sortable: false,
    },
    {
        name: 'Duration Days',
        selector: 'Duration_Days',
        sortable: false,
    },
    {
        name: 'Interest Per Day',
        selector: 'Interest',
        sortable: false,
    },

    {
        name: 'Action',
        selector: 'button',
        sortable: false,
    },


];

const initialFormValue = {
    'isModalOpen': false,
    'record': {}
}

const FlexibleStake = () => {
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
            let reqData = {
                type: 'flexible'
            }
            const { status, loading, message, result } = await getStaking(reqData);
           
            setLoader(loading)
            if (status == 'success') {
                let data = []
                result && result.length > 0 && result.map((el, key) => {
                    data.push({
                        Coin: <div className="coin_section_table"><div>
                            <img src={el.image} alt="logo" className="img-fluid" /><span>{el.coin}</span></div><span>{el.name}</span></div>,
                        APY: <div className="apy_section"><span className="color_green">{el.flexibleAPY}%</span></div>,
                        Duration_Days: <span className="duration">{t('FLEXIBLE')}</span>,
                        Interest: toFixed((interestByDays(1000, el.flexibleAPY, 365)), 4),

                        button: <div className="Subscribe">
                            <Button
                                data-toggle="modal"
                                data-target="#SubscribeETH"
                                onClick={() => {
                                    if (isAuth) {
                                        setStakeData({
                                            'isModalOpen': true,
                                            'record': el
                                        })
                                    } else {
                                        history.push('/login')
                                    }
                                }}
                            >{t('STAKE_NOW')}</Button>
                        </div>
                    })
                })
                setList(data)
            }
        } catch (err) { }
    }

    const handleCloseModal = () => {
        setStakeData({ 'isModalOpen': false, 'record': {} })
    }


    useEffect(() => {
        fetchStaking()
    }, [isAuth])
    return (
        <Fragment>
            <OrderPlaceModal
                isShow={stakeData.isModalOpen}
                record={stakeData.record}
                onHide={handleCloseModal}
            />
            <DataTable
                columns={stakingHistoryColumns}
                data={list}
                noHeader
                progressPending={loader} className="text_center_div_table staking_btn_table table_staking_align_left_first"
            />
        </Fragment>

    )
}

export default FlexibleStake;