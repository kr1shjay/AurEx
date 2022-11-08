// import package
import React from 'react';
import ReactTooltip from 'react-tooltip';
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import clsx from 'classnames';
import { useTranslation } from 'react-i18next';

// import lib
import { capitalize } from '../../lib/stringCase'

const Security = () => {
    const { t, i18n } = useTranslation();

    // redux-state
    const accountData = useSelector(state => state.account);
    const { twoFAStatus } = accountData;

    return (
        <div className=" dashSecurityTable">
            <div class="table-responsive mari_topwithborder">
                <table className="table">
                    <tbody>
                        <tr>
                            <td>{t("TWO_FA")} <a data-tip data-for='clickme' data-event='click' className="ml-2"><i class="fas fa-info-circle"></i></a>
                                <ReactTooltip id='clickme' place='right' effect='solid' clickable={true}>{t("2FA_TOOL_TIP1")}</ReactTooltip>
                            </td>
                            <td className="text-right">
                                <i class={clsx({ "fas fa-check-circle enableGreen pl-2": twoFAStatus == 'enabled' }, { "fas fa-times-circle disabledRed pl-2": twoFAStatus == 'disabled' })}></i>
                                {capitalize(twoFAStatus)} [ <Link to="/security?url=2FA" className='pl-2'>{twoFAStatus == 'disabled' ? t("ENABLE_NOW") : t("DISABLE_NOW")}</Link> ]
                            </td>

                        </tr>
                        <tr>
                            <td>{t("LOGIN_PASSWORD")}</td>
                            <td className="text-right">[ <Link to="/security?url=password"> {t("UPDATE")}</Link> ]</td>

                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Security;