let key = {};
//empty string
if (process.env.REACT_APP_MODE === "production") {
    console.log("Set the Production Config")
    const API_URL = 'https://api.aurexchange.com';
    key = {
        secretOrKey: "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3",
        CRYPTO_SECRET_KEY: "1234567812345678",
        RECAPTCHA_SITE_KEY: "6LeKwCYjAAAAAMbORefOGhr-1AAXaTNTkL7MBJrV", //local
        API_URL: 'https://api.aurexchange.com',
        FRONT_URL: 'https://aurexchange.com',
        ADMIN_URL: 'https://contorls.aurexchange.com',
        SOCKET_URL: 'https://api.aurexchange.com/',
        getGeoInfo: "https://ipapi.co/json/",
        AUTHENTICATOR_URL: {
            PLAY_STORE: "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2",
            APP_STORE: "https://apps.apple.com/us/app/google-authenticator/id388497605",
        }
    };
 }
 else {
    console.log("Set Development Config")
    // const API_URL = 'https://api.cluxchange.com/';
    const API_URL ='http://localhost'// 'http://localhost' 'http://192.168.0.124';  //http://192.168.29.63:3000/  http://192.168.0.124
    key = {
        secretOrKey: "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3",
        CRYPTO_SECRET_KEY: "1234567812345678",
        RECAPTCHA_SITE_KEY: "6LeHezUfAAAAAE_uuY_HFN5HoEVsQv8bpyC3xTat", //local
        API_URL: `${API_URL}:2053`,
        FRONT_URL: 'http://localhost', //'http://localhost:3000',
        ADMIN_URL: 'http://localhost:3001/admin',
        SOCKET_URL: `${API_URL}:2053`,
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