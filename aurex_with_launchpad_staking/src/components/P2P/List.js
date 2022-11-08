// import package
import React, { useRef } from 'react';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Detail from './Detail';
import RecentPost from './RecentPost';

const List = () => {
    const history = useHistory()
    const recentRef = useRef();
    const { t, i18n } = useTranslation();
    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={5} lg={3}>
                <div className="p2p_card">
                    <h3 className="login_title_8">{t('P2P')}</h3>
                    <div className="submit_btn w70_i">
                        <Button onClick={() => history.push('/Postad')}>{t('POST_NEW_AD')}</Button>
                    </div>

                    <RecentPost
                        ref={recentRef}
                    />                   
{/* 
                    <div className="recent_post">
                        <h4>{t('P2P_STATISTICS')}</h4>
                        <div>
                            <div className="flex_details">
                                <span className="text_color_w">{t('TOTAL_TRADES')}</span>
                                <span className="text-right clor_black">{t('BUY')} <span className="color_green">120</span> |  {t('SELL')}<span className="color_red">150</span></span>
                            </div>
                            <div className="flex_details">
                                <span className="text_color_w">{t('FIRST_TRADE')}</span>
                                <span className="text-right clor_black">12 {t('DAYS')}</span>
                            </div>
                            <div className="flex_details">
                                <span className="text_color_w">{t('TOTAL_VOLUME')}</span>
                                <span className="text-right clor_black">0.023658787 {t('BTC')}<br />
                                    $6,500.50
                                </span>
                            </div>
                            <div className="flex_details">
                                <span className="text_color_w">{t('TOTAL_TRADE_COMPLETE')}</span>
                                <span className="text-right clor_black">99.5%</span>
                            </div>
                        </div>
                    </div> */}

                </div>
            </GridItem>
            <GridItem xs={12} sm={12} md={7} lg={9}>
                <div className="p2p_card p-0">
                    <GridContainer>
                        <Detail
                            recentRef={recentRef}
                        />
                    </GridContainer>
                </div>
            </GridItem>
        </GridContainer>
    )
}

export default List;