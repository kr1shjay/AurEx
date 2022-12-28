// import package
import express from 'express';
import passport from 'passport';
import morgan from 'morgan';
import cors from 'cors';
import http from 'http'
import https from 'https'
import bodyParser from 'body-parser';

// import config
import config from './config';
import dbConnection from './config/dbConnection';
import { createSocketIO } from './config/socketIO';
import './config/cron';

// import routes
import adminApi from './routes/admin.route';
import userApi from './routes/user.route';
import testApi from './routes/test.route';
import v1Api from './routes/v1.route'

// import controller
import * as priceCNVCtrl from './controllers/priceCNV.controller';
import * as binanceCtrl from './controllers/binance.controller';
import * as bybitCtrl from './controllers/bybit.controller';
import * as cloudinaryCtrl from './controllers/cloudinary.controller';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';


const app = express();
app.use(morgan("dev"))
app.use(cors());

var ip = require('ip');
var fs = require('fs');
var myip = ip.address();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(passport.initialize());

// include passport stratagy
require("./config/passport").usersAuth(passport)
require("./config/passport").adminAuth(passport)

app.use(express.static(__dirname + '/public'));

// coin
app.get('/test', (req, res) => {
  console.log('successfully')
})


app.use('/adminApi', adminApi)
app.use('/api', userApi)
app.use('/testApi', testApi)
app.use('/api/v1', v1Api)



// const RateLimit = require("express-rate-limit");
// const RedisStore = require("rate-limit-redis");

// const limiter = new RateLimit({
//   store: new RedisStore({
//     // see Configuration
//   }),
//   max: 5, // limit each IP to 100 requests per windowMs
//   delayMs: 0, // disable delaying - full speed until the max limit is reached
// });

// app.get('/testAPI', limiter, (req, res) => {
//   return res.send("Successfully Testing")
// })


app.get('/testAPI', (req, res) => {
  return res.send("Successfully Testing")
})


if (myip == '139.162.66.242') {
  const options = {
    key: fs.readFileSync('/var/www/sslkeys/aurexchange_com.key'),
    cert: fs.readFileSync('/var/www/sslkeys/aurexchange_com.csr')
  };
  var server = https.createServer(options, app);
}
else {
  var server = http.createServer(app);
}




app.get('/', function (req, res) {
  res.json({ status: true });
});

createSocketIO(server)

// DATABASE CONNECTION
dbConnection((done) => {
  if (done) {
    server = server.listen(config.PORT, function () {
      console.log('\x1b[34m%s\x1b[0m', `server is running on port ${config.PORT}`);
    });
  }
})

