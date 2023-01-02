let key = {};
// empty string
// if (process.env.NODE_ENV === "production") {
if (process.env.REACT_APP_MODE === "production") {
    console.log("Set Production Config")
    const API_URL = 'https://api.aurexchange.com';

    key = {
        secretOrKey: "FxUum76z",
        Recaptchakey: "6LeKwCYjAAAAAMbORefOGhr-1AAXaTNTkL7MBJrV", //local
        API_URL: API_URL,
        FRONT_URL: 'https://aurexchange.com',
        ADMIN_URL: 'https://contorls.aurexchange.com',
        getGeoInfo: "https://ipapi.co/json/",
    };

} 
else {
    console.log("Set Development Config")
    const API_URL = 'http://localhost';
    key = {
        secretOrKey: "FxUum76z",
        Recaptchakey: "6LeHezUfAAAAAE_uuY_HFN5HoEVsQv8bpyC3xTat", //local
        API_URL: `${API_URL}:2053`,
        TRADE_URL: 'http://54.211.230.83:8081/api/trade',

        getGeoInfo: "https://ipapi.co/json/",

        socialMedia: {
            facebook: {
                appId: "1034988646970193"
            },
            linkedIn: {
                clientId: '78szlpfkw7ee7s',
                redirectUrl: 'https://99893158a13c.ngrok.io/signup',
                oauthUrl: 'https://www.linkedin.com/oauth/v2/authorization?response_type=code',
                scope: 'r_liteprofile%20r_emailaddress',
                state: '123456'
            }
        },

    };
}

export default key;