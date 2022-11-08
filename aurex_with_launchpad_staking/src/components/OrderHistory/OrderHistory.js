// import package
import React, { Fragment, useState, useEffect } from 'react';
import { MenuItem, Select, Button } from '@material-ui/core';
import DataTable from 'react-data-table-component';
import clsx from 'classnames'
import { useTranslation } from 'react-i18next';
// import component
import Staking from '../Staking/Staking';
import P2pOrder from './P2pOrder';
import SpotOrder from './SpotOrder/SpotOrder'
import DerivativeOrder from './DerivativeOrder/DerivativeOrder';


// import action
import { historyFilter } from '../../actions/commonAction'

const StakingColumns = [
    {
        name: 'Subscription Date',
        selector: 'Subscription_Date',
        sortable: false,
    },
    {
        name: 'Type',
        selector: 'Type',
        sortable: false,
    },
    {
        name: 'Coin',
        selector: 'Coin',
        sortable: false,
    },
    {
        name: 'Crypto amount',
        selector: 'Crypto_amount',
        sortable: false,
    },

    {
        name: 'APY',
        selector: 'APY',
        sortable: false,
    },
    {
        name: 'Duration',
        selector: 'Duration',
        sortable: false,
    },
    {
        name: 'Value Date',
        selector: 'Value_Date',
        sortable: false,
    },
    {
        name: 'Order ID',
        selector: 'Order_ID',
        sortable: false,
    },
    {
        name: 'Status',
        selector: 'Status',
        sortable: false,
    },
];

const StakingOrders = [
    {
        Subscription_Date: "30-11-2021 15:15",
        Type: "Locked",
        Coin: <div className="coin_section_table"><div><img src={require("../../assets/images/coin2.png")} alt="logo" className="img-fluid" /></div><span>BTC</span></div>,
        Crypto_amount: "0.23659878",
        APY: <div className="apy_section"><span className="color_green">+10.25%</span></div>,
        Duration: "30 Days",
        Value_Date: "CryptoTrader",
        Order_ID: <a href="">123456</a>,
        Status: <div className="apy_section"><span className="color_green">COMPLETED</span></div>,

    },
    {
        Subscription_Date: "30-11-2021 15:15",
        Type: "Locked",
        Coin: <div className="coin_section_table"><div><img src={require("../../assets/images/coin2.png")} alt="logo" className="img-fluid" /></div><span>BTC</span></div>,
        Crypto_amount: "0.23659878",
        APY: <div className="apy_section"><span className="color_green">+10.25%</span></div>,
        Duration: "30 Days",
        Value_Date: "CryptoTrader",
        Order_ID: <a href="">123456</a>,
        Status: <div className="apy_section"><span className="color_green">COMPLETED</span></div>,

    },
    {
        Subscription_Date: "30-11-2021 15:15",
        Type: "Locked",
        Coin: <div className="coin_section_table"><div><img src={require("../../assets/images/coin2.png")} alt="logo" className="img-fluid" /></div><span>BTC</span></div>,
        Crypto_amount: "0.23659878",
        APY: <div className="apy_section"><span className="color_green">+10.25%</span></div>,
        Duration: "30 Days",
        Value_Date: "CryptoTrader",
        Order_ID: <a href="">123456</a>,
        Status: <a href="">Reedem</a>,

    },
    {
        Subscription_Date: "30-11-2021 15:15",
        Type: "Locked",
        Coin: <div className="coin_section_table"><div><img src={require("../../assets/images/coin2.png")} alt="logo" className="img-fluid" /></div><span>BTC</span></div>,
        Crypto_amount: "0.23659878",
        APY: <div className="apy_section"><span className="color_green">+10.25%</span></div>,
        Duration: "30 Days",
        Value_Date: "CryptoTrader",
        Order_ID: <a href="">123456</a>,
        Status: <div className="apy_section"><span className="color_green">COMPLETED</span></div>,

    },
    {
        Subscription_Date: "30-11-2021 15:15",
        Type: "Locked",
        Coin: <div className="coin_section_table"><div><img src={require("../../assets/images/coin2.png")} alt="logo" className="img-fluid" /></div><span>BTC</span></div>,
        Crypto_amount: "0.23659878",
        APY: <div className="apy_section"><span className="color_green">+10.25%</span></div>,
        Duration: "30 Days",
        Value_Date: "CryptoTrader",
        Order_ID: <a href="">123456</a>,
        Status: <div className="apy_section"><span className="color_green">COMPLETED</span></div>,

    },
    {
        Subscription_Date: "30-11-2021 15:15",
        Type: "Locked",
        Coin: <div className="coin_section_table"><div><img src={require("../../assets/images/coin2.png")} alt="logo" className="img-fluid" /></div><span>BTC</span></div>,
        Crypto_amount: "0.23659878",
        APY: <div className="apy_section"><span className="color_green">+10.25%</span></div>,
        Duration: "30 Days",
        Value_Date: "CryptoTrader",
        Order_ID: <a href="">123456</a>,
        Status: <div className="apy_section"><span className="color_green">COMPLETED</span></div>,

    },
    {
        Subscription_Date: "30-11-2021 15:15",
        Type: "Locked",
        Coin: <div className="coin_section_table"><div><img src={require("../../assets/images/coin2.png")} alt="logo" className="img-fluid" /></div><span>BTC</span></div>,
        Crypto_amount: "0.23659878",
        APY: <div className="apy_section"><span className="color_green">+10.25%</span></div>,
        Duration: "30 Days",
        Value_Date: "CryptoTrader",
        Order_ID: <a href="">123456</a>,
        Status: <div className="apy_section"><span className="color_green">COMPLETED</span></div>,

    },
    {
        Subscription_Date: "30-11-2021 15:15",
        Type: "Locked",
        Coin: <div className="coin_section_table"><div><img src={require("../../assets/images/coin2.png")} alt="logo" className="img-fluid" /></div><span>BTC</span></div>,
        Crypto_amount: "0.23659878",
        APY: <div className="apy_section"><span className="color_green">+10.25%</span></div>,
        Duration: "30 Days",
        Value_Date: "CryptoTrader",
        Order_ID: <a href="">123456</a>,
        Status: <div className="apy_section"><span className="color_green">COMPLETED</span></div>,

    },


];

const OrderHistory = () => {
    // state
    const [type, setType] = useState('spot')
    const [pageLoader, setPageLoader] = useState(true)
    const { t, i18n } = useTranslation();
    const [p2pFilter, setP2pFilter] = useState({
        'coinList': [],
        'payment': []
    })
    const [spotFilter, setSpotFilter] = useState({
        'coinList': [],
        'orderTypes': []
    })
    const [derivativeFilter, setDerivativeFilter] = useState({
        'coinList': [],
        'orderTypes': []
    })

    // function
    const fetchData = async () => {
        try {
            const { status, loading, result } = await historyFilter();
            setPageLoader(false)
            setP2pFilter(result.p2pFilter)
            setSpotFilter(result.spotFilter)
            setDerivativeFilter(result.derivativeFilter)
        } catch (err) {
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <Fragment>
            {
                pageLoader && <div className="loader loader-1">
                    <div class="loader-outter"></div>
                    <div class="loader-inner"></div>
                </div>
            }

            {
                !pageLoader && <div className="table_p2p_section inprofile cion_table_sectio">
                    <div className="d-flex justify-content-between">
                        <ul class="nav nav-tabs ">
                            <li class="active"><a className={clsx({ 'active': type == 'spot' })} onClick={() => setType('spot')}>{t('SPOT_ORDERS')}</a></li>
                            {/* <li><a className={clsx({ 'active': type == 'derivative' })} onClick={() => setType('derivative')}>{t('DERIVATIVE_ORDERS')}</a></li>
                            <li><a className={clsx({ 'active': type == 'p2p' })} onClick={() => setType('p2p')}>{t('P2P_ORDERS')}</a></li> */}
                            {/* <li><a className={clsx({ 'active': type == 'staking' })} onClick={() => setType('staking')}>{t('STAKING_ORDERS')}</a></li> */}
                        </ul>
                    </div>

                    {
                        type == 'spot' && <SpotOrder filter={spotFilter} />
                    }

                    {
                        type == 'derivative' && <DerivativeOrder filter={derivativeFilter} />
                    }
                    {
                        type == 'p2p' && <P2pOrder p2pFilter={p2pFilter} />
                    }

                    {

                        type == 'staking' && 
                        <div id="Staking" class="tab-pane">
                        <div className="order_header_">
                            <div className="d-flex">

                            </div>

                            <div className="select_section">
                                <div className="select_lable_">
                                    <label>Type</label>
                                    <Select
                                        name="type"
                                        label="Locked"
                                    >
                                        <MenuItem value="">
                                            <em>Locked</em>
                                        </MenuItem>
                                        <MenuItem value={1}>{t('MANA')}</MenuItem>
                                        <MenuItem value={2}>{t('BTC')}</MenuItem>
                                        <MenuItem value={3}>{t('ETH')}</MenuItem>
                                        <MenuItem value={4}>{t('XRB')}</MenuItem>

                                    </Select>
                                </div>
                                <div className="select_lable_">
                                    <label>{t('DURATION')}</label>
                                    <Select
                                        name="type"
                                        label="30 Days"
                                    >
                                        <MenuItem value="">
                                            <em>30 {t('DAYS')}</em>
                                        </MenuItem>
                                        <MenuItem value={1}>{t('MANA')}</MenuItem>
                                        <MenuItem value={2}>{t('BTC')}</MenuItem>
                                        <MenuItem value={3}>{t('ETH')}</MenuItem>
                                        <MenuItem value={4}>{t('XRB')}</MenuItem>

                                    </Select>
                                </div>

                                {/* <div className="seacr_box_s">                                    
                                    <input type="text" placeholder="Find Coin" className="mb-0" />
                                    <i class="fas fa-search"></i>
                                </div> */}
                                <div className="submit_btn w70_i p-0 ml-2">
                                    <Button className="m-0">{t('Download_PDF')}</Button>
                                </div>
                            </div>
                        </div>
                        <DataTable
                            columns={StakingColumns}
                            data={StakingOrders}
                            noHeader
                        />
                    </div>
                    }
                </div >
            }

        </Fragment>
    )
}

export default OrderHistory