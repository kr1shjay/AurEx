import Web3 from "web3";
// import { UseTokens, checkIsOurToken, TokenInfo } from "./useToken";
// import { RPC_URL, ERC20_ABI, ADMIN_ID, PRIVATE_KEY, WALLET_ADDRESS } from "../config/config";
import ERC20_ABI from '../config/ERC20ABI.json'
import BigNumber from 'bignumber.js';
import mongoose from 'mongoose';
const ethers = require('ethers');

// import config
import config from "../config";
const ObjectId = mongoose.Types.ObjectId;

// import new modal
import { Currency, User, Wallet, UserReference } from "../models";

// import modal
import Assets from "../models/Assets";
import TransactionDB from "../models/Transaction";
import isEmpty from "is-empty";
//controller
import { createPassBook } from "../controllers/passbook.controller";
import { bnbMovetoAdmin ,tokenMoveToAdmin} from "../controllers/coin/bnb.controller";


const web3 = new Web3(config.COIN_GATE_WAY.BNB.URL);

export const UseRecieve = async () => {
    // const web3= await UseWeb3()
    try { // Get the latest block number
        const latestBlockNumber = await web3.eth.getBlockNumber();

        // Check transactions in the latest block
        const block = await web3.eth.getBlock(parseInt(latestBlockNumber), false);


        block.transactions.forEach(async transaction => {
            // console.log(transaction,'transaction')
            await UseValidateTx(transaction);
        })
        //   console.log("Blocks Length : ",block.transactions.length);
    } catch (err) {
        console.log(err, "UseRecieve__err")
    }
}

export const UseValidateTx = async (transactionHsh) => {
    // console.log("transaction",transaction);
    try {
        web3.eth.getTransaction(transactionHsh, async (error, transaction) => {
            if (transaction) {
            
                const { to, from, value, input } = transaction;
                // console.log(to, from, value, input ,'to, from, value, input')
                // check to is Our ADDRESS or NOT, If NOT return here
                const recipient = input == "0x" ? to : `0x${input.slice(34, 74)}`; // Extract the recipient's address from the input data
                // console.log(recipient,'to, from, value, input')
                if(config.COIN_GATE_WAY.BNB.ADDRESS.toLowerCase() == from.toLowerCase()){
                    return false
                }
                if(recipient =='0x'){
                    return false
                }
                let { success, data } = await checkAddress(recipient)
                
                if (success == true) {
                    let walletData = data.assets.find((val) => (val.address.toLocaleLowerCase() == recipient.toLocaleLowerCase()))
                    console.log(walletData,'UseValidateTx__walletData')
                    let walletCurrency = await Currency.findOne({ _id: walletData._id });
                    let transactionExist = await TransactionDB.findOne({
                        txid: transaction.hash,
                    });
                    if (!isEmpty(transactionExist) && !(parseFloat(amount) >= parseFloat(walletCurrency.depositminlimit))) {
                        return false
                    }
                    console.log("Tx Hash : ",transaction.hash)
                    let userData = await User.findOne({ _id: data._id })
                    if (input.startsWith('0xa9059cbb')) {
                        const tokenAddress = to;
    
                        const tokenValue = new BigNumber(`0x${input.slice(74)}`).toString(); // Extract the amount in Wei and convert it to a string
                        const token = await UseERC20(tokenAddress);
                        const symbol = await token.methods.symbol().call();
                        const decimals = await token.methods.decimals().call();
                        const amount = tokenValue / 10 ** parseInt(decimals);
                        
    
                        const txInfo = await hasTxlogs(transaction.hash);
                        console.log("txInfo11", txInfo);
                        if (txInfo.status) {
                            console.log(`..${recipient} Recieved ${amount} ${symbol} from ${from}`)
    
                            const { status, message } = await tokenMoveToAdmin({
                                minAbi: walletCurrency.minABI,
                                contractAddress: walletCurrency.contractAddress,
                                adminAddress: config.COIN_GATE_WAY.BNB.ADDRESS,
                                decimals: walletCurrency.contractDecimal,
                                amount: amount,
                                userPrivateKey: walletData.privateKey,
                                userAddress: walletData.address,
                              });
                              console.log(status,'tokenMoveToAdmin')
                              if(status){
                                let Transaction = new TransactionDB({
                                    userId: data.userId,
                                    currencyId: walletData._id,
                                    fromAddress: from,
                                    toAddress: recipient,
                                    txid: transaction.hash,
                                    coin: walletData.coin,
                                    paymentType: "coin_deposit",
                                    amount: amount,
                                    status: "completed",
                                });
                                let tran = await Transaction.save();
                                console.log(Transaction,'Transaction')
                                let beforeBalance = walletData.spotBal
                                walletData.spotBal = parseFloat(walletData.spotBal) + parseFloat(amount);
                                await data.save()
                                // CREATE PASS_BOOK
                                createPassBook({
                                    userId: userData._id,
                                    coin: walletData.coin,
                                    currencyId: walletData._id,
                                    tableId: Transaction._id,
                                    beforeBalance: beforeBalance,
                                    afterBalance: parseFloat(walletData.spotBal),
                                    amount: parseFloat(amount),
                                    type: "coin_deposit",
                                    category: "credit",
                                });
                              }
                        }
    
                    }
                    else if (input == "0x") {
                        const symbol = "BNB";
                        const amount = parseFloat(value) / (10 ** parseInt(18));
                        const recipient = to;
    
                        const txInfo = await hasTxlogs(transaction.hash);
                        console.log("txInfo22", txInfo);
                        if (txInfo.status) {
                            console.log(`${recipient} Recieved ${amount} ${symbol} from ${from}`)
                            const { status } = await bnbMovetoAdmin({
                                amount: amount,
                                // amount: parseInt(result.value) ,
                                useraddress: walletData.address,
                                userprivatekey: walletData.privateKey,
                                adminAddress: config.COIN_GATE_WAY.BNB.ADDRESS,
                              });
                              console.log('bnbMovetoAdmin',status)
                              if(status){
                                let Transaction = new TransactionDB({
                                    userId: data.userId,
                                    currencyId: walletData._id,
                                    fromAddress: from,
                                    toAddress: recipient,
                                    txid: transaction.hash,
                                    coin: walletData.coin,
                                    paymentType: "coin_deposit",
                                    amount: amount,
                                    status: "completed",
                                });
                                let tran = await Transaction.save();
                                let beforeBalance = walletData.spotBal
                                walletData.spotBal = parseFloat(walletData.spotBal) + parseFloat(amount);
                                await data.save()
                                // CREATE PASS_BOOK
                                createPassBook({
                                    userId: userData._id,
                                    coin: walletData.coin,
                                    currencyId: walletData._id,
                                    tableId: Transaction._id,
                                    beforeBalance: beforeBalance,
                                    afterBalance: parseFloat(walletData.spotBal),
                                    amount: parseFloat(amount),
                                    type: "coin_deposit",
                                    category: "credit",
                                });
                              }
                        }
                    }
                }
                else {
                    return true
                }
            }
        })
        
    } catch (err) {
        console.log('UseValidateTx__err', err)
    }

}

export const UseERC20 = async (Token) => {
    try {
        const contract = new web3.eth.Contract(ERC20_ABI, Token);
        return contract;
    } catch (err) {
        console.log("UseERC20 err", err);
    }

};

export const IsTransacted = async (HASH) => {
    try {
        const hashvalue = await web3.eth.getTransactionReceipt(HASH);
        return hashvalue;
    } catch (err) {
        console.log("IsTransacted err", err);
        return null;
    }

}

export const hasTxlogs = async (HASH) => {
    try {
        let res = null;
        do {
            res = await IsTransacted(HASH)

        } while (!res)
        return res;
    } catch (err) {
        console.log("hasTxlogs err", err);
    }

}

export const checkAddress = async (address) => {
    try {
        let Address = address.toLocaleLowerCase()
        
        let usersData = await Wallet.findOne({
            "assets.address": {
              $regex: new RegExp(".*" + address.toLowerCase() + ".*", "i"),
            },
            // "assets.coin": currencySymbol,
          });
        //   let usersData2 = await Wallet.find({
        //     "assets.address": {
        //       $regex: new RegExp(".*" + address.toLowerCase() + ".*", "i"),
        //     },
        //     // "assets.coin": currencySymbol,
        //   });
         // console.log(Address,'Address',address,usersData)
        // let usersData = await Wallet.findOne({ 'assets.address': address })
        // console.log("usersData",usersData);
        if (usersData) {
            return { success: true, data: usersData };
        } else {
            return { success: false, data: {}};
        }
    } catch (err) {

        console.log(err, "checkAddress__err")
        return { success: false, data: {} };
    }
}
