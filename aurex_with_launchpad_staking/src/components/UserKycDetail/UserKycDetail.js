// import package
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'classnames';
import { useSelector } from 'react-redux'

// import component
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// import lib
import { kycStatus, userStatus } from '../../lib/displayStatus';
import isEmpty from '../../lib/isEmpty';

const UserKycDetail = () => {
    const { t, i18n } = useTranslation();

    // redux-state
    const { idProof, addressProof } = useSelector(state => state.userKyc);
    const accountData = useSelector(state => state.account);
    const { userId, firstName, lastName, email, emailStatus, phoneStatus, phoneCode, phoneNo, type, createAt, bankDetail } = accountData;

    return (
        <div className="">
            <div className="kycTopCard">
                <h3 className='mt-3'>{firstName}{' '}{lastName}</h3>
                <p><label>{t("USER_ID")}:</label> {userId} <label>{t("MEMBER_SINCE")}:</label> {createAt} </p>
                {/* <h5>
                    <label>{t("VERIFICATION_TYPE")}</label>
                    <span className={clsx({
                        "kycTypeGreen": ['basic_verified', 'advanced', 'pro'].includes(type),
                        'kycTypeRed': ['basic_pending', 'basic_submitted', 'advanced_processing', 'pro_processing'].includes(type)
                    })}>{type && t(userStatus(type))}</span>
                </h5> */}
            </div>
            <div className="kycBottomCard">
                <GridContainer>
                    <GridItem xs={12} sm={12} md={4} lg={4}>
                        <div className="kycCardStatus">
                            <div className="profileDetailView">
                                <ul>
                                    <li><label>{t('EMAIL')}</label> <span>{email} <i class={clsx({ "fas fa-check-circle enableGreen pl-2": emailStatus == 'verified' }, { "fas fa-times-circle disabledRed pl-2": emailStatus == 'unverified' })}></i></span></li>
                                    <li><label>{t('PHONE')}</label>
                                        <span>
                                            {
                                                phoneStatus && phoneStatus == 'unverified' && <span className='ml-0'>{t('NOT_VERIFIED')}</span>
                                            }

                                            {
                                                phoneStatus && phoneStatus == 'verified' && <span>+{phoneCode}{phoneNo}</span>
                                            } <i class={clsx({ "fas fa-check-circle enableGreen pl-2": phoneStatus == 'verified' }, { "fas fa-times-circle disabledRed pl-2": phoneStatus == 'unverified' })}></i>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6} lg={6}>
                        <div className="kycCardStatus labelWidth">
                            <div className="profileDetailView">
                                <ul>
                                    <li>
                                        <label>{t('ID_DOCUMENT')}</label>
                                        <span>{idProof.status == "rejected" ? `${t(kycStatus(idProof.status))}  : ${idProof.reason}` : t(kycStatus(idProof.status))} <i className={clsx({ "fas fa-check-circle enableGreen pl-2": idProof.status == 'approved' }, { "fas fa-times-circle disabledRed pl-2": ['new', 'pending', 'rejected'].includes(idProof.status) })}></i></span>
                                    </li>
                                    <li>
                                        <label>{t('ADDRESS_PROOF')}</label>
                                        <span>{addressProof.status == "rejected" ? `${t(kycStatus(addressProof.status))}  : ${addressProof.reason}` : t(kycStatus(addressProof.status))} <i className={clsx({ "fas fa-check-circle enableGreen pl-2": addressProof.status == 'approved' }, { "fas fa-times-circle disabledRed pl-2": ['new', 'pending', 'rejected'].includes(addressProof.status) })}></i></span>
                                    </li>
                                    {/* <li>
                                        <label>Advanced User Verification:</label>
                                        {
                                            type != 'advanced_verified' && <span>{t("NOT_VERIFIED")}</span>
                                        }
                                        {
                                            ['advanced_verified', 'pro_verified'].includes(type) && <span>{t("VERIFIED")}</span>
                                        }

                                    </li>
                                    <li>
                                        <label>Pro User Verification:</label>
                                        {
                                            type != 'pro_verified' && <span>{t("NOT_VERIFIED")}</span>
                                        }
                                        {
                                            ['pro_pending', 'pro_verified'].includes(type) && <span>{t("VERIFIED")}</span>
                                        }
                                    </li> */}
                                </ul>
                            </div>
                            {/* <h6>{t("ID_ADDRESS_PROOF")}f</h6> */}

                            {/* Address Proof Pending Verified */}
                            {/* Advanced user verification: Pending/Verified */}
                            {/* Pro user verification: Pending/Verified */}
                            {/* <ul>
                                <li>
                                    <label>ID document:</label><span>Not verified</span>

                                </li>
                                {
                                    idProof && idProof.status == 'new' && <li>
                                        <label>{t("NOT_APPLY")}</label>
                                    </li>
                                }



                                {
                                    idProof && idProof.status != 'new' && <li>
                                        <label>{t(documentType(idProof.type))}</label>
                                        <span>
                                            <i className={clsx({ "fas fa-check-circle enableGreen": idProof.status == 'approved' }, { "fas fa-times-circle disabledRed": ['pending', 'rejected'].includes(idProof.status) })}></i>{' '}
                                            {t(documentStatus(idProof.status))}
                                        </span>
                                    </li>
                                }


                                {
                                    addressProof && addressProof.status == 'new' && <li>
                                        <label>{t("NOT_APPLY")}</label>
                                    </li>
                                }

                                {
                                    addressProof && addressProof.status != 'new' && <li>
                                        <label>{t(documentType(addressProof.type))}</label>
                                        <span>
                                            <i className={clsx({ "fas fa-check-circle enableGreen": addressProof.status == 'approved' }, { "fas fa-times-circle disabledRed": ['pending', 'approved', 'rejected'].includes(addressProof.status) })}></i>{' '}
                                            {t(documentStatus(addressProof.status))}
                                        </span>
                                    </li>
                                }

                            </ul> */}
                        </div>
                    </GridItem>
                    {/*<GridItem xs={12} sm={12} md={4} lg={4}>
                        {
                            !isEmpty(bankDetail) && <div className="kycCardStatus">
                                <h6>{t("DEFAULT_BANK_ACCOUNT_DETAIL")}</h6>
                                <ul>
                                    <li><label>{bankDetail.bankName}</label>
                                        <span><i class="fas fa-check-circle enableGreen"></i> {t('VERIFIED')}</span>
                                    </li>
                                    <li><label>{bankDetail.accountNo},</label></li>
                                    <li><label>{bankDetail.city}, {bankDetail.country}</label></li>
                                </ul>
                            </div>
                        }

                    </GridItem>*/}
                </GridContainer>
            </div>
        </div>
    )
}

export default UserKycDetail;