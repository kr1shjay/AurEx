// import package
import React from 'react';
import { useTranslation } from 'react-i18next';

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import UserWalletList from './UserWalletList';
import WalletTransfer from './WalletTransfer';
import UserBalance from './UserBalance';
import Announcement from '../Announcement';

const Wallet = () => {
    const { t, i18n } = useTranslation();

    return (
        <div className="dashboardContent userPages">
            <div className="container">
                <GridContainer>
                    <GridItem xs={12} sm={12} md={5} lg={5}>
                        <h3 className="dash_title">Wallet</h3>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={7} lg={7}>
                        <Announcement />
                    </GridItem>
                </GridContainer>
                <div className="dashboard_box mb-2">
                    <GridContainer>
                        <UserBalance />
                        <WalletTransfer />
                    </GridContainer>
                </div>
                <UserWalletList />
            </div>
        </div>
    )
}

export default Wallet;