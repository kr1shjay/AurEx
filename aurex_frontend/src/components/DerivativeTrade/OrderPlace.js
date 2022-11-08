// import package
import React, { useState } from 'react';
import clsx from 'classnames';
import { useTranslation } from 'react-i18next';
// import component
import LimitOrder from './LimitOrder';
import MarketOrder from './MarketOrder';

const OrderPlace = () => {

    // state
    const [orderType, setOrderType] = useState('limit')
    const [buyorsell, setBuyorsell] = useState('buy') // buy or sell
    const { t, i18n } = useTranslation();
    return (
        <div className="tradeTableLeftSide darkBox orderBook">
            <div className="tableHead">
                <h4>{t('PLACE_ORDER')}</h4>
            </div>

            {/* <div className="derivativeCalC">
                <div className="calCBtnGroup">
                    <button className="btn greyBtn py-2 px-4">Cross</button>
                </div>
            </div> */}
            <div className="tradeFulltabbedTable">
                <nav>
                    <div className="nav nav-tabs nav-fill" id="nav-tab1" role="tablist">
                        <a className={clsx("nav-item nav-link py-2", { "active": orderType == 'limit' })}
                            onClick={() => setOrderType('limit')}
                        >
                            {t('LIMIT')}
                        </a>
                        <a
                            className={clsx("nav-item nav-link py-2", { "active": orderType == 'market' })}
                            onClick={() => setOrderType('market')}
                        >
                            {t('MARKET')}
                        </a>
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
                </div>
            </div>
        </div>
    )
}

export default OrderPlace;