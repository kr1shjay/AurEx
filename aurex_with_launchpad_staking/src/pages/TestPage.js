// import package
import React, { memo, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    GoogleReCaptchaProvider,
    useGoogleReCaptcha
} from 'react-google-recaptcha-v3';

const MyAppp = () => {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const { t, i18n } = useTranslation();
    // Create an event handler so you can call the verification on button click event or form submit
    const handleReCaptchaVerify = async () => {
        if (!executeRecaptcha) {
            console.log('Execute recaptcha not yet available');
            return;
        }

        const token = await executeRecaptcha('yourAction');
        // Do whatever you want with the token
    }

    const onClicktest = () => {
        handleReCaptchaVerify()
    }

    // You can use useEffect to ttrigger the verification as soon as the component being loaded
    // useEffect(() => {
    //   handleReCaptchaVerify();
    // }, [handleReCaptchaVerify]);
    return (
        <GoogleReCaptchaProvider reCaptchaKey="6Ld9F-QcAAAAAD8m9qE00vekxCSzVwmU94L4eb8P">
       <button onClick={onClicktest}>{t('VERIFY_RECAPTCHA')}</button>;
        </GoogleReCaptchaProvider>
    );
    return <button onClick={onClicktest}>Verify recaptcha</button>;
};

export default MyAppp
// export default function App() {
//     return (
//         <GoogleReCaptchaProvider reCaptchaKey="6Ld9F-QcAAAAAD8m9qE00vekxCSzVwmU94L4eb8P">
//             <MyAppp />
//         </GoogleReCaptchaProvider>
//     );
// }
