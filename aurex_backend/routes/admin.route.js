//  import packages
import express from 'express';
import passport from 'passport';

// import controllers
import * as adminCtrl from '../controllers/admin.controller';
import * as languageCtrl from '../controllers/language.controller';
import * as emailTemplateCtrl from '../controllers/emailTemplate.controller';
import * as userKycCtrl from '../controllers/userKyc.controller';
import * as currencyCtrl from '../controllers/currency.controller';
import * as walletCtrl from '../controllers/wallet.controller';
import * as stakingCtrl from '../controllers/staking.controller';
import * as siteSettingCtrl from '../controllers/siteSetting.controller';
import * as cmsCtrl from '../controllers/cms.controller';
import * as faqCtrl from '../controllers/faq.controller';
import * as commonCtrl from '../controllers/common.controller';
import * as pairCtrl from '../controllers/pairManage.controller';
import * as perpetualCtrl from '../controllers/perpetualPair.controller';
import * as userCntrl from '../controllers/user.controller';
import * as reportCtrl from '../controllers/report.controller';
import * as supportCtrl from '../controllers/support.controller';
import * as priceCNVCtrl from '../controllers/priceCNV.controller';
import * as anouncementCtrl from '../controllers/anouncement.controller';
import * as launchpadCtrl from '../controllers/launchpad.controller';
import * as tradeBotCtrl from '../controllers/tradeBot.controller';
import * as p2pCtrl from '../controllers/p2p.controller';
import * as newsLetterCtrl from '../controllers/newsLetter.controller'
import * as usrRefCtrl from '../controllers/userReference.controller'
import * as ProfiCtrl from '../controllers/ProfitManagement.controller'
import * as Dashboard from '../controllers/dashboard.controller'
import * as Contactus from '../controllers/contactUs.controller'
import * as DerivativeCtrl from '../controllers/derivativeTrade.controller'
import * as passbookCtrl from '../controllers/passbook.controller';

// import validation
import * as adminValid from '../validation/admin.validation';
import * as languageValid from '../validation/language.validation';
import * as currencyValid from '../validation/currency.validation';
import * as emailTemplateValid from '../validation/emailTemplate.validation';
import * as userKycValid from '../validation/userKyc.validation';
import * as walletValid from '../validation/wallet.validation';
import * as stakingValid from '../validation/staking.validation';
import * as pairValidate from '../validation/pair.validation';
import * as perpetualValid from '../validation/perpetual.validation'
import * as siteSettingsValid from '../validation/siteSettings.validation';
import * as priceCNVValid from '../validation/priceCNV.validation';
import * as launchpadValid from '../validation/launchpad.validation';
import * as anouncementValid from '../validation/anouncement.validation';
import * as p2pValid from '../validation/p2p.validation';
import * as CmsValid from '../validation/cms.validation'
import * as FaqValid from '../validation/faq.validation'
import * as SupprotValid from '../validation/support.validation'
import * as UrsValid from '../validation/UrsDash.validation'
import * as P2pValid from '../validation/p2p.validation'
import * as CountactValid from '../validation/contactus.validation'
import * as NewsValid from '../validation/newsLetter.Validation';


const router = express();
const passportAuth = passport.authenticate("adminAuth", { session: false });


// Admin
router.route('/login').post(adminValid.loginValidate, adminCtrl.adminLogin);
router.route('/subAdmin').get(passportAuth, adminCtrl.getAdmin);
router.route('/sub-admin').post(passportAuth, adminValid.SubAdminValid, adminCtrl.creatAdmin);
router.route('/edit-admin').post(passportAuth, adminValid.updateAdminValid, adminCtrl.editAdmin);
router.route('/login-history').get(passportAuth, adminCtrl.LoginhistoryPag);
router.route('/change-password').put(passportAuth, adminValid.passwordValid, adminCtrl.changePassword);
router.route('/get-profile').get(passportAuth, adminCtrl.getProfile);
router.route('/send-mail').post(passportAuth, adminCtrl.generateOTP, adminCtrl.sendMail);
router.route('/edit-profile').put(passportAuth, adminCtrl.editProfile);


//contactus
router.route('/get-contact').get(passportAuth, Contactus.getContact)
router.route('/admin-rly').put(passportAuth, CountactValid.AdminRly, Contactus.adminMsg)

// Dashboard
router.route('/get-history').get(Dashboard.getHistory)
router.route('/total-count').get(Dashboard.totalCount)

// Currency
router.route('/currency')
  .get(passportAuth, currencyCtrl.currencyList)
  .post(passportAuth, currencyCtrl.uploadCurrency, currencyValid.addValid, currencyCtrl.addCurrency)
  .put(passportAuth, currencyCtrl.uploadCurrency, currencyValid.editValid, currencyCtrl.updateCurrency);
router.route('/getCurrency').get(passportAuth, currencyCtrl.getCurrency);


// Language
router.route('/language')
  .get(passportAuth, languageCtrl.languageList)
  .post(passportAuth, languageValid.addLangValidate, languageCtrl.addLanguage)
  .put(passportAuth, languageValid.editLangValidate, languageCtrl.editLanguage);
router.route('/getLanguage').get(passportAuth, languageCtrl.getLanguage);

// Email Template
router.route('/emailTemplate')
  .get(passportAuth, emailTemplateCtrl.emailTemplateList)
  .post(passportAuth, emailTemplateValid.addTemplateValidate, emailTemplateCtrl.addEmailTemplate)
  .put(passportAuth, emailTemplateValid.editTemplateValidate, emailTemplateCtrl.editEmailTemplate)

//anouncement
router.route('/anouncement')
.post(passportAuth, anouncementCtrl.Anouncementupload ,anouncementValid.anouncementAdd,anouncementCtrl.anouncementAdd)
.get(passportAuth ,anouncementCtrl.getanouncement)
.put(passportAuth, anouncementCtrl.Anouncementupload ,anouncementValid.anouncementAdd,anouncementCtrl.anouncementEdit)
.delete(passportAuth,anouncementCtrl.anouncementdelete)

// User
router.route('/user').get(passportAuth, userCntrl.getUserList)
router.route('/user-update').post(passportAuth, userCntrl.UpdateStatue)
router.route('/getUserBalnce').get(passportAuth, userCntrl.getUserBalanceList)
router.route('/disable-2fa').post(passportAuth, userCntrl.Disable2FA)


// User Reference 
router.route('/referralHist').post(usrRefCtrl.usrReferralHist);

//2fa
router.route('/security').get(passportAuth, adminCtrl.get2faCode)
router.route('/update2FA').post(passportAuth, adminValid.update2faValid, adminCtrl.UpdateTwoFA)
router.route('/disabled2FA').post(passportAuth, adminValid.update2faValid, adminCtrl.diabled2faCode)


//kyc
router.route('/userKyc')
  .get(passportAuth, userKycCtrl.getAllUserKyc)
  .post(passportAuth, userKycCtrl.approveUserKyc)
  .put(passportAuth, userKycValid.rejectKycValidate, userKycCtrl.rejectUserKyc);
router.route('/changeUsrType/:userId').put(passportAuth, userKycCtrl.changeUserType)
router.route('/kycList').post(userKycCtrl.getKycList)

// Wallet
router.route('/depositList').get(passportAuth, walletCtrl.getDepositList)
router.route('/withdrawList').get(passportAuth, walletCtrl.getWithdrawList)
router.route('/fundList').get(passportAuth, walletCtrl.fundList)
router.route('/coinWithdraw/approve/:transactionId').get(passportAuth, walletCtrl.coinWithdrawApprove)
router.route('/coinWithdraw/reject/:transactionId').get(passportAuth, walletCtrl.coinWithdrawReject)
router.route('/fiatWithdraw/approve/:transactionId').get(passportAuth, walletCtrl.fiatWithdrawApprove)
router.route('/fiatWithdraw/reject/:transactionId').get(passportAuth, walletCtrl.fiatWithdrawReject)
router.route('/fiatDeposit/approve').post(passportAuth, walletValid.fiatDepositApproveValid, walletCtrl.fiatDepositApprove)

// Staking
router.route('/staking')
  .get(passportAuth, stakingCtrl.stakingList)
  .post(passportAuth, stakingValid.addStakeValid, stakingCtrl.addStaking)
  .put(passportAuth, stakingValid.editStakeValid, stakingCtrl.editStaking)
router.route('/settlementHistory').get(passportAuth, stakingCtrl.settlementHistory)
router.route('/orderHistory').get(passportAuth, stakingCtrl.orderHistory)

// Launch Pad
router.route('/launchpad')
  .get(passportAuth, launchpadCtrl.launchpadList)
  .post(passportAuth, launchpadCtrl.uploadWhitePaper, launchpadValid.addValid, launchpadCtrl.addLaunchpad)
  .put(passportAuth, launchpadCtrl.uploadWhitePaper, launchpadValid.editValid, launchpadCtrl.updateLaunchpad)
router.route('/purchaseToken').get(passportAuth, launchpadCtrl.purchaseTknList)

// Site Setting
router.route('/getSiteSetting').get(passportAuth, siteSettingCtrl.getSiteSetting)
router.route('/updateSiteSetting').put(passportAuth, siteSettingCtrl.updateSiteSetting)
router.route('/updateSiteDetails')
  .put(passportAuth, siteSettingCtrl.uploadSiteDetails, siteSettingsValid.siteSettingsValid, siteSettingCtrl.updateSiteDetails)
router.route('/updateUsrDash').put(passportAuth, UrsValid.UrsUpdateValida, siteSettingCtrl.updateUsrDash)
router.route('/updateSocialMedia').put(passportAuth, siteSettingCtrl.updateSocialMedia)
router.route('/updateFaqTrend').put(passportAuth, siteSettingCtrl.updateFaqTrend)
router.route('/updatemailintegrate').post(passportAuth, siteSettingsValid.updateMailValid, siteSettingCtrl.updateMailIntegrate)
router.route('/getemailintegrate').get(passportAuth, siteSettingCtrl.getMailIntegrate)
router.route("/updateLimit").put(passportAuth, siteSettingCtrl.updateLimit)
router.route("/getApiLimit").get(passportAuth, siteSettingCtrl.getApiLimit)


//profit
router.route('/fetch-profit').get(passportAuth, ProfiCtrl.AdminProfitDisplay)

// CMS
router.route('/cms').get(passportAuth, cmsCtrl.getCmsList).put(passportAuth, cmsCtrl.uploadImage, CmsValid.TemplateValid, cmsCtrl.updateCms)

// FAQ
router.route('/faqCategory')
  .get(passportAuth, faqCtrl.listFaqCategory)
  .post(passportAuth, FaqValid.FaqAddValid, faqCtrl.addFaqCategory)
  .put(passportAuth, FaqValid.FaqCatUpdateValid, faqCtrl.updateFaqCategory)
  .delete(passportAuth, faqCtrl.deleteFaqCategory);
router.route('/getFaqCategory').get(passportAuth, faqCtrl.getFaqCategory);
router.route('/faq')
  .get(passportAuth, faqCtrl.listFaq)
  .post(passportAuth, faqCtrl.addFaq)
  .put(passportAuth, FaqValid.FaqUpdateValid, faqCtrl.updateFaq)
  .delete(passportAuth, faqCtrl.deleteFaq);
router.route('/getFaqDropdown').get(passportAuth, faqCtrl.getFaqDropdown)


//spotTrade Pair
router.route('/spotPair')
  .get(passportAuth, pairCtrl.spotPairList)
  .post(passportAuth, pairValidate.addSpotPairValid, pairCtrl.addSpotPair)
  .put(passportAuth, pairValidate.editSpotPairValid, pairCtrl.editSpotPair);
// spot History
router.route('/spotOrderHistory').get(passportAuth, reportCtrl.spotorderHistory);
router.route('/spotTradeHistory').get(passportAuth, reportCtrl.spotTradeHistory);


//Perptual Pair
router.route('/perptualPair')
  .get(passportAuth, perpetualCtrl.perpetualPairList)
  .post(passportAuth, perpetualValid.addPerptualPairValid, perpetualCtrl.addPerpetualPair)
  .put(passportAuth, perpetualValid.editPerpetualPairValid, perpetualCtrl.editPerpetualPair)

//perpetual History
router.route('/perpetualOrderHistory').get(passportAuth, reportCtrl.perpetualOrderHistory);
router.route('/perpetualTradeHistory').get(passportAuth, reportCtrl.perpetualTradeHistory);

//passBook
router
  .route("/userPassBookHistory")
  .get(passportAuth, passbookCtrl.userPassbookHistory);

// P2P
router.route('/p2pPair')
  .get(passportAuth, p2pCtrl.pairList)
  .post(passportAuth, p2pValid.addPairValid, p2pCtrl.addPair)
  .put(passportAuth, p2pValid.editPairValid, p2pCtrl.editPair);
router.route('/p2p/orderReport').get(passportAuth, p2pCtrl.orderReport)
router.route('/p2p/getOrderReport/:orderId').get(passportAuth, p2pCtrl.getOrderReport)
router.route('/p2p/adminConversation').post(passportAuth, p2pCtrl.uploadAttach, P2pValid.messageValid, p2pCtrl.adminConversation)
router.route('/p2p/disputeResolve').post(passportAuth, p2pCtrl.disputeResolve)
router.route('/p2p/disputeList').get(passportAuth, p2pCtrl.disputeList)


//Price Conversion 
router.route('/priceCNV')
  .get(passportAuth, priceCNVCtrl.getPriceCNVlist)
  .put(passportAuth, priceCNVValid.priceCNVUpdateValid, priceCNVCtrl.priceCNVUpdate)


// Support
router.route('/supportCategory')
  .get(passportAuth, supportCtrl.getSupportCategory)
  .post(passportAuth, supportCtrl.addSupportCategory)
  .put(passportAuth, SupprotValid.SupportUpdateValid, supportCtrl.editSupportCategory);

router.route('/ticketList').get(passportAuth, supportCtrl.getTicketList)
router.route('/ticketMessage')
  .get(passportAuth, supportCtrl.getTicketMessage)
  .put(passportAuth, SupprotValid.MessgaeValid, supportCtrl.replyMessage);

// News Letter
router.route('/subscriber-all').get(passportAuth, newsLetterCtrl.allSubscriber)
router.route('/subscriber/sendNews').post(passportAuth, NewsValid.newsValid, newsLetterCtrl.sendNews)


// Common
router.route('/getPairDropdown').get(passportAuth, commonCtrl.getPairDropdown)
//
router.route('/get-position').get(passportAuth, DerivativeCtrl.closePosition)

export default router;