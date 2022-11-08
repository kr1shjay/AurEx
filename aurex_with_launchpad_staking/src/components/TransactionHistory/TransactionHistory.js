// import package
import React, { useEffect } from "react";
import DataTable from 'react-data-table-component';
import { Select, MenuItem } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux'

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Announcement from '../Announcement'
import FiatHistory from './FiatHistory';
import CryptoHistory from './CryptoHistory'
import P2pOrderHistory from './P2pOrderHistory';
import { useTranslation } from 'react-i18next';
const TransactionHistory = () => {

  // redux-state
  const currencyOption = useSelector(state => state.currency)
  const { t, i18n } = useTranslation();
  return (
    <div className="container-fluid">
      <GridContainer>
        <GridItem xs={12} sm={12} md={5} lg={5}>
          <h3 className="dash_title">{t('FIAT_HISTORY')}</h3>
        </GridItem>
        <GridItem xs={12} sm={12} md={7} lg={7}>
          <Announcement />
        </GridItem>
      </GridContainer>
      <FiatHistory
        currencyOption={currencyOption}
      />
      <div class="row align-items-center">
        <div class="col-lg-12">
          <h3 class="dash_title mb-3">{t('CRYPTO_HISTORY')}</h3>
        </div>
      </div>
      <CryptoHistory
        currencyOption={currencyOption}
      />

      {/* <div class="row align-items-center">
        <div class="col-lg-12">
          <h3 class="dash_title mb-3">{t('P2P_HISTORY')}</h3>
        </div>
      </div>
      <P2pOrderHistory
        currencyOption={currencyOption}
      /> */}

    </div>
  )
}

export default TransactionHistory;