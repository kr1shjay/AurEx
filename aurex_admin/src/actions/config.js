let env = "prod" //dev //test //prod
let baseUrl;
// let baseUrl = "https://api.cluxchange.com/";
if (env == "ngrok") {
       baseUrl = "http://ef7a478bafd4.ngrok.io/";
}
if (env == "test") {
       // baseUrl = "http://http://128.199.129.139:2053/";
       baseUrl = "http://localhost:2053/";
}
if (env == "prod") {
       baseUrl = "https://api.cluxchange.com/";
       // baseUrl = "http://45.32.44.27:2053/";
       // baseUrl = "http://localhost:2053/";
}


module.exports = {
       baseUrl: baseUrl,
       imageUrl: baseUrl,
};
