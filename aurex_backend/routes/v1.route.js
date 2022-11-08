//  import packages
import express from 'express';
import requestIp from 'request-ip'

// import controllers
import * as apiKeyCtrl from '../controllers/apiManage.controller';
import * as spotV1Ctrl from '../controllers/v1/spot.v1';

const router = express();

router.route('/test').get(requestIp.mw(), apiKeyCtrl.v1VerifySign, apiKeyCtrl.testKey)

// Spot 
router.route('/spot/allOrders').get(requestIp.mw(), apiKeyCtrl.v1VerifySign, spotV1Ctrl.getAllOrder)
router.route('/spot/order').get(requestIp.mw(), apiKeyCtrl.v1VerifySign, spotV1Ctrl.getOrder)
router.route('/spot/openOrders').get(requestIp.mw(), apiKeyCtrl.v1VerifySign, spotV1Ctrl.getOpenOrders)
router.route('/spot/tradeHistory').get(requestIp.mw(), apiKeyCtrl.v1VerifySign, spotV1Ctrl.getTradeHistory)



export default router;