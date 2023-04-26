// import package
import React, { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next';
// import component
import CancelOrder from './CancelOrder'

// import action
import { getOrderList } from '../../actions/stakingAction'

//lib
import { momentFormat } from 'lib/dateTimeHelper';

const SubscribeStake = () => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    // redux
    const { loader, data } = useSelector(state => state.stakeOrder);

    useEffect(() => {
        getOrderList(dispatch)
    }, [])
    return (
        <div className="dashboard_box px-mpob-zero">
            {/* <h5 className="dash_subtitle">Current Subscription</h5> */}
            <div className="stakingSubscription stakingSubscription_bg_trans">
                <div className='overflow_subsc_auto'>
              
                <ul>
                        {
                            !loader && data && data.length > 0 && data.map((item, key) => {
                                return (
                                    item.status == 'active' ?
                                        <>
                                            <li key={key}>
                                                <div className="csLeft">
                                                    <h3>
                                                        <img src={item.image} alt="" className="img-fluid" /> {item.name}</h3>
                                                    <p><span>{momentFormat(item && item.createdAt, 'YYYY-MM-DD HH:mm')}</span> <span className="textDepositGreen">{item.APY}%</span> <span className="textDepositGreen">{item.type}</span> </p>
                                                </div>
                                                <div className="csRight flex-row align-items-center">
                                                    <h4 className='margin_top_amount_10'>{item.amount} {item.coin}</h4>

                                                    {

                                                        item.status == 'active' && item.type != 'fixed' && <CancelOrder orderData={item} />
                                                    }

                                                </div>
                                            </li>
                                        </> : null

                                )
                            })
                        }
                        {
                            !loader && data && data.length == 0 && <li className='text-center justify-content-center'>{t('NO_RECORD')}</li>
                        }
                        {
                            loader && <li className='text-center justify-content-center'>{t('LOADING')}</li>
                        }
                    </ul>
                </div>
            
            </div>
        </div>
    )
}

export default SubscribeStake;