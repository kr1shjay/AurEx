// import package
import React, { useState } from 'react';
import { MenuItem, Select } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import clsx from 'classnames';

// import component
import LimitOrder from './LimitOrder';
import MarketOrder from './MarketOrder';
import StopLimitOrder from './StopLimitOrder';
import StopMarketOrder from './StopMarketOrder';

const OrderPlace = (props) => {
    const { t, i18n } = useTranslation();

    // props
    const { setExpandScreen, expandScreen } = props;

    // state
    const [orderType, setOrderType] = useState('limit')
    const [buyorsell, setBuyorsell] = useState('buy') // buy or sell
    const [orderTypeOption, setOrderTypeOption] = useState('stop_limit')

    return (
        <div className="tradeTableLeftSide darkBox orderBook">

            <ul class="nav nav-tabs">
                <li className={clsx({ "active": buyorsell == 'buy' })} >
                    <a data-toggle="tab" className={clsx("green", { "active": buyorsell == 'buy' })} onClick={() => setBuyorsell('buy')}>Buy Order</a>
                </li>
                <li className={clsx({ "active": buyorsell == 'sell' })} >
                    <a data-toggle="tab" className={clsx("red", { "active": buyorsell == 'sell' })} onClick={() => setBuyorsell('sell')}>Sell Order</a>
                </li>
            </ul>
            <div class="tab-content">
                <div id="BuyO" class="tab-pane fade in active show">
                    <div className="tradeFulltabbedTable">
                        <nav className="place_order_nav_tabs">
                            <div className="nav nav-tabs nav-fill" id="nav-tab1" role="tablist">

                                <a
                                    className={clsx("nav-item nav-link py-2", { "active": orderType == 'limit' })}
                                    onClick={() => setOrderType('limit')}>
                                    {t('LIMIT')}
                                </a>
                                <a
                                    className={clsx("nav-item nav-link py-2", { "active": orderType == 'market' })}
                                    onClick={() => setOrderType('market')}
                                >
                                    {t('MARKETS')}
                                </a>
                                {/*<a
                                    className={clsx("nav-item nav-link py-2", { "active": orderType == 'stop_limit' })}
                                    onClick={() => setOrderType('stop_limit')}
                                >
                                    {t("STOP_LIMIT")}
                                </a>
*/}
                                {/* <a
                                    className={clsx("nav-item nav-link py-2", { "active": ['stop_limit', 'stop_market'].includes(orderType) })}
                                    onClick={(e) => setOrderType(orderTypeOption)}
                                >
                                    {orderTypeOption == 'stop_limit' && t("STOP_LIMIT")}
                                    {orderTypeOption == 'stop_market' && t("STOP_MARKET")}
                                </a>
                                <Select
                                    name="type"
                                    value={''}
                                    className="dropSelect"
                                    onChange={(e) => {
                                        e.preventDefault();
                                        const { name, value } = e.target;
                                        setOrderType(value)
                                        setOrderTypeOption(value)
                                    }}
                                >
                                    <MenuItem value={'stop_limit'}>{t("STOP_LIMIT")}</MenuItem>
                                    <MenuItem value={'stop_market'}>{t("STOP_MARKET")}</MenuItem>
                                </Select> */}
                            </div>
                        </nav>
                        <div className="tab-content" id="nav-tabContent1">

                            {
                                orderType == 'limit' && <LimitOrder
                                    buyorsell={buyorsell}
                                />
                            }

                            {
                                orderType == 'market' && <MarketOrder
                                    buyorsell={buyorsell}
                                />
                            }


                            {
                                orderType == 'stop_limit' && <StopLimitOrder
                                    buyorsell={buyorsell}
                                />
                            }

                            {/* {
                            orderType == 'stop_market' && <StopMarketOrder
                                buyorsell={buyorsell}
                            />
                        } */}
                        </div>
                    </div>
                </div>
                <div id="SellO" class="tab-pane fade in active">

                </div>
            </div>

        </div >
    )
}

export default OrderPlace;