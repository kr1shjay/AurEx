// import package
import React from 'react';
import { useTranslation } from 'react-i18next';

// import component
import Section1 from './Section1';
import Section2 from './Section2';

const WalletBalance = () => {
    const { t, i18n } = useTranslation();

    return (
        <div className="p2p_card">
            <h3 className="login_title_8">{t("WALLET_BAL")}</h3>
            {/*<Section1
                firstCoin={'BTC'}
                secondCoin={'USD'}
            />*/}

            <Section2
                firstCoin={'BTC'}
                secondCoin={'USD'}
                walletType={"spot"}
            />
            {/*<Section2
                firstCoin={'BTC'}
                secondCoin={'USD'}
                walletType={"derivative"}
            />*/}
        </div>
    )
}

export default WalletBalance;