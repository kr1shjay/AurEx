// import package
import React, { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next';
// import component
import CancelOrder from './CancelOrder'

// import action
import { getOrderList } from '../../actions/stakingAction'

const SubscribeStake = () => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    // redux
    const { loader, data } = useSelector(state => state.stakeOrder);

    useEffect(() => {
        getOrderList(dispatch)
    }, [])

    return (
        <div className="dashboard_box">
            <h5 className="dash_subtitle">{t('CURRENT_SUBSCRIPTION')}</h5>
            <div className="stakingSubscription">
                <Scrollbars style={{ width: "100%", height: 175 }}>
                    <ul>
                        {
                            !loader && data && data.length > 0 && data.map((item, key) => {
                                return (
                                    <li key={key}>
                                        <div className="csLeft">
                                            <h3>
                                                <img src={item.image} alt="" className="img-fluid" /> {item.name}</h3>
                                            <p><span>{item.createdAt}</span> <span className="textDepositGreen">{item.APY}%</span> {/* <span>Auto</span> */}</p>
                                        </div>
                                        <div className="csRight">
                                            <h4>{item.amount} {item.coin}</h4>
                                            {
                                                item.status == 'active' && <CancelOrder orderData={item} />
                                            }

                                        </div>
                                    </li>
                                )
                            })
                        }
                        {
                            !loader && data && data.length == 0 && <li className='text-center'>{t('NO_RECORD')}</li>
                        }
                        {
                            loader && <li className='text-center'>{t('LOADING')}</li>
                        }
                    </ul>
                </Scrollbars>
            </div>
        </div>
    )
}

export default SubscribeStake;