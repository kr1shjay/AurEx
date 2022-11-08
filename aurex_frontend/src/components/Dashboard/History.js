// import package
import React from 'react';
import { useTranslation } from 'react-i18next';

// import component
import RecentTransaction from './RecentTransaction';
import UserLoginHistory from './UserLoginHistory';
import NotificationHistory from '../NotificationHistory';
import TradeHistory from './tradeHistory'
const History = () => {
    const { t, i18n } = useTranslation();

    return (
        <div className="p2p_card min-h-auto dashHistoryTable">
            <h5 className="login_title_8 new_dashboard">{t("HISTORY")}</h5>
            <nav>
                <div class="nav nav-tabs primaryNav" id="nav-tab" role="tablist">
                    <a class="nav-item nav-link active" id="nav-recentTransaction-tab" data-toggle="tab" href="#nav-recentTransaction" role="tab" aria-controls="nav-recentTransaction" aria-selected="true">{t("RECENT_TRANSACTION")}</a>
                    <a class="nav-item nav-link" id="nav-loginHistory-tab" data-toggle="tab" href="#nav-loginHistory" role="tab" aria-controls="nav-loginHistory" aria-selected="false">{t("LOGIN_HISTORY")}</a>
                    {/* <a class="nav-item nav-link" id="nav-notificationHistory-tab" data-toggle="tab" href="#nav-notificationHistory" role="tab" aria-controls="nav-notificationHistory" aria-selected="false">{t("NOTIFICATION_HISTORY")}</a> */}
                    <a class="nav-item nav-link" id="nav-tradeHistory-tab" data-toggle="tab" href="#nav-tradeHistory" role="tab" aria-controls="nav-tradeHistory" aria-selected="false">{t("TRADE_HISTORY")}</a>
                </div>
            </nav>
            <div class="tab-content" id="nav-tabContent">
                <div class="tab-pane fade show active" id="nav-recentTransaction" role="tabpanel" aria-labelledby="nav-recentTransaction-tab">
                    <RecentTransaction />
                </div>
                <div class="tab-pane fade" id="nav-loginHistory" role="tabpanel" aria-labelledby="nav-loginHistory-tab">
                    <UserLoginHistory />
                </div>
                {/* <div class="tab-pane fade" id="nav-notificationHistory" role="tabpanel" aria-labelledby="nav-notificationHistory-tab"> 
                     <NotificationHistory /> 
                </div> */}
                <div class="tab-pane fade" id="nav-tradeHistory" role="tabpanel" aria-labelledby="nav-tradeHistory-tab"> 
                     <TradeHistory /> 
                </div>
            </div>
        </div>
    )
}

export default History;