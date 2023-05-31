//  import packages
import express from 'express';
import requestIp from 'request-ip'

// import controllers
import * as userCtrl from '../controllers/userController';
import * as apiKeyCtrl from '../../controllers/apiManage.controller';
import * as userValid from '../validations/userValidations';
import * as spotTradeCtrl from '../controllers/spotTradeController';
import * as spotTradeValid from '../validations/spotTradeValidations';
import * as walletCtrl from '../controllers/walletController';
import * as walletValid from '../validations/walletValid';

const router = express();

// Login
router.route('/login').post(userValid.loginValidate, userCtrl.userLogin);

//spotTrade
router.route('/spot/orderPlace').post(apiKeyCtrl.authorization, spotTradeValid.decryptValidate, spotTradeCtrl.decryptTradeOrder, spotTradeValid.orderPlaceValidate, spotTradeCtrl.orderPlace)
router.route('/spot/openOrder/:pairId').get(apiKeyCtrl.authorization, spotTradeCtrl.getOpenOrder)
router.route('/spot/cancelOrder/:orderId').delete(apiKeyCtrl.authorization, spotTradeCtrl.cancelOrder)
router.route('/spot/orderHistory/:pairId').get(apiKeyCtrl.authorization, spotTradeCtrl.getOrderHistory)
router.route('/spot/tradeHistory/:pairId').get(apiKeyCtrl.authorization, spotTradeCtrl.getTradeHistory)
router.route('/spot/orderBook/:pairId').get(spotTradeCtrl.getOrderBook)
router.route('/spot/recentTrade/:pairId').get(spotTradeCtrl.getRecentTrade)
router.route('/spot/tradePair').get(spotTradeCtrl.getPairList)
router.route('/spot/allOpenOrder').get(apiKeyCtrl.authorization, spotTradeCtrl.allOpenOrder)
router.route('/spot/allTradeOrder').get(apiKeyCtrl.authorization, spotTradeCtrl.allTradeOrder)

// auto withdraw
router.route('/coinWithdraw')
    .post(apiKeyCtrl.authorization, walletValid.tokenValid, walletCtrl.decryptWallet, walletValid.coinWithdrawValid, walletCtrl.withdrawCoinRequest)
router.route('/withdrawfee').post(apiKeyCtrl.authorization, walletCtrl.withdrawfee)

// wallet
router.route('/getbalance').get(apiKeyCtrl.authorization, walletCtrl.getbalance)


export default router;