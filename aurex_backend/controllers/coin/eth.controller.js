// import package
import axios from "axios";
import https from "https";
import converter from "hex2dec";
import querystring from "querystring";
import mongoose from "mongoose";
import Web3 from "web3";
import { Transaction } from "@ethereumjs/tx";
import { createPassBook } from "../passbook.controller";

// import modal
import { Currency, User, Wallet } from "../../models";
import TransactionDB from "../../models/Transaction";
import Common from "@ethereumjs/common";

// import controller
import { mailTemplateLang } from "../emailTemplate.controller";

// import config
import config from "../../config";

// import lib
import isEmpty from "../../lib/isEmpty";
import isJsonParse from "../../lib/isJsonParse";
import { encryptString, decryptString } from "../../lib/cryptoJS";
const web3 = new Web3("https://rpc.notadegen.com/eth/sepolia");

const ObjectId = mongoose.Types.ObjectId;

export const createAddress = async () => {
  // try {
  //     let respData = await axios({
  //         'method': 'get',
  //         'timeout': 1000,
  //         'url': `${config.COIN_GATE_WAY.ETH.URL}/getnewaddress`,
  //     });

  //     if (respData && respData.status == 200 && !isEmpty(respData.data.data)) {
  //         const { address, privateKey } = respData.data.data;
  //         return {
  //             address,
  //             privateKey
  //         }
  //     } else {
  //         return {
  //             address: '',
  //             privateKey: ''
  //         }
  //     }
  // }
  // catch (err) {
  //     return {
  //         address: '',
  //         privateKey: ''
  //     }
  // }

  try {
    let account = await web3.eth.accounts.create();
    // console.log(account, "accountaccount");
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

/**
 * Deposit ETH
 */
export const deposit = async (userId) => {
  // try {
  //   let userWalletData = await Wallet.findOne({ _id: userId }).populate("_id");
  //   let walletData = userWalletData.assets.find((el) => el.coin == "ETH");
  //   let { latestBlockNumber } = await getLatestBlock();

  //   var startBlock = config.coinGateway.eth.startBlock;
  //   let currentBlock = walletData.blockNo > 0 ? walletData.blockNo : startBlock;

  //   let depositUrl = config.coinGateway.eth.ethDepositUrl
  //     .replace("##USER_ADDRESS##", walletData.address)
  //     .replace("##START_BLOCK##", currentBlock)
  //     .replace("##END_BLOCK##", latestBlockNumber);
  //   console.log(depositUrl, "depositUrl");
  //   let respData = await axios({
  //     url: depositUrl,
  //     method: "post",
  //   });

  //   if (respData && respData.data && respData.data.status == "1") {
  //     for (let y in respData.data.result) {
  //       let result = respData.data.result[y];
  //       console.log(result, "----------result");
  //       let userAssetData = await Wallet.findOne({
  //         "assets.address": {
  //           $regex: new RegExp(".*" + result.to.toLowerCase() + ".*", "i"),
  //         },
  //         "assets.coin": "ETH",
  //       });
  //       // console.log(userAssetData,'userAssetDatauserAssetDatauserAssetData--------------------')
  //       if (userAssetData) {
  //         // console.log(typeof result.value,'*******************************************')
  //         let transactionExist = await Transaction.findOne({
  //           txid: result.hash,
  //         });

  //         if (!transactionExist) {
  //           // console.log('*********************')

  //           let responseData = await amountMoveToAdmin({
  //             toAddress: config.coinGateway.eth.address,
  //             privateKey: decryptString(walletData.privateKey),
  //             fromAddress: walletData.address,
  //             // amount: result.value/1000000000000000000,
  //           });

  //           if (responseData && responseData.status) {
  //             let amount = parseFloat(result.value) / 10 ** 18;
  //             let transaction = new Transaction({
  //               userId: userId,
  //               currencyId: walletData._id,
  //               fromAddress: result.from,
  //               toAddress: result.to,
  //               txid: result.hash,
  //               coin: walletData.coin,
  //               paymentType: "coin_deposit",
  //               amount: amount,
  //               status: "completed",
  //             });
  //             let newTransaction = await transaction.save();

  //             // userAssetData.spotwallet = userAssetData.spotwallet + result.value/1000000000000000000;
  //             // userAssetData.blockNo = latestBlockNumber;
  //             // await userAssetData.save();

  //             await Wallet.updateOne(
  //               {
  //                 _id: userId,
  //                 "assets._id": walletData._id,
  //               },
  //               {
  //                 $inc: {
  //                   "assets.$.spotBal": amount,
  //                   "amount.$.blockNo": latestBlockNumber,
  //                 },
  //               }
  //             );

  //             let content = {
  //               email: userWalletData._id.email,
  //               currency: "ETH",
  //               amount: amount,
  //               tranactionId: result.hash,
  //               date: new Date(),
  //             };

  //             mailTemplateLang({
  //               userId: userId,
  //               identifier: "User_deposit",
  //               toEmail: userWalletData._id.email,
  //               content,
  //             });
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

  try {
    let userWalletData = await Wallet.findOne({ userId: userId }).populate(
      "_id"
    );
    let walletData = userWalletData.assets.find((el) => el.coin == "ETH");
    let walletCurrency = await Currency.findOne({ _id: walletData._id });
    console.log(walletCurrency, "ETH-deposit-walletCurrency");

    const latest = await web3.eth.getBlockNumber();
    var startBlock = config.COIN_GATE_WAY.ETH.START_BLOCK;
    var currentBlock = walletData.blockNo > 0 ? walletData.blockNo : startBlock;
    if (walletData.address) {
      let url = config.COIN_GATE_WAY.ETH.DEPOSIT_URL.replace(
        "##USER_ADDRESS##",
        walletData.address
      )
        .replace("##START_BLOCK##", currentBlock)
        .replace("##END_BLOCK##", latest);
      let respData = await axios({
        url: url,
        method: "post",
      });
      console.log(url, "ETH-deposit-url");
      if (respData && respData.data && respData.data.status == "1") {
        for (let y in respData.data.result) {
          var result = respData.data.result[y];

          let userAssetData = await Wallet.findOne({
            "assets.address": {
              $regex: new RegExp(".*" + result.to.toLowerCase() + ".*", "i"),
            },

            "assets.coin": "ETH",
          });
          if (userAssetData) {
            let transactionExist = await TransactionDB.findOne({
              txid: result.hash,
            });
            let amount = parseInt(result.value, 10) / 1000000000000000000;
            console.log(amount, "amountamountamountETH");
            console.log(transactionExist, "transactionExistETH");
            console.log(
              parseFloat(amount) >= parseFloat(walletCurrency.depositminlimit),
              "ETHparseFloat(amount) >= parseFloat(walletCurrency.depositminlimit)"
            );
            if (
              !transactionExist &&
              parseFloat(amount) >= parseFloat(walletCurrency.depositminlimit)
            ) {
              console.log(walletData, "walletDatawalletDataETH");
              const { status } = await ethMovetoAdmin({
                amount: amount,
                // amount: parseInt(result.value) ,
                useraddress: walletData.address,
                userprivatekey: walletData.privateKey,
                adminAddress: config.COIN_GATE_WAY.ETH.ADDRESS,
              });
              console.log(status, "ETH-status");
              if (status) {
                //referralcommission
                let UserB = await TransactionDB.find({
                  $and: [
                    { userId: userId },
                    { paymentType: { $in: ["coin_deposit", "fiat_deposit"] } },
                  ],
                });
                console.log(UserB, "UserBUserBETH");
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
                  coin: "ETH",
                  paymentType: "coin_deposit",
                  amount: amount,
                  status: "completed",
                });
                //User insert
                let tran = await transaction.save();

                let userData = await Wallet.findOne({
                  userId: userId,
                });
                console.log(userData, "userDataETH");
                let AssetData = userData.assets.id(walletData._id);
                console.log(AssetData, "AssetDataETH");

                let beforeBalance = parseFloat(AssetData.spotBal);
                AssetData.spotBal =
                  parseFloat(AssetData.spotBal) + parseFloat(amount);

                console.log(
                  AssetData.spotBal,
                  amount,
                  "AssetData.spotBalAssetData.spotBalETH"
                );

                let WalletData = await userData.save();
                console.log(WalletData, "WalletDataETH");

                // CREATE PASS_BOOK
                createPassBook({
                  userId: userData._id,
                  coin: "ETH",
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
    console.log("Error on  ethGateway(deposit)", err);
    return;
  }
};

/**
 * Deposit ERC20_TOEKEN
 */
export const ERC20_Deposit = async (userId, currencySymbol) => {
  //   try {
  //     let getUsers = await User.aggregate([
  //       { $match: { _id: ObjectId(userId) } },
  //       {
  //         $lookup: {
  //           from: "Assets",
  //           localField: "_id",
  //           foreignField: "userId",
  //           as: "userAssetsInfo",
  //         },
  //       },
  //       {
  //         $unwind: "$userAssetsInfo",
  //       },
  //       { $match: { "userAssetsInfo.currencySymbol": currencySymbol } },
  //       {
  //         $lookup: {
  //           from: "currency",
  //           localField: "userAssetsInfo.currency",
  //           foreignField: "_id",
  //           as: "currencyInfo",
  //         },
  //       },
  //       {
  //         $unwind: "$currencyInfo",
  //       },
  //       {
  //         $project: {
  //           _id: 1,
  //           blockNo: "$userAssetsInfo.blockNo",
  //           userAssetId: "$userAssetsInfo.userId",
  //           currencySymbol: "$userAssetsInfo.currencySymbol",
  //           currencyAddress: "$userAssetsInfo.currencyAddress",
  //           privateKey: "$userAssetsInfo.privateKey",
  //           currencyId: "$userAssetsInfo.currency",
  //           contractAddress: "$currencyInfo.contractAddress",
  //           minABI: "$currencyInfo.minABI",
  //           decimals: "$currencyInfo.decimals",
  //         },
  //       },
  //     ]);

  //     let { latestBlockNumber } = await getLatestBlock();
  //     for (let x in getUsers) {
  //       var user = getUsers[x];

  //       // console.log('user',user)
  //       // console.log('latestBlockNumber',latestBlockNumber)
  //       var startBlock = config.coinGateway.eth.startBlock;
  //       let currentBlock = user.blockNo > 0 ? user.blockNo : startBlock;

  //       let depositUrl = config.coinGateway.eth.ethTokenDepositUrl
  //         .replace("##USER_ADDRESS##", user.currencyAddress)
  //         .replace("##START_BLOCK##", currentBlock)
  //         .replace("##END_BLOCK##", latestBlockNumber);
  //       // console.log(depositUrl,'depositUrldepositUrl')
  //       let respData = await axios({
  //         url: depositUrl,
  //         method: "post",
  //       });

  //       if (respData && respData.data && respData.data.status == "1") {
  //         for (let y in respData.data.result) {
  //           let result = respData.data.result[y];

  //           let userAssetData = await Assets.findOne({
  //             currencyAddress: {
  //               $regex: new RegExp(".*" + result.to.toLowerCase() + ".*", "i"),
  //             },
  //             currencySymbol: currencySymbol,
  //           });

  //           if (userAssetData) {
  //             // console.log(typeof result.value,'*******************************************')
  //             let transactionExist = await Transaction.findOne({
  //               txid: result.hash,
  //             });

  //             if (!transactionExist) {
  //               let responseData = await tokenMoveToAdmin({
  //                 userPrivateKey: decryptString(userAssetData.privateKey),
  //                 adminPrivateKey: decryptString(
  //                   config.coinGateway.eth.privateKey
  //                 ),
  //                 fromAddress: userAssetData.currencyAddress,
  //                 toAddress: config.coinGateway.eth.address,
  //                 minAbi: user.minABI,
  //                 contractAddress: user.contractAddress,
  //                 decimals: user.decimals,
  //                 amount: result.value / 10 ** parseInt(user.decimals),
  //               });

  //               if (responseData && responseData.status) {
  //                 let transaction = new Transaction({
  //                   userId: userAssetData.userId,
  //                   currencyId: user.currencyId,
  //                   fromaddress: result.from,
  //                   toaddress: result.to,
  //                   txid: result.hash,
  //                   currencySymbol: userAssetData.currencySymbol,
  //                   paymentType: "coin_deposit",
  //                   amount: result.value / 10 ** parseInt(user.decimals),
  //                   status: "completed",
  //                 });
  //                 let newTransaction = await transaction.save();
  //                 userAssetData.spotwallet =
  //                   userAssetData.spotwallet + result.value / 1000000000000000000;
  //                 userAssetData.blockNo = latestBlockNumber;
  //                 await userAssetData.save();

  //                 let content = {
  //                   email: user.email,
  //                   currencySymbol: currencySymbol,
  //                   amount: result.value / 1000000000000000000,
  //                   txid: result.hash,
  //                   date: new Date(),
  //                 };

  //                 mailTemplateLang({
  //                   userId: userAssetData.userId,
  //                   identifier: "User_deposit",
  //                   toEmail: user.email,
  //                   content,
  //                 });
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   } catch (err) {
  //     console.log("Error on  ethGateway(deposit)", err);
  //     return;
  //   }

  try {
    let userWalletData = await Wallet.findOne({ userId: userId }).populate(
      "_id"
    );
    console.log(userWalletData, "userWalletDatauserWalletDataETH");
    let walletData = userWalletData.assets.find(
      (el) => el.coin == currencySymbol
    );
    let walletCurrency = await Currency.findOne({ _id: walletData._id });
    const latest = await web3.eth.getBlockNumber();
    var startBlock = config.COIN_GATE_WAY.ETH.START_BLOCK;
    var currentBlock = walletData.blockNo > 0 ? walletData.blockNo : startBlock;
    console.log(walletData.address, "walletData.addresswalletData.addressETH");
    console.log(
      config.COIN_GATE_WAY,
      config.COIN_GATE_WAY.ETH,
      config.COIN_GATE_WAY.ETH.DEPOSIT_TOKEN_URL,
      "URLURL"
    );
    if (walletData.address) {
      let url = config.COIN_GATE_WAY.ETH.DEPOSIT_TOKEN_URL.replace(
        "##USER_ADDRESS##",
        walletData.address
      )
        .replace("##START_BLOCK##", currentBlock)
        .replace("##END_BLOCK##", latest);
      let respData = await axios({
        url: url,
        method: "post",
      });
      console.log(url, "urlurlETH");
      console.log(respData, "respDatarespDataETH");
      if (respData && respData.data && respData.data.status == "1") {
        for (let y in respData.data.result) {
          var result = respData.data.result[y];
          let userAssetData = await Wallet.findOne({
            "assets.address": {
              $regex: new RegExp(".*" + result.to.toLowerCase() + ".*", "i"),
            },
            "assets.coin": currencySymbol,
          });
          console.log(userAssetData, "userAssetDatauserAssetDataETH");
          if (userAssetData) {
            let transactionExist = await TransactionDB.findOne({
              txid: result.hash,
            });
            console.log(transactionExist, "transactionExistETH");
            let amount = result.value / 10 ** parseInt(walletCurrency.decimal);
            console.log(amount, "amountETH");
            if (
              !transactionExist &&
              parseFloat(amount) >= parseFloat(walletCurrency.depositminlimit)
            ) {
              const { status, message } = await tokenMoveToAdmin({
                minAbi: walletCurrency.minABI,
                contractAddress: walletCurrency.contractAddress,
                adminAddress: config.COIN_GATE_WAY.ETH.ADDRESS,
                decimals: walletCurrency.decimal,
                amount: amount,
                userPrivateKey: walletData.privateKey,
                userAddress: walletData.address,
              });
              console.log(status, "statusETH");
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
                let AssetData = userData.assets.id(walletData._id);

                // let beforeBalance = parseFloat(AssetData.spotBal);
                // AssetData.spotBal =
                //   parseFloat(AssetData.spotBal) +
                //   parseFloat(amount) / (10 ** walletCurrency.decimal)
                let beforeBalance = parseFloat(AssetData.spotBal);
                AssetData.spotBal =
                  parseFloat(AssetData.spotBal) + parseFloat(amount);
                console.log(AssetData.spotBal, "AssetData.spotBal");
                let WalletData = await userData.save();

                // CREATE PASS_BOOK
                createPassBook({
                  userId: userData._id,
                  coin: walletCurrency.coin,
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
    console.log("\x1b[33m%s\x1b[0m", "Erron on ETH Deposit ", err);
  }
};

export const ethMovetoAdmin = async ({
  amount,
  useraddress,
  userprivatekey,
  adminAddress,
}) => {
  try {
    console.log("ETH Amount Move to Admin");
    var userprivatekey = decryptString(userprivatekey);
    // console.log(userprivatekey, "userprivatekeyuserprivatekey");
    let balance = await web3.eth.getBalance(useraddress);
    let getGasPrice = await web3.eth.getGasPrice();
    let txCount = await web3.eth.getTransactionCount(useraddress);
    var gaslimit = web3.utils.toHex(21000);
    var fee = web3.utils.toHex(getGasPrice) * gaslimit;

    amount = amount * 1000000000000000000 - fee;
    console.log(amount, "amount * 1000000000000000000 - feeETH");
    console.log(balance, amount, balance > amount, "balance > amountETH");
    if (balance > amount) {
      var updateVal = {};
      const txObject = {
        nonce: web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(gaslimit),
        gasPrice: web3.utils.toHex(getGasPrice),
        to: adminAddress.toString(),
        // value: "0x1e18",
        value: web3.utils.toHex(amount),
      };
      const common = await Common.forCustomChain(
        "mainnet",
        {
          name: "bnb",
          networkId: config.COIN_GATE_WAY.ETH.NETWORK_ID,
          chainId: config.COIN_GATE_WAY.ETH.CHAIN_ID,
        },
        "petersburg"
      );

      const tx = Transaction.fromTxData(txObject, {
        common,
      });
      const privateKey = Buffer.from(userprivatekey.substring(2, 66), "hex");
      // console.log(privateKey, "privateKeyprivateKey");
      const signedTx = tx.sign(privateKey);

      const serializedTx = signedTx.serialize();

      const raw1 = "0x" + serializedTx.toString("hex");

      let responseData = await web3.eth.sendSignedTransaction(raw1);
      console.log(responseData, "responseDataresponseDataETHETH");
      return {
        status: true,
        message: "success",
      };
    } else {
      console.log("USER ETH BALNCE NOT FOUND");
      return {
        status: false,
        message: "No Balance",
      };
    }
  } catch (err) {
    console.log(err, "Amount Move to Admin Catch Error");
    return {
      status: false,
      message: "Catch Error",
    };
  }
};

// export const amountMoveToAdmin = async (data) => {
//   try {
//     let respData = await axios({
//       method: "post",
//       url: `${config.COIN_GATE_WAY.ETH.URL}/eth-move-to-admin`,
//       data,
//     });

//     if (respData && respData.data) {
//       return respData.data;
//     }
//   } catch (err) {
//     return {
//       status: false,
//       message: "Error on Server",
//     };
//   }
// };

// export const tokenMoveToAdmin = async (data) => {
//   try {
//     let respData = await axios({
//       method: "post",
//       url: `${config.COIN_GATE_WAY.ETH.URL}/erc20-token-move-to-admin`,
//       data,
//     });

//     if (respData && respData.data) {
//       return respData.data;
//     }
//   } catch (err) {
//     return {
//       status: false,
//       message: "Error on Server",
//     };
//   }
// };

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
    let contract = new web3.eth.Contract(JSON.parse(minAbi), contractAddress);
    let tokenbalance = await contract.methods.balanceOf(userAddress).call();
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
    console.log(muldecimal, "muldecimalETH");
    amount = parseFloat(amount) * parseFloat(muldecimal);
    console.log(amount, "tokenMoveToAdminETH");
    console.log(tokenbalance, "tokenbalanceETH");
    if (tokenbalance > 0) {
      let getBalance = await web3.eth.getBalance(userAddress);
      let txCount = await web3.eth.getTransactionCount(userAddress);
      let getGasPrice = await web3.eth.getGasPrice();
      let gaslimit = web3.utils.toHex(500000);
      let fee = web3.utils.toHex(getGasPrice) * gaslimit;
      console.log(getBalance, getBalance > fee, "getBalanceETH");
      if (getBalance > fee) {
        // let tokenAmount = web3.utils.toHex(
        //   web3.utils.toWei(amount.toString(), "ether")
        // );
        // let tokenAmount = web3.utils.toHex(web3.utils.toWei(amount.toString(), "ether"));
        console.log(amount.toString(), "amount.toString()ETH");

        let data = contract.methods
          .transfer(adminAddress, amount.toString())
          .encodeABI();
        let transactionObject = {
          gasLimit: web3.utils.toHex(500000),
          gasPrice: web3.utils.toHex(getGasPrice),
          data: data,
          nonce: txCount,
          from: userAddress,
          to: contractAddress,
        };

        const common = await Common.forCustomChain(
          "mainnet",
          {
            name: "bnb",
            networkId: config.COIN_GATE_WAY.ETH.NETWORK_ID,
            chainId: config.COIN_GATE_WAY.ETH.CHAIN_ID,
          },
          "petersburg"
        );

        const tx = Transaction.fromTxData(transactionObject, {
          common,
        });
        const privateKey = Buffer.from(userPrivateKey.substring(2, 66), "hex");

        const signedTx = tx.sign(privateKey);

        const serializedTx = signedTx.serialize();

        const raw1 = "0x" + serializedTx.toString("hex");

        let result = await web3.eth.sendSignedTransaction(raw1);
        return {
          status: true,
          result: result,
        };
      } else {
        let amopunttosend =
          parseFloat(fee) -
          parseFloat(getBalance) +
          parseFloat(web3.utils.toWei("0.00041", "ether"));

        let { status, message, result } = await ethMovetoUser({
          amount: amopunttosend / 1000000000000000000,
          adminAddress: config.COIN_GATE_WAY.ETH.ADDRESS,
          adminPrivatekey: config.COIN_GATE_WAY.ETH.PRIVATE_KEY,
          userAddress: userAddress,
        });
        console.log(status, "ethMovetoUserETH");
        return {
          status: false,
          message: "No Balance",
        };
      }
    } else {
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

export const ethMovetoUser = async ({
  amount,
  adminAddress,
  adminPrivatekey,
  userAddress,
}) => {
  try {
    console.log("ETH Amount Move to User");
    var adminPrivatekey = decryptString(adminPrivatekey);
    // var adminPrivatekey = adminPrivatekey

    console.log(
      amount,
      "amountETH",
      adminAddress,
      "adminAddressETH",
      adminPrivatekey,
      "adminPrivatekey",
      userAddress,
      "userAddress"
    );
    let balance = await web3.eth.getBalance(adminAddress);
    let getGasPrice = await web3.eth.getGasPrice();
    let txCount = await web3.eth.getTransactionCount(adminAddress);
    var gaslimit = web3.utils.toHex(21000);
    var fee = web3.utils.toHex(getGasPrice) * gaslimit;
    // var amount1 = amount * 1000000000000000000 - fee;
    var amount1 = amount * 1000000000000000000;
    // amount = amount * 1000000000000000000;

    // Convert to wei value

    console.log(
      balance,
      "balance",
      amount1,
      "amount----------ETH-----------------------------"
    );
    if (balance > amount1) {
      // const amountToSend = web3.toWei(amount1, "ether");
      var updateVal = {};
      const txObject = {
        nonce: web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(gaslimit),
        gasPrice: web3.utils.toHex(getGasPrice),
        to: userAddress.toString(),
        // value: amountToSend ,
        value: web3.utils.toHex(amount1),
      };
      console.log(txObject, "txobjecttttttttttttttttttETH");
      const common = await Common.forCustomChain(
        "mainnet",
        {
          name: "bnb",
          networkId: config.COIN_GATE_WAY.ETH.NETWORK_ID,
          chainId: config.COIN_GATE_WAY.ETH.CHAIN_ID,
        },
        "petersburg"
      );
      // console.log(common,'commoncommoncommoncommon')

      const tx = Transaction.fromTxData(txObject, { common });
      // console.log(tx,'txtxtx')

      const privateKey = Buffer.from(adminPrivatekey.substring(2, 66), "hex");

      const signedTx = tx.sign(privateKey);

      const serializedTx = signedTx.serialize();

      const raw1 = "0x" + serializedTx.toString("hex");

      let responseData = await web3.eth.sendSignedTransaction(raw1);

      var recamount = web3.utils.fromWei(
        amount1.toString(),
        // amount1,
        "ether"
      );

      return {
        status: true,
        message: "Withdraw successfully",
        trxId: responseData.transactionHash,
      };
    } else {
      console.log("ther is no balance check it");
      return {
        status: false,
        message: "ETH No Balance",
      };
    }
  } catch (err) {
    console.log(err, "errerrerrerrerrerrerr");
    return {
      status: false,
      message: err.toString(),
    };
  }
};
export const getLatestBlock = async () => {
  try {
    let respData = await axios({
      method: "get",
      url: `${config.COIN_GATE_WAY.ETH.URL}/getLatestBlock`,
    });

    if (respData && respData.data && respData.data.status)
      return {
        latestBlockNumber: respData.data.data,
      };
  } catch (err) {
    return {
      latestBlockNumber: 0,
    };
  }
};

export const getTransactionList = (
  inc,
  count,
  currencyData,
  transactions = []
) => {
  if (inc <= count) {
    let blknum = converter.decToHex(inc.toString());
    let params = config.coinGateway.eth.blockTransaction;
    params["tag"] = blknum;
    params = querystring.stringify(params);
    https
      .get(config.coinGateway.eth.etherscanUrl + params, (resp) => {
        let data = "";
        resp.on("data", (chunk) => {
          data += chunk;
        });
        resp.on("end", () => {
          try {
            var responseTxn = JSON.parse(data);
            if (responseTxn.result.transactions.length > 0) {
              transactions = [
                ...transactions,
                ...responseTxn.result.transactions,
              ];
              var inc2 = inc + 1;
              getTransactionList(inc2, count, currencyData, transactions);
            } else {
              var inc2 = inc + 1;
              getTransactionList(inc2, count, currencyData, transactions);
            }
          } catch (err) {
            var inc2 = inc + 1;
            getTransactionList(inc2, count, currencyData, transactions);
          }
        });
      })
      .on("error", (err) => {
        let inc2 = inc + 1;
        getTransactionList(inc2, count, currencyData);
        console.log("Error: " + err.message);
      });
  } else {
    return checkCurrency(transactions, count, currencyData);
  }
};

export const checkCurrency = async (response, blockCnt, currencyData) => {
  try {
    let tokenData = await Currency.find({ type: "Token", tokenType: 1 });
    if (response) {
      let count = 0;
      for (let item of response) {
        count = count + 1;
        // Check ERC 20 TOKEN ADDRESS
        if (item.contractAddress) {
          let checkContractAddress =
            tokenData &&
            tokenData.length > 0 &&
            tokenData.find((el) => {
              return (
                el.contractAddress.toUpperCase() ==
                item.contractAddress.toUpperCase()
              );
            });

          if (checkContractAddress) {
            let currencyData = checkContractAddress;
            await updateTokenDeposit(item, currencyData);
            // await ethTokenUpdate(item, currencyData)
          }
        } else {
          await updateDeposit(item, currencyData);
        }

        if (response.length == count) {
          await Currency.update(
            { _id: currencyData._id },
            { $set: { block: blockCnt } }
          );
        }
      }
    } else {
      console.log("No Response ethGateway(checkCurrency)");
      return;
    }
  } catch (err) {
    console.log("Error on  ethGateway(checkCurrency)");
    return;
  }
};

async function updateTokenDeposit(transactionsData, currencyData) {
  try {
    if (isEmpty(transactionsData.to)) {
      // console.log("Invalid Address");
      return;
    }

    let userAssetData = await Assets.findOne({
      currencyAddress: {
        $regex: new RegExp(
          ".*" + transactionsData.to.toLowerCase() + ".*",
          "i"
        ),
      },
    }).populate({ path: "userId", select: "email _id" });

    if (userAssetData) {
      // if (userAssetData.currencyAddress.toUpperCase() != keys.ethaddress.toUpperCase()) {
      //     const slashminabii = JSON.parse(currencyData.minABI);
      //     const curminabi = slashminabii.replace(/\\|\//g, '')

      //     token_move_to_admin(
      //         userAssetData.currencyAddress,
      //         userAssetData.privateKey,
      //         keys.ethaddress,
      //         userAssetData.currencyAddress,
      //         userAssetData.userId._id,
      //         currencyData.decimals,
      //         curminabi,
      //         currencyData.contractAddress
      //     );
      // }

      let checkTransactionData = await Transaction.findOne({
        userId: userAssetData.userId._id,
        txid: transactionsData.hash,
      });

      if (checkTransactionData) {
        return;
      }

      if (transactionsData.tokenDecimal == "1") {
        var recamount = transactionsData.value / 10;
      } else if (transactionsData.tokenDecimal == "6") {
        var recamount = transactionsData.value / 1000000;
      } else if (transactionsData.tokenDecimal == "8") {
        var recamount = transactionsData.value / 100000000;
      }

      var currencyfromrespone;
      if (transactionsData.tokenSymbol == "????PC") {
        currencyfromrespone = "💲PC";
      } else {
        currencyfromrespone = transactionsData.tokenSymbol;
      }

      var transactions = new Transaction();
      transactions["user_id"] = userAssetData.userId._id;
      transactions["currencyId"] = currencyData._id;
      transactions["fromaddress"] = transactionsData.from;
      transactions["toaddress"] = transactionsData.to;
      transactions["transferType"] = "TOUSER";
      transactions["amount"] = recamount;
      transactions["txid"] = transactionsData.hash;
      transactions["paymentType"] = 1;
      transactions["status"] = 3;

      var incdata = {};
      incdata["spotwallet"] = recamount;
      await transactions.save();

      await Assets.findOneAndUpdate(
        { _id: userAssetData._id },
        { $inc: incdata },
        { new: true, fields: { balance: 1 } }
      );
      return;
    } else {
      return;
    }
  } catch (err) {
    console.log("Error on  ethGateway(updateDeposit)");
  }
}

export const updateDeposit = async (transactionsData, currencyData) => {
  try {
    if (isEmpty(transactionsData.to)) {
      // console.log("Invalid Address");
      return;
    }
    let userAssetData = await Assets.findOne({
      currencyAddress: {
        $regex: new RegExp(
          ".*" + transactionsData.to.toLowerCase() + ".*",
          "i"
        ),
      },
    }).populate({ path: "userId", select: "email _id" });

    if (userAssetData) {
      let respData = await axios({
        method: "post",
        url: `${config.COIN_GATE_WAY.ETH.URL}/getBalance`,
        data: {
          address: userAssetData.currencyAddress,
        },
      });

      if (respData && respData.data) {
        if (
          userAssetData.currencyAddress.toUpperCase() !=
          config.coinGateway.eth.address.toUpperCase()
        ) {
          amountMoveToAdmin({
            userAddress: userAssetData.currencyAddress,
            userPrivateKey: userAssetData.privateKey,
          });
        }
        const { balance } = respData.data.result;
        if (balance > 0) {
          let checkTransactionData = await Transaction.findOne({
            userId: userAssetData.userId._id,
            txid: transactionsData.hash,
          });
          if (checkTransactionData) {
            return;
          }

          let fromWeiRespData = await axios({
            method: "post",
            url: `${config.COIN_GATE_WAY.ETH.URL}/fromWei`,
            data: {
              balance: transactionsData.value,
            },
          });

          if (fromWeiRespData && fromWeiRespData.data) {
            const { amount } = fromWeiRespData.data.result;

            let transactions = new Transaction();
            transactions["userId"] = userAssetData.userId._id;
            transactions["currencyId"] = currencyData._id;
            transactions["fromaddress"] = transactionsData.from;
            transactions["toaddress"] = transactionsData.to;
            transactions["transferType"] = "TOUSER";
            transactions["amount"] = amount;
            transactions["txid"] = transactionsData.hash;
            transactions["status"] = 3;
            transactions["paymentType"] = 1;
            // transactions["createdAt"] = 1;

            let newTransactions = await transactions.save();
            await Assets.updateOne(
              { _id: userAssetData._id },
              {
                $inc: {
                  spotwallet: amount,
                },
              }
            );
          }
          return;
        } else {
          console.log("no amount ethGateway(updateDeposit)");
          return;
        }
      } else {
        console.log("Error on getBalance ethGateway(updateDeposit)");
        return;
      }
    } else {
      // console.log("No userAssetData ethGateway(updateDeposit)")
      return;
    }
  } catch (err) {
    console.log("Error on  ethGateway(updateDeposit)");
    return;
  }
};

// export const amountMoveToAdmin = async ({ userAddress, userPrivateKey }) => {
//     try {
//         let respData = await axios({
//             'method': 'post',
//             'url': `${config.COIN_GATE_WAY.ETH.URL}/amountMoveToAdmin`,
//             'data': {
//                 userAddress,
//                 userPrivateKey,
//                 adminAddress: config.coinGateway.eth.address
//             }
//         });

//         if (respData && respData.data) {
//             console.log("Success ON amountMoveToAdmin")
//             return
//         } else {
//             console.log("FAILED ON amountMoveToAdmin")
//             return
//         }
//     }
//     catch (err) {
//         console.log("ERRON ON amountMoveToAdmin", err)
//         return
//     }
// }

export const amountMoveToUser = async (data) => {
  try {
    let respData = await axios({
      method: "post",
      url: `${config.COIN_GATE_WAY.ETH.URL}/eth-move-to-user`,
      data,
    });
    if (respData && respData.status == 200) {
      return {
        status: true,
        data: respData.data.data,
      };
    } else {
      return {
        status: false,
        message: "Some error",
      };
    }
  } catch (err) {
    return {
      status: false,
      message: err.response.data.message,
    };
  }
};

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
    console.log(decimals, "---------------decimalETH", amount);
    adminPrivateKey = decryptString(adminPrivateKey);
    console.log("-------admin privateKeyETH", adminPrivateKey);
    let contract = new web3.eth.Contract(JSON.parse(minAbi), contractAddress);
    let tokenbalance = await contract.methods.balanceOf(adminAddress).call();
    console.log(tokenbalance, "tokenbalancetokenbalanceETH");
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
    amount = parseFloat(amount) * parseFloat(muldecimal);
    console.log(amount, "amountamountETH");
    if (tokenbalance > 0) {
      let getBalance = await web3.eth.getBalance(adminAddress);
      let txCount = await web3.eth.getTransactionCount(adminAddress);
      let getGasPrice = await web3.eth.getGasPrice();
      let gaslimit = web3.utils.toHex(500000);
      let fee = web3.utils.toHex(getGasPrice) * gaslimit;
      console.log(getBalance > fee, "getBalance > feeETH");
      if (getBalance > fee) {
        let tokenAmount = web3.utils.toHex(
          web3.utils.toWei(amount.toString(), "ether")
        );
        let data = contract.methods
          .transfer(userAddress, amount.toString())
          .encodeABI();
        let transactionObject = {
          gasLimit: web3.utils.toHex(500000),
          gasPrice: web3.utils.toHex(getGasPrice),
          data: data,
          nonce: txCount,
          from: adminAddress,
          to: contractAddress,
        };

        const common = await Common.forCustomChain(
          "mainnet",
          {
            name: "ETH",
            networkId: config.COIN_GATE_WAY.ETH.NETWORK_ID,
            chainId: config.COIN_GATE_WAY.ETH.CHAIN_ID,
          },
          "petersburg"
        );

        const tx = Transaction.fromTxData(transactionObject, {
          common,
        });
        const privateKey = Buffer.from(adminPrivateKey.substring(2, 66), "hex");

        const signedTx = tx.sign(privateKey);

        const serializedTx = signedTx.serialize();

        const raw1 = "0x" + serializedTx.toString("hex");

        let result = await web3.eth.sendSignedTransaction(raw1);

        return {
          status: true,
          trxId: result && result.transactionHash,
          message: "Withdraw successfully",
        };
      } else {
        return {
          status: false,
          message: "ETH Balance Not Found",
        };
      }
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

// export const tokenMoveToUser = async (data) => {
//   try {
//     let respData = await axios({
//       method: "post",
//       url: `${config.COIN_GATE_WAY.ETH.URL}/erc20-token-move-to-user`,
//       data,
//     });
//     if (respData && respData.status == 200) {
//       return {
//         status: true,
//         data: respData.data.data,
//       };
//     } else {
//       return {
//         status: false,
//         message: "Some error",
//       };
//     }
//   } catch (err) {
//     return {
//       status: false,
//       message: err.response.data.message,
//     };
//   }
// };

// async function example(){
//    let currencyData = await Currency.find({});
//    // console.log(currencyData[i].currencySymbol,'------------')
//    for(let i=0;i<currencyData.length;i++){
//      let data = await Assets.findOneAndUpdate(
//         {userId:ObjectId("61cc2578f175fe299929e3f4"),currencySymbol:currencyData[i].currencySymbol},
//         {$set:{currencyAddress:"",privateKey:""}},
//         {new:true}
//     )
//      console.log(data,'------------')
//    }
// }

// example();
