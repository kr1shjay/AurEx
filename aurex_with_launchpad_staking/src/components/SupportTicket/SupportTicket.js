// import package
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Announcement from '../Announcement';
import CreateTicket from './CreateTicket';
import TicketList from './TicketList';

const SupportTicket = () => {
    const listRef = useRef();
    const { t, i18n } = useTranslation();
    return (
        <div className="container-fluid">
            <GridContainer>
                <GridItem xs={12} sm={12} md={5} lg={5}>
                    <h3 className="dash_title">{t('CREAT_SUPPORT_TICKET')}</h3>
                </GridItem>
                <GridItem xs={12} sm={12} md={7} lg={7}>
                    <Announcement />
                </GridItem>
            </GridContainer>
            <div className="dashboard_box">
                <CreateTicket listRef={listRef}/>
            </div>
            <div class="row align-items-center">
                <div class="col-lg-12">
                    <h3 class="dash_title mb-3">{t('SUPPORT_DETAILS')}</h3>
                </div>
            </div>
            <TicketList
                ref={listRef}
            />
        </div>
    )
}

export default SupportTicket;