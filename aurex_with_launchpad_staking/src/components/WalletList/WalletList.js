// import package
import React, { useEffect } from 'react';

// import component
import GridItem from "components/Grid/GridItem.js";
import CryptoWallet from './CryptoWallet';
import FiatWallet from './FiatWallet';

// import action
import { checkDeposit } from '../../actions/walletAction'

const WalletList = () => {

    useEffect(() => {
        checkDeposit()
    }, [])
    return (
        <GridItem xs={12} sm={12} lg={12} xl={12}>
            <FiatWallet />
            <CryptoWallet />
        </GridItem>
    )
}

export default WalletList