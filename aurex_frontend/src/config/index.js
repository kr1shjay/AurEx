let key = {};

if (process.env.REACT_APP_MODE === "production") {
    console.log("Set Production Config")
    const API_URL = 'https://api.cluxchange.com';
    key = {
        secretOrKey: "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3",
        CRYPTO_SECRET_KEY: "1234567812345678",
        RECAPTCHA_SITE_KEY: "6LfCM7kgAAAAAK8DAXuDJsqm3alreybJ2TKpPaU3", //local
        API_URL: 'https://api.cluxchange.com/',
        FRONT_URL: 'https://cluxchange.com/',
        ADMIN_URL: 'https://cluxchange.com/admin',
        SOCKET_URL: 'https://api.cluxchange.com/',
        getGeoInfo: "https://ipapi.co/json/",
        AUTHENTICATOR_URL: {
            PLAY_STORE: "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2",
            APP_STORE: "https://apps.apple.com/us/app/google-authenticator/id388497605",
        }
    };

}else if (process.env.REACT_APP_MODE === "demo") {
    console.log("Set Demo Config")
    const API_URL = 'https://aurex.maticz.com/api';

    key = {
        secretOrKey: "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3",
        CRYPTO_SECRET_KEY: "1234567812345678",
        RECAPTCHA_SITE_KEY: "6Lc0jA4jAAAAADmNtnnGw7Px86Pscz2sgpavPIcn", //local
        API_URL: 'https://aurex.maticz.com/api',
        FRONT_URL: 'https://aurex.maticz.com',
        ADMIN_URL: 'https://aurex.maticz.com/admin',
        SOCKET_URL: 'https://aurex.maticz.com',
        getGeoInfo: "https://ipapi.co/json/",
        AUTHENTICATOR_URL: {
            PLAY_STORE: "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2",
            APP_STORE: "https://apps.apple.com/us/app/google-authenticator/id388497605",
        }
    };

} else {
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