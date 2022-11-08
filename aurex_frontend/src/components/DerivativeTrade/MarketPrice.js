// import package
import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
// import context
import SocketContext from '../Context/SocketContext';

// import action
import { setMarketPrice } from '../../actions/perpetualTradeAction';

// import lib
import isEmpty from '../../lib/isEmpty';
import { toFixed } from '../../lib/roundOf';


const MarketPrice = () => {
    const socketContext = useContext(SocketContext);
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    // redux-state
    const pairData = useSelector(state => state.tradePair);
    const tickerData = useSelector(state => state.marketPrice);

    useEffect(() => {
        if (!isEmpty(pairData)) {
            // socket
            socketContext.socket.on('perpetualMarketPrice', (result) => {
                if (result.pairId == pairData.pairId) {
                    setMarketPrice(result.data, dispatch)
                }
            })
        }
    }, [pairData])

    useEffect(() => {
        return () => {
            socketContext.socket.off("perpetualMarketPrice");
        }
    }, [])

    return (
        <div className="headerOverviewGroup">
            <div className="hoPriceConversion">
                <h3 className="tradeGreenText">{toFixed(tickerData.markPrice, pairData.secondFloatDigit)}</h3>
            </div>

            <div className="headerOverviewStatus">
                <h5><small>{t('24H_CHANGE')}</small><span className="tradeRedText">{tickerData.changePrice} {tickerData.change}%</span></h5>
            </div>

            <div className="headerOverviewStatus">
                <h5><small>{t('24_HIGH')}</small>{tickerData.high}</h5>
            </div>
            <div className="headerOverviewStatus">
                <h5><small>{t('24_LOW')}</small>{tickerData.low}</h5>
            </div>
            <div className="headerOverviewStatus">
                <h5><small>{t('24H_VOLUME')}({pairData && pairData.firstCurrencySymbol})</small>{tickerData.firstVolume}</h5>
            </div>
            <div className="headerOverviewStatus">
                <h5><small>{t('24H_VOLUME')}({pairData && pairData.secondCurrencySymbol})</small>{tickerData.secondVolume}</h5>
            </div>
        </div>
    )
}

export default MarketPrice;