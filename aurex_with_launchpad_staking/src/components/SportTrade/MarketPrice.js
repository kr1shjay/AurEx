// import package
import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
// import lib
import { toFixed } from '../../lib/roundOf';

const MarketPrice = () => {
    // redux-state
    const tickerData = useSelector(state => state.marketPrice);
    const pairData = useSelector(state => state.tradePair);
    const { t, i18n } = useTranslation();
    return (
        <div className="header-overview">
            <div className="selectCoinType">
                <div className="hoPriceConversion">
                    <h3 className="tradeGreenText">{toFixed(tickerData.markPrice, pairData.secondFloatDigit)}</h3>
                </div>
            </div>
            <div className="headerOverviewGroup">
                <div className="headerOverviewStatus">
                    <h5><small>{t('24H_CHANGE')}</small><span className="tradeRedText">{toFixed(tickerData.changePrice, pairData.secondFloatDigit)} ({toFixed(tickerData.change, 2)}%)</span></h5>
                </div>
                <div className="headerOverviewStatus">
                    <h5 className="pinkText"><small>{t('24_HIGH')}</small>{toFixed(tickerData.high, pairData.secondFloatDigit)}</h5>
                </div>
                <div className="headerOverviewStatus">
                    <h5><small>{t('24_LOW')}</small>{toFixed(tickerData.low, pairData.secondFloatDigit)}</h5>
                </div>
                <div className="headerOverviewStatus">
                    <h5><small>{t('24H_VOLUME')}({pairData && pairData.firstCurrencySymbol})</small>{toFixed(tickerData.firstVolume, pairData.secondFloatDigit)}</h5>
                </div>

                <div className="headerOverviewStatus">
                    <h5><small>{t('24H_VOLUME')}({pairData && pairData.secondCurrencySymbol})</small>{toFixed(tickerData.secondVolume, pairData.secondFloatDigit)}</h5>
                </div>
            </div>
        </div>
    )
}

export default MarketPrice;