// import package
import mongoose from "mongoose";

// import controller
import * as binanceCtrl from "./binance.controller";

// import coin controller
import * as ethGateway from "./coin/ethGateway";

import * as btcCtrl from "./coin/btc.controller";
import * as ltcCtrl from "./coin/ltc.controller";
import * as ethCtrl from "./coin/eth.controller";
import * as xrpGateway from "./coin/xrpGateway";
import * as dogeCtrl from "./coin/doge.controller";
import * as bnbCtrl from "./coin/bnb.controller";
import * as xrpCtrl from "./coin/xrp.controller";
import * as tronCtrl from "./coin/TronGateway";
import * as etcCtrl from "./coin/etc.controller";
import * as coinPayment from "./coin/coinpaymentGateway";

// import model
import { Currency } from "../models";

// import lib
import { encryptString, decryptString } from "../lib/cryptoJS";
import isEmpty from "../lib/isEmpty";
import config from "../config";

const ObjectId = mongoose.Types.ObjectId;

var WAValidator = require("multicoin-address-validator");

/**
 * Response
 * status, trxId
 */
export const coinWithdraw = async ({
  type,
  coin,
  toAddress,
  amount,
  currencyDetails,
}) => {
  try {
    if (isEmpty(type) && !["local", "coin_payment", "binance"].includes(type)) {
      return {
        status: false,
      };
    }

    if (isEmpty(coin)) {
      return {
        status: false,
      };
    }

    if (isEmpty(toAddress)) {
      return {
        status: false,
      };
    }

    if (isEmpty(amount) && amount <= 0) {
      return {
        status: false,
      };
    }
    if (type == "binance") {
      return await binanceCtrl.withdraw(coin, toAddress, amount);
    } else if (type == "local") {
      return await localWithdraw({ coin, toAddress, amount, currencyDetails });
    } else if (type == "coin_payment") {
      console.log("Coin Payments : ", coin, amount, toAddress);
      var destTag = "";
      return await coinPayment.createWithdrawal({
        currencySymbol: coin,
        amount: amount,
        address: toAddress,
        destTag: destTag,
      });
    }
  } catch (err) {
    console.log(err, "------------");
    return {
      status: false,
    };
  }
};

/**
 * Local withdraw
 * coin, toAddress, amount
 */
export const localWithdraw = async ({
  coin,
  toAddress,
  amount,
  currencyDetails,
}) => {
  try {
    // if (coin == 'BTC') {
    //     return await btcCtrl.transfer({
    //         userAddress: toAddress,
    //         amount
    //     })
    // } else if (coin == 'DOGE') {
    //     return await btcCtrl.transfer({
    //         userAddress: toAddress,
    //         amount
    //     })
    // }
    // else if (coin == 'LTC') {
    //     return await ltcCtrl.transfer({
    //         userAddress: toAddress,
    //         amount
    //     })
    // }else
    console.log(currencyDetails, "currencyDetails");
    console.log(currencyDetails.type, "currencyDetails.type");
    if (currencyDetails.type == "crypto") {
      if (coin == "BNB") {
        return await bnbCtrl.bnbMovetoUser({
          userAddress: toAddress,
          amount,
          adminAddress: config.COIN_GATE_WAY.BNB.ADDRESS,
          adminPrivatekey: config.COIN_GATE_WAY.BNB.PRIVATE_KEY,
        });
      }
      if (coin == "ETH") {
        return await ethCtrl.ethMovetoUser({
          userAddress: toAddress,
          amount,
          adminAddress: config.COIN_GATE_WAY.ETH.ADDRESS,
          adminPrivatekey: config.COIN_GATE_WAY.ETH.PRIVATE_KEY,
        });
      }
      if (coin == "TRX") {
        return await tronCtrl.sentTransaction({
          fromAddress: config.COIN_GATE_WAY.TRON.ADDRESS,
          toAddress: toAddress,
          privateKey: config.COIN_GATE_WAY.TRON.PRIVATEKEY,
          amount: amount,
        });
      }
    }
    if (currencyDetails.type == "token") {
      if (currencyDetails.tokenType == "bep20") {
        return await bnbCtrl.tokenMoveToUser({
          amount,
          adminAddress: config.COIN_GATE_WAY.BNB.ADDRESS,
          userAddress: toAddress,
          contractAddress: currencyDetails.contractAddress,
          adminPrivateKey: config.COIN_GATE_WAY.BNB.PRIVATE_KEY,
          minAbi: currencyDetails.minABI,
          decimals: currencyDetails.decimal,
        });
      }
      if (currencyDetails.tokenType == "trc20") {
        return await tronCtrl.tokenMoveToUser({
          amount,
          fromAddress: config.COIN_GATE_WAY.TRON.ADDRESS,
          toAddress: toAddress,
          currencycontract: currencyDetails.contractAddress,
          privateKey: decryptString(config.COIN_GATE_WAY.TRON.PRIVATEKEY),
          decimals: currencyDetails.decimal,
        });
      }
      if (currencyDetails.tokenType == "erc20") {
        return await ethCtrl.tokenMoveToUser({
          amount,
          adminAddress: config.COIN_GATE_WAY.ETH.ADDRESS,
          userAddress: toAddress,
          contractAddress: currencyDetails.contractAddress,
          adminPrivateKey: config.COIN_GATE_WAY.ETH.PRIVATE_KEY,
          minAbi: currencyDetails.minABI,
          decimals: currencyDetails.decimal,
        });
      }
    }

    return {
      status: false,
    };
  } catch (err) {
    console.log(err, "---------15");
    return {
      status: false,
    };
  }
};

/**
 * Generate Crypto Address
 * currencyList[{_id(currencyId), coin, depositType, tokenType}]
 */
export const generateCryptoAddr = async ({
  currencyList = [],
  option = {},
}) => {
  try {
    if (!Array.isArray(currencyList)) {
      return [];
    }
    let assetList = [];
    console.log(currencyList, "currencyListcurrencyList");
    for (let currency of currencyList) {
      console.log(
        currency.depositType == "local",
        "currency.depositType =='local'"
      );
      if (currency && currency.type == "crypto") {
        if (
          currency.depositType == "binance" &&
          !isEmpty(option) &&
          !isEmpty(option.binSubAcctEmail)
        ) {
          let subAccAsset = await binanceCtrl.subAccDepAddr({
            email: option.binSubAcctEmail,
            coin: currency.coin,
          });
          let assetObj = {
            _id: currency._id,
            coin: currency.coin,
            privateKey: "",
          };

          if (subAccAsset.status) {
            assetObj["address"] = subAccAsset.address;
            assetObj["destTag"] = subAccAsset.tag;
          }
          assetList.push(assetObj);
        } else if (currency.depositType == "local") {
          console.log(currency.depositType == "local", "currency.depositType");
          let assetObj = {
            _id: currency._id,
            coin: currency.coin,
            privateKey: "",
            address: "",
            destTag: "",
          };
          let ntwAddDoc = await ntwAddress(currency.coin, option);
          if (ntwAddDoc.status) {
            assetObj["address"] = ntwAddDoc.address;
            assetObj["privateKey"] =
              ntwAddDoc && ntwAddDoc.privateKey
                ? encryptString(ntwAddDoc.privateKey)
                : "";
            assetObj["destTag"] = ntwAddDoc.destTag ? ntwAddDoc.destTag : "";
          }
          assetList.push(assetObj);
        } else if (currency.depositType == "coin_payment") {
          console.log("option.emailId", option.emailId);
          let emailId = "AUREX" + option.emailId; // user registered address
          let ipnUrl = config.IPN_URL; // config ipn url
          var coinpayment_details = await coinPayment.createAddress(
            currency.coin,
            emailId,
            ipnUrl
          );

          let assetObj = {
            _id: currency._id,
            coin: currency.coin,
            privateKey: coinpayment_details.privateKey,
          };

          assetObj["address"] = coinpayment_details.address;
          assetObj["destTag"] = coinpayment_details.destTag;
          assetList.push(assetObj);
        }
      }
    }
    return assetList;
  } catch (err) {
    return [];
  }
};

/**
 * Generate Token Address
 * currencyList[{_id(currencyId), coin, depositType, tokenType}]
 */
export const generateTokenAddr = async ({ currencyList = [], walletData }) => {
  // console.log(currencyList, walletData, "currencyListcurrencyListcurrencyList");
  try {
    if (!Array.isArray(currencyList)) {
      return [];
    }

    if (isEmpty(walletData)) {
      return [];
    }

    let assetList = [];
    // console.log(currencyList, walletData, "walletDatawalletData");
    for (let currency of currencyList) {
      // console.log(walletData.assets.length, "walletData");
      // console.log(
      //   currency &&
      //     currency.type == "token" &&
      //     walletData.assets &&
      //     walletData.assets.length > 0
      // );
      if (
        currency &&
        currency.type == "token" &&
        walletData.assets &&
        walletData.assets.length > 0
      ) {
        // if (currency.tokenType == 'erc20') {
        //     let ETH = walletData.assets.find(el => el.coin == 'ETH');
        //     if (ETH) {
        //         let assetObj = {
        //             "_id": currency._id,
        //             "coin": currency.coin,
        //             'address': ETH.address,
        //             'privateKey': ETH.privateKey,
        //         }
        //         assetList.push(assetObj)
        //     }
        // } else
        // console.log(currency.tokenType, "currency.tokenType");
        if (currency.tokenType == "bep20") {
          let assetObj = {
            _id: currency._id,
            coin: currency.coin,
            privateKey: "",
            address: "",
            destTag: "",
          };
          let ntwAddDoc = await ntwAddress("BNB");
          if (ntwAddDoc.status) {
            assetObj["address"] = ntwAddDoc.address;
            assetObj["privateKey"] =
              ntwAddDoc && ntwAddDoc.privateKey
                ? encryptString(ntwAddDoc.privateKey)
                : "";
          }
          assetList.push(assetObj);
        } else if (currency.tokenType == "trc20") {
          let assetObj = {
            _id: currency._id,
            coin: currency.coin,
            privateKey: "",
            address: "",
            destTag: "",
          };
          let ntwAddDoc = await ntwAddress("TRX");
          if (ntwAddDoc.status) {
            assetObj["address"] = ntwAddDoc.address;
            assetObj["privateKey"] =
              ntwAddDoc && ntwAddDoc.privateKey
                ? encryptString(ntwAddDoc.privateKey)
                : "";
          }
          assetList.push(assetObj);
          // console.log(currency.tokenType, "currency.tokenType");
        } else if (currency.tokenType == "erc20") {
          let assetObj = {
            _id: currency._id,
            coin: currency.coin,
            privateKey: "",
            address: "",
            destTag: "",
          };
          let ntwAddDoc = await ntwAddress("ETH");
          if (ntwAddDoc.status) {
            assetObj["address"] = ntwAddDoc.address;
            assetObj["privateKey"] =
              ntwAddDoc && ntwAddDoc.privateKey
                ? encryptString(ntwAddDoc.privateKey)
                : "";
          }
          assetList.push(assetObj);
        } else {
          let assetObj = {
            _id: currency._id,
            coin: currency.coin,
            privateKey: "",
            address: "",
            destTag: "",
          };
          assetList.push(assetObj);
        }
      }
    }
    return assetList;
  } catch (err) {
    return [];
  }
};

/**
 * Generate Address for fiat
 * currencyList[{_id(currencyId), coin, depositType, tokenType}]
 */
export const generateFiatAddr = async ({ currencyList = [] }) => {
  try {
    if (!Array.isArray(currencyList)) {
      return [];
    }

    let assetList = [];
    for (let currency of currencyList) {
      if (currency && currency.type == "fiat") {
        // if (currency.depositType == 'coin_payment') {
        let assetObj = {
          _id: currency._id,
          coin: currency.coin,
          privateKey: "",
        };
        assetList.push(assetObj);
      }
      // }
    }
    return assetList;
  } catch (err) {
    return [];
  }
};

/**
 * Check Crypto Address
 * coin, tokenType, address
 */
export const isCryptoAddr = async (coin, address, currencyId) => {
  try {
    if (isEmpty(coin)) {
      return false;
    }

    if (isEmpty(address)) {
      return false;
    }
    let currency = await Currency.findOne({ _id: currencyId });
    console.log("currency_currency", currency);
    let currencySymbol = currency.coin;
    if (currencySymbol && currency.type == "token") {
      currencySymbol =
        currency.tokenType == "erc20" || currency.tokenType == "bep20"
          ? "ETH"
          : "TRX";
    }
    if (currencySymbol == "BNB") {
      currencySymbol = "ETH";
    }
    var valid = WAValidator.validate(address, currencySymbol);
    if (valid) {
      return true;
    } else {
      return false;
    }

    // if (coin == 'ETH') {
    //     return ethGateway.isAddress(address)
    // } else if (coin == 'BNB') {
    //     return bnbCtrl.isAddress(address)
    // } else if (coin == 'BTC') {
    //     return btcCtrl.isAddress(address)
    // } else if (coin == 'XRP') {
    //     return xrpGateway.isAddress(address)
    // } else {
    //     return false
    // }
  } catch (err) {
    return false;
  }
};

/**
 * Generate Network Address
 */
export const ntwAddress = async (network, option) => {
  try {
    // if (network == "BTC") {
    //     let reqData = {
    //         'userId': option.userId
    //     }
    //     return {
    //         status: true,
    //         ...await btcCtrl.createAddress(reqData)
    //     }
    // } else if (network == 'DOGE') {
    //     let reqData = {
    //         'userId': option.userId
    //     }
    //     return {
    //         status: true,
    //         ...await dogeCtrl.createAddress(reqData)
    //     }
    // }
    // else if (network == 'LTC') {
    //     let reqData = {
    //         'userId': option.userId
    //     }
    //     return {
    //         status: true,
    //         ...await ltcCtrl.createAddress(reqData)
    //     }
    // } else if (network == 'ETH') {
    //     return {
    //         status: true,
    //         ...await ethCtrl.createAddress()
    //     }
    // } else
    // console.log(network, option, "network, option");
    if (network == "BNB") {
      return await bnbCtrl.createAddress();
    } else if (network == "TRX") {
      return await tronCtrl.createAddress();
    } else if (network == "ETH") {
      console.log("ETH ETH");
      return await ethCtrl.createAddress();
    }

    // else if (network == 'XRP') {
    //     return await xrpCtrl.createAddress(ObjectId())
    // } else if (network == 'ETC') {
    //     return etcCtrl.createAddress()
    // }

    return {
      status: false,
    };
  } catch (err) {
    return {
      status: false,
    };
  }
};
