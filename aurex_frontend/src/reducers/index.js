import { combineReducers } from "redux";
import authReducer from "./authReducer";
import tradeReducers from './tradeReducers'
import tradeAsset from './tradeAsset'
// import errorReducer from "./errorReducers";

// common
import modal from './modal';
import form from './form';


import account from './account';
import bankDetail from './bankDetail';
import userSetting from './userSetting';
import language from './language';
import currency from './currency';
import timezone from './timezone';
import userKyc from './userKyc';
import wallet from './wallet';
import socialMedia from './socialMedia';
import pairList from './pairListReducer';
import tradePair from './tradePairReducers'
import marketPrice from './marketPriceReducers';
import themeReducers from './themeReducers';
import tradeTheme from './tradeTheme';
import orderBookDetail from './orderBookDetail'
import stakeOrder from './stakeOrderReducer';
import priceConversion from './priceConversion';
import announcement from './announcement';
import p2pPost from './p2pPost';
import p2pOrder from './p2pOrder';
import p2pPair from './p2pPair';
import iconBtn from './iconBtn';    
import notice from './notice';
import purchaseToken from './purchaseToken';

export default combineReducers({
    auth: authReducer,
    account,
    bankDetail,
    userSetting,
    language,
    currency,
    timezone,
    userKyc,
    wallet,
    pairList,
    tradeAsset,
    tradePair,
    marketPrice,
    theme: themeReducers,
    tradeTheme,
    orderBookDetail,
    stakeOrder,
    priceConversion,
    announcement,
    p2pPost,
    p2pOrder,
    p2pPair,
    iconBtn,
    notice,
    purchaseToken,
    socialMedia
    // modal: modal,
    // form,
    // trade: tradeReducers,
    // errors: errorReducer
});