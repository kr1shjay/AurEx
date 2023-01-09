//  import packages
import express from 'express';
import passport from 'passport';

// import controllers
import * as userCtrl from '../controllers/user.controller';
import * as currencyCtrl from '../controllers/currency.controller'
import * as languageCtrl from '../controllers/language.controller';
import * as userKycCtrl from '../controllers/userKyc.controller';
import * as usrRefCtrl from '../controllers/userReference.controller';
import * as walletCtrl from '../controllers/wallet.controller';
import * as dashboardCtrl from '../controllers/dashboard.controller';
import * as spotTradeCtrl from '../controllers/spotTrade.controller';
import * as derivativeTradeCtrl from '../controllers/derivativeTrade.controller'
import * as chartCtrl from '../controllers/chart/chart.controller'
import * as apiKeyCtrl from '../controllers/apiManage.controller'
import * as commonCtrl from '../controllers/common.controller';
import * as cmsCtrl from '../controllers/cms.controller';
import * as faqCtrl from '../controllers/faq.controller';
import * as stakingCtrl from '../controllers/staking.controller';
import * as launchpadCtrl from '../controllers/launchpad.controller';
import * as anouncementCtrl from '../controllers/anouncement.controller';
import * as supportCtrl from '../controllers/support.controller';
import * as p2pCtrl from '../controllers/p2p.controller';
import * as newsLetterCtrl from '../controllers/newsLetter.controller'
import * as contactCtrl from '../controllers/contactUs.controller'
import * as webhookCtrl from '../controllers/webhook.controller';
import * as NotificationCtrl from '../controllers/notification.controller';

// import coin controllers
import * as coinpaymentCtrl from '../controllers/coin/coinpaymentGateway';

// import validation
import * as userValid from '../validation/user.validation';
import * as userKycValid from '../validation/userKyc.validation';
import * as walletValid from '../validation/wallet.validation';
import * as apiKeyVaild from '../validation/apiKey.validation'
import * as spotTradeValid from '../validation/spotTrade.validation';
import * as supportValid from "../validation/support.validation"
import * as p2pValid from '../validation/p2p.validation';
import * as contactUsValid from '../validation/contactus.validation'

const router = express();
const passportAuth = passport.authenticate("usersAuth", { session: false });

// User
router.route('/register').post(userValid.registerValidate, userCtrl.createNewUser);
router.route('/login').post(userValid.loginValidate, userCtrl.userLogin);
router.route('/confirm-mail').post(userValid.confirmMailValidate, userCtrl.confirmMail);
router.route('/check-deposit').get(passportAuth, userCtrl.checkDeposit)
router.route('/hide-btn').get(passportAuth, userCtrl.hideBtn)
router.route('/userProfile')
    .get(passportAuth, userCtrl.getUserProfile)
    .put(passportAuth, userCtrl.uploadProfile, userValid.editProfileValidate, userCtrl.editUserProfile);
router.route('/changePassword').post(passportAuth, userValid.changePwdValidate, userCtrl.changePassword);
router.route('/upgradeUser').post(passportAuth, userCtrl.upgradeUser)
router.route('/security/2fa')
    .get(passportAuth, userCtrl.get2faCode)
    .put(passportAuth, userValid.update2faValid, userCtrl.update2faCode)
    .patch(passportAuth, userValid.update2faValid, userCtrl.diabled2faCode);
router.route('/bankdetail')
    .post(passportAuth, userValid.editBankValidate, userCtrl.updateBankDetail)
    .put(passportAuth, userValid.deleteBankValidate, userCtrl.deleteBankDetail)
    .patch(passportAuth, userValid.deleteBankValidate, userCtrl.setPrimaryBank)
    .get(passportAuth, userCtrl.getBankDetail);
router.route('/userSetting')
    .get(passportAuth, userCtrl.getUserSetting)
    .put(passportAuth, userValid.editSettingValid, userCtrl.editUserSetting);
router.route('/editNotif').put(passportAuth, userValid.editNotifValid, userCtrl.editNotif)
router.route('/forgotPassword').post(userValid.checkForgotPwdValidate, userCtrl.checkForgotPassword);

router.route('/resetPassword').post(userValid.resetPwdValidate, userCtrl.resetPassword);
router.route('/phoneChange')
    .post(passportAuth, userValid.newPhoneValidate, userCtrl.changeNewPhone)
    .put(passportAuth, userValid.editPhoneValidate, userCtrl.verifyNewPhone);
router.route('/emailChange')
    .post(passportAuth, userValid.editEmailValidate, userCtrl.editEmail)
    .put(userValid.tokenValidate, userCtrl.sentVerifLink)
    .patch(userValid.tokenValidate, userCtrl.verifyNewEmail);
router.route('/sentOTP').post(userValid.sentOtp, userCtrl.checkMobile, userCtrl.sentOtp)

// kyc
router.route('/kycdetail').get(passportAuth, userKycCtrl.getUserKycDetail);
router.route('/kyc').put(passportAuth, userKycCtrl.uploadKyc, userKycValid.updateKycValidate, userKycCtrl.updateKyc);
router.route('/kyc/idproof').put(passportAuth, userKycCtrl.IDKycUpload, userKycValid.idProofValidate, userKycCtrl.updateIdProof);
router.route('/kyc/addressproof').put(passportAuth, userKycCtrl.uploadKyc, userKycValid.addressProofValidate, userKycCtrl.updateAddressProof);

// User Reference 

router.route('/transList').get(passportAuth, usrRefCtrl.transList)
router.route('/referralHist').get(passportAuth, usrRefCtrl.referralHist);

//user setting
router.route('/add-fav').post(passportAuth, userCtrl.AddFavorite)
router.route('/get-fav').get(passportAuth, userCtrl.getFavorit)

// wallet
// router.route('/getAssetsDetails').get(passportAuth, walletCtrl.getAssetsDetails);
router.route('/getAssetsDetails').get(passportAuth, walletCtrl.getWallet);
router.route('/getHideoZeroStatus').get(passportAuth,walletCtrl.getHideZeroStatus).put(passportAuth,walletCtrl.updateHideZeroStatus);


// auto withdraw
router.route('/WithdrawApprove').post(walletValid.tokenValid, walletCtrl.WithdrawApprove);
router.route('/WithdrawCancel').post(walletValid.tokenValid, walletCtrl.WithdrawCancel);

router.route('/getAsset/:currencyId').get(passportAuth, walletCtrl.getAssetByCurrency);
router.route('/fiatWithdraw')
    .post(passportAuth, walletValid.tokenValid, walletCtrl.decryptWallet, walletValid.fiatWithdrawValidate, walletCtrl.checkUserKyc, walletCtrl.withdrawFiatRequest)
    .patch(walletValid.tokenValid, walletCtrl.fiatRequestVerify);
router.route('/coinWithdraw')
    .post(passportAuth, walletValid.tokenValid, walletCtrl.decryptWallet, walletValid.coinWithdrawValid, walletCtrl.withdrawCoinRequest)
    .patch(walletValid.tokenValid, walletCtrl.coinRequestVerify);
router.route('/fiatDeposit').post(passportAuth, walletCtrl.uploadWalletDoc, walletValid.depositReqtValid, walletCtrl.checkUserKyc, walletCtrl.depositRequest);
router.route('/walletTransfer').post(passportAuth, walletValid.walletTransferValid, walletCtrl.walletTransfer);
router.route('/fundTransfer').post(passportAuth, walletValid.fundTransferValid, walletCtrl.fundTransfer);

router.route('/history/transaction/:paymentType').get(passportAuth, walletCtrl.getTrnxHistory);

// Dashboard
router.route('/recentTransaction').get(passportAuth, dashboardCtrl.getRecentTransaction);
router.route('/loginHistory').get(passportAuth, dashboardCtrl.getLoginHistory);
router.route('/notificationHistory').get(passportAuth, dashboardCtrl.getNotificationHistory);
router.route('/getDashBal').get(passportAuth, dashboardCtrl.getDashBal);
router
  .route("/gettradehistory_dash")
  .get(passportAuth, dashboardCtrl.gettradehistory_dash);
  
//Top gain list
router.route('/top-gain').get(spotTradeCtrl.topGainList)
//statistic
router.route('/Statistic').get(passportAuth, userCtrl.getAllTrade)

//Notification
router.route('/get-notification').get(passportAuth, NotificationCtrl.getNotification)
router.route('/unread-notice').get(passportAuth, NotificationCtrl.unReadNotice)
router.route('/read-notification').put(passportAuth, NotificationCtrl.readNotification)
router.route('/readsingel-notification').put(passportAuth, NotificationCtrl.readsingelNotification)
router.route('/create-notification').post(passportAuth, NotificationCtrl.NewNotification)

// Spot Trade
router.route('/spot/allPairs').get(passportAuth, spotTradeCtrl.allPairs)
router.route('/spot/tradePair').get(spotTradeCtrl.getPairList);
router.route('/spot/orderPlace').post(passportAuth, spotTradeValid.decryptValidate, spotTradeCtrl.decryptTradeOrder, spotTradeValid.orderPlaceValidate, spotTradeCtrl.orderPlace)
router.route('/spot/ordeBook/:pairId').get(spotTradeCtrl.getOrderBook)
router.route('/spot/openOrder/:pairId').get(passportAuth, spotTradeCtrl.getOpenOrder)
router.route('/spot/filledOrder/:pairId').get(passportAuth, spotTradeCtrl.getFilledOrder)
router.route('/spot/orderHistory/:pairId').get(passportAuth, spotTradeCtrl.getOrderHistory)
router.route('/spot/tradeHistory/:pairId').get(passportAuth, spotTradeCtrl.getTradeHistory)
router.route('/spot/marketPrice/:pairId').get(spotTradeCtrl.getMarketPrice)
router.route('/spot/recentTrade/:pairId').get(spotTradeCtrl.getRecentTrade)
router.route('/spot/cancelOrder/:orderId').delete(passportAuth, spotTradeCtrl.cancelOrder)
router.route('/spot/allOpenOrder').get(passportAuth, spotTradeCtrl.allOpenOrder)
router.route('/spot/allOpenOrderDoc').get(passportAuth, spotTradeCtrl.allOpenOrderDoc)
router.route('/spot/allTradeOrder').get(passportAuth, spotTradeCtrl.allTradeOrder)
router.route('/spot/allTradeOrderDoc').get(passportAuth, spotTradeCtrl.allTradeOrderDoc)


// Derivative Trade
router.route('/perpetual/allPairs').get(derivativeTradeCtrl.allPairs);
router.route('/perpetual/tradePair').get(derivativeTradeCtrl.getPairList);
router.route('/perpetual/orderPlace').post(passportAuth, derivativeTradeCtrl.decryptTradeOrder, derivativeTradeCtrl.orderPlace)
router.route('/perpetual/ordeBook/:pairId').get(derivativeTradeCtrl.getOrderBook)
router.route('/perpetual/openOrder/:pairId').get(passportAuth, derivativeTradeCtrl.getOpenOrder)
router.route('/perpetual/filledOrder/:pairId').get(passportAuth, derivativeTradeCtrl.getFilledOrder)
router.route('/perpetual/tradeHistory/:pairId').get(passportAuth, derivativeTradeCtrl.getTradeHistory)
router.route('/perpetual/positionOrder/:pairId').get(passportAuth, derivativeTradeCtrl.getPositionOrder)
router.route('/perpetual/cancelOrder/:orderId').delete(passportAuth, derivativeTradeCtrl.cancelOrder)
router.route('/perpetual/recentTrade/:pairId').get(derivativeTradeCtrl.getRecentTrade)
router.route('/perpetual/allOpenOrder').get(passportAuth, derivativeTradeCtrl.allOpenOrder)
router.route('/perpetual/allOpenOrderDoc').get(passportAuth, derivativeTradeCtrl.allOpenOrderDoc)
router.route('/perpetual/allTradeHist').get(passportAuth, derivativeTradeCtrl.allTradeHist)
router.route('/perpetual/allTradeHistDoc').get(passportAuth, derivativeTradeCtrl.allTradeHistDoc)

// chart
router.route('/chart/:config').get(chartCtrl.getChartData)
router.route('/perpetual/chart/:config').get(chartCtrl.getPerpetualChart)

// Staking
router.route('/getStaking').get(stakingCtrl.getStaking)
router.route('/stake/balance').get(passportAuth, stakingCtrl.getStakeBal)
router.route('/stake/orderPlace').post(passportAuth, stakingCtrl.orderPlace)
router.route('/stake/orderList').get(passportAuth, stakingCtrl.orderList)
router.route('/stake/settleHistory').get(passportAuth, stakingCtrl.getSettleHistory)
router.route('/stake/cancel/:stakeId').delete(passportAuth, stakingCtrl.cancelOrder)
router.route("/orderPlaceLocked").post(passportAuth, stakingCtrl.orderPlaceLocked);
router.route("/high-yield").get(stakingCtrl.highYield);

// Launch Pad
router.route('/launchpad/list/:listType').get(passportAuth, launchpadCtrl.getAllLaunchpad)
router.route('/launchpad/:id').get(passportAuth, launchpadCtrl.getLaunchpad)
router.route('/purchaseToken').post(passportAuth, launchpadCtrl.purchaseToken);
router.route('/getPurchaseTkn/:launchId').get(passportAuth, launchpadCtrl.getPurchaseTkn);

// API Management
router.route('/key/manage/:keyId?')
    .get(passportAuth, apiKeyCtrl.keyList)
    .post(passportAuth, apiKeyVaild.newKeyVaild, apiKeyCtrl.newKey)
    .patch(passportAuth, apiKeyCtrl.changeStatus)
    .delete(passportAuth, apiKeyCtrl.removeKey)

// Common
router.route('/getLanguage').get(languageCtrl.getLanguage);
router.route('/getCurrency').get(currencyCtrl.getCurrency);
router.route('/getSocialMedia').get(commonCtrl.getSocialMedia);
router.route('/getMarketTrend').get(commonCtrl.getMarketTrend)
router.route('/getCmsData').get(commonCtrl.getCmsData)
router.route('/getFaqTrend').get(commonCtrl.getFaqTrend)
router.route('/getPairData').get(passportAuth, commonCtrl.getPairData)
router.route('/priceConversion').get(passportAuth, commonCtrl.getPriceCNV)
router.route('/historyFilter').get(passportAuth, commonCtrl.historyFilter)
router.route('/contact').post(contactUsValid.newContactValid, contactCtrl.newContact)

// Announcement
router.route('/announcement').get(anouncementCtrl.getAnnouncement)
router.route('/getannouncement').get(anouncementCtrl.getAnnouncementContent)

// CMS 
router.route('/cms/:identifier').get(cmsCtrl.getCMSPage)
router.route('/fetch-cms').post(cmsCtrl.getAllCMSPage)

// FAQ
router.route('/faq').get(faqCtrl.getFaqWithCategory);

// Support Ticket
router.route('/getSptCat').get(passportAuth, supportCtrl.getSptCat);
// router.route('/ticket')
//     .get(passportAuth, supportCtrl.userTicketList)
//     .post(passportAuth, supportCtrl.createNewTicket)
//     .put(passportAuth, supportCtrl.usrReplyMsg)
//     .patch(passportAuth, supportCtrl.closeTicket);

router.route('/ticket')
    .get(passportAuth, supportCtrl.userTicketList)
    .post(passportAuth, supportCtrl.uploadAttachment, supportValid.createNewTicket, supportCtrl.createNewTicket)
    .put(passportAuth, supportCtrl.uploadAttachment, supportValid.usrReplyMsg, supportCtrl.usrReplyMsg)
    .patch(passportAuth, supportCtrl.closeTicket);

// P2P
router.route('/p2p/allPairs').get(p2pCtrl.allPairs);
router.route('/p2p/detail').get(p2pCtrl.getDetail)
router.route('/p2p/allPostAd').get(p2pCtrl.allPostAd)
router.route('/p2p/pair').get(p2pCtrl.getPairList)
router.route('/p2p/postOrder')
    .post(passportAuth, p2pValid.postAdValid, p2pCtrl.postOrder)
    .put(passportAuth, p2pValid.editPostValid, p2pCtrl.editPost)
    .patch(passportAuth, p2pCtrl.cancelPost)
router.route('/p2p/postOrderList').get(passportAuth, p2pCtrl.postOrderList)
router.route('/p2p/orderPlace').post(passportAuth, p2pValid.orderPlaceValid, p2pCtrl.checkPost, p2pCtrl.orderPlace)
router.route('/p2p/orderDetail/:orderId').get(passportAuth, p2pCtrl.getOrderDetail)
router.route('/p2p/conversation').post(passportAuth, p2pCtrl.uploadAttach, p2pCtrl.usrConversation)
router.route("/p2p/cancelOrder/:orderId").delete(passportAuth, p2pCtrl.cancelOrder);
router.route("/p2p/transferPayment/:orderId").post(passportAuth, p2pCtrl.transferPayment);
router.route("/p2p/releaseAsset").post(passportAuth, p2pCtrl.releaseAsset);
router.route("/p2p/disputeOrder/:orderId").post(passportAuth, p2pCtrl.disputeOrder);
router.route("/p2p/orderHistory").get(passportAuth, p2pCtrl.orderHistory);
router.route("/p2p/orderHistoryDoc").get(passportAuth, p2pCtrl.orderHistoryDoc);

// News Letter
router.route("/newsLetter/subscribe").post(newsLetterCtrl.newSubscribe);

// Webhook
router.route('/depositwebhook').post(coinpaymentCtrl.verifySign, coinpaymentCtrl.depositwebhook)
router.route('/getMySpotHistory').post(passportAuth, spotTradeCtrl.getMySpotHistory);
router.route('/getFilledOrderHistory').post(passportAuth, spotTradeCtrl.getFilledOrderHistory);
//chechemail
router.route('/checkEmail').post(passportAuth,userCtrl.checkEmail)
export default router;