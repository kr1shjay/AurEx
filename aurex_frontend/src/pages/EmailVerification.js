import React, { useEffect, useState } from "react";
import {
    useParams,
    useHistory,
    useLocation
} from "react-router-dom";
import { useTranslation } from 'react-i18next';

// import action
import {
    userEmailActivation,
    verifyOldEmail,
    verifyNewEmail
} from '../actions/users';
import { fiatRequestVerify, coinRequestVerify, coinWithdrawApprove, coinWithdrawCancel } from '../actions/walletAction'


// import lib
import { toastAlert } from "../lib/toastAlert";

const EmailVerification = (props) => {
    const { authToken } = useParams();
    const { t, i18n } = useTranslation();
    const history = useHistory();
    const location = useLocation();

    // state
    const [page, setPage] = useState('loading')

    // function
    const emailActivation = async () => {
        const { status, message } = await userEmailActivation({ userId: authToken });
        if (status == 'success') {
            history.push("/login");
            toastAlert('success', message, 'emailActivation', 'TOP_CENTER');
        } else if(status == 'failed') {
            history.push("/login");
            toastAlert('error', message, 'emailActivation', 'TOP_CENTER');
        }
        else {
            setPage('error');
        }
    }

    const verifOldEmail = async () => {
        const { status, message } = await verifyOldEmail({ token: authToken });
        if (status == 'success') {
            history.push("/login");
            toastAlert('success', message, 'verifyOldEmail');
        } else {
            setPage('error');
        }
    }

    const verifNewEmail = async () => {
        const { status, message } = await verifyNewEmail({ token: authToken });
        if (status == 'success') {
            history.push("/login");
            toastAlert('success', message, 'verifyNewEmail');
        } else {
            setPage('error');
        }
    }

    const acceptFiatRequest = async () => {
        try {
            const { status, message } = await fiatRequestVerify({ token: authToken });
            if (status == 'success') {
                history.push("/wallet");
                toastAlert('success', t(message), 'withdrawRequest');
            } else {
                toastAlert('error', t(message), 'withdrawRequest');
                setPage('error');
            }
        }
        catch (err) {
            setPage('error');
        }
    }

    const acceptCoinRequest = async () => {
        try {
            const { status, message } = await coinRequestVerify({ token: authToken });
            if (status == 'success') {
                history.push("/wallet");
                toastAlert('success', t(message), 'withdrawRequest');
            } else {
                toastAlert('error', t(message), 'withdrawRequest');
                setPage('error');
            }
        }
        catch (err) {
            setPage('error');
        }
    }

    const withdrawApprove = async () => {
        try {
            const { status, message } = await coinWithdrawApprove({ token: authToken });
            if (status == 'success') {
                history.push("/wallet");
                toastAlert('success', t(message), 'withdrawRequest');
            } else {
                toastAlert('error', t(message), 'withdrawRequest');
                setPage('error');
            }
        }
        catch (err) {
            setPage('error');
        }
    }

    const WithdrawCancel = async () => {
        try {
            const { status, message } = await coinWithdrawCancel({ token: authToken });
            if (status == 'success') {
                history.push("/wallet");
                toastAlert('success', t(message), 'withdrawRequest');
            } else {
                toastAlert('error', t(message), 'withdrawRequest');
                setPage('error');
            }
        }
        catch (err) {
            setPage('error');
        }
    }

    useEffect(() => {
        let pathname = location.pathname;
        if (pathname == '/email-verification/' + authToken) {
            emailActivation();
        } else if (pathname == '/verify-old-email/' + authToken) {
            verifOldEmail();
        } else if (pathname == '/verify-new-email/' + authToken) {
            verifNewEmail();
        } else if (pathname == '/withdraw-fiat-verification/' + authToken) {
            acceptFiatRequest()
        } else if (pathname == '/withdraw-coin-verification/' + authToken) {
            acceptCoinRequest()
        } else if (pathname == '/withdraw-approve/' + authToken) {
            withdrawApprove()
        } else if (pathname == '/withdraw-cancel/' + authToken) {
            WithdrawCancel()
        }
    }, [])

    return (
        <>
            {
                page == 'loading' && <p>{t('LOADING')}</p>
            }
            {
                page == 'error' && <p>{t('INVALID_URL')}</p>
            }
        </>
    )


}

export default EmailVerification;