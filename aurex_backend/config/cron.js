// import package
import cron from 'node-cron'

// import config
import config from '../config'

/** 
 * Every 5 Second
*/
export const binOrderTask = cron.schedule('*/5 * * * * *', (date) => {
    require('../controllers/binance.controller').checkOrder()
}, {
    scheduled: false
});

/** 
 * Every minutes
*/
export const btcDepositTask = cron.schedule("* * * * *", () => {
    // require("../controllers/coin/btcGateway").deposit();
    require('../controllers/coin/btc.controller').deposit();
}, {
    scheduled: false
});

export const dogeDepositTask = cron.schedule("* * * * *", () => {
    require('../controllers/coin/doge.controller').deposit();
}, {
    scheduled: false
});

export const ltcDepositTask = cron.schedule("* * * * *", () => {
    require('../controllers/coin/ltc.controller').deposit();
}, {
    scheduled: false
});

export const flexibleSettleTask = cron.schedule('* * * * *', (date) => {
    require('../controllers/staking.controller').flexibleSettleList()
}, {
    scheduled: false
});

export const fixedSettleTask = cron.schedule('* * * * *', (date) => {
    require('../controllers/staking.controller').fixedSettleList()
}, {
    scheduled: false
});


export const redemListTask = cron.schedule('* * * * *', (date) => {
    require('../controllers/staking.controller').redemList(date)
}, {
    scheduled: false
});

export const binDepHisTask = cron.schedule('* * * * *', () => {
    if (config.RUN_CRON) {
        // require('../controllers/binance.controller').usrDeposit()
    }
}, {
    scheduled: false
});

export const p2pOrderCrossTime = cron.schedule('*/30 * * * * *', () => {
    require('../controllers/p2p.controller').orderClose()
}, {
    scheduled: false
});

export const p2pPostCrossDate = cron.schedule('* * * * *', () => {
    require('../controllers/p2p.controller').postClose()
}, {
    scheduled: false
});



/** 
 * Every 6 hours
*/
cron.schedule('0 0 */6 * * *', () => {
    // cron.schedule('* * * * *', () => {
        // console.log("price conversion run one miniute")
    require('../controllers/priceCNV.controller').priceCNV();
});

// cron.schedule('* * * * * *', () => {
//     require('../controllers/priceCNV.controller').priceCNV();
// });

export const warazixApi = cron.schedule('*/5 * * * * *', (date) => {

    // require('../controllers/wazarix.controller').spotPriceTicker()   
});
/** 
 * every one  mins
 * get all oerder from wazirix .com
 * wazarix.controller
*/
export const warazix_get_allOrder = cron.schedule('*/30 * * * * *', (date) => {
    // console.log("-----corn run wazario")
    // require('../controllers/wazarix.controller').checkOrder()
    // require('../controllers/wazarix.controller').getAllOrder()
},
    // {
    //     scheduled: true
    // }
);
/** 
 * Every 1 hours
*/
export const balMoveToBNBTask = cron.schedule('0 0 */1 * * *', (date) => {
    // require('../controllers/coin/coinpaymentGateway').balMoveToBinance();
}, {
    scheduled: false
});

/** 
 * Every 2 Minutes
*/
export const autoWithdraw = cron.schedule("*/2 * * * *", (date) => {
    require('../controllers/wallet.controller').AutoWithdraw();
}, {
    scheduled: false
});