let key = {};
// if (process.env.NODE_ENV === "production") {
if (process.env.REACT_APP_MODE === "production") {
    // console.log("Set Production Config")
    const API_URL = 'https://deepliquidity.exchange';

    key = {
        secretOrKey: "FxUum76z",
        Recaptchakey: "6Lf-oQAaAAAAAHsxE5WyOHwmKav2lOfeL5KeA7AV", //local
        API_URL: `${API_URL}/deepliquidityapi`,
        FRONT_URL: 'https://deepliquidity.exchange/Deepliquidity',
        ADMIN_URL: 'https://deepliquidity.exchange/Deepliquidity/admin',
        TRADE_URL: 'https://java.deepliquidity.exchange/api/trade',
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

} else {
    console.log("Set Development Config")
    const API_URL = 'http://localhost';
    key = {
        secretOrKey: "FxUum76z",
        Recaptchakey: "6LdpeoQUAAAAAHwFEDfpcA-W5-leSH8548lZWWeb", //local
        API_URL: `${API_URL}:3001/deepliquidityapi`,
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