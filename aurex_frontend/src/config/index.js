let key = {};

if (process.env.REACT_APP_MODE === "production") {
    console.log("Set Production Config")
    const API_URL = 'https://api.cluxchange.com';
    key = {
        secretOrKey: "dZ@fD#%WqPQcGSa34QYF1W72uac7jYLk",
        CRYPTO_SECRET_KEY: "1234567812345678",
        RECAPTCHA_SITE_KEY: "6LeKwCYjAAAAAMbORefOGhr-1AAXaTNTkL7MBJrV", //local
        API_URL: 'https://api.aurexchange.com/',
        FRONT_URL: 'https://aurexchange.com/',
        ADMIN_URL: 'https://controls.aurexchange.com',
        SOCKET_URL: 'https://api.aurexchange.com/',
        getGeoInfo: "https://ipapi.co/json/",
        AUTHENTICATOR_URL: {
            PLAY_STORE: "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2",
            APP_STORE: "https://apps.apple.com/us/app/google-authenticator/id388497605",
        }
    };

}


export default {
    ...key,
    ...{ SITE_DETAIL: require('./siteConfig').default }
};