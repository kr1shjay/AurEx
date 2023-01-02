// import package
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import queryString from 'query-string';
import clsx from 'classnames';

// import component
import ChangePassword from '../ChangePassword';
import TwoFA from '../TwoFA';

const Security = () => {
    const location = useLocation();
    const query = queryString.parse(location.search);

    // state
    const [activeTab, setActiveTab] = useState('2FA')

    // function
    // useEffect(() => {
    //     if (query && query.url) {
    //         setActiveTab(query.url)
    //     }
    // }, [query])
    useEffect(() => {
        if (query && query.url) {
            setActiveTab(query.url)
        }
    }, [])

    return (
        <div className="table_p2p_section inprofile cion_table_sectio">
            <div className="d-flex justify-content-between">
                <ul class="nav nav-tabs ">
                    <li
                        className={clsx({ "active": activeTab == '2FA' })}
                        onClick={() => setActiveTab('2FA')}
                    >
                        <a data-toggle="tab" className={clsx({ "active": activeTab == '2FA' })} href="#twofactor">2 Step Authentication</a>
                    </li>
                    <li
                        className={clsx({ "active": activeTab == 'password' })}
                        onClick={() => setActiveTab('password')}
                    >
                        <a data-toggle="tab" className={clsx({ "active": activeTab == 'password' })} href="#loginpassword">Update Login Password</a>
                    </li>
                </ul>
            </div>
            <div class="tab-content">
                <div id="twofactor"
                    className={clsx('tab-pane mt-3 fade', { "in active show": activeTab == '2FA' })}
                >
                    <TwoFA />
                </div>
                <div id="loginpassword"
                    className={clsx('tab-pane mt-3 fade', { "in active show": activeTab == 'password' })}
                >
                    <ChangePassword />
                </div>
            </div>
        </div >
    )
}

export default Security;