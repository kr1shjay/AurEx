// import package
import React from 'react';
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next';
import clsx from 'classnames';
import { Link } from 'react-router-dom';

import Security from './Security';

// import lib
import { emailFormat } from '../../lib/stringCase'
import { userStatus } from '../../lib/displayStatus';

const UserDetail = () => {
    const { t, i18n } = useTranslation();

    // redux-state
    const accountData = useSelector(state => state.account);
    const { userId, profileImage, emailStatus, phoneStatus, phoneCode, phoneNo, type, email } = accountData;

    return (
        <div className="p2p_card min-h-auto">
            <h5 className="login_title_8 new_dashboard">{t("ACCOUNT")}</h5>
            <div className="dashUserDetails">
                {/* <div className="dudLeft">
                    <img src={profileImage} alt="" className="img-fluid" />
                    <a href="#"><i class="fas fa-pencil-alt"></i></a>
                </div> */}
                <div className="dudRight">
                    <ul>
                        <li>
                            <label>{t("USER_ID")} </label> <span>{userId}</span>
                        </li>
                        <li>
                            <label>{t("KYC_VERIFICATION")} </label> <span>{t(userStatus(type))}</span>
                        </li>
                        <li>
                            <label>{t("EMAIL")} <span>
                                <i class={clsx({ "fas fa-check-circle enableGreen pr-2": emailStatus == 'verified' }, { "fas fa-times-circle disabledRed pr-2": emailStatus == 'unverified' })}></i> {emailStatus} {emailFormat(email)}
                            </span></label>
                        </li>

                        <li>
                            <label>{t("MOBILE_PHONE")}

                                {
                                    phoneStatus == 'unverified' && <span><i class="fas fa-times-circle disabledRed pr-2"></i> {t("NOT_VERIFIED")} [ <Link to='/profile'>{t("VERIFY_NOW")}</Link> ]</span>
                                }

                                {
                                    phoneStatus == 'verified' && <span>+{phoneCode}{phoneNo}</span>
                                }

                            </label>
                        </li>


                    </ul>
                </div>
            </div>
            <Security />
        </div>
    )
}

export default UserDetail;