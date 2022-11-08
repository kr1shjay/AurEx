// import package
import React, { useState, useEffect } from "react";
import { Switch } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// import action
import { editNotif } from "../../actions/dashboardAction";

// import lib
import isEmpty from "../../lib/isEmpty";
import { toastAlert } from "../../lib/toastAlert";

const initialFormValue = {
    twoFA: false,
    passwordChange: false,
    siteNotification: false,
};

const Notification = () => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    // state
    const [formValue, setFormValue] = useState(initialFormValue);

    const { twoFA, passwordChange, siteNotification } = formValue;

    // redux-state
    const userSetting = useSelector((state) => state.userSetting);

    // function
    const handleChange = async (e) => {
        e.preventDefault();
        const { name, checked } = e.target;
        setFormValue({ ...formValue, ...{ [name]: checked } });
        const { status, message } = await editNotif(
            {
                name,
                checked,
            },
            dispatch
        )
        if (status == "success") {
            toastAlert("success", message);
        } else {
            toastAlert("error", message);
        }
    };

    useEffect(() => {
        if (!isEmpty(userSetting)) {
            setFormValue({
                twoFA: userSetting.twoFA,
                passwordChange: userSetting.passwordChange,
                siteNotification: userSetting.siteNotification,
            });
        }
    }, [userSetting]);
    return (
        <div className="p2p_card min-h-auto dashAlertNotification">
            <h5 class="login_title_8 mb-0">{t("ALERT")}</h5>
            <ul>
                <li>
                    <label>{t("WHEN_ENABLE_DISABLE_2FA")}</label>
                    <Switch
                        checked={twoFA}
                        onChange={handleChange}
                        color="primary"
                        name="twoFA"
                        inputProps={{ "aria-label": "primary checkbox" }}
                    />
                </li>
                <li>
                    <label>{t("WHEN_LOGIN_PWD_CHG")}</label>
                    <Switch
                        checked={passwordChange}
                        onChange={handleChange}
                        color="primary"
                        name="passwordChange"
                        inputProps={{ "aria-label": "primary checkbox" }}
                    />
                </li>
                {/* <li>
                    <label>{t("MARKTING_PROMOTION_EMAIL")}</label>
                    <Switch
                        checked={siteNotification}
                        onChange={handleChange}
                        color="primary"
                        name="siteNotification"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                </li> */}
            </ul>
        </div>
    );
};

export default Notification;
