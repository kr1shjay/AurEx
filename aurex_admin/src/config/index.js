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

export default key;