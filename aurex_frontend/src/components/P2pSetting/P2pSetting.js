// import package
import React, { useState, useEffect } from 'react';
import { Switch } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next';
// import action
import { editNotif } from '../../actions/dashboardAction';

// import lib
import isEmpty from '../../lib/isEmpty';

const initialFormValue = {
    "sellVacation": false,
    "buyVacation": false,
}

const P2pSetting = () => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    // state
    const [formValue, setFormValue] = useState(initialFormValue);

    const { sellVacation, buyVacation } = formValue;

    // redux-state
    const userSetting = useSelector(state => state.userSetting)

    // function
    const handleChange = (e) => {
        e.preventDefault();
        const { name, checked } = e.target;
        setFormValue({ ...formValue, ...{ [name]: checked } })
        editNotif({
            name,
            checked
        }, dispatch)
    }

    useEffect(() => {
        if (!isEmpty(userSetting)) {
            setFormValue({
                'sellVacation': userSetting.sellVacation,
                'buyVacation': userSetting.buyVacation,
            })
        }
    }, [userSetting])

    return (
        <div className="p2p_card min-h-auto dashAlertNotification">
            <h5 class="login_title_8 mb-0">{t('VACATION')}</h5>
            <ul>
                <li>
                    <label>{t('DISABLE_ALL_ADVERTISMENT_SELL')}</label>
                    <Switch
                        checked={sellVacation}
                        onChange={handleChange}
                        color="primary"
                        name="sellVacation"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                </li>
                <li>
                    <label>{t('DISABLE_ALL_ADVERTISMENT_BUY')}</label>
                    <Switch
                        checked={buyVacation}
                        onChange={handleChange}
                        color="primary"
                        name="buyVacation"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                </li>
            </ul>
        </div>
    )
}

export default P2pSetting;