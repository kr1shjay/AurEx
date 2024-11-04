// import package
import axios from "axios";
import https from "https";
import converter from "hex2dec";
import querystring from "querystring";
import Web3 from "web3";
import { Transaction } from "@ethereumjs/tx";
import Common from "@ethereumjs/common";
import mongoose from "mongoose";

//controller
import { createPassBook } from "../passbook.controller";

// import new modal
import { Currency, User, Wallet, UserReference } from "../../models";

// import modal
import Assets from "../../models/Assets";
import TransactionDB from "../../models/Transaction";

// import config
import config from "../../config";

// import lib
import { encryptString, decryptString } from "../../lib/cryptoJS";
import isEmpty from "../../lib/isEmpty";
// import isJsonParse from "../../lib/isJsonParse";

const web3 = new Web3(config.COIN_GATE_WAY.BNB.URL);
const ObjectId = mongoose.Types.ObjectId;

export const createAddress = async () => {
  try {
    let account = await web3.eth.accounts.create();
    return {
      status: true,
      address: account.address,
      privateKey: account.privateKey,
    };
    return account;
  } catch (err) {
    return {
      status: false,
    };
  }
};

export const deposit = async (userId) => {
  console.log("BNB Deposit Cron... etnter ...........", userId);
  try {
    let userWalletData = await Wallet.findOne({ userId: userId }).populate(
      "_id"
    );
    let walletData = userWalletData.assets.find((el) => el.coin == "BNB");
    let walletCurrency = await Currency.findOne({ _id: walletData._id });
    console.log(walletCurrency, "walletCurrencywalletCurrencyBNB");

    const latest = await web3.eth.getBlockNumber();
    var startBlock = config.COIN_GATE_WAY.BNB.START_BLOCK;
    var currentBlock = walletData.blockNo > 0 ? walletData.blockNo : startBlock;
    if (walletData.address) {
      let url = config.COIN_GATE_WAY.BNB.DEPOSIT_URL.replace(
        "##USER_ADDRESS##",
        walletData.address
      )
        .replace("##START_BLOCK##", currentBlock)
        .replace("##END_BLOCK##", latest);
      let respData = await axios({
        url: url,
        method: "post",
      });
      console.log(url, "BNB-URL");
      if (respData && respData.data && respData.data.status == "1") {
        for (let y in respData.data.result) {
          var result = respData.data.result[y];

          let userAssetData = await Wallet.findOne({
            "assets.address": {
              $regex: new RegExp(".*" + result.to.toLowerCase() + ".*", "i"),
            },

            "assets.coin": "BNB",
          });
          if (userAssetData) {
            let transactionExist = await TransactionDB.findOne({
              txid: result.hash,
            });
            console.log(transactionExist, "transactionExist-BNB");
            let amount = parseInt(result.value, 10) / 1000000000000000000;
            console.log(
              parseFloat(amount) >= parseFloat(walletCurrency.depositminlimit),
              "parseFloat(amount) >= parseFloat(walletCurrency.depositminlimit-BNB)"
            );

            if (
              !transactionExist &&
              parseFloat(amount) >= parseFloat(walletCurrency.depositminlimit)
            ) {
              const { status } = await bnbMovetoAdmin({
                amount: amount,
                // amount: parseInt(result.value) ,
                useraddress: walletData.address,
                userprivatekey: walletData.privateKey,
                adminAddress: config.COIN_GATE_WAY.BNB.ADDRESS,
              });
              console.log(status, "BNB-status");
              if (status) {
                //referralcommission
                let UserB = await TransactionDB.find({
                  $and: [
                    { userId: userId },
                    { paymentType: { $in: ["coin_deposit", "fiat_deposit"] } },
                  ],
                });
                if (isEmpty(UserB)) {
                  let userData = await User.findOne(
                    { userId: userId },
                    { _id: 1 }
                  );

                  let referTable = await UserReference.find({
                    "referChild._id": userData._id,
                  });
                }

                let transaction = new TransactionDB({
                  userId: userId,
                  currencyId: walletCurrency._id,
                  fromAddress: result.from,
                  toAddress: result.to,
                  txid: result.hash,
                  coin: "BNB",
                  paymentType: "coin_deposit",
                  amount: amount,
                  status: "completed",
                });
                //User insert
                let tran = await transaction.save();

                let userData = await Wallet.findOne({
                  userId: userId,
                });
                console.log(userData, "---------004BNB");
                let AssetData = userData.assets.id(walletData._id);
                console.log(AssetData, "---------005BNB");

                let beforeBalance = parseFloat(AssetData.spotBal);
                AssetData.spotBal =
                  parseFloat(AssetData.spotBal) + parseFloat(amount);
                let WalletData = await userData.save();
                console.log(WalletData, "---------006BNB");
                // CREATE PASS_BOOK
                createPassBook({
                  userId: userData._id,
                  coin: "BNB",
                  currencyId: walletCurrency._id,
                  tableId: transaction._id,
                  beforeBalance: beforeBalance,
                  afterBalance: parseFloat(AssetData.spotBal),
                  amount: parseFloat(amount),
                  type: "coin_deposit",
                  category: "credit",
                });
              }
            }
          }
        }
      }
    }
  } catch (err) {
    //  res.status(200).json({"message":"errr"})
    console.log("Erron on BNB Deposit ", err);
  }
};

export const bnbMovetoAdmin = async ({
  amount,
  useraddress,
  userprivatekey,
  adminAddress,
}) => {
  try {
    console.log("BNB Amount Move to Admin");
    var userprivatekey = decryptString(userprivatekey);
    web3.eth.accounts.wallet.add(userprivatekey);
    let balance = await web3.eth.getBalance(useraddress);
    let getGasPrice = await web3.eth.getGasPrice();
    let txCount = await web3.eth.getTransactionCount(useraddress);
    // var gaslimit = web3.utils.toHex(21000);
    var gaslimit = await web3.eth.estimateGas({
      from: useraddress,
      to: adminAddress,
      value: toFixedNumber(amount * 1000000000000000000).toString(),
    });
    var fee = web3.utils.toHex(getGasPrice) * gaslimit;

    amount = toFixedNumber(amount * 1000000000000000000 - fee);
    console.log(balance, "balancebalancebalanceBNB");
    console.log(amount, "amountamountamountBNB");
    console.log(balance > amount, "balance > amountBNB");
    if (balance > amount) {
      var updateVal = {};
      // const txObject = {
      //   nonce: web3.utils.toHex(txCount),
      //   gasLimit: web3.utils.toHex(gaslimit),
      //   gasPrice: web3.utils.toHex(getGasPrice),
      //   to: adminAddress.toString(),
      //   // value: "0x1e18",
      //   value: web3.utils.toHex(amount),
      // };
      // const common = await Common.forCustomChain(
      //   "mainnet",
      //   {
      //     name: "bnb",
      //     networkId: config.COIN_GATE_WAY.BNB.NETWORK_ID,
      //     chainId: config.COIN_GATE_WAY.BNB.CHAIN_ID,
      //   },
      //   "petersburg"
      // );

      // const tx = Transaction.fromTxData(txObject, {
      //   common,
      // });
      // const privateKey = Buffer.from(userprivatekey.substring(2, 66), "hex");

      // const signedTx = tx.sign(privateKey);

      // const serializedTx = signedTx.serialize();

      // const raw1 = "0x" + serializedTx.toString("hex");

      // let responseData = await web3.eth.sendSignedTransaction(raw1);

      let responseData = await web3.eth.sendTransaction({ from: useraddress, to: adminAddress, value: amount.toString(), gas: gaslimit, getGasPrice });
      console.log(responseData, "responseDataresponseDataBNB");
      web3.eth.accounts.wallet.remove(userprivatekey);
      return {
        status: true,
        message: "success",
      };
    } else {
      web3.eth.accounts.wallet.remove(userprivatekey);
      console.log("USER BNB BALNCE NOT FOUND");
      return {
        status: false,
        message: "No Balance",
      };
    }
  } catch (err) {
    web3.eth.accounts.wallet.remove(userprivatekey);
    console.log(err, "Amount Move to Admin Catch Error");
    return {
      status: false,
      message: "Catch Error",
    };
  }
};

export const bnbMovetoUser = async ({
  amount,
  adminAddress,
  adminPrivatekey,
  userAddress,
}) => {
  try {

    console.log("BNB Amount Move to User");
    var adminPrivatekey = decryptString(adminPrivatekey);
    web3.eth.accounts.wallet.add(adminPrivatekey);
    // var adminPrivatekey = adminPrivatekey

    console.log(
      amount,
      "amountBNB",
      adminAddress,
      "adminAddressBNB",
      adminPrivatekey,
      "adminPrivatekeyBNB",
      userAddress,
      "userAddressBNB"
    );
    let balance = await web3.eth.getBalance(adminAddress);
    let getGasPrice = await web3.eth.getGasPrice();
    let txCount = await web3.eth.getTransactionCount(adminAddress);
    // var gaslimit = web3.utils.toHex(21000);
    var gaslimit = await web3.eth.estimateGas({
      from: adminAddress,
      to: userAddress,
      value: toFixedNumber(amount * 1000000000000000000).toString(),
    });
    var fee = web3.utils.toHex(getGasPrice) * gaslimit;
    // var amount1 = amount * 1000000000000000000 - fee;
    var amount1 = amount * 1000000000000000000;
    // amount = amount * 1000000000000000000;

    // Convert to wei value

    console.log(
      balance,
      "balanceBNB",
      amount1,
      "amount---------------------------------------"
    );
    console.log(balance > amount1, "balance > amount1BNB");
    if (balance > amount1) {
      // const amountToSend = web3.toWei(amount1, "ether");

      // var updateVal = {};
      // const txObject = {
      //   nonce: web3.utils.toHex(txCount),
      //   gasLimit: web3.utils.toHex(gaslimit),
      //   gasPrice: web3.utils.toHex(getGasPrice),
      //   to: userAddress.toString(),
      //   value: web3.utils.toHex(amount1),
      // };
      // console.log(txObject, "txobjecttttttttttttttttttBNB");
      // const common = await Common.forCustomChain(
      //   "mainnet",
      //   {
      //     name: "bnb",
      //     networkId: config.COIN_GATE_WAY.BNB.NETWORK_ID,
      //     chainId: config.COIN_GATE_WAY.BNB.CHAIN_ID,
      //   },
      //   "petersburg"
      // );
      // // console.log(common,'commoncommoncommoncommon')

      // const tx = Transaction.fromTxData(txObject, { common });
      // // console.log(tx,'txtxtx')

      // const privateKey = Buffer.from(adminPrivatekey.substring(2, 66), "hex");
      // const signedTx = tx.sign(privateKey);

      // const serializedTx = signedTx.serialize();

      // const raw1 = "0x" + serializedTx.toString("hex");

      // let responseData = await web3.eth.sendSignedTransaction(raw1);
      let responseData = await web3.eth.sendTransaction({ from: adminAddress, to: userAddress, value: amount1.toString(), gas: gaslimit, getGasPrice });
      var recamount = web3.utils.fromWei(
        amount1.toString(),
        // amount1,
        "ether"
      );
      web3.eth.accounts.wallet.remove(adminPrivatekey);
      return {
        status: true,
        message: "Withdraw successfully",
        trxId: responseData.transactionHash,
      };
    } else {
      console.log("ther is no balance check it");
      web3.eth.accounts.wallet.remove(adminPrivatekey);
      return {
        status: false,
        message: "BNB No Balance",
      };
    }
  } catch (err) {
    console.log(err, "errerrerrerrerrerrerr");
    web3.eth.accounts.wallet.remove(adminPrivatekey);
    return {
      status: false,
      message: err.toString(),
    };
  }
};

export const tokenDeposit = async (userId, currencySymbol) => {
  console.log("BNB Token Deposit Cron...", userId, currencySymbol);
  try {
    let userWalletData = await Wallet.findOne({ userId: userId }).populate(
      "_id"
    );
    let walletData = userWalletData.assets.find(
      (el) => el.coin == currencySymbol
    );
    console.log(walletData, "walletDataBNB");
    let walletCurrency = await Currency.findOne({ _id: walletData._id });
    const latest = await web3.eth.getBlockNumber();
    var startBlock = config.COIN_GATE_WAY.BNB.START_BLOCK;
    var currentBlock = walletData.blockNo > 0 ? walletData.blockNo : startBlock;
    console.log(
      walletData.address,
      walletData.coin,
      "currencyAddresscurrencyAddressBNB"
    );
    if (walletData.address) {
      // console.log(
      //   config.COIN_GATE_WAY.BNB.depositCheckUrl,
      //   "config.COIN_GATE_WAY.BNB.depositCheckUrl"
      // );
      let url = config.COIN_GATE_WAY.BNB.DEPOSIT_TOKEN_URL.replace(
        "##USER_ADDRESS##",
        walletData.address
      )
        .replace("##START_BLOCK##", currentBlock)
        .replace("##END_BLOCK##", latest);
      let respData = await axios({
        url: url,
        method: "post",
      });
      console.log(url, "URLBNBurlurl");
      console.log(
        respData.data,
        respData.data.status,
        "respDatarespDatarespDatarespDataBNB"
      );
      console.log("respDataTOKENDEPOSITBNB");
      if (respData && respData.data && respData.data.status == "1") {
        for (let y in respData.data.result) {
          var result = respData.data.result[y];
          let userAssetData = await Wallet.findOne({
            "assets.address": {
              $regex: new RegExp(".*" + result.to.toLowerCase() + ".*", "i"),
            },
            "assets.coin": currencySymbol,
          });
          if (userAssetData) {
            let transactionExist = await TransactionDB.findOne({
              txid: result.hash,
            });
            console.log(transactionExist, "BNBtransactionExist");
            let amount =
              result.value / 10 ** parseInt(walletCurrency.contractDecimal);
            console.log(amount, transactionExist, "amountBNB");
            console.log(
              !transactionExist,
              parseFloat(amount),
              parseFloat(walletCurrency.depositminlimit)
            );
            if (
              !transactionExist &&
              parseFloat(amount) >= parseFloat(walletCurrency.depositminlimit)
            ) {
              const { status, message } = await tokenMoveToAdmin({
                minAbi: walletCurrency.minABI,
                contractAddress: walletCurrency.contractAddress,
                adminAddress: config.COIN_GATE_WAY.BNB.ADDRESS,
                decimals: walletCurrency.contractDecimal,
                amount: amount,
                userPrivateKey: walletData.privateKey,
                userAddress: walletData.address,
              });
              console.log(status, message, "statusstatusBNB");
              if (status) {
                console.log("result.hashresult.hash", result.hash);
                //referralcommission
                let UserB = await TransactionDB.find({
                  $and: [
                    { userId: userId },
                    { paymentType: { $in: ["coin_deposit", "fiat_deposit"] } },
                  ],
                });
                if (isEmpty(UserB)) {
                  let userData = await User.findOne(
                    { userId: userId },
                    { _id: 1 }
                  );
                  let referTable = await UserReference.find({
                    "referChild._id": userData._id,
                  });
                }

                let transaction = new TransactionDB({
                  userId: userId,
                  currencyId: walletData.currencyId,
                  fromAddress: result.from,
                  toAddress: result.to,
                  txid: result.hash,
                  coin: currencySymbol,
                  paymentType: "coin_deposit",
                  amount: amount,
                  status: "completed",
                });
                //User insert
                let tran = await transaction.save();

                let userData = await Wallet.findOne({
                  userId: userId,
                });
                console.log(userData, "---------004BNB");
                let AssetData = userData.assets.id(walletData._id);
                console.log(AssetData, "---------005BNB");

                let beforeBalance = parseFloat(AssetData.spotBal);
                console.log(parseFloat(amount));
                console.log(walletCurrency.contractDecimal);
                console.log(
                  parseFloat(amount) / 10 ** walletCurrency.contractDecimal
                );
                AssetData.spotBal =
                  parseFloat(AssetData.spotBal) + parseFloat(amount);
                let WalletData = await userData.save();
                console.log(WalletData, "---------006BNB");

                // CREATE PASS_BOOK
                createPassBook({
                  userId: userData._id,
                  coin: "BNB",
                  currencyId: walletCurrency._id,
                  tableId: transaction._id,
                  beforeBalance: beforeBalance,
                  afterBalance: parseFloat(AssetData.spotBal),
                  amount: parseFloat(amount),
                  type: "coin_deposit",
                  category: "credit",
                });
              }
            } else if (transactionExist.status == "completed") {
              let newUserData = await TransactionDB.findOneAndUpdate(
                { _id: transactionExist._id },
                {
                  $set: {
                    txid: result.hash,
                  },
                }
              );
            }
          }
        }
      }
    }
  } catch (err) {
    console.log("\x1b[33m%s\x1b[0m", "Erron on BNB Deposit ", err);
  }
};

export const toFixedNumber = (x) => {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split("e-")[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = "0." + new Array(e).join("0") + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split("+")[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += new Array(e + 1).join("0");
    }
  }
  return x.toString();
};

export const tokenMoveToAdmin = async ({
  userPrivateKey,
  minAbi,
  contractAddress,
  userAddress,
  decimals,
  adminAddress,
  amount,
}) => {
  try {
    userPrivateKey = decryptString(userPrivateKey);
    console.log(
      userPrivateKey,
      decimals,
      contractAddress, userAddress,
      "userPrivateKeyTOKENBNB"
    );
    // let UserAddress  = web3.eth.accounts.privateKeyToAccount(userPrivateKey);
    // // if(UserAddress.address.toLocaleLowerCase() !== userAddress.toLocaleLowerCase() ){

    // // }
    let contract = new web3.eth.Contract(JSON.parse(minAbi), contractAddress);
    let tokenbalance = await contract.methods.balanceOf(userAddress).call();
    decimals = await contract.methods.decimals().call()
    let muldecimal = 2;
    if (decimals == 0) {
      muldecimal = 1;
    } else if (decimals == 1) {
      muldecimal = 10;
    } else if (decimals == 2) {
      muldecimal = 100;
    } else if (decimals == 4) {
      muldecimal = 10000;
    } else if (decimals == 6) {
      muldecimal = 1000000;
    } else if (decimals == 8) {
      muldecimal = 100000000;
    } else if (decimals == 18) {
      muldecimal = 1000000000000000000;
    } else if (decimals == 9) {
      muldecimal = 1000000000;
    }

    console.log(muldecimal, "muldecimalBNB");
    // amount = parseFloat(amount) * parseFloat(muldecimal);
    amount = toFixedNumber(parseFloat(amount) * 10 ** parseFloat(decimals));
    console.log(tokenbalance, "tokenbalancetokenbalance");
    if (tokenbalance > 0) {
      let getBalance = await web3.eth.getBalance(userAddress);
      let txCount = await web3.eth.getTransactionCount(userAddress);
      let getGasPrice = await web3.eth.getGasPrice();
      let params = [web3.utils.toChecksumAddress(adminAddress), amount.toString()]
      let { gasLimit } = await EstGas(params, JSON.parse(minAbi), contractAddress, 'transfer', userAddress)
      // let gaslimit = web3.utils.toHex(500000);
      let fee = web3.utils.toHex(getGasPrice) * gasLimit;
      fee = fee * 1.5
      console.log(getBalance, "------------>>>>getBalanceBNB");
      console.log(fee, "------------>>>>feeBNB");
      let decBalance = parseFloat(getBalance) / 10 ** 18
      decBalance = decBalance.toFixed(4)
      let decfee = parseFloat(fee) / 10 ** 18
      decfee = decfee.toFixed(4)
      if (parseFloat(decBalance) > parseFloat(decfee)) {

        console.log(
          "-------------->>>>>>>>>>BNB-----------------<<<<<<<<<<<",
          amount
        );

        let tokenAmount = web3.utils.toHex(
          web3.utils.toWei(amount.toString(), "ether")
        );
        // let tokenAmount = web3.utils.toHex(web3.utils.toWei(amount.toString(), "ether"));
        // let data = contract.methods
        //   .transfer(adminAddress, amount.toString())
        //   .encodeABI();
        // let transactionObject = {
        //   gasLimit: web3.utils.toHex(500000),
        //   gasPrice: web3.utils.toHex(getGasPrice),
        //   data: data,
        //   nonce: txCount,
        //   from: userAddress,
        //   to: contractAddress,
        // };

        // const common = await Common.forCustomChain(
        //   "mainnet",
        //   {
        //     name: "bnb",
        //     networkId: config.COIN_GATE_WAY.BNB.NETWORK_ID,
        //     chainId: config.COIN_GATE_WAY.BNB.CHAIN_ID,
        //   },
        //   "petersburg"
        // );

        // const tx = Transaction.fromTxData(transactionObject, {
        //   common,
        // });
        // const privateKey = Buffer.from(userPrivateKey.substring(2, 66), "hex");

        // const signedTx = tx.sign(privateKey);

        // const serializedTx = signedTx.serialize();

        // const raw1 = "0x" + serializedTx.toString("hex");

        // let result = await web3.eth.sendSignedTransaction(raw1);

        web3.eth.accounts.wallet.add(userPrivateKey);
        let accountS = await web3.eth.getAccounts()
        console.log(accountS, 'accountS')
        let Tokencontract = new web3.eth.Contract(JSON.parse(minAbi), contractAddress);
        let result = await Tokencontract.methods.transfer(web3.utils.toChecksumAddress(adminAddress), amount.toString()).send({ from: web3.utils.toChecksumAddress(userAddress), gas: gasLimit, gasPrice: getGasPrice });
        web3.eth.accounts.wallet.remove(userPrivateKey);
        return {
          status: true,
          result: result,
        };
      } else {
        let amopunttosend =
          parseFloat(fee) -
          parseFloat(getBalance) +
          parseFloat(web3.utils.toWei("0.00041", "ether"));

        console.log(
          "<<<<-----------SEND BNB ADMIN TO USER AMOUNT----------->>>>",
          amopunttosend / 1000000000000000000
        );
        let { status, message, result } = await bnbMovetoUser({
          amount: amopunttosend / 1000000000000000000,
          adminAddress: config.COIN_GATE_WAY.BNB.ADDRESS,
          adminPrivatekey: config.COIN_GATE_WAY.BNB.PRIVATE_KEY,
          userAddress: userAddress,
        });
        if (status) {
          console.log("BNB move from admim")
          web3.eth.accounts.wallet.add(userPrivateKey);
          let params = [web3.utils.toChecksumAddress(adminAddress), amount.toString()]
          let { gasLimit } = await EstGas(params, JSON.parse(minAbi), contractAddress, 'transfer', userAddress)
          let Tokencontract = new web3.eth.Contract(JSON.parse(minAbi), contractAddress);
          let result = await Tokencontract.methods.transfer(web3.utils.toChecksumAddress(adminAddress), amount.toString()).send({ from: userAddress, gas: gasLimit, gasPrice: getGasPrice });
          console.log("Token move to admin")
          web3.eth.accounts.wallet.remove(userPrivateKey);
          return {
            status: true,
            result: result,
          };
        }
        return {
          status: false,
          message: "No Balance",
        };
      }
    } else {
      console.log("<<<<-----------There is no new deposit----------->>>>");
      return {
        status: false,
        message: "There is no new deposit",
      };
    }
  } catch (err) {
    console.log(
      "\x1b[33m%s\x1b[0m",
      "Erron on Token Move to Admin",
      err.toString()
    );
    return {
      status: false,
      message: err.toString(),
    };
  }
};

export function convert(n) {
  try {
    var sign = +n < 0 ? "-" : "",
      toStr = n.toString();
    if (!/e/i.test(toStr)) {
      return n;
    }
    var [lead, decimal, pow] = n
      .toString()
      .replace(/^-/, "")
      .replace(/^([0-9]+)(e.*)/, "$1.$2")
      .split(/e|\./);
    return +pow < 0
      ? sign +
      "0." +
      "0".repeat(Math.max(Math.abs(pow) - 1 || 0, 0)) +
      lead +
      decimal
      : sign +
      lead +
      (+pow >= decimal.length
        ? decimal + "0".repeat(Math.max(+pow - decimal.length || 0, 0))
        : decimal.slice(0, +pow) + "." + decimal.slice(+pow));
  } catch (err) {
    return 0;
  }
}

export const tokenMoveToUser = async ({
  amount,
  adminAddress,
  userAddress,
  contractAddress,
  adminPrivateKey,
  minAbi,
  decimals,
}) => {
  try {
    console.log(
      amount,
      ",amountamountamount",
      adminAddress,
      ",adminAddressadminAddressadminAddress",
      userAddress,
      ",userAddressuserAddressuserAddress",
      contractAddress,
      ",contractAddresscontractAddresscontractAddress",
      adminPrivateKey,
      ",adminPrivateKeyadminPrivateKeyadminPrivateKey",
      minAbi,
      ",minAbiminAbiminAbi",
      decimals,
      ",decimalsdecimalsdecimals"
    );
    console.log(decimals, "---------------decimal", amount);
    adminPrivateKey = decryptString(adminPrivateKey);
    // let adminPrivateKey1 = Buffer.from(adminPrivateKey, "hex");
    console.log("-------admin privateKey", adminPrivateKey);
    // return
    let contract = new web3.eth.Contract(JSON.parse(minAbi), contractAddress);
    let tokenbalance = await contract.methods.balanceOf(adminAddress).call();
    console.log(tokenbalance, "tokenbalancetokenbalancetokenbalance");
    let muldecimal = 2;
    if (decimals == 0) {
      muldecimal = 1;
    } else if (decimals == 1) {
      muldecimal = 10;
    } else if (decimals == 2) {
      muldecimal = 100;
    } else if (decimals == 4) {
      muldecimal = 10000;
    } else if (decimals == 6) {
      muldecimal = 1000000;
    } else if (decimals == 8) {
      muldecimal = 100000000;
    } else if (decimals == 18) {
      muldecimal = 1000000000000000000;
    }
    console.log(muldecimal, "parseFloat(muldecimal)");
    // amount = parseFloat(amount) * parseFloat(muldecimal);
    amount = parseFloat(amount) * 10 ** parseFloat(decimals);
    // amount = convert(amount)
    console.log(amount, "--------------amount");
    if (tokenbalance > amount) {
      let getBalance = await web3.eth.getBalance(adminAddress);
      let txCount = await web3.eth.getTransactionCount(adminAddress);
      let getGasPrice = await web3.eth.getGasPrice();
      let params = [web3.utils.toChecksumAddress(userAddress), amount.toString()]
      let { gasLimit } = await EstGas(params, JSON.parse(minAbi), contractAddress, 'transfer', adminAddress)
      // let gaslimit = web3.utils.toHex(500000);
      let gaslimit = gasLimit;
      let fee = web3.utils.toHex(getGasPrice) * gaslimit;

      if (getBalance > fee) {
        // let tokenAmount = web3.utils.toHex(
        //   web3.utils.toWei(amount.toString(), "ether")
        // );
        // // let tokenAmount = web3.utils.toHex(web3.utils.toWei(amount.toString(), "ether"));
        // let data = contract.methods
        //   .transfer(userAddress, amount.toString())
        //   .encodeABI();
        // console.log("🚀 ~ file: bnb.controller.js:883 ~ data:", data);
        // let transactionObject = {
        //   gasLimit: web3.utils.toHex(500000),
        //   gasPrice: web3.utils.toHex(getGasPrice),
        //   data: data,
        //   nonce: txCount,
        //   from: adminAddress,
        //   to: contractAddress,
        // };

        // const common = await Common.forCustomChain(
        //   "mainnet",
        //   {
        //     name: "bnb",
        //     networkId: config.COIN_GATE_WAY.BNB.NETWORK_ID,
        //     chainId: config.COIN_GATE_WAY.BNB.CHAIN_ID,
        //   },
        //   "petersburg"
        // );

        // const tx = Transaction.fromTxData(transactionObject, {
        //   common,
        // });
        // const privateKey = Buffer.from(adminPrivateKey.substring(2, 66), "hex");

        // const signedTx = tx.sign(privateKey);

        // const serializedTx = signedTx.serialize();

        // const raw1 = "0x" + serializedTx.toString("hex");

        // let result = await web3.eth.sendSignedTransaction(raw1);
        web3.eth.accounts.wallet.add(adminPrivateKey);
        let Tokencontract = new web3.eth.Contract(JSON.parse(minAbi), contractAddress);
        let result = await Tokencontract.methods.transfer(web3.utils.toChecksumAddress(userAddress), amount.toString()).send({ from: adminAddress, gas: gaslimit, gasPrice: getGasPrice });
        console.log("Token move to user")
        web3.eth.accounts.wallet.remove(adminPrivateKey);

        return {
          status: true,
          trxId: result && result.transactionHash,
          message: "Withdraw successfully",
        };
      } else {
        return {
          status: false,
          message: "Te1 Balance Not Found",
        };
      }
    } else {
      return {
        status: false,
        message: "Insufficient Balance",
      };
    }
  } catch (err) {
    console.log(
      "\x1b[33m%s\x1b[0m",
      "Erron on Token Move to User",
      err.toString()
    );
    return {
      status: false,
      message: err.toString(),
    };
  }
};

export const EstGas = async (params, abi, contractAddress, methodName, account) => {
  try {
    // const web3 = await useWeb3();
    const gasPrice = await web3.eth.getGasPrice();
    console.log(gasPrice, "EstGas", params, contractAddress, methodName, account)

    const Contract = new web3.eth.Contract(abi, contractAddress)
    const encoded = await Contract.methods[methodName].apply(null, params).encodeABI();
    let estimatedGasLimit = await web3.eth.estimateGas({
      from: web3.utils.toChecksumAddress(account),
      to: web3.utils.toChecksumAddress(contractAddress),
      data: encoded,
    });

    return {
      gasLimit: parseInt(estimatedGasLimit * 1.5, 10),
      gasPrice: gasPrice
    }
  } catch (e) {
    consolelog('EstGas_err', e, true);
    return false
  }
}

export const isAddress = (address) => {
  try {
    if (isEmpty(address)) {
      return false;
    }

    return web3.utils.isAddress(address);
  } catch (err) {
    return false;
  }
};

// const test = async () => {
//     let getGasPrice = await web3.eth.getGasPrice()
//     var gaslimit = web3.utils.toHex(21000);
//     var fee = web3.utils.toHex(getGasPrice) * gaslimit;
// }

// test()
