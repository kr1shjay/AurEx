import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Dashboard from "./components/pages/Dashboard";
import React, { Component } from 'react';
import Login from "./components/auth/Login";
import Forgot from "./components/auth/Forgot";
import NotFound from "./components/layout/NotFound";
import { Provider, connect } from "react-redux";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Register from "./components/auth/Register";
import store from "./store";
import isEmpty from './lib/isEmpty'
//action
import { SingleAdmin } from './actions/admin'
//lib
import isLogin from './lib/isLogin'

// import component
import ConditionRoute from './components/Route/ConditionRoute';
import SideBar from "./components/partials/Sidebar";

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/bootstrap/dist/js/bootstrap';
import '../node_modules/font-awesome/css/font-awesome.css';
import '../node_modules/jquery/dist/jquery.min';
import '../node_modules/popper.js/dist/popper';

// import page
import P2pPair from "./components/pages/P2pPair"

import User from "./components/pages/Users";
import Bonus from "./components/pages/Bonus";
import Emailtemplates from "./components/pages/Emailtemplates";
import Pairmanagement from "./components/pages/Pairmanagement";
import Cms from "./components/pages/Cms";
import Profile from "./components/pages/Profile.jsx";
import Settings from "./components/pages/Settings";
import Changepassword from "./components/pages/Changepassword";

import Withdraw from "./components/pages/Withdraw";
import Deposit from "./components/pages/Deposit";
import FundTransfer from "./components/pages/FundTransfer";
import Userbalance from "./components/pages/Userbalance";
import Liquidated from "./components/pages/Liquidated";
import priceConversion from './components/pages/priceConversion'
import Perpetual from "./components/pages/Perpetual";
import Contactus from "./components/pages/Contactus";
// import Chat from "./components/pages/Chat";
import Newsletter from "./components/pages/Newsletter";
import SupportCategory from './components/pages/supportCategory';
import Support from "./components/pages/Support";
import SupportReply from "./components/pages/SupportReply";
import Currency from "./components/pages/Currency";
import SubAdmin from "./components/pages/SubAdmin";
import TradeHistory from "./components/pages/Tradehistory";
import Closedpositions from "./components/pages/Closedpositionshistory";
import OrderHistory from "./components/pages/Orderhistory";
import PerpetualOrderHistory from './components/pages/perputualOrderHoitory'
import PerpetualTradeHistory from './components/pages/perpetualTradeHistory'
import FeeSettings from "./components/pages/Feesettings.jsx"
// import Assets from "./components/pages/AssetsExchange.jsx"
// import Category from "./components/pages/category.jsx"
// import Subcategory from "./components/pages/Subcategory.jsx";
import Anouncement from "./components/pages/anouncement";
// import Article from "./components/pages/Article.jsx";
import Staking from "./components/pages/Staking";
import StakingHistory from "./components/pages/StakeSettelment";

// import HelpCentreCategory from "./components/pages/HelpCentrecategory.jsx"
// import HelpCentreArticle from "./components/pages/HelpcentreArticle.jsx"
import Kyc from "./components/pages/Kyc";
import kycupdate from "./components/partials/KycUpdate.js";
import Tradingbot from "./components/pages/Tradingbot"
import Launchpad from "./components/pages/Launchpad"
import TokenPurchase from "./components/pages/TokenPurchase"

import SiteSettingPage from "./components/pages/SiteSettingPage";
import LanguagePage from "./components/pages/LanguagePage";
import FaqCategory from "./components/pages/FaqCategory";
import FaqPage from "./components/pages/Faq";
import perpetualTradeHistory from "./components/pages/perpetualTradeHistory";
// p2p
// import P2pOrder from "./components/pages/P2pOrder";
// import P2pOrderView from "./components/pages/P2pOrderView";
// import P2pDispute from './components/pages/P2pDispute'
import dashboard from "./components/pages/Dashboard";


//2fa
import GoogleAuth from './components/pages/SecurityTwoFA'


//routes
import Routers from './components/partials/routes'

// actions 
import { decodeJwt } from './actions/jsonWebToken';

// lib
import { getAuthToken } from './lib/localStorage';
// import constant
import {
    SET_AUTHENTICATION
} from './constant';

class App extends Component {

    constructor() {
        super()
    }



    async componentDidMount() {
        let token = getAuthToken();
        if (!isEmpty(token)) {
            token = token.replace('Bearer ', '')
            const decoded = jwt_decode(token);
            if (decoded) {
                store.dispatch({
                    type: SET_AUTHENTICATION,
                    authData: {
                        isAuth: true,
                        userId: decoded._id,
                        restriction: decoded.restriction,
                        role: decoded.role
                    }
                })
            }
        }
    }


    render() {
        let records = store.getState()
        let restriction = records.isRun.restriction
        return (
            <Provider store={store}>
                <ToastContainer />
                <Router basename={'/'}>
                    <div className="App">
                        <Switch>
                            <Switch>

                                {

                                    Routers && Routers.length > 0 && Routers.map((route, idx) => {

                                        if (restriction && restriction.length > 0 && restriction.includes(route.path)) {
                                            return (

                                                <ConditionRoute
                                                    key={idx}
                                                    exact={route.exact}
                                                    path={route.path}
                                                    component={route.component}
                                                    type={route.type}
                                                    render={(props) => (
                                                        <>
                                                            <route.component {...props} />
                                                        </>
                                                    )}
                                                />
                                            )

                                        } else if (isEmpty(restriction)) {
                                            return (

                                                <ConditionRoute
                                                    key={idx}
                                                    exact={route.exact}
                                                    path={route.path}
                                                    component={route.component}
                                                    type={route.type}
                                                    render={(props) => (
                                                        <>
                                                            <route.component {...props} />
                                                        </>
                                                    )}
                                                />
                                            )

                                        }

                                    })
                                }

                                {/* <ConditionRoute exact path="/" component={Login} type={"auth"} />
                         <ConditionRoute exact path="/dashboard" component={Dashboard} type={"private"} /> */}

                                {/* 
                                <ConditionRoute exact path="/register" component={Register} type={"auth"} />
                                <ConditionRoute exact path="/login" component={Login} type={"auth"} />
                                <ConditionRoute exact path="/forgot" component={Forgot} type={"auth"} />

                                <ConditionRoute exact path="/sub-admin" component={SubAdmin} type={"private"} />
                                <ConditionRoute exact path="/users" component={User} type={"private"} />
                                <ConditionRoute exact path="/site-setting" component={SiteSettingPage} type={"private"} />
                                <ConditionRoute exact path="/cms" component={Cms} type={"private"} />
                                <ConditionRoute exact path="/contactus" component={Contactus} type={"private"} />

                                <ConditionRoute exact path="/faq-category" component={FaqCategory} type={"private"} />
                                <ConditionRoute exact path="/faq" component={FaqPage} type={"private"} />
                                <ConditionRoute exact path="/emailtemplates" component={Emailtemplates} type={"private"} />
                                <ConditionRoute exact path="/perpetual" component={Perpetual} type={"private"} />
                                <ConditionRoute exact path="/priceCNVlist" component={priceConversion} type={"private"} />
                                <ConditionRoute exact path="/anouncement" component={Anouncement} type={"private"} />
                                <ConditionRoute exact path="/support-category" component={SupportCategory} type={"private"} />
                                <ConditionRoute exact path="/support" component={Support} type={"private"} />
                                <ConditionRoute exact path="/support_reply/:id" component={SupportReply} type={"private"} />
                                <ConditionRoute exact path="/security" component={GoogleAuth} type={"private"} />


                                <ConditionRoute exact path="/kyc" component={Kyc} type={"private"} />
                                <ConditionRoute exact path="/currency" component={Currency} type={"private"} />


                                <ConditionRoute exact path="/profile" component={Profile} type={"private"} />
                                <ConditionRoute exact path="/settings" component={Settings} type={"private"} />
                                <ConditionRoute exact path="/changepassword" component={Changepassword} type={"private"} />


                                <ConditionRoute exact path="/orderhistory" component={OrderHistory} type={"private"} />
                                <ConditionRoute exact path="/tradehistory" component={TradeHistory} type={"private"} />
                                <ConditionRoute exact path="/perpetual-Trade-History" component={perpetualTradeHistory} type={"private"} />
                                <ConditionRoute exact path="/perpetual-Order-History" component={PerpetualOrderHistory} type={"private"} />
                                <ConditionRoute exact path="/withdraw" component={Withdraw} type={"private"} />
                                <ConditionRoute exact path="/deposit" component={Deposit} type={"private"} />
                                <ConditionRoute exact path="/fund-transfer" component={FundTransfer} type={"private"} />
                                <ConditionRoute exact path="/Pairmanagement" component={Pairmanagement} type={"private"} />
                                <ConditionRoute exact path="/Tradingbot" component={Tradingbot} type={"private"} />
                                <ConditionRoute exact path="/Staking" component={Staking} type={"private"} />
                                <ConditionRoute exact path="/Staking-History" component={StakingHistory} type={"private"} />
                                <ConditionRoute exact path="/launchpad" component={Launchpad} type={"private"} />
                                <ConditionRoute exact path="/token-purchase" component={TokenPurchase} type={"private"} />
                                <ConditionRoute exact path="/kyc" component={Kyc} type={"private"} /> */}

                                {/* <ConditionRoute exact path="/Bonus" component={Bonus} /> */}
                                {/* <ConditionRoute exact path="/contactus" component={Contactus} /> */}
                                {/* <ConditionRoute exact path="/chat" component={Chat} /> */}
                                {/* <ConditionRoute exact path="/newsletter" component={Newsletter} /> */}
                                {/* <PrivateRoute exact path="/assets" component={Assets} /> */}
                                {/* <PrivateRoute exact path="/closedpositions" component={Closedpositions} /> */}
                                {/* <ConditionRoute exact path="/feesettings" component={FeeSettings} /> */}

                                {/* <ConditionRoute exact path="/liquidated" component={Liquidated} /> */}
                                {/* <ConditionRoute exact path="/category" component={Category} /> */}
                                {/* <ConditionRoute exact path="/subcategory" component={Subcategory} /> */}
                                {/* <ConditionRoute exact path="/article" component={Article} /> */}

                                {/* <ConditionRoute exact path="/HelpCentreCategory" component={HelpCentreCategory} /> */}
                                {/* <ConditionRoute exact path="/HelpCentreArticle" component={HelpCentreArticle} /> */}

                                {/* P2P */}
                                {/* <ConditionRoute exact path="/p2p-pair" component={P2pPair} type={"private"} />
                                <ConditionRoute exact path="/p2p-order" component={P2pOrder} type={"private"} />
                                <ConditionRoute exact path="/p2p-ordrView/:orderId" component={P2pOrderView} type={"private"} />
                                <ConditionRoute exact path="/p2p-dispute" component={P2pDispute} type={"private"} />
                                <PrivateRoute
                                    exact
                                    path="/kycupdate/:id"
                                    component={kycupdate}
                                /> */}

                            </Switch>
                            <Route exact path="*" component={NotFound} />
                        </Switch>
                    </div>
                </Router>
            </Provider>
        );
    }
}


export default App
