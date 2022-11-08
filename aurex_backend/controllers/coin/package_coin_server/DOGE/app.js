var express = require('express');
var ip = require('ip');
const bitcoin_rpc = require('node-bitcoin-rpc');
var bodyParser = require('body-parser')

var myip = ip.address();
console.log(myip);
var app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json


app.use(bodyParser.json())
app.post('/btcnode', function (req, res) {
  console.log(req.body);
  var host = '127.0.0.1';
  var port = 8332;
  var username = 'PVsdsknuihwuhe2w';
  var password = "Kvwsxbdqwhdqwiqu2";
  var type = req.body.type;
  if (type == 'getnewaddress') {
    console.log(req.body);
    var email = req.body.email;
    var argmns = [email];
    console.log(argmns, 'argmnsargmns');
  }
  else if (type == 'getbalance') {
    var argmns = [];
  }
  else if (type == 'listtransactions') {
    var argmns = [];
  }
  else if (type == 'sendtoaddress') {
    var amount = parseFloat(req.body.amount);
    var toaddress = req.body.toaddress;
    var argmns = [toaddress, amount];
  }
  bitcoin_rpc.init(host, port, username, password)
  bitcoin_rpc.call(type, argmns, function (err, address) {
    console.log(err, 'err', address, 'adress')
    if (!err) {
      res.json(address);
    }
  })
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "I am using babel in NodeJS",
    status: "success",
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


