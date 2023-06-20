// import package
import mongoose from 'mongoose';

// import models
import {
    SpotPair,
    SpotTrade,
    Wallet,
    Admin,
    Currency,
    ApiKey
} from '../../models';

// import SpotPairOld from '../models_Old/spotpairs'
// import SpotTradeOld from '../models_Old/spottradeTable'

// import config
import config from '../../config';
import { socketEmitOne, socketEmitAll } from '../../config/socketIO';

// import controller
import * as binanceCtrl from '../../controllers/binance.controller'
import { createPassBook } from '../../controllers/passbook.controller';
import {getOpenOrderSocket , getOrderHistorySocket , getTradeHistorySocket ,getOrderBookSocket , calculateServiceFee  ,assetUpdate ,marketPriceSocket ,recentTradeSocket ,orderBookData, recentTrade, matchEngine,marketTradeMatch} from '../../controllers/spotTrade.controller'

// import lib
import isEmpty from '../../lib/isEmpty';
import { decryptObject } from '../../lib/cryptoJS';
import { paginationQuery } from '../../lib/adminHelpers';
import { toFixed } from '../../lib/roundOf'
import { withoutServiceFee } from '../../lib/calculation'
import { encryptString, decryptString } from '../../lib/cryptoJS'
import { IncCntObjId } from '../../lib/generalFun';


const ObjectId = mongoose.Types.ObjectId;


let cancelOrderArr = [];
export let orderIds = [];
let marketOrderIds = [];
let tradeMatchCall = false;


// decryy()
async function decryy() {
    console.log(decryptString('U2FsdGVkX1804FveNbJaF1sGyBEtiW76UF2TDxLlzi0lk63z7Bcs1RIAcpVF9Fk8Am97h1ukICcG9EGCmTfvaRM50C0cfuOuQ3M0RfIFs+jrJUOBAh85/wOE+ogOmNgr'), '--------------------------------')
}
/**
 * Spot Order Place
 * METHOD : POST
 * URL : /api/new/spotOrder
 * BODY : newdate, spotPairId, stopPrice, price, quantity, buyorsell, orderType(limit,market,stopLimit,oco), limitPrice
*/
export const orderPlace = async (req, res) => {
    try {
        let api_key = req.header("x-api-key");
        console.log("orderreq",req.user)
        if(api_key!==null && api_key!== undefined && req.user.trade !==true){
             return res.status(400).json({  'statusCode':400, 'status': false, 'message': "You don't have permission to trade" });      
        }
        else{
            let reqBody = req.body
            console.log("orderreq",reqBody)
            if (reqBody.orderType == 'limit') {
                limitOrderPlace(req, res)
            } else if (reqBody.orderType == 'market') {
                marketOrderPlace(req, res)
            } else if (reqBody.orderType == 'stop_limit') {
                stopLimitOrderPlace(req, res)
            } else if (reqBody.orderType == 'stop_market') {
                stopMarketOrderPlace(req, res)
            } else if (reqBody.orderType == 'trailing_stop') {
                trailingStopOrderPlace(req, res)
            }
        }
    } catch (err) {
        console.log(err,'orderreq-err')
        return res.status(500).json({  'statusCode':400,'status': false, 'message': "System error" });
    }
}

/**
 * Limit order place
 * URL : /api/new/spotOrder
 * METHOD : POST
 * BODY : newdate, spotPairId, stopPrice, price, quantity, buyorsell, orderType(limit,market,stopLimit,oco), limitPrice
*/
export const limitOrderPlace = async (req, res) => {
    try {
        let reqBody = req.body;
        console.log("limitreq",reqBody)
        reqBody.price = parseFloat(reqBody.price)
        reqBody.quantity = parseFloat(reqBody.quantity)
        // console.log("-------reqBody.", reqBody)
        let spotPairData = await SpotPair.findOne({ "_id": reqBody.spotPairId });

        if (!spotPairData) {
            return res.status(400).json({ 'statusCode':400,'status': false, 'message': "Trade pair does not exist" });
        }

        if (reqBody.quantity < spotPairData.minQuantity) {
            return res.status(400).json({'statusCode':400,'status': false, 'message': 'Invalid Amount' });
        } else if (reqBody.quantity > spotPairData.maxQuantity) {
            return res.status(400).json({'statusCode':400,'status': false, 'message': 'Invalid Amount' });
        }

        if(reqBody.quantity < 0.0001){
            return res.status(400).json({ 'statusCode':400,'status': false, 'message': 'Invalid Amount'});
        }

        if(reqBody.price < 0.0001){
            return res.status(400).json({'statusCode':400,'status': false, 'message': "Invalid Price" });
        }
        let
            minPrice = spotPairData.markPrice - (spotPairData.markPrice * (spotPairData.minPricePercentage / 100)),
            maxPrice = spotPairData.markPrice + (spotPairData.markPrice * (spotPairData.maxPricePercentage / 100));
            console.log("minprice",minPrice);
            console.log("maxprice",maxPrice);


        if (reqBody.price < minPrice) {
            return res.status(400).json({ 'statusCode':400, 'status': false, 'message': 'Invalid Price' });
        } else if (reqBody.price > maxPrice) {
            return res.status(400).json({ 'statusCode':400, 'status': false, 'message': 'Invalid Price' });
        }

        let currencyId = reqBody.buyorsell == 'buy' ? spotPairData.secondCurrencyId : spotPairData.firstCurrencyId;

        let usrWallet = await Wallet.findOne({ '_id': req.user.id });
        if (!usrWallet) {
            return res.status(500).json({ 'statusCode':500, 'status': false, 'message': "System error" });
        }

        let usrAsset = usrWallet.assets.id(currencyId)
        if (!usrAsset) {
            return res.status(500).json({'statusCode':500,'status': false, 'message': "System error" });
        }

        let
            balance = parseFloat(usrAsset.spotBal),
            orderValue = (reqBody.buyorsell == 'buy') ? reqBody.price * reqBody.quantity : reqBody.quantity;

        orderValue = toFixed(orderValue, 8)

        if (balance < orderValue) {
            return res.status(400).json({'statusCode':400,'status': false, 'message': "Insufficient wallet balance" });
        }

        usrAsset.spotBal = balance - orderValue;
        // if (spotPairData.botstatus == "off") {
        //     await usrWallet.save();
        // }

        let balDetect = await Wallet.updateOne({
            '_id': req.user.id,
            "assets._id": currencyId,
            '$where': "function() {return this.assets.some((obj) => { return obj._id == '" + currencyId + "' && (obj.spotBal - " + orderValue + ") >= 0;})}"
        }, {
            '$inc': {
                "assets.$.spotBal": -orderValue
            }
        }, {
            new: true
        });

        if (balDetect && balDetect.nModified != 1) {
            return res.status(400).json({ 'statusCode':400,'status': false, 'message': "Insufficient wallet balance" });
        }


        socketEmitOne('updateTradeAsset', {
            'currencyId': usrAsset._id,
            'spotBal': usrAsset.spotBal,
            'derivativeBal': usrAsset.derivativeBal,
        }, req.user.id)

        const newSpotTrade = new SpotTrade({
            userId: req.user.id,
            pairId: spotPairData._id,
            firstCurrencyId: spotPairData.firstCurrencyId,
            firstCurrency: spotPairData.firstCurrencySymbol,
            secondCurrencyId: spotPairData.secondCurrencyId,
            secondCurrency: spotPairData.secondCurrencySymbol,

            quantity: reqBody.quantity,
            price: reqBody.price,
            orderValue: reqBody.price * reqBody.quantity,

            pairName: `${spotPairData.firstCurrencySymbol}${spotPairData.secondCurrencySymbol}`,
            beforeBalance: balance,
            afterBalance: usrAsset.spotBal,
            
            orderType: reqBody.orderType,
            orderDate: new Date(),
            buyorsell: reqBody.buyorsell,
            status: 'open',
        });

        // console.log("0-------spotPairData", spotPairData.botstatus)
        if (spotPairData.botstatus == "binance") {
            let payloadObj = {
                'firstCoin': spotPairData.firstCurrencySymbol,
                'secondCoin': spotPairData.secondCurrencySymbol,
                "side": newSpotTrade.buyorsell,
                "price": newSpotTrade.price,
                "quantity": newSpotTrade.quantity,
                'orderType': newSpotTrade.orderType,
                "markupPercentage": spotPairData.markupPercentage,
                "minimumValue": 10
            }

            let binOrder = await binanceCtrl.orderPlace(payloadObj);
            // console.log("-----binOrder", binOrder)
            if (binOrder.status) {
                newSpotTrade.liquidityId = binOrder.data.orderId;
                newSpotTrade.liquidityType = 'binance';
                newSpotTrade.isLiquidity = true;
                newSpotTrade.markupPerc = spotPairData.markupPercentage;

                await usrWallet.save();
            } else {
                return res.status(400).json({ 'statusCode':400,'status': false, 'message': binOrder.message });
            }
        }

        let newOrder = await newSpotTrade.save();
        getOpenOrderSocket(newOrder.userId, newOrder.pairId)

        // CREATE PASS_BOOK
        createPassBook({
            'userId': req.user.id,
            'coin': reqBody.buyorsell == "buy" ? spotPairData.secondCurrencySymbol : spotPairData.firstCurrencySymbol,
            'currencyId': reqBody.buyorsell == "buy" ? spotPairData.secondCurrencyId : spotPairData.firstCurrencyId,
            'tableId': newOrder._id,
            'beforeBalance': balance,
            'afterBalance': usrAsset.spotBal,
            'amount': parseFloat(orderValue),
            'type': 'spot_trade',
            'category': 'debit'
        })

        if (spotPairData.botstatus == 'off') {
            getOrderBookSocket(newOrder.pairId)
            // tradeList(newOrder, spotPairData)
            orderIds.push(newOrder._id.toString())
            matchEngine()
        } else if (spotPairData.botstatus == 'binance') {
            await getOrderHistorySocket(newOrder.userId, newOrder.pairId)
            await getTradeHistorySocket(newOrder.userId, newOrder.pairId)
        }

        return res.status(200).json({ 'statusCode':200,'status': true, 'message': "Your order placed successfully.",'orderId':newOrder._id});

    } catch (err) {
        // console.log('err', err)
        return res.status(500).json({ 'statusCode':500,'status': false, 'message': "System error" });
    }
}


// /** 
//  * Match Engine (QUEUE CONCEPT)
// */
// export const matchEngine = async () => {
//     try {
//         if (tradeMatchCall) {
//             return
//         }
//         tradeMatchCall = true
//         // console.log(orderIds, '---orderIds')
//         if (marketOrderIds && Array.isArray(marketOrderIds) && marketOrderIds.length > 0) {
//             let newOrder = await SpotTrade.findOne({ '_id': marketOrderIds[0], 'orderType': 'market', 'status': { "$in": ['open'] } })
//             if (newOrder) {
//                 let pairData = await SpotPair.findOne({ "_id": newOrder.pairId, 'status': 'active' });
//                 if (pairData) {
//                     await tradeList(newOrder, pairData)
//                 }
//             }
//             marketOrderIds.shift()
//             tradeMatchCall = false
//             matchEngine()
//             return
//         } else if (orderIds && Array.isArray(orderIds) && orderIds.length > 0) {
//             let newOrder = await SpotTrade.findOne({ '_id': orderIds[0], 'status': { "$in": ['open', 'pending'] } })
//             if (newOrder) {
//                 let pairData = await SpotPair.findOne({ "_id": newOrder.pairId, 'status': 'active' });
//                 if (pairData) {
//                     await tradeList(newOrder, pairData)
//                 }
//             }
//             orderIds.shift()
//             tradeMatchCall = false
//             matchEngine()
//             return
//         }
//         tradeMatchCall = false
//         // console.log(orderIds, '---orderIds')
//         // matchEngine()
//         return
//     } catch (err) {
//         return res.status(500).json({ 'statusCode':500,'status': false, 'message': "System error" });
//     }
// }


/**
 * Market order place
 * URL : /api/new/spotOrder
 * METHOD : POST
 * BODY : spotPairId, quantity, buyorsell, orderType(market)
*/
export const marketOrderPlace = async (req, res) => {
    try {
        let reqBody = req.body;

        console.log("marketOrderPlace ",reqBody)
        reqBody.quantity = parseFloat(reqBody.quantity)
        let spotPairData = await SpotPair.findOne({ "_id": reqBody.spotPairId });

        if (!spotPairData) {
            return res.status(400).json({  'statusCode':400,'status': false, 'message': "Trade pair does not exist" });
        }

        if (reqBody.quantity < spotPairData.minQuantity) {
            return res.status(400).json({  'statusCode':400,'status': false, 'message': 'Invalid Amount' });
        } else if (reqBody.quantity > spotPairData.maxQuantity) {
            return res.status(400).json({  'statusCode':400,'status': false, 'message': 'Invalid Amount' });
        }

        if(reqBody.quantity < 0.0001){
            return res.status(400).json({  'statusCode':400,'status': false, 'message': 'Invalid Amount' });
        }

        let currencyId = reqBody.buyorsell == 'buy' ? spotPairData.secondCurrencyId : spotPairData.firstCurrencyId;

        let usrWallet = await Wallet.findOne({ "_id": req.user.id, })
        if (!usrWallet) {
            return res.status(500).json({ 'statusCode':500, 'status': false, 'message': "System error" });
        }

        let usrAsset = usrWallet.assets.id(currencyId)
        if (!usrAsset) {
            return res.status(500).json({  'statusCode':500,'status': false, 'message': "System error" });
        }

        let spotOrder,
            balance = parseFloat(usrAsset.spotBal),
            orderValue = 0,
            orderPrice = 0;
        let orderCost = 0;

        if (spotPairData.botstatus == "off") {
            spotOrder = await SpotTrade.aggregate([
                {
                    "$match": {
                        'pairId': ObjectId(reqBody.spotPairId),
                        'userId': { "$ne": ObjectId(req.user.id) },
                        'status': { "$in": ['open', 'pending'] },
                        'buyorsell': reqBody.buyorsell == 'buy' ? "sell" : "buy",
                        'isLiquidity': false
                    }
                },
                {
                    "$facet": {
                        "orderList": [
                            { "$sort": { 'price': reqBody.buyorsell == 'buy' ? 1 : -1 } },
                            { "$limit": 100 },
                        ],
                        "orderBook": [
                            {
                                "$group": {
                                    '_id': '$price',
                                    'quantity': { '$sum': '$quantity' },
                                    'filledQuantity': { '$sum': '$filledQuantity' },
                                }
                            },
                            { "$sort": { '_id': reqBody.buyorsell == 'buy' ? 1 : -1 } },
                            { "$limit": 100 },
                        ]
                    }
                },
            ])

            if ((spotOrder && spotOrder.length == 0) || (spotOrder[0].orderBook && spotOrder[0].orderBook.length == 0)) {
                return res.status(400).json({  'statusCode':400,'status': false, 'message': "There is no order" });
            }
            // orderPrice = spotOrder[0].orderBook[0]._id
            
            let orderBookQuantity = 0;
            // if (reqBody.buyorsell == 'buy') {
            // for (const key in spotOrder[0].orderBook) {
            //     let item = spotOrder[0].orderBook[key];
            //     orderBookQuantity = orderBookQuantity + (item.quantity - item.filledQuantity);

            //     if (orderBookQuantity >= reqBody.quantity) {
            //         // orderPrice = item._id;
            //         orderPrice = orderPrice + (spotOrder[0].orderBook[0]._id * (item.quantity - item.filledQuantity))
            //         break;
            //     } else if (key == (spotOrder[0].orderBook.length - 1)) {
            //         orderPrice = item._id;
            //     }
            // }
            // }

            // for (const key in spotOrder[0].orderBook) {
            //     let item = spotOrder[0].orderBook[key];
            //     let needQty = reqBody.quantity - orderBookQuantity;
            //     if (needQty > 0) {
            //         if (needQty < (item.quantity - item.filledQuantity)) {
            //             orderPrice = orderPrice + (item._id * needQty)
            //             orderBookQuantity = orderBookQuantity + needQty;
            //         } else {
            //             orderPrice = orderPrice + (item._id * (item.quantity - item.filledQuantity))
            //             orderBookQuantity = orderBookQuantity + (item.quantity - item.filledQuantity);
            //         }
            //     } else {
            //         break
            //     }
            // }
            for (const key in spotOrder[0].orderBook) {
                let item = spotOrder[0].orderBook[key];
                let needQty = reqBody.quantity - orderBookQuantity;
                if (needQty > 0) {
                    if (needQty < (item.quantity - item.filledQuantity)) {
                        orderPrice = item._id;
                        orderCost = orderCost + (item._id * needQty)
                        orderBookQuantity = orderBookQuantity + needQty;
                        console.log("orderBookQuantity",orderBookQuantity,"orderCost",orderCost,"orderPrice",orderPrice)
                    } else {
                        orderPrice = item._id;
                        orderCost = orderCost + (item._id * (item.quantity - item.filledQuantity))
                        orderBookQuantity = orderBookQuantity + (item.quantity - item.filledQuantity);
                        console.log("orderBookQuantity",orderBookQuantity,"orderCost",orderCost,"orderPrice",orderPrice)
                    }
                } else {
                    break
                }
            }
            // orderValue = (reqBody.buyorsell == 'buy') ? orderPrice * reqBody.quantity : reqBody.quantity;
            // orderValue = (reqBody.buyorsell == 'buy') ? orderPrice : orderBookQuantity;
            orderValue = (reqBody.buyorsell == 'buy') ? orderCost : orderBookQuantity;
            console.log("orderValue",orderValue)
        } else if (spotPairData.botstatus == "binance") {
            orderValue = (reqBody.buyorsell == 'buy') ? binanceCtrl.calculateMarkup(spotPairData.markPrice, spotPairData.markupPercentage, '+') * reqBody.quantity : reqBody.quantity;
            orderPrice = (reqBody.buyorsell == 'buy') ? binanceCtrl.calculateMarkup(spotPairData.markPrice, spotPairData.markupPercentage, '+') : spotPairData.markPrice;
        }
        if (orderValue <= 0) {
            return res.status(400).json({ 'statusCode':400, 'status': false, 'message': "Market order match error" });
        }



        // if ((spotOrder && spotOrder.length == 0) || (spotOrder[0].orderBook && spotOrder[0].orderBook.length == 0)) {           
        //     let checkBalance= reqBody.buyorsell=="buy"? reqBody.quantity* spotPairData.markPrice:reqBody.quantity
        //     console.log("checkbalanceeeeeeeeeeeeeeeeeeeee",checkBalance);
        //     if (balance < checkBalance) {
        //         return res.status(400).json({ 'status': false, 'message': "Due to insuffient balance order cannot be placed" });
        //     }
        //     usrAsset.spotBal = balance - checkBalance;
        //     await usrWallet.save();
        //     socketEmitOne('updateTradeAsset', {
        //         'currencyId': usrAsset._id,
        //         'spotBal': usrAsset.spotBal,
        //         'derivativeBal': usrAsset.derivativeBal,
        //     }, req.user.id)
        // }
        // if (balance < orderValue) {
        //     return res.status(400).json({ 'status': false, 'message': "Due to insuffient balance order cannot be placed" });
        // }

        // if (spotPairData.botstatus == 'off') {
        //     await usrWallet.save();
        // }
        usrAsset.spotBal = balance - orderValue;

        let balDetect = await Wallet.updateOne({
            '_id': req.user.id,
            "assets._id": currencyId,
            '$where': "function() {return this.assets.some((obj) => { return obj._id == '" + currencyId + "' && (obj.spotBal - " + orderValue + ") >= 0;})}"
        }, {
            '$inc': {
                "assets.$.spotBal": -orderValue
            }
        }, {
            new: true
        });

        if (balDetect && balDetect.nModified != 1) {
            return res.status(400).json({  'statusCode':400,'status': false, 'message': "Insufficient wallet balance" });
        }


        socketEmitOne('updateTradeAsset', {
            'currencyId': usrAsset._id,
            'spotBal': usrAsset.spotBal,
            'derivativeBal': usrAsset.derivativeBal,
        }, req.user.id)

        let newOrderData = {
            '_id': ObjectId(),
            'userId': req.user.id,
            'pairId': spotPairData._id,
            'firstCurrencyId': spotPairData.firstCurrencyId,
            'firstCurrency': spotPairData.firstCurrencySymbol,
            'secondCurrencyId': spotPairData.secondCurrencyId,
            'secondCurrency': spotPairData.secondCurrencySymbol,
            'price': orderPrice,
            // orderValue: orderValue,

            'quantity': reqBody.quantity,
            'filledQuantity': 0,
            'pairName': `${spotPairData.firstCurrencySymbol}${spotPairData.secondCurrencySymbol}`,
            'beforeBalance': balance,
            'afterBalance': usrAsset.spotBal,
            'orderType': reqBody.orderType,
            'orderDate': new Date(),
            'buyorsell': reqBody.buyorsell,
            'status': 'open',
        }
        var newOrder
        if (spotPairData.botstatus == "off") {

            console.log("no spottyuussssssssssssssssssssssssssssss", spotOrder)

            // if ((spotOrder && spotOrder.length == 0) || (spotOrder[0].orderBook && spotOrder[0].orderBook.length == 0)) {
            //     newOrderData.price=spotPairData.markPrice;
            //     let newOrder = await new SpotTrade(newOrderData).save();
            //        // await newOrder.save();
            //         await getOrderBookSocket(newOrder.pairId);
            //         await getOpenOrderSocket(newOrder.userId,newOrder.pairId)
            //     //     await  getOrderHistorySocket(newOrder.userId, newOrder.pairId)
            //     //   await  getTradeHistorySocket(newOrder.userId, newOrder.pairId)
            //     }else{
            newOrder = await new SpotTrade(newOrderData).save();

            // CREATE PASS_BOOK
            createPassBook({
                'userId': req.user.id,
                'coin': reqBody.buyorsell == "buy" ? spotPairData.secondCurrencySymbol : spotPairData.firstCurrencySymbol,
                'currencyId': reqBody.buyorsell == "buy" ? spotPairData.secondCurrencyId : spotPairData.firstCurrencyId,
                'tableId': newOrderData._id,
                'beforeBalance': balance,
                'afterBalance': parseFloat(usrAsset.spotBal),
                'amount': parseFloat(orderValue),
                'type': 'spot_trade',
                'category': 'debit'
            })
            console.log("no spot orderrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr", newOrder)
            marketOrderIds.push(newOrder._id.toString())
            matchEngine()
            // let matchStatus = await marketTradeMatch(newOrderData, spotOrder[0].orderList, 0, spotPairData)
            // if (!matchStatus) {
            //     return res.status(400).json({ 'status': false, 'message': "Market order match error" });
            // }
            // }


        } else if (spotPairData.botstatus == "binance") {
            let newOrder = new SpotTrade(newOrderData);

            //  // CREATE PASS_BOOK
            //  createPassBook({
            //     'userId': req.user.id,
            //     'coin': reqBody.buyorsell == "buy" ? spotPairData.secondCurrencySymbol : spotPairData.firstCurrencySymbol,
            //     'currencyId': reqBody.buyorsell == "buy" ? spotPairData.secondCurrencyId : spotPairData.firstCurrencyId,
            //     'tableId': newOrder._id,
            //     'beforeBalance': balance,
            //     'afterBalance': (parseFloat(balance) - parseFloat(orderValue)),
            //     'amount': parseFloat(orderValue),
            //     'type': 'spot_trade',
            //     'category': 'debit'
            // })

            let payloadObj = {
                'firstCoin': spotPairData.firstCurrencySymbol,
                'secondCoin': spotPairData.secondCurrencySymbol,
                "side": newOrder.buyorsell,
                "quantity": newOrder.quantity,
            }

            let binOrder = await binanceCtrl.marketOrderPlace(payloadObj);
            if (!binOrder.status) {
                return res.status(400).json({  'statusCode':400,'status': false, 'message': binOrder.message });
            }

            newOrder.liquidityId = binOrder.data.orderId;
            newOrder.liquidityType = 'binance';
            newOrder.isLiquidity = true;

            if (binOrder.data.status == 'FILLED') {
                newOrder.status = 'completed';
                let updateBal = 0;

                for (let binFill of binOrder.data.fills) {

                    let markupPrice = 0;
                    if (binOrder.data.side == 'SELL') {
                        markupPrice = binanceCtrl.calculateMarkup(binFill.price, spotPairData.markupPercentage, '-')
                    } else if (binOrder.data.side == 'BUY') {
                        markupPrice = orderPrice
                    }


                    let uniqueId = Math.floor(Math.random() * 1000000000);
                    newOrder.filled.push({
                        'pairId': spotPairData._id,
                        "userId": newOrder.userId,
                        "uniqueId": uniqueId,
                        "price": markupPrice,
                        "filledQuantity": binFill.qty,
                        // "Fees": binFill.commission,
                        "Fees": calculateServiceFee({
                            'price': binOrder.data.side == 'SELL' ? markupPrice * binFill.qty : binFill.qty,
                            'serviceFee': spotPairData.taker_fees
                        }),
                        "status": "filled",
                        "Type": 'sell',
                        "createdAt": new Date(),
                        "orderValue": markupPrice * binFill.qty,
                    })
                    newOrder['filledQuantity'] = newOrder.filledQuantity + binFill.qty;
                    if (binOrder.data.side == 'SELL') {
                        // updateBal = updateBal + ((binFill.price * binFill.qty) - binFill.commission)
                        updateBal = updateBal + (markupPrice * binFill.qty)
                    } else if (binOrder.data.side == 'BUY') {
                        // updateBal = updateBal + (binFill.qty - binFill.commission)
                        updateBal = updateBal + binFill.qty
                    }
                }

                newOrder.price = binOrder.data.cummulativeQuoteQty / binOrder.data.executedQty
                newOrder.orderValue = binOrder.data.cummulativeQuoteQty
                console.log(`--------withoutServiceFee({
                    'price': updateBal,
                    'serviceFee': spotPairData.taker_fees
                })`, withoutServiceFee({
                    'price': updateBal,
                    'serviceFee': spotPairData.taker_fees
                }))
                if (updateBal > 0) {
                    await assetUpdate({
                        'currencyId': newOrder.buyorsell == 'sell' ? newOrder.secondCurrencyId : newOrder.firstCurrencyId,
                        'userId': newOrder.userId,
                        // 'balance': updateBal,
                        'balance': withoutServiceFee({
                            'price': updateBal,
                            'serviceFee': spotPairData.taker_fees
                        }),
                    })
                }
            }
            await newOrder.save();
            await usrWallet.save();
            getOrderHistorySocket(newOrder.userId, newOrder.pairId)
            getTradeHistorySocket(newOrder.userId, newOrder.pairId)
        }
        return res.status(200).json({ 'statusCode':200,'status': true, 'message': "Your order placed successfully.",'orderId':newOrder._id});
    } catch (err) {

        console.log("errrrrrrrrrrrrrrrrrrrrrrrrrr", err)
        return res.status(500).json({  'statusCode':500,'status': false, 'message': "System error" });
    }
}

// export const marketTradeMatch = async (newOrder, orderData, count = 0, pairData) => {
//     try {

//         console.log("meworderrrrrrrrrrrrrrrrrrr", newOrder)
//         if (!['open', 'pending'].includes(newOrder.status)) {
//             return true;
//         } else if (isEmpty(orderData[count])) {
//             let updateNewOrder = {}

//             updateNewOrder['status'] = 'completed';
//             updateNewOrder['quantity'] = newOrder.filledQuantity;

//             let newOrderUpdate = await SpotTrade.findOneAndUpdate({
//                 '_id': newOrder._id
//             }, updateNewOrder, { 'new': true, 'upsert': true });


//             await getOrderHistorySocket(newOrder.userId, newOrder.pairId)
//             await getTradeHistorySocket(newOrder.userId, newOrder.pairId)

//             // // Balance Retrieve
//             // await assetUpdate({
//             //     'currencyId': newOrder.buyorsell == 'sell' ? newOrder.firstCurrencyId : newOrder.secondCurrencyId,
//             //     'userId': newOrder.userId,
//             //     'balance': newOrder.buyorsell == 'sell' ? (newOrder.quantity - newOrder.filledQuantity) : newOrder.price * (newOrder.quantity - newOrder.filledQuantity),
//             // })


//             await getOrderBookSocket(pairData._id)

//             return true;
//         }
//         let uniqueId = Math.floor(Math.random() * 1000000000);

//         let newOrderQuantity = newOrder.quantity - newOrder.filledQuantity;
//         let orderDataQuantity = orderData[count].quantity - orderData[count].filledQuantity;
//         if (newOrderQuantity == orderDataQuantity) {

//             /* New Order */
//             let updateNewOrder = {}
//             if (count == 0) {
//                 updateNewOrder = newOrder;
//                 updateNewOrder['price'] = orderData[count].price;
//                 updateNewOrder['orderValue'] = orderData[count].price * newOrderQuantity;
//             }

//             updateNewOrder['status'] = 'completed';
//             updateNewOrder['filledQuantity'] = newOrder.filledQuantity + newOrderQuantity;
//             updateNewOrder['$push'] = {
//                 "filled": {
//                     "pairId": newOrder.pairId,
//                     "sellUserId": newOrder.buyorsell == 'sell' ? newOrder.userId : orderData[count].userId,
//                     "buyUserId": newOrder.buyorsell == 'buy' ? newOrder.userId : orderData[count].userId,
//                     "userId": newOrder.userId,
//                     "sellOrderId": newOrder.buyorsell == 'sell' ? newOrder._id : orderData[count]._id,
//                     "buyOrderId": newOrder.buyorsell == 'buy' ? newOrder._id : orderData[count]._id,
//                     "uniqueId": uniqueId,
//                     "price": orderData[count].price,
//                     "filledQuantity": newOrderQuantity,
//                     "Fees": ((newOrder.buyorsell == 'sell' ? orderData[count].price * newOrderQuantity : newOrderQuantity) * pairData.taker_fees / 100),
//                     "status": "filled",
//                     "Type": newOrder.buyorsell,
//                     "createdAt": new Date(),
//                     "orderValue": orderData[count].price * newOrderQuantity,
//                 }
//             }

//             await SpotTrade.findOneAndUpdate({
//                 '_id': newOrder._id
//             }, updateNewOrder, { 'new': true, 'upsert': true });

//             await assetUpdate({
//                 'currencyId': newOrder.buyorsell == 'sell' ? newOrder.secondCurrencyId : newOrder.firstCurrencyId,
//                 'userId': newOrder.userId,
//                 'balance': withoutServiceFee({
//                     'price': newOrder.buyorsell == 'sell' ? orderData[count].price * newOrderQuantity : newOrderQuantity,
//                     'serviceFee': pairData.taker_fees
//                 }),
//                 'type': 'spot_trade',
//                 'tableId': newOrder._id
//             })

//             await getOrderHistorySocket(newOrder.userId, newOrder.pairId)
//             await getTradeHistorySocket(newOrder.userId, newOrder.pairId)


//             /* Order Book */
//             await SpotTrade.findOneAndUpdate({
//                 '_id': orderData[count]._id
//             }, {

//                 'status': 'completed',
//                 'filledQuantity': orderData[count].filledQuantity + orderDataQuantity,
//                 "$push": {
//                     "filled": {
//                         "pairId": orderData[count].pairId,
//                         "sellUserId": orderData[count].buyorsell == 'sell' ? orderData[count].userId : newOrder.userId,
//                         "buyUserId": orderData[count].buyorsell == 'buy' ? orderData[count].userId : newOrder.userId,
//                         "userId": orderData[count].userId,
//                         "sellOrderId": orderData[count].buyorsell == 'sell' ? orderData[count]._id : newOrder._id,
//                         "buyOrderId": orderData[count].buyorsell == 'buy' ? orderData[count]._id : newOrder._id,
//                         "uniqueId": uniqueId,
//                         "price": orderData[count].price,
//                         "filledQuantity": orderDataQuantity,
//                         "Fees": ((orderData[count].buyorsell == 'sell' ? orderData[count].price * orderDataQuantity : orderDataQuantity) * pairData.maker_rebate / 100),
//                         "status": "filled",
//                         "Type": orderData[count].buyorsell,
//                         "createdAt": new Date(),
//                         "orderValue": orderData[count].price * orderDataQuantity,
//                     }
//                 }
//             }, { 'new': true });

//             await assetUpdate({
//                 'currencyId': orderData[count].buyorsell == 'sell' ? orderData[count].secondCurrencyId : orderData[count].firstCurrencyId,
//                 'userId': orderData[count].userId,
//                 'balance': withoutServiceFee({
//                     'price': orderData[count].buyorsell == 'sell' ? orderData[count].price * orderDataQuantity : orderDataQuantity,
//                     'serviceFee': pairData.maker_rebate
//                 }),
//                 'type': 'spot_trade',
//                 'tableId': orderData[count]._id
//             })

//             let
//                 updateBalance = orderData[count].buyorsell == 'sell' ? orderData[count].price : orderData[count].quantity,
//                 newBalance = orderData[count].buyorsell == 'sell' ? newOrder.price : newOrder.quantity
//             // if (updateBalance < newBalance) {
//             //     console.log('after updateBalence ---', updateBalance < newBalance)
//             //     // Balance Retrieve
//             //     await assetUpdate({
//             //         'currencyId': orderData[count].buyorsell == 'sell' ? newOrder.secondCurrencyId : newOrder.firstCurrencyId,
//             //         'userId': newOrder.userId,
//             //         'balance': newBalance - updateBalance
//             //     })
//             // }

//             await getOpenOrderSocket(orderData[count].userId, orderData[count].pairId)
//             await getOrderHistorySocket(orderData[count].userId, orderData[count].pairId)
//             await getTradeHistorySocket(orderData[count].userId, orderData[count].pairId)


//             await getOrderBookSocket(pairData._id)
//             await marketPriceSocket(pairData._id)
//             await recentTradeSocket(pairData._id)

//             return true
//         }
//         else if (newOrderQuantity < orderDataQuantity) {
//             /* New Order */
//             let updateNewOrder = {}
//             if (count == 0) {
//                 updateNewOrder = newOrder;
//                 updateNewOrder['price'] = orderData[count].price;
//                 updateNewOrder['orderValue'] = orderData[count].price * newOrderQuantity;
//             }

//             updateNewOrder['status'] = 'completed';
//             updateNewOrder['filledQuantity'] = newOrder.filledQuantity + newOrderQuantity;
//             updateNewOrder['$push'] = {
//                 "filled": {
//                     "pairId": newOrder.pairId,
//                     "sellUserId": newOrder.buyorsell == 'sell' ? newOrder.userId : orderData[count].userId,
//                     "buyUserId": newOrder.buyorsell == 'buy' ? newOrder.userId : orderData[count].userId,
//                     "userId": newOrder.userId,
//                     "sellOrderId": newOrder.buyorsell == 'sell' ? newOrder._id : orderData[count]._id,
//                     "buyOrderId": newOrder.buyorsell == 'buy' ? newOrder._id : orderData[count]._id,
//                     "uniqueId": uniqueId,
//                     "price": orderData[count].price,
//                     "filledQuantity": newOrderQuantity,
//                     "Fees": ((newOrder.buyorsell == 'sell' ? orderData[count].price * newOrderQuantity : newOrderQuantity) * pairData.taker_fees / 100),
//                     "status": "filled",
//                     "Type": newOrder.buyorsell,
//                     "createdAt": new Date(),
//                     "orderValue": orderData[count].price * newOrderQuantity,
//                 }
//             }

//             await SpotTrade.findOneAndUpdate({
//                 '_id': newOrder._id
//             }, updateNewOrder, { 'new': true, 'upsert': true });



//             await assetUpdate({
//                 'currencyId': newOrder.buyorsell == 'sell' ? newOrder.secondCurrencyId : newOrder.firstCurrencyId,
//                 'userId': newOrder.userId,
//                 'balance': withoutServiceFee({
//                     'price': newOrder.buyorsell == 'sell' ? orderData[count].price * newOrderQuantity : newOrderQuantity,
//                     'serviceFee': pairData.taker_fees
//                 }),
//                 'type': 'spot_trade',
//                 'tableId': newOrder._id
//             })

//             await getOrderHistorySocket(newOrder.userId, newOrder.pairId)
//             await getTradeHistorySocket(newOrder.userId, newOrder.pairId)


//             /* Order Book */
//             await SpotTrade.findOneAndUpdate({
//                 '_id': orderData[count]._id
//             }, {

//                 'status': 'pending',
//                 'filledQuantity': orderData[count].filledQuantity + newOrderQuantity,
//                 "$push": {
//                     "filled": {
//                         "pairId": orderData[count].pairId,
//                         "sellUserId": orderData[count].buyorsell == 'sell' ? orderData[count].userId : newOrder.userId,
//                         "buyUserId": orderData[count].buyorsell == 'buy' ? orderData[count].userId : newOrder.userId,
//                         "userId": orderData[count].userId,
//                         "sellOrderId": orderData[count].buyorsell == 'sell' ? orderData[count]._id : newOrder._id,
//                         "buyOrderId": orderData[count].buyorsell == 'buy' ? orderData[count]._id : newOrder._id,
//                         "uniqueId": uniqueId,
//                         "price": orderData[count].price,
//                         "filledQuantity": newOrderQuantity,
//                         "Fees": ((orderData[count].buyorsell == 'sell' ? orderData[count].price * newOrderQuantity : newOrderQuantity) * pairData.maker_rebate / 100),
//                         "status": "filled",
//                         "Type": orderData[count].buyorsell,
//                         "createdAt": new Date(),
//                         "orderValue": orderData[count].price * newOrderQuantity,
//                     }
//                 }
//             }, { 'new': true });

//             await assetUpdate({
//                 'currencyId': orderData[count].buyorsell == 'sell' ? orderData[count].secondCurrencyId : orderData[count].firstCurrencyId,
//                 'userId': orderData[count].userId,
//                 'balance': withoutServiceFee({
//                     'price': orderData[count].buyorsell == 'sell' ? orderData[count].price * newOrderQuantity : newOrderQuantity,
//                     'serviceFee': pairData.maker_rebate
//                 }),
//                 'type': 'spot_trade',
//                 'tableId': orderData[count]._id
//             })

//             let
//                 updateBalance = orderData[count].buyorsell == 'sell' ? orderData[count].price : orderData[count].quantity,
//                 newBalance = orderData[count].buyorsell == 'sell' ? newOrder.price : newOrder.quantity

//             // if (updateBalance < newBalance) {
//             //     // Balance Retrieve
//             //     await assetUpdate({
//             //         'currencyId': orderData[count].buyorsell == 'sell' ? newOrder.secondCurrencyId : newOrder.firstCurrencyId,
//             //         'userId': newOrder.userId,
//             //         'balance': newBalance - updateBalance
//             //     })
//             // }

//             await getOpenOrderSocket(orderData[count].userId, orderData[count].pairId)
//             await getOrderHistorySocket(orderData[count].userId, orderData[count].pairId)
//             await getTradeHistorySocket(orderData[count].userId, orderData[count].pairId)



//             await getOrderBookSocket(pairData._id)
//             await marketPriceSocket(pairData._id)
//             await recentTradeSocket(pairData._id)


//             return true
//         }
//         else if (newOrderQuantity > orderDataQuantity) {
//             /* New Order */
//             let updateNewOrder = {}
//             if (count == 0) {
//                 updateNewOrder = newOrder;
//                 updateNewOrder['price'] = orderData[count].price;
//                 updateNewOrder['orderValue'] = orderData[count].price * orderDataQuantity;
//             }

//             updateNewOrder['status'] = 'pending';
//             updateNewOrder['filledQuantity'] = newOrder.filledQuantity + orderDataQuantity;
//             updateNewOrder['$push'] = {
//                 "filled": {
//                     "pairId": newOrder.pairId,
//                     "sellUserId": newOrder.buyorsell == 'sell' ? newOrder.userId : orderData[count].userId,
//                     "buyUserId": newOrder.buyorsell == 'buy' ? newOrder.userId : orderData[count].userId,
//                     "userId": newOrder.userId,
//                     "sellOrderId": newOrder.buyorsell == 'sell' ? newOrder._id : orderData[count]._id,
//                     "buyOrderId": newOrder.buyorsell == 'buy' ? newOrder._id : orderData[count]._id,
//                     "uniqueId": uniqueId,
//                     "price": orderData[count].price,
//                     "filledQuantity": orderDataQuantity,
//                     "Fees": ((newOrder.buyorsell == 'sell' ? orderData[count].price * orderDataQuantity : orderDataQuantity) * pairData.taker_fees / 100),
//                     "status": "filled",
//                     "Type": newOrder.buyorsell,
//                     "createdAt": new Date(),
//                     "orderValue": orderData[count].price * orderDataQuantity,
//                 }
//             }

//             let newOrderUpdate = await SpotTrade.findOneAndUpdate({
//                 '_id': newOrder._id
//             }, updateNewOrder, { 'new': true, 'upsert': true });


//             await assetUpdate({
//                 'currencyId': newOrder.buyorsell == 'sell' ? newOrder.secondCurrencyId : newOrder.firstCurrencyId,
//                 'userId': newOrder.userId,
//                 'balance': withoutServiceFee({
//                     'price': newOrder.buyorsell == 'sell' ? orderData[count].price * orderDataQuantity : orderDataQuantity,
//                     'serviceFee': pairData.taker_fees
//                 }),
//                 'type': 'spot_trade',
//                 'tableId': newOrder._id
//             })

//             // await getOpenOrderSocket(newOrder.userId, newOrder.pairId)
//             // await getOrderHistorySocket(newOrder.userId, newOrder.pairId)
//             // await getTradeHistorySocket(newOrder.userId, newOrder.pairId)


//             /* Order Book */
//             await SpotTrade.findOneAndUpdate({
//                 '_id': orderData[count]._id
//             }, {

//                 'status': 'completed',
//                 'filledQuantity': orderData[count].filledQuantity + orderDataQuantity,
//                 "$push": {
//                     "filled": {
//                         "pairId": orderData[count].pairId,
//                         "sellUserId": orderData[count].buyorsell == 'sell' ? orderData[count].userId : newOrder.userId,
//                         "buyUserId": orderData[count].buyorsell == 'buy' ? orderData[count].userId : newOrder.userId,
//                         "userId": orderData[count].userId,
//                         "sellOrderId": orderData[count].buyorsell == 'sell' ? orderData[count]._id : newOrder._id,
//                         "buyOrderId": orderData[count].buyorsell == 'buy' ? orderData[count]._id : newOrder._id,
//                         "uniqueId": uniqueId,
//                         "price": orderData[count].price,
//                         "filledQuantity": orderDataQuantity,
//                         "Fees": ((orderData[count].buyorsell == 'sell' ? orderData[count].price * orderDataQuantity : orderDataQuantity) * pairData.maker_rebate / 100),
//                         "status": "filled",
//                         "Type": orderData[count].buyorsell,
//                         "createdAt": new Date(),
//                         "orderValue": orderData[count].price * orderDataQuantity,
//                     }
//                 }
//             }, { 'new': true });

//             await assetUpdate({
//                 'currencyId': orderData[count].buyorsell == 'sell' ? orderData[count].secondCurrencyId : orderData[count].firstCurrencyId,
//                 'userId': orderData[count].userId,
//                 'balance': withoutServiceFee({
//                     'price': orderData[count].buyorsell == 'sell' ? orderData[count].price * orderDataQuantity : orderDataQuantity,
//                     'serviceFee': pairData.maker_rebate
//                 }),
//                 'type': 'spot_trade',
//                 'tableId': orderData[count]._id
//             })

//             let
//                 updateBalance = orderData[count].buyorsell == 'sell' ? orderData[count].price : orderData[count].quantity,
//                 newBalance = orderData[count].buyorsell == 'sell' ? newOrder.price : newOrder.quantity
//             // console.log('Before updateBalence ---', updateBalance < newBalance)
//             // console.log('updateBalance ---', updateBalance)
//             // console.log('updateBalance orderData[count].buyorsell ---', orderData[count].buyorsell)
//             // console.log('updateBalance orderData[count].price ---', orderData[count].price)
//             // console.log('updateBalance orderData ---', orderData)

//             // console.log('newBalance ---', newBalance)
//             // console.log('newBalance  orderData[count].buyorsell ---', orderData[count].buyorsell)
//             // console.log('newBalance newOrder.price---', newOrder.price)
//             // console.log('newBalance newOrder.quantity---', newOrder.quantity)
//             // if (updateBalance < newBalance) {
//             //     // Balance Retrieve
//             //     await assetUpdate({
//             //         'currencyId': orderData[count].buyorsell == 'sell' ? newOrder.secondCurrencyId : newOrder.firstCurrencyId,
//             //         'userId': newOrder.userId,
//             //         'balance': newBalance - updateBalance
//             //     })
//             // }

//             await getOpenOrderSocket(orderData[count].userId, orderData[count].pairId)
//             await getOrderHistorySocket(orderData[count].userId, orderData[count].pairId)
//             await getTradeHistorySocket(orderData[count].userId, orderData[count].pairId)



//             await getOrderBookSocket(pairData._id)
//             await marketPriceSocket(pairData._id)
//             await recentTradeSocket(pairData._id)

//             return await marketTradeMatch(newOrderUpdate, orderData, count = count + 1, pairData)
//         }
//     } catch (err) {
       
//         return res.status(500).json({  'statusCode':500,'status': false, 'message': "System error" });
//     }
// }

/**
 * Stop Limit order place
 * URL : /api/new/spotOrder
 * METHOD : POST
 * BODY : spotPairId, stopPrice, price, quantity, buyorsell, orderType(stop_limit)
*/
export const stopLimitOrderPlace = async (req, res) => {
    try {
        let reqBody = req.body;
        reqBody.stopPrice = parseFloat(reqBody.stopPrice)
        reqBody.price = parseFloat(reqBody.price)
        reqBody.quantity = parseFloat(reqBody.quantity)

        let spotPairData = await SpotPair.findOne({ "_id": reqBody.spotPairId });

        if (!spotPairData) {
            return res.status(400).json({ 'statusCode':400,'status': false, 'message': "Trade pair does not exist" });
        }

        if (reqBody.quantity < spotPairData.minQuantity) {
            return res.status(400).json({ 'statusCode':400,'status': false, 'message': "Invalid Amount" });
        } else if (reqBody.quantity > spotPairData.maxQuantity) {
            return res.status(400).json({ 'statusCode':400,'status': false, 'message': "Invalid Amount" });
        }

        let currencyId = reqBody.buyorsell == 'buy' ? spotPairData.secondCurrencyId : spotPairData.firstCurrencyId;

        let usrWallet = await Wallet.findOne({ "_id": req.user.id, })
        if (!usrWallet) {
            return res.status(500).json({ 'statusCode':500,'status': false, 'message': "System error" });
        }

        let usrAsset = usrWallet.assets.id(currencyId)
        if (!usrAsset) {
            return res.status(500).json({ 'statusCode':500,'status': false, 'message': "System error" });
        }

        let
            balance = parseFloat(usrAsset.spotBal),
            orderValue = (reqBody.buyorsell == 'buy') ? reqBody.price * reqBody.quantity : reqBody.quantity;

        if (balance < orderValue) {
            return res.status(400).json({ 'statusCode':400,'status': false, 'message': "Insufficient wallet balance" });
        }

        usrAsset.spotBal = balance - orderValue;
        // if (spotPairData.botstatus == "off") {
        //     await usrWallet.save();
        // }

        let balDetect = await Wallet.updateOne({
            '_id': req.user.id,
            "assets._id": currencyId,
            '$where': "function() {return this.assets.some((obj) => { return obj._id == '" + currencyId + "' && (obj.spotBal - " + orderValue + ") >= 0;})}"
        }, {
            '$inc': {
                "assets.$.spotBal": -orderValue
            }
        }, {
            new: true
        });

        if (balDetect && balDetect.nModified != 1) {
            return res.status(400).json({'statusCode':400, 'status': false, 'message': "Insufficient wallet balance" });
        }

        let conditionalType = 'equal';
        if (spotPairData.markPrice < reqBody.stopPrice) {
            conditionalType = 'greater_than'
        } else if (spotPairData.markPrice > reqBody.stopPrice) {
            conditionalType = 'lesser_than'
        }

        const newSpotTrade = new SpotTrade({
            userId: req.user.id,
            pairId: spotPairData._id,
            firstCurrencyId: spotPairData.firstCurrencyId,
            firstCurrency: spotPairData.firstCurrencySymbol,
            secondCurrencyId: spotPairData.secondCurrencyId,
            secondCurrency: spotPairData.secondCurrencySymbol,

            stopPrice: reqBody.stopPrice,
            price: reqBody.price,
            quantity: reqBody.quantity,

            orderValue: orderValue,

            pairName: `${spotPairData.firstCurrencySymbol}${spotPairData.secondCurrencySymbol}`,
            beforeBalance: balance,
            afterBalance: usrAsset.spotBal,


            orderType: reqBody.orderType,
            orderDate: new Date(),
            buyorsell: reqBody.buyorsell,
            conditionalType,
            status: 'conditional'
        });
        console.log("newSpotTrade_stoplimit",newSpotTrade)

        if (spotPairData.botstatus == "binance") {
            let payloadObj = {
                'firstCoin': spotPairData.firstCurrencySymbol,
                'secondCoin': spotPairData.secondCurrencySymbol,
                "side": newSpotTrade.buyorsell,
                "price": newSpotTrade.price,
                "stopPrice": newSpotTrade.stopPrice,
                "quantity": newSpotTrade.quantity,
                "markPrice": spotPairData.markPrice,
                "markupPercentage": spotPairData.markupPercentage,
            }

            let binOrder = await binanceCtrl.stopLimitOrderPlace(payloadObj, req.user.binApiKey);
            if (binOrder.status) {
                newSpotTrade.liquidityId = binOrder.data.orderId;
                newSpotTrade.liquidityType = 'binance';
                newSpotTrade.isLiquidity = true;

                await usrWallet.save();
            } else {
                return res.status(400).json({ 'statusCode':400,'status': false, 'message': binOrder.message });
            }
        }

        let newOrder = await newSpotTrade.save();

        // CREATE PASS_BOOK
        createPassBook({
            'userId': req.user.id,
            'coin': reqBody.buyorsell == "buy" ? spotPairData.secondCurrencySymbol : spotPairData.firstCurrencySymbol,
            'currencyId': reqBody.buyorsell == "buy" ? spotPairData.secondCurrencyId : spotPairData.firstCurrencyId,
            'tableId': newOrder._id,
            'beforeBalance': balance,
            'afterBalance': usrAsset.spotBal,
            'amount': parseFloat(orderValue),
            'type': 'spot_trade',
            'category': 'debit'
        })

        socketEmitOne('updateTradeAsset', {
            'currencyId': usrAsset._id,
            'spotBal': usrAsset.spotBal,
            'derivativeBal': usrAsset.derivativeBal,
        }, req.user.id)

        getOpenOrderSocket(newOrder.userId, newOrder.pairId)
        return res.status(200).json({'statusCode':200, 'status': true, 'message': "Your order placed successfully.", 'orderId':newOrder._id });
    } catch (err) {
       console.log("-------err", err)
        return res.status(400).json({ 'statusCode':400,'status': false, 'message': "System error" });
    }
}

/**
 * Stop Market order place
 * URL : /api/new/spotOrder
 * METHOD : POST
 * BODY : spotPairId, stopPrice, quantity, buyorsell, orderType(stop_limit)
*/
export const stopMarketOrderPlace = async (req, res) => {
    try {
        let reqBody = req.body;
        console.log("reqBody",reqBody)
        reqBody.stopPrice = parseFloat(reqBody.stopPrice)
        // reqBody.price = parseFloat(reqBody.price)
        reqBody.quantity = parseFloat(reqBody.quantity)

        let spotPairData = await SpotPair.findOne({ "_id": reqBody.spotPairId });
        
        if (!spotPairData) {
            return res.status(400).json({ 'statusCode':400,'status': false, 'message': "Invalid Pair" });
        }

        if (reqBody.quantity < spotPairData.minQuantity) {
            return res.status(400).json({ 'statusCode':400,'status': false, 'message': "Invalid Amount" });
        } else if (reqBody.quantity > spotPairData.maxQuantity) {
            return res.status(400).json({ 'statusCode':400,'status': false, 'message': "Invalid Amount" });
        }

        let currencyId = reqBody.buyorsell == 'buy' ? spotPairData.secondCurrencyId : spotPairData.firstCurrencyId;

        let usrWallet = await Wallet.findOne({ "_id": req.user.id, })
        if (!usrWallet) {
            return res.status(500).json({'statusCode':500, 'status': false, 'message': "System error" });
        }

        let usrAsset = usrWallet.assets.id(currencyId)
        if (!usrAsset) {
            return res.status(500).json({ 'statusCode':500,'status': false, 'message': "System error" });
        }

        let
            balance = parseFloat(usrAsset.spotBal),
            orderValue = (reqBody.buyorsell == 'buy') ? reqBody.stopPrice * reqBody.quantity : reqBody.quantity;
            console.log("reqBody.price",reqBody.stopPrice,reqBody.quantity)
            console.log("orderValue_orderValue",orderValue)

        if (balance < orderValue) {
            return res.status(400).json({ 'statusCode':400,'status': false, 'message': "Insufficient wallet balance" });
        }
        
        usrAsset.spotBal = balance - orderValue;
        let updateUserAsset = await usrWallet.save();

        socketEmitOne('updateTradeAsset', {
            'currencyId': usrAsset._id,
            'spotBal': usrAsset.spotBal,
            'derivativeBal': usrAsset.derivativeBal,
        }, req.user.id)

        let conditionalType = 'equal';
        if (spotPairData.markPrice < reqBody.stopPrice) {
            conditionalType = 'greater_than'
        } else if (spotPairData.markPrice > reqBody.stopPrice) {
            conditionalType = 'lesser_than'
        }

        const newSpotTrade = new SpotTrade({
            userId: req.user.id,
            pairId: spotPairData._id,
            firstCurrencyId: spotPairData.firstCurrencyId,
            firstCurrency: spotPairData.firstCurrencySymbol,
            secondCurrencyId: spotPairData.secondCurrencyId,
            secondCurrency: spotPairData.secondCurrencySymbol,

            stopPrice: reqBody.stopPrice,
            price: spotPairData.markPrice,
            quantity: reqBody.quantity,

            orderValue: orderValue,

            pairName: `${spotPairData.firstCurrencySymbol}${spotPairData.secondCurrencySymbol}`,
            beforeBalance: balance,
            afterBalance: usrAsset.spotBal,


            orderType: reqBody.orderType,
            orderDate: new Date(),
            buyorsell: reqBody.buyorsell,
            conditionalType,
            status: 'conditional',
        });

        let newOrder = await newSpotTrade.save();
        getOpenOrderSocket(newOrder.userId, newOrder.pairId)
        return res.status(200).json({'statusCode':200, 'status': true, 'message': "Your order placed successfully.", 'orderId':newOrder._id });
    } catch (err) {
        console.log("err_stopmarket",err)
        return res.status(400).json({'statusCode':400, 'status': false, 'message': "System error" });
        
    }
}

/**
 * Trailing Stop order place
 * URL : /api/new/spotOrder
 * METHOD : POST
 * BODY : spotPairId, distance, quantity, buyorsell, orderType(trailing_stop)
*/
export const trailingStopOrderPlace = async (req, res) => {
    try {
        let reqBody = req.body;
        reqBody.distance = parseFloat(reqBody.distance)
        reqBody.quantity = parseFloat(reqBody.quantity)

        let spotPairData = await SpotPair.findOne({ "_id": reqBody.spotPairId });

        if (!spotPairData) {
            return res.status(400).json({'statusCode':400, 'status': false, 'message': "Trade pair does not exist" });
        }

        if (reqBody.quantity < spotPairData.minQuantity) {
            return res.status(400).json({ 'statusCode':400,'status': false, 'message': 'Invalid Amount' });
        } else if (reqBody.quantity > spotPairData.maxQuantity) {
            return res.status(400).json({'statusCode':400, 'status': false, 'message': 'Invalid Amount' });
        }

        let currencyId = reqBody.buyorsell == 'buy' ? spotPairData.secondCurrencyId : spotPairData.firstCurrencyId;

        let usrWallet = await Wallet.findOne({ "_id": req.user.id, })
        if (!usrWallet) {
            return res.status(500).json({ 'statusCode':500,'status': false, 'message': "System error" });
        }

        let usrAsset = usrWallet.assets.id(currencyId)
        if (!usrAsset) {
            return res.status(500).json({'statusCode':500, 'status': false, 'message': "System error" });
        }

        let
            balance = parseFloat(usrAsset.spotBal),
            orderValue = (reqBody.buyorsell == 'buy') ? (spotPairData.markPrice + reqBody.distance) * reqBody.quantity : reqBody.quantity;

        if (balance < orderValue) {
            return res.status(400).json({'statusCode':400, 'status': false, 'message': "Insufficient wallet balance" });
        }

        usrAsset.spotBal = balance - orderValue;
        let updateUserAsset = await usrWallet.save();

        socketEmitOne('updateTradeAsset', {
            'currencyId': usrAsset._id,
            'spotBal': usrAsset.spotBal,
            'derivativeBal': usrAsset.derivativeBal,
        }, req.user.id)

        let conditionalType = 'equal';
        if (spotPairData.markPrice < reqBody.stopPrice) {
            conditionalType = 'greater_than'
        } else if (spotPairData.markPrice > reqBody.stopPrice) {
            conditionalType = 'lesser_than'
        }

        const newSpotTrade = new SpotTrade({
            userId: req.user.id,
            pairId: spotPairData._id,
            firstCurrencyId: spotPairData.firstCurrencyId,
            firstCurrency: spotPairData.firstCurrencySymbol,
            secondCurrencyId: spotPairData.secondCurrencyId,
            secondCurrency: spotPairData.secondCurrencySymbol,

            marketPrice: spotPairData.markPrice,
            trailingPrice: (reqBody.buyorsell == 'buy') ? spotPairData.markPrice + reqBody.distance : spotPairData.markPrice - reqBody.distance,
            distance: reqBody.distance,
            price: (reqBody.buyorsell == 'buy') ? spotPairData.markPrice + reqBody.distance : spotPairData.markPrice - reqBody.distance,
            quantity: reqBody.quantity,
            orderValue: orderValue,

            pairName: `${spotPairData.firstCurrencySymbol}${spotPairData.secondCurrencySymbol}`,
            beforeBalance: balance,
            afterBalance: usrAsset.spotBal,
            orderType: reqBody.orderType,
            orderDate: new Date(),
            buyorsell: reqBody.buyorsell,
            conditionalType,
            status: 'conditional',
        });

        let newOrder = await newSpotTrade.save();
        getOpenOrderSocket(newOrder.userId, newOrder.pairId)
        return res.status(200).json({ 'statusCode':200,'status': true, 'message': "Your order placed successfully.",'orderId':newOrder._id`` });
    } catch (err) {
        return res.status(500).json({ 'statusCode':500,'status': false, 'message': "System error" });
    }
}


/** 
 * Trade Decrypt
 * BODY : token
*/
export const decryptTradeOrder = (req, res, next) => {
    try {
        let api_key = req.header("x-api-key");
        let authorization = req.header('Authorization')
        console.log("orderreq", req.user, req.body,authorization)
        if (api_key !== null && api_key !== undefined && authorization == undefined) {
            return next();
        }
        else {
            console.log("token22", req.body)
            let token = decryptObject(req.body.token)
            console.log("token", req.body)
            req.body = token;
            return next();
        }
    } catch (err) {
        return res.status(500).json({ 'statusCode':500,'status': false, 'message': "System error" });
    }
}

/**
 * Get User Open Order
 * URL : /api/new/spot/openOrder/{{pairId}}
 * METHOD : GET
 * Query : page, limit
*/
export const getOpenOrder = async (req, res) => {
    try {
        console.log("getOpenOrder",req.body,req.user)
        let pagination = paginationQuery(req.query);
        console.log("open",req.body)
        let count = await SpotTrade.countDocuments({
            "userId": req.user.id,
            'pairId': req.body.pairId,
            "status": { "$in": ['open', 'pending', 'conditional'] }
        });
        let data = await SpotTrade.aggregate([
            {
                "$match": {
                    "userId": ObjectId(req.user.id),
                    'pairId': ObjectId(req.body.pairId),
                    "status": { "$in": ['open', 'pending', 'conditional'] }
                }
            },
            { "$sort": { '_id': -1 } },
            { "$skip": pagination.skip },
            { "$limit": pagination.limit },
            {
                "$project": {
                    "orderDate": 1,
                    "firstCurrency": 1,
                    "secondCurrency": 1,
                    "orderType": 1,
                    "buyorsell": 1,
                    "price": 1,
                    "quantity": 1,
                    "filledQuantity": 1,
                    "orderValue": 1,
                    "conditionalType": 1,
                    "stopPrice": 1
                }
            }
        ])

        let result = {
            count,
            'currentPage': pagination.page,
            'nextPage': count > data.length,
            'limit': pagination.limit,
            data
        }
         console.log("openorder",result)
        return res.status(200).json({ 'statusCode':200,'success': true, result })
    } catch (err) {
        console.log(err,'errrr')
        return res.status(500).json({'statusCode':500, 'success': false, 'message': "System error" })
    }
}


/** 
 * Cancel Order
 * METHOD: Delete
 * URL : /api/new/spot/cancelOrder
 * PARAMS: orderId
*/
export const cancelOrder = async (req, res) => {
    try {
        console.log("cancel",req.body.orderId)
        if (cancelOrderArr.includes(IncCntObjId(req.body.orderId))) {
            return res.status(400).json({'statusCode':400, 'status': false, 'message': 'Order has been excute processing ...' })
        }

        let orderData = await SpotTrade.findOne({ '_id': req.body.orderId, 'userId': req.user.id });
        if (!orderData) {
            return res.status(400).json({'statusCode':400, 'status': false, 'message': "There is no order" });
        }

        if (['open', 'pending', 'conditional'].includes(orderData.status)) {
            let remainingQuantity = orderData.quantity - orderData.filledQuantity;
            let currencyId = orderData.buyorsell == 'buy' ? orderData.secondCurrencyId : orderData.firstCurrencyId;
            let orderValue = (orderData.buyorsell == 'buy') ? orderData.price * remainingQuantity : remainingQuantity;

            if (orderData.isLiquidity == true) {
                if (orderData.liquidityType == 'binance') {
                    let binOrder = await binanceCtrl.cancelOrder({
                        'firstCoin': orderData.firstCurrency,
                        'secondCoin': orderData.secondCurrency,
                        'binanceId': orderData.liquidityId,
                        'orderType': orderData.orderType
                    })

                    if (!binOrder.status) {
                        return res.status(400).json({'statusCode':400, 'status': false, 'message': "Something went wrong" });
                    }
                }
            }

            assetUpdate({
                currencyId,
                userId: orderData.userId,
                balance: orderValue,
                'type': 'spot_trade_cancel',
                'tableId': orderData._id
            })



            orderData.status = 'cancel';
            await orderData.save();

            getOpenOrderSocket(orderData.userId, orderData.pairId)
            getOrderBookSocket(orderData.pairId)
            getTradeHistorySocket(orderData.userId, orderData.pairId)

            return res.status(200).json({ 'statusCode':200,'status': true, 'message': "Your Order cancelled successfully" });
        } else if (orderData.status == 'completed') {
            return res.status(400).json({ 'statusCode':400,'status': false, 'message': "Your Order already completed" });
        } else if (orderData.status == 'cancel') {
            return res.status(400).json({'statusCode':400, 'status': false, 'message': "Your Order already cancelled" });
        }
        return res.status(400).json({ 'statusCode':400,'status': false, 'message': "Something went wrong" });
    } catch (err) {
        return res.status(500).json({ 'statusCode':500,'status': false, 'message': "System error" });
    }
}

/**
 * Get User Trade History
 * URL : /api/new/spot/orderHistory
 * METHOD : GET
 * Query : page, limit
*/
export const getOrderHistory = async (req, res) => {
    try {
        let pagination = paginationQuery(req.query);

        let count = await SpotTrade.countDocuments({
            "userId": req.user.id,
            'pairId': req.body.pairId,
            "status": {
                "$in": ['pending', 'completed', 'cancel']
            }
        });

        let data = await SpotTrade.aggregate([
            {
                "$match": {
                    "userId": ObjectId(req.user.id),
                    'pairId': ObjectId(req.body.pairId),
                    "status": {
                        "$in": ['pending', 'completed', 'cancel']
                    }
                }
            },
            // { "$unwind": "$filled" },
            { "$sort": { '_id': -1 } },
            { "$skip": pagination.skip },
            { "$limit": pagination.limit },
            {
                "$project": {
                    "orderDate": 1,
                    "firstCurrency": 1,
                    "secondCurrency": 1,
                    "orderType": 1,
                    "buyorsell": 1,
                    "price": 1,
                    "filledQuantity": 1,
                    "quantity": 1,
                    "orderValue": 1,
                    "conditionalType": 1,
                    "status": 1,
                    "Fees": "$filled.Fees",
                    "stopPrice": 1,
                    "averageTotal": {
                        $reduce: {
                          input: "$filled",
                          initialValue: 0,
                          in: {
                            $avg: {
                              $add: [
                                "$$value",
                                { $multiply: ["$$this.price", "$$this.filledQuantity"] },
                              ],
                            },
                          },
                        },
                    }
                }
            }
        ])
        let result = {
            count,
            'currentPage': pagination.page,
            'nextPage': count > data.length,
            'limit': pagination.limit,
            data
        }
        console.log("orderhistory",result)
        return res.status(200).json({ 'statusCode':200,'success': true, result })
    } catch (err) {
        return res.status(500).json({ 'statusCode':500,'success': false ,'message': "System error" })
    }
}

/**
 * Get User Trade History
 * URL : /api/new/spot/tradeHistory
 * METHOD : GET
 * Query : page, limit
*/
export const getTradeHistory = async (req, res) => {
    try {
        let pagination = paginationQuery(req.query);

        let count = await SpotTrade.aggregate([
            {
                "$match": {
                    "userId": ObjectId(req.user.id),
                    'pairId': ObjectId(req.body.pairId),
                    "status": {
                        "$in": ['pending', 'completed', 'cancel']
                    }
                }
            },
            { "$unwind": "$filled" }
        ])


        let data = await SpotTrade.aggregate([
            {
                "$match": {
                    "userId": ObjectId(req.user.id),
                    'pairId': ObjectId(req.body.pairId),
                    "status": {
                        "$in": ['pending', 'completed', 'cancel']
                    }
                }
            },
            { "$unwind": "$filled" },
            { "$sort": { 'createdAt': -1 } },
            { "$skip": pagination.skip },
            { "$limit": pagination.limit },

            {
                "$project": {
                    "createdAt": "$filled.createdAt",
                    "firstCurrency": 1,
                    "secondCurrency": 1,
                    "buyorsell": 1,
                    "ExecutedPrice": "$filled.price",
                    "price": 1,
                    "filledQuantity": "$filled.filledQuantity",
                    "Fees": "$filled.Fees",
                    "orderValue": "$filled.orderValue",
                }
            }
        ])

        let result = {
            count: count.length,
            'currentPage': pagination.page,
            'nextPage': count.length > data.length,
            'limit': pagination.limit,
            data
        }
        console.log("TradeHistory",result)
        return res.status(200).json({'statusCode':200, 'success': true, result })
    } catch (err) {
        return res.status(500).json({'statusCode':500, 'success': false , 'message': "System error"})
    }
}

/** 
 * Get Order Book
 * URL : /api/new/spot/orderBook/:{{pairId}}
 * METHOD : GET
 * PARAMS : pairId
*/
export const getOrderBook = async (req, res) => {
    try {
        let result = await orderBookData({
            'pairId': req.params.pairId
        })

        console.log("-----result", result)

        return res.status(200).json({'statusCode':200, 'success': true, result })
    } catch (err) {
        return res.status(500).json({ 'statusCode':500,'success': false,  'message': "System error" })
    }
}

/**
 * Get Recent Trade
 * URL : /api/new/spot/recentTrade/{{pairId}}
 * METHOD : GET
*/
export const getRecentTrade = async (req, res) => {
    try {
        let pairData = await SpotPair.findOne(
            { "_id": req.params.pairId },
            {
                "firstCurrencySymbol": 1,
                "secondCurrencySymbol": 1,
                "botstatus": 1
            }
        );
        if (!pairData) {
            return res.status(400).json({'statusCode':400, 'success': false,'message':"Trade pair does not exist"})
        }

        if (pairData.botstatus == 'binance') {
            let recentTradeData = await binanceCtrl.recentTrade({
                'firstCurrencySymbol': pairData.firstCurrencySymbol,
                'secondCurrencySymbol': pairData.secondCurrencySymbol
            })
            if (recentTradeData && recentTradeData.length > 0) {
                console.log("rectradebtc",recentTradeData)
                return res.status(200).json({'statusCode':200, 'success': true, 'result': recentTradeData })
                
            }
        } else {
            let recentTradeData = await recentTrade(req.params.pairId);
            if (recentTradeData.status) {
                console.log("rectradeusdt",recentTradeData.result)
                return res.status(200).json({ 'statusCode':200,'success': true, 'result': recentTradeData.result })
            }
        }

        // return res.status(400).json({'statusCode':400, 'success': false })
    } catch (err) {
        return res.status(500).json({ 'statusCode':500,'success': false,  'message': "System error" })
    }
}

/** 
 * Get Spot Trade Pair List
 * METHOD: GET
 * URL : /api/new/spot/tradePair
*/
export const getPairList = async (req, res) => {
    try {
        console.log("pair",req.body)
        let spotPairData = await SpotPair.aggregate([
            { "$match": { "status": "active" } },
            {
                "$lookup":
                {
                    "from": 'currency',
                    "localField": "firstCurrencyId",
                    "foreignField": "_id",
                    "as": "firstCurrencyInfo"
                }
            },
            { "$unwind": "$firstCurrencyInfo" },

            {
                "$lookup":
                {
                    "from": 'currency',
                    "localField": "secondCurrencyId",
                    "foreignField": "_id",
                    "as": "secondCurrencyInfo"
                }
            },
            { "$unwind": "$secondCurrencyInfo" },
            {
                "$project": {
                    '_id': 1,
                    'firstCurrencyId': 1,
                    'firstCurrencySymbol': 1,
                    'firstCurrencyImage': {
                        "$cond": [
                            { "$eq": ['$firstCurrencyInfo.image', ''] },
                            "",
                            { "$concat": [config.SERVER_URL, config.IMAGE.CURRENCY_URL_PATH, "$firstCurrencyInfo.image"] }
                        ]
                    },

                    'secondCurrencyId': 1,
                    'secondCurrencySymbol': 1,
                    'secondCurrencyImage': {
                        "$cond": [
                            { "$eq": ['$secondCurrencyInfo.image', ''] },
                            "",
                            { "$concat": [config.SERVER_URL, config.IMAGE.CURRENCY_URL_PATH, "$secondCurrencyInfo.image"] }
                        ]
                    },
                    'firstFloatDigit': 1,
                    'secondFloatDigit': 1,
                    'botstatus': 1,

                    'last': 1,
                    'markPrice': 1,
                    'low': 1,
                    'high': 1,
                    'firstVolume': 1,
                    'secondVolume': 1,
                    'changePrice': 1,
                    'change': 1,
                }
            },
        ])
        console.log("tradepair",spotPairData)
        return res.status(200).json({ 'statusCode':200,'success': true, 'messages': "success", 'result': spotPairData })
    } catch (err) {
        return res.status(500).json({ 'statusCode':500,'status': false,  'message': "System error" });
    }
}

/**
 * Get User Open Order
 * URL : /api/new/spot/allopenOrder
 * METHOD : GET
 * Query : page, limit, pairName, orderType
*/
export const allOpenOrder = async (req, res) => {
    try {
        console.log('allOpenOrder')
        let pagination = paginationQuery(req.query);
        let filter, reqQuery = req.query;

        filter = {
            "userId": req.user.id,
            "status": { "$in": ['open', 'pending', 'conditional'] }
        };

        if (!isEmpty(reqQuery.pairName) && reqQuery.pairName != 'all') {
            filter['pairName'] = reqQuery.pairName;
        }

        if (!isEmpty(reqQuery.orderType) && reqQuery.orderType != 'all') {
            filter['orderType'] = reqQuery.orderType;
        }

        let count = await SpotTrade.countDocuments(filter);
        let data = await SpotTrade.aggregate([
            { "$match": filter },
            { "$sort": { '_id': -1 } },
            { "$skip": pagination.skip },
            { "$limit": pagination.limit },
            {
                "$project": {
                    "orderDate": 1,
                    "firstCurrency": 1,
                    "secondCurrency": 1,
                    "orderType": 1,
                    "buyorsell": 1,
                    "price": 1,
                    "quantity": 1,
                    "filledQuantity": 1,
                    "orderValue": 1,
                    "conditionalType": 1,
                    "stopPrice": 1
                }
            }
        ])

        let result = {
            count,
            data
        }
        return res.status(200).json({ 'statusCode':200,'success': true, result })
    } catch (err) {
        console.log(err,'allOpenOrder')
        return res.status(500).json({ 'statusCode':500,'success': false,  'message': "System error" })
    }
}

/**
 * Get All User Trade History
 * URL : /api/new/spot/allTradeOrder
 * METHOD : GET
 * Query : page, limit, pairName
*/
export const allTradeOrder = async (req, res) => {
    try {
        let pagination = paginationQuery(req.query);
        let filter = {}, reqQuery = req.query;

        filter = {
            "userId": ObjectId(req.user.id),
            "status": {
                "$in": ['pending', 'completed', 'cancel']
            }
        }

        if (!isEmpty(reqQuery.pairName) && reqQuery.pairName != 'all') {
            filter['pairName'] = reqQuery.pairName;
        }

        let count = await SpotTrade.aggregate([
            { "$match": filter },
            { "$unwind": "$filled" }
        ])


        let data = await SpotTrade.aggregate([
            { "$match": filter },
            { "$unwind": "$filled" },
            { "$sort": { 'filled.createdAt': -1 } },
            { "$skip": pagination.skip },
            { "$limit": pagination.limit },
            {
                "$project": {
                    "createdAt": "$filled.createdAt",
                    "firstCurrency": 1,
                    "secondCurrency": 1,
                    "buyorsell": 1,
                    "price": "$filled.price",
                    "filledQuantity": "$filled.filledQuantity",
                    "Fees": "$filled.Fees",
                    "orderValue": "$filled.orderValue",
                }
            }
        ])

        let result = {
            count: count.length,
            data
        }
        return res.status(200).json({ 'statusCode':200,'success': true, result })
    } catch (err) {
        return res.status(500).json({'statusCode':500, 'success': false,  'message': "System error" })
    }
}


/**
 * Get Order Status using OrderId
 * URL : /api/new/spot/orderStatus
 * METHOD : POST
*/

export const getOrderStatus = async (req, res) => {
    try {
        let orderStatus = await SpotTrade.findOne({ "_id": req.body.id });
        console.log("orderStatus", orderStatus)
        if (!orderStatus) {
            return res.status(400).json({ 'statusCode': 400, 'success': false, 'messages': "Order Id not found" })
        }
        return res.status(200).json({ 'statusCode': 200, 'success': true, 'messages': "success", 'result': orderStatus })

    }
    catch (err) {
        return res.status(500).json({ 'statusCode': 500, 'status': false,  'message': "System error" });
    }
}