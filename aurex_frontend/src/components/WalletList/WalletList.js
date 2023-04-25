// import package
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import component
import GridItem from "components/Grid/GridItem.js";
import CryptoWallet from './CryptoWallet';
import FiatWallet from './FiatWallet';

// import action
import { checkDeposit,getAssetData } from '../../actions/walletAction'
import { getCurrency } from 'actions/commonAction';

const WalletList = () => {
let dispatch = useDispatch()
    useEffect(() => {
        checkDeposit()
        getAssetData(dispatch)
    }, [])
    return (
        <GridItem xs={12} sm={12} lg={12} xl={12}>
            {/* <FiatWallet /> */}
            <CryptoWallet />
        </GridItem>
    )
}

export default WalletList