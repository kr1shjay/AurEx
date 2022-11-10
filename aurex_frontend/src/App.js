// import package
import React, { useEffect } from "react";
import { Switch, BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { I18nextProvider } from 'react-i18next';

// import component
import ConditionRoute from './components/Route/ConditionRoute';
import i18n from './components/i18next/i18n';
import HelperRoute from './components/Route/HelperRoute';

// import Context
import SocketContext from './components/Context/SocketContext'

// pages for this product
import DashboardPage from './pages/DashboardPage';
import WalletPage from './pages/WalletPage'
import ProfilePage from './pages/ProfilePage';


import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Register from "pages/register.js";
import ForgotPwdPage from "./pages/ForgotPwdPage";
import EmailVerification from './pages/EmailVerification';

import SecurityPage from './pages/SecurityPage';


import Staking from './pages/staking';
import Spot from './pages/spot';
import Derivative from './pages/derivative';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AboutUsPage from './pages/AboutUsPage';
import FaqPage from './pages/FaqPage';
import Contact from './pages/contact';
import Market from './pages/market';
import Orders from './pages/orders';



import PressPage from './pages/PressPage';
import InvestorsPage from './pages/InvestorsPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import ApiMgmtPage from './pages/ApiMgmtPage'
import TwoFA from './pages/TwoFA'
import P2P from './pages/p2p'
import Chat from './pages/p2pChat'
import Postad from './pages/postad'
import SettingPage from './pages/SettingPage';
import Referral from './pages/referal';

import Fees from './pages/fees';
import stakeTerms from './pages/stakingTerms';
import Notification from './pages/Notification';






// import CMS Page
import BusinessPage from './pages/cms/BusinessPage';
import TokenListPage from './pages/cms/TokenListPage';
import ApiPage from './pages/cms/ApiPage';
import SupportCMS from './pages/cms/SupportCms'
import FeesPage from './pages/cms/FeesPage';
// import SecurityPage from './pages/cms/SecurityPage';
import StakingPage from './pages/cms/StakingPage';

import Launchpad from "./pages/launchpad.js";
import TokenDetailPage from "./pages/TokenDetailPage";



import ChartPage from './pages/chart'


import HistoryPage from './pages/HistoryPage';
import SupportPage from './pages/SupportPage';

// import action
import { decodeJwt } from './actions/jsonWebToken';
import { getBankDetail } from './actions/users';

// import config
import { socket } from './config/socketConnectivity';

// import lib
import store from './store';
import isLogin from './lib/isLogin';
import { getAuthToken } from './lib/localStorage';


const App = () => {
    const { isAuth } = store.getState().auth;

    useEffect(() => {
        if (isAuth != true && isLogin()) {
            decodeJwt(getAuthToken(), store.dispatch)
        }
    }, [])

    return (
        <Provider store={store}>
            <I18nextProvider i18n={i18n}>
                <BrowserRouter basename="/">
                    <SocketContext.Provider value={{ socket }}>
                        <ToastContainer />
                        <HelperRoute />
                        <Switch>

                            <ConditionRoute exact path='/login' component={LoginPage} type={"auth"} />
                            <ConditionRoute exact path='/2fa' component={TwoFA} type={"auth"} />
                            <ConditionRoute exact path='/ResetPassword' component={TwoFA} type={"auth"} />
                            <ConditionRoute exact path='/register' component={Register} type={"auth"} />
                            <ConditionRoute exact path='/recover-password' component={ForgotPwdPage} type={"auth"} />
                            <ConditionRoute exact path='/reset-password/:authToken' component={ResetPasswordPage} type={"auth"} />
                            {/* <ConditionRoute exact path='/reset-password' component={ResetPasswordPage} type={"auth"} /> */}












                            {/* PRIVATE */}
                            <ConditionRoute exact path='/postad' component={Postad} type={"private"} />
                            <ConditionRoute exact path='/profile' component={ProfilePage} type={"private"} />
                            <ConditionRoute exact path='/security' component={SecurityPage} type={"private"} />
                            <ConditionRoute exact path='/setting' component={SettingPage} type={"private"} />



                            <ConditionRoute exact path='/dashboard' component={DashboardPage} type={"private"} />
                            <ConditionRoute exact path='/wallet' component={WalletPage} type={"private"} />
                            <ConditionRoute exact path='/orders' component={Orders} type={"private"} />
                            <ConditionRoute exact path='/kyc' component={ProfilePage} type={"private"} />
                            <ConditionRoute exact path='/api-management' component={ApiMgmtPage} type={"private"} />
                            <ConditionRoute exact path='/referral' component={Referral} type={"private"} />
                            <ConditionRoute exact path='/notification' component={Notification} type={"private"} />
                            <ConditionRoute exact path="/launchpad" component={Launchpad} type={"private"} />
                            <ConditionRoute exact path="/launchpad/:launchId" component={TokenDetailPage} type={"private"} />
                            {/* PRIVATE */}


                            {/* PUBLIC */}
                            <ConditionRoute exact path='/' component={HomePage} type={"public"} />
                            <ConditionRoute exact path='/home' component={HomePage} type={"public"} />
                            <ConditionRoute exact path='/staking' component={Staking} type={"public"} />
                            <ConditionRoute exact path='/history' component={HistoryPage} type={"public"} />
                            <ConditionRoute exact path='/support-ticket' component={SupportPage} type={"public"} />
                            <ConditionRoute exact path='/p2p' component={P2P} type={"public"} />
                            <ConditionRoute exact path='/chat/:orderId' component={Chat} type={"public"} />

                            <ConditionRoute exact path='/spot/:tikerRoot?' component={Spot} type={"public"} />
                            <ConditionRoute exact path='/derivative/:tikerRoot?' component={Derivative} type={"public"} />
                            <ConditionRoute exact path='/chart' component={ChartPage} type={"public"} />
                            <ConditionRoute exact path='/faq' component={FaqPage} type={"public"} />

                            {/* CMS Page */}
                            <ConditionRoute exact path='/about' component={AboutUsPage} type={"public"} />
                            <ConditionRoute exact path='/market' component={Market} type={"public"} />
                            <ConditionRoute exact path='/support' component={SupportCMS} type={"public"} />
                            {/* CMS Page */}


                            <ConditionRoute exact path='/contact' component={Contact} type={"public"} />
                            <ConditionRoute exact path='/terms' component={TermsPage} type={"public"} />
                            <ConditionRoute exact path='/fees' component={Fees} type={"public"} />
                            <ConditionRoute exact path='/stak-terms' component={stakeTerms} type={"public"} />








                            {/* <ConditionRoute exact path='/faq' component={FaqPage} type={"public"} /> */}
                            <ConditionRoute exact path='/press' component={PressPage} type={"public"} />
                            <ConditionRoute exact path='/investors' component={InvestorsPage} type={"public"} />
                            {/* <ConditionRoute exact path='/terms' component={TermsPage} type={"public"} /> */}
                            <ConditionRoute exact path='/privacy-policy' component={PrivacyPolicyPage} type={"public"} />
                            <ConditionRoute exact path='/business' component={BusinessPage} type={"public"} />
                            <ConditionRoute exact path='/listing' component={TokenListPage} type={"public"} />
                            <ConditionRoute exact path='/api' component={ApiPage} type={"public"} />
                            {/* <ConditionRoute exact path='/fees' component={FeesPage} type={"public"} /> */}
                            {/* <ConditionRoute exact path='/security' component={SecurityPage} type={"public"} /> */}
                            {/* <ConditionRoute exact path='/staking' component={StakingPage} type={"public"} /> */}
                            {/* CMS Page */}


                            <ConditionRoute exact path='/email-verification/:authToken' component={EmailVerification} type={"public"} />
                            <ConditionRoute exact path='/verify-old-email/:authToken' component={EmailVerification} type={"public"} />
                            <ConditionRoute exact path='/verify-new-email/:authToken' component={EmailVerification} type={"public"} />
                            <ConditionRoute exact path='/withdraw-fiat-verification/:authToken' component={EmailVerification} type={"public"} />
                            <ConditionRoute exact path='/withdraw-coin-verification/:authToken' component={EmailVerification} type={"public"} />
                            <ConditionRoute exact path='/withdraw-approve/:authToken' component={EmailVerification} type={"public"} />
                            <ConditionRoute exact path='/withdraw-cancel/:authToken' component={EmailVerification} type={"public"} />
                            {/* PUBLIC */}

                            {/* <Route exact path="/*" component={Home}>
                    <Redirect to="/home" />
                </Route> */}
                        </Switch>
                    </SocketContext.Provider>
                </BrowserRouter>
            </I18nextProvider>
        </Provider>
    )
}

export default App;