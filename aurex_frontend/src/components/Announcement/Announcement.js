// import package
import React from 'react';
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next';

// import lib
import { dateTimeFormat ,momentFormat} from '../../lib/dateTimeHelper'
import isEmpty from '../../lib/isEmpty';

const Announcement = () => {
    const { t, i18n } = useTranslation();

    // redux-state
    const accountData = useSelector(state => state.account);
    const anncData = useSelector(state => state.announcement);

    const { loginHistory } = accountData;

    return (
        <ul className="profile_dash">

            {
                anncData && anncData.length > 0 && !isEmpty(anncData[0]) && <li>{anncData[0].content} - <span>{t("ADMIN_ANNOUNCEMENT")}</span></li>
            }

            {
                !isEmpty(loginHistory) && <li>{momentFormat(loginHistory.createdDate, 'DD-MM-YYYY HH:mm')}, {loginHistory.broswername}, {loginHistory.ipaddress}  - <span>{t("LAST_LOGIN")}</span></li>
            }

        </ul>

    )
}

export default Announcement;