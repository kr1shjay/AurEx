// import package
import React from 'react';
import { useTranslation } from 'react-i18next';

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import History from './History';
import Notification from './Notification';
import BalanceDetail from './BalanceDetail';
import UserDetail from './UserDetail';
import Announcement from '../Announcement';
import Statistics from './Statistic';


const Dashboard = () => {
    const { t, i18n } = useTranslation();

    return (
        <div className="dashboardContent userPages">
            <div className="container-fluid">
                <GridContainer>
                    <GridItem xs={12} sm={12} md={5} lg={5}>
                        <h3 className="dash_title">{t("DASHBOARD")}</h3>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={7} lg={7}>
                        <Announcement />
                    </GridItem>
                </GridContainer>

                <GridContainer>
                    <GridItem xs={12} sm={12} md={12} lg={6} className="height_full_div">
                        <UserDetail />
                       
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={6} className="height_full_div">
                       
                        <Notification />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                        <BalanceDetail />
                    </GridItem>

                </GridContainer>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                        {/* <Statistics /> */}
                    </GridItem>
                </GridContainer>
                <History />
            </div>
        </div>
    )
}

export default Dashboard;