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
router.route('/spot/openOrder').post(apiKeyCtrl.authorization, spotTradeCtrl.getOpenOrder)
router.route('/spot/cancelOrder').delete(apiKeyCtrl.authorization, spotTradeCtrl.cancelOrder)
router.route('/spot/orderHistory').post(apiKeyCtrl.authorization, spotTradeCtrl.getOrderHistory)
router.route('/spot/tradeHistory').post(apiKeyCtrl.authorization, spotTradeCtrl.getTradeHistory)
router.route('/spot/orderBook/:pairId').get(spotTradeCtrl.getOrderBook)
router.route('/spot/recentTrade/:pairId').get(spotTradeCtrl.getRecentTrade)
router.route('/spot/tradePair').get(spotTradeCtrl.getPairList)
router.route('/spot/allOpenOrder').post(apiKeyCtrl.authorization, spotTradeCtrl.allOpenOrder)
router.route('/spot/allTradeOrder').post(apiKeyCtrl.authorization, spotTradeCtrl.allTradeOrder)
router.route('/spot/orderStatus').post(apiKeyCtrl.authorization, spotTradeCtrl.getOrderStatus)

// auto withdraw
router.route('/coinWithdraw')
    .post(apiKeyCtrl.authorization, walletValid.tokenValid, walletCtrl.decryptWallet, walletValid.coinWithdrawValid, walletCtrl.withdrawCoinRequest)
router.route('/withdrawfee').post(apiKeyCtrl.authorization, walletCtrl.withdrawfee)

// wallet
router.route('/getbalance').post(apiKeyCtrl.authorization, walletCtrl.getbalance)



export default router;