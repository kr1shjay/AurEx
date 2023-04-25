let env = "prod" //dev //test //prod
let baseUrl;

if (env == "ngrok") {
       baseUrl = "http://ef7a478bafd4.ngrok.io/";
}
if (env == "test") {
       baseUrl = "http://localhost:2053/";
}


module.exports = {
       baseUrl: baseUrl,
       imageUrl: baseUrl,
};
