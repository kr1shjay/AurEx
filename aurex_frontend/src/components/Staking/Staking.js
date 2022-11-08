// import package
import React from 'react';
import { useTranslation } from 'react-i18next';
// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import StakingList from './StakingList';
import StakeHistory from './StakeHistory';
import OrderList from './OrderList'


const Staking = () => {
    const { t, i18n } = useTranslation();
    return (
        <>
            <GridContainer>
                <GridItem xs={12} sm={12} md={8} lg={7}>
                    <div className="dashboard_box">
                        <h5 className="dash_subtitle">{t('STAKING_DELAILS')}</h5>
                        <div className="balance_details_panel">
                            <div className="balance_details_left">
                                <div className="mb-3">
                                    <h3>{t('TOTAL_STAKING')}</h3>
                                    <h2>0.00455349 <span>{t('BTC')}</span></h2>
                                </div>
                                <div>
                                    <h3>{t('ESTIMATED_VALUE')}</h3>
                                    <h4>$232.77</h4>
                                </div>
                            </div>
                            <div className="balance_details_right">
                                <div className="chartDash">
                                    <img src={require("../../assets/images/dashboardChart.jpg")} alt="" className="img-fluid" />
                                </div>
                                <div className="chartLabel">
                                    <ul>
                                        <li>
                                            <label><i class="fas fa-square-full squareOrange"></i> {t('BUSD')}</label>
                                            <span>106.49508070</span>
                                        </li>
                                        <li>
                                            <label><i class="fas fa-square-full squareBlue"></i> {t('BNB')}</label>
                                            <span>0.1083000</span>
                                        </li>
                                        <li>
                                            <label><i class="fas fa-square-full squareYellow"></i> {t('TRX')}</label>
                                            <span>283.1749000</span>
                                        </li>
                                        <li>
                                            <label><i class="fas fa-square-full squareGreen"></i> {t('XRP')}</label>
                                            <span>16.31823000</span>
                                        </li>
                                        <li>
                                            <label><i class="fas fa-square-full squareGrey"></i> {t('OTHERS')}</label>
                                            <span>0</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={4} lg={5}>
                    <OrderList />
                </GridItem>
            </GridContainer>

            <StakingList />
            <StakeHistory />
        </>
    )
}

export default Staking;