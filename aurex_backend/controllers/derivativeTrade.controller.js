// import package
import mongoose from 'mongoose';

// import models
import {
    PerpetualPair,
    PerpetualOrder,
    Wallet,
    ClosedPosition
} from '../models';

// import config
import config from '../config';
import { socketEmitOne, socketEmitAll } from '../config/socketIO';

// import controller
import {
    calculateInverseOrderCost,
    isolatedLiquidationPrice,
    inversePositionMargin,
    inversePositionPnL
} from './bybit.controller'

// import lib
import isEmpty from '../lib/isEmpty';
import { encryptObject, decryptObject } from '../lib/cryptoJS';
import { paginationQuery } from '../lib/adminHelpers';
import { toFixed } from '../lib/roundOf'

const ObjectId = mongoose.Types.ObjectId;

const adminId = ObjectId("5e567694b912240c7f0e4299")

/** 
 * Trade Decrypt
 * BODY : token
*/
export const decryptTradeOrder = (req, res, next) => {
    try {
        let token = decryptObject(req.body.token)
        req.body = token;
        return next();
    } catch (err) {
        return res.status(500).json({ 'status': false, 'message': "SOMETHING_WRONG" });
    }
}

/** 
 * Get Spot Pair 
 * METHOD : GET
 * URL : /api/spot/allPair
*/
export const allPairs = (req, res) => {
    PerpetualPair.find({ 'status': 'active' }, {
        '_id': 0,
        'firstCurrencySymbol': 1,
        'secondCurrencySymbol': 1,
        'taker_fees': 1,
        'maker_rebate': 1
    }, (err, data) => {
        if (err) {
            return res.status(500).json({ 'status': false, 'message': 'Something went worng' })
        }
        return res.status(200).json({ 'status': true, 'message': "FETCH", 'result': data })
    })
}

/** 
 * Get Perpetual Pair List
 * METHOD: GET
 * URL : /api/perpetual/tradePair
*/
export const getPairList = async (req, res) => {
    try {
        let perpetualPairData = await PerpetualPair.aggregate([
            { "$match": { "status": "active" } },
            {
                "$lookup": {
                    "from": 'currency',
                    "localField": "firstCurrencyId",
                    "foreignField": "_id",
                    "as": "firstCurrencyInfo"
                }
            },
            { "$unwind": "$firstCurrencyInfo" },

            {
                "$lookup": {
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
                    'maker_rebate': 1,
                    'taker_fees': 1
                }
            },

        ])
        return res.status(200).json({ 'success': true, 'messages': "success", 'result': perpetualPairData })
    } catch (err) {
        console.log("🚀 ~ file: derivativeTrade.controller.js ~ line 139 ~ getPairList ~ err", err)
        return res.status(500).json({ 'status': false, 'message': "Error occured" });
    }
}

/**
 * Cancel Order
 * METHOD : DELETE
 * URL : /api/perpetual/cancelOrder/{{orderId}}
 * PARAMS : orderId
*/
export const cancelOrder = async (req, res) => {
    try {
        let orderData = await PerpetualOrder.findOne({
            "_id": req.params.orderId,
            "userId": req.user.id
        }).populate({ "path": "pairId", "select": "taker_fees firstFloatDigit" });
        if (!orderData) {
            return res.status(400).json({ 'status': false, 'message': "NO_ORDER" });
        }

        if (orderData && !orderData.pairId) {
            return res.status(400).json({ 'status': false, 'message': "NO_ORDER" });
        }

        let orderCost = 0;
        let balanceRetrieve = false;

        if (['open', 'pending', 'conditional'].includes(orderData.status)) {

            let positionDetails = await checkUserPosition(orderData.pairId._id, orderData.userId, orderData.buyorsell);
            let quantity = orderData.quantity - orderData.filledQuantity;

            if (positionDetails && positionDetails.status == 'POSITIONED') {
                if (positionDetails.orderList && positionDetails.orderList.length == 1) {
                    if (quantity > positionDetails.positionQuantity) {
                        balanceRetrieve = true

                        let remainingQuantity = quantity - positionDetails.positionQuantity;
                        orderCost = calculateInverseOrderCost({
                            'price': orderData.price,
                            'quantity': remainingQuantity,
                            'leverage': orderData.leverage,
                            'takerFee': orderData.pairId.taker_fees,
                            'buyorsell': orderData.buyorsell
                        })

                        orderCost = toFixed(orderCost, orderData.pairId.firstFloatDigit)
                    }

                } else if (positionDetails.orderList && positionDetails.orderList.length > 1) {
                    if (positionDetails.orderList[0].price == orderData.price) {

                        balanceRetrieve = true

                        let remainingQuantity = quantity - positionDetails.positionQuantity;

                        orderCost = calculateInverseOrderCost({
                            'price': positionDetails.orderList[1].price,
                            'quantity': remainingQuantity,
                            'leverage': orderData.leverage,
                            'takerFee': orderData.pairId.taker_fees,
                            'buyorsell': orderData.buyorsell
                        }) + calculateInverseOrderCost({
                            'price': orderData.price,
                            'quantity': quantity - remainingQuantity,
                            'leverage': orderData.leverage,
                            'takerFee': orderData.pairId.taker_fees,
                            'buyorsell': orderData.buyorsell
                        })

                        orderCost = toFixed(orderCost, orderData.pairId.firstFloatDigit)

                    } else {
                        balanceRetrieve = true

                        let remainingQuantity = quantity - positionDetails.positionQuantity;
                        orderCost = calculateInverseOrderCost({
                            'price': orderData.price,
                            'quantity': remainingQuantity,
                            'leverage': orderData.leverage,
                            'takerFee': orderData.pairId.taker_fees,
                            'buyorsell': orderData.buyorsell
                        })

                        orderCost = toFixed(orderCost, orderData.pairId.firstFloatDigit)
                    }
                }
            } else {
                let openOrder = await PerpetualOrder.aggregate([
                    {
                        "$match": {
                            'pairId': ObjectId(orderData.pairId._id),
                            'userId': ObjectId(req.user.id),
                            'status': { "$in": ['open', 'filled'] },
                            'positionStatus': 'closed',
                        }
                    },
                    {
                        "$project": {
                            'buyOrderCost': {
                                "$cond": [
                                    { "$eq": ["$buyorsell", "buy"] },
                                    "$orderCost",
                                    0
                                ]
                            },
                            'sellOrderCost': {
                                "$cond": [
                                    { "$eq": ["$buyorsell", "sell"] },
                                    "$orderCost",
                                    0
                                ]
                            }
                        }
                    },
                    {
                        "$group": {
                            "_id": null,
                            "buyOrderCost": { "$sum": "$buyOrderCost" },
                            "sellOrderCost": { "$sum": "$sellOrderCost" },
                        }
                    }
                ])

                if (openOrder && openOrder.length > 0 && ((orderData.buyorsell == 'buy' && openOrder[0].sellOrderCost > 0) || (orderData.buyorsell == 'sell' && openOrder[0].buyOrderCost > 0))) {
                    let remainingOrderCost = 0;

                    if (orderData.buyorsell == 'buy') {
                        remainingOrderCost = openOrder[0].buyOrderCost - openOrder[0].sellOrderCost;
                    } else if (orderData.buyorsell == 'sell') {
                        remainingOrderCost = openOrder[0].sellOrderCost - openOrder[0].buyOrderCost;
                    }


                    if (remainingOrderCost > 0) {
                        if (remainingOrderCost > orderData.orderCost) {
                            balanceRetrieve = true
                            orderCost = orderData.orderCost;
                        } else if (remainingOrderCost < orderData.orderCost) {
                            balanceRetrieve = true
                            orderCost = remainingOrderCost;
                        }
                    }
                } else {
                    balanceRetrieve = true
                    orderCost = orderData.orderCost;
                }

                orderCost = toFixed(orderCost, orderData.pairId.firstFloatDigit)
            }

            orderData.status = 'cancel';
            await orderData.save();

            if (balanceRetrieve) {
                await Wallet.updateOne({
                    "_id": orderData.userId,
                    'assets._id': orderData.firstCurrencyId
                }, {
                    "$inc": {
                        "assets.$.derivativeBal": orderCost
                    }
                })
            }

            getOpenOrderSocket(orderData.userId, orderData.pairId._id)
            getOrderBookSocket(orderData.pairId._id)
            getTradeHistorySocket(orderData.userId, orderData.pairId._id)

            return res.status(200).json({ 'status': true, 'message': "ORDER_CANCEL" });

        } else if (orderData.status == 'completed') {
            return res.status(400).json({ 'status': false, 'message': "ORDER_ALREADY_COMPLETED" });
        } else if (orderData.status == 'cancel') {
            return res.status(400).json({ 'status': false, 'message': "ORDER_ALREADY_CANCEL" });
        }
        return res.status(400).json({ 'status': false, 'message': "SOMETHING_WRONG" });
    } catch (err) {
        return res.status(500).json({ 'status': false, 'message': "Error occured" });
    }
}

/** 
 * Order cancel by Time In Force
*/
export const ordercancelTIF = async (orderData, pairData) => {
    try {
        let orderCost = 0;
        let balanceRetrieve = false;

        if (['open', 'pending', 'conditional'].includes(orderData.status)) {

            let positionDetails = await checkUserPosition(pairData._id, orderData.userId, orderData.buyorsell);
            let quantity = orderData.quantity - orderData.filledQuantity;

            if (positionDetails && positionDetails.status == 'POSITIONED') {
                if (positionDetails.orderList && positionDetails.orderList.length == 1) {
                    if (quantity > positionDetails.positionQuantity) {
                        balanceRetrieve = true

                        let remainingQuantity = quantity - positionDetails.positionQuantity;
                        orderCost = calculateInverseOrderCost({
                            'price': orderData.price,
                            'quantity': remainingQuantity,
                            'leverage': orderData.leverage,
                            'takerFee': pairData.taker_fees,
                            'buyorsell': orderData.buyorsell
                        })

                        orderCost = toFixed(orderCost, pairData.firstFloatDigit)
                    }

                } else if (positionDetails.orderList && positionDetails.orderList.length > 1) {
                    if (positionDetails.orderList[0].price == orderData.price) {

                        balanceRetrieve = true

                        let remainingQuantity = quantity - positionDetails.positionQuantity;

                        orderCost = calculateInverseOrderCost({
                            'price': positionDetails.orderList[1].price,
                            'quantity': remainingQuantity,
                            'leverage': orderData.leverage,
                            'takerFee': pairData.taker_fees,
                            'buyorsell': orderData.buyorsell
                        }) + calculateInverseOrderCost({
                            'price': orderData.price,
                            'quantity': quantity - remainingQuantity,
                            'leverage': orderData.leverage,
                            'takerFee': pairData.taker_fees,
                            'buyorsell': orderData.buyorsell
                        })

                        orderCost = toFixed(orderCost, pairData.firstFloatDigit)

                    } else {
                        balanceRetrieve = true

                        let remainingQuantity = quantity - positionDetails.positionQuantity;
                        orderCost = calculateInverseOrderCost({
                            'price': orderData.price,
                            'quantity': remainingQuantity,
                            'leverage': orderData.leverage,
                            'takerFee': pairData.taker_fees,
                            'buyorsell': orderData.buyorsell
                        })

                        orderCost = toFixed(orderCost, pairData.firstFloatDigit)
                    }
                }
            } else {
                let openOrder = await PerpetualOrder.aggregate([
                    {
                        "$match": {
                            'pairId': ObjectId(orderData.pairId),
                            'userId': ObjectId(orderData.userId),
                            'status': { "$in": ['open', 'filled'] },
                            'positionStatus': 'closed',
                        }
                    },
                    {
                        "$project": {
                            'buyOrderCost': {
                                "$cond": [
                                    { "$eq": ["$buyorsell", "buy"] },
                                    "$orderCost",
                                    0
                                ]
                            },
                            'sellOrderCost': {
                                "$cond": [
                                    { "$eq": ["$buyorsell", "sell"] },
                                    "$orderCost",
                                    0
                                ]
                            }
                        }
                    },
                    {
                        "$group": {
                            "_id": null,
                            "buyOrderCost": { "$sum": "$buyOrderCost" },
                            "sellOrderCost": { "$sum": "$sellOrderCost" },
                        }
                    }
                ])

                if (openOrder && openOrder.length > 0 && ((orderData.buyorsell == 'buy' && openOrder[0].sellOrderCost > 0) || (orderData.buyorsell == 'sell' && openOrder[0].buyOrderCost > 0))) {
                    let remainingOrderCost = 0;

                    if (orderData.buyorsell == 'buy') {
                        remainingOrderCost = openOrder[0].buyOrderCost - openOrder[0].sellOrderCost;
                    } else if (orderData.buyorsell == 'sell') {
                        remainingOrderCost = openOrder[0].sellOrderCost - openOrder[0].buyOrderCost;
                    }


                    if (remainingOrderCost > 0) {
                        if (remainingOrderCost > orderData.orderCost) {
                            balanceRetrieve = true
                            orderCost = orderData.orderCost;
                        } else if (remainingOrderCost < orderData.orderCost) {
                            balanceRetrieve = true
                            orderCost = remainingOrderCost;
                        }
                    }
                } else {
                    balanceRetrieve = true
                    orderCost = orderData.orderCost;
                }

                orderCost = toFixed(orderCost, pairData.firstFloatDigit)
            }

            orderData.status = 'cancel';
            await orderData.save();

            if (balanceRetrieve) {
                await Wallet.updateOne({
                    "_id": orderData.userId,
                    'assets._id': orderData.firstCurrencyId
                }, {
                    "$inc": {
                        "assets.$.derivativeBal": orderCost
                    }
                })
            }

            console.log("Your Order cancelled successfully (TIME IN FORCE)")
            return true
        }
    } catch (err) {
        console.log("Error on order cancel (TIME IN FORCE)")
        return false
    }
}

/**
 * Order Placing
 * METHOD : POST
 * URL : /api/perpetual/orderPlace
 * BODY : newdate, spotPairId, stopPrice, price, quantity, buyorsell, orderType(limit,market,stopLimit,oco), limitPrice
*/
export const orderPlace = (req, res) => {
    try {
        let reqBody = req.body;

        if (reqBody.orderType == 'limit') {
            limitOrderPlace(req, res)
        } else if (reqBody.orderType == 'market') {
            marketOrderPlace(req, res)
        }
    } catch (err) {
        return res.status(400).json({ 'status': false, 'message': "Error occured For the Interval_orderPlace_err" });
    }
}

/** 
 * Check User Position
*/
export const checkUserPosition = async (pairId, userId, buyorsell) => {
    try {
        let positionDetails = await PerpetualOrder.aggregate([
            {
                "$match": {
                    'pairId': ObjectId(pairId),
                    'userId': ObjectId(userId),
                    // 'status': { "$in": ['pending', 'completed', 'cancel'] },
                    'positionStatus': 'open',
                    'buyorsell': buyorsell == 'buy' ? 'sell' : 'buy'
                }
            },
            {
                "$group": {
                    '_id': null,
                    'positionQuantity': { "$sum": "$positionQuantity" },
                }
            }
        ])

        if (positionDetails.length > 0) {
            let openOrder = await PerpetualOrder.aggregate([
                {
                    "$match": {
                        'pairId': ObjectId(pairId),
                        'userId': ObjectId(userId),
                        'status': { "$in": ['open', 'filled'] },
                        'positionStatus': 'closed',
                        'buyorsell': buyorsell
                    }
                },
                { "$sort": { "price": buyorsell == 'sell' ? 1 : -1 } },
                {
                    "$project": {
                        'price': 1,
                        'quantity': 1,
                        'filledQuantity': 1
                    }
                },
                {
                    "$group": {
                        '_id': null,
                        'orderList': {
                            "$push": {
                                'price': "$price",
                            }
                        },
                        "quantity": {
                            "$sum": {
                                "$subtract": [
                                    "$quantity",
                                    "$filledQuantity"
                                ]
                            }
                        }
                    }
                }
            ])

            return {
                'status': 'POSITIONED',
                'positionQuantity': positionDetails.length > 0 ? positionDetails[0].positionQuantity : 0,
                'orderList': openOrder.length > 0 ? openOrder[0].orderList : [],
                'openQuantity': openOrder.length > 0 ? openOrder[0].quantity : 0,
            }
        }

        return {
            'status': 'NOT_POSITION',
        }

    } catch (err) {
        return {
            'status': 'NOT_POSITION',
        }
    }
}

/** 
 * Limit Order Place
 * METHOD : POST
 * URL : /api/
 * BODY : pairId, buyorsell(buy,sell), leverage, takeProfitPrice, stopLossPrice, typeTIF(GTC,IOC,FOK), isProfitLoss,
*/
export const limitOrderPlace = async (req, res) => {
    try {
        let reqBody = req.body;
        let userId = req.user.id;
        let balanceCheck = false;

        reqBody.price = parseFloat(reqBody.price);
        reqBody.quantity = parseFloat(reqBody.quantity);
        reqBody.leverage = parseFloat(reqBody.leverage);

        let pairData = await PerpetualPair.findOne({ "_id": reqBody.pairId });
        if (!pairData) {
            return res.status(400).json({ "success": false, 'message': "Invalid pair detail" })
        }

        let orderValue = (reqBody.price * reqBody.quantity);
        let orderCost = 0;
        let liquidityPrice = isolatedLiquidationPrice({
            'buyorsell': reqBody.buyorsell,
            'price': reqBody.price,
            'leverage': reqBody.leverage,
            'maintanceMargin': pairData.maintenanceMargin
        })


        if (reqBody.quantity < pairData.minQuantity) {
            return res.status(400).json({ 'status': false, 'message': "Quantity of contract must not be lesser than " + pairData.minQuantity });
        } else if (reqBody.quantity > pairData.maxQuantity) {
            return res.status(400).json({ 'status': false, 'message': "Quantity of contract must not be higher than " + pairData.maxQuantity });
        } else if (reqBody.buyorsell == "buy" && liquidityPrice > reqBody.price) {
            return res.status(400).json({ 'status': false, 'message': "Opening this position may cause immediate liquidation as the system predicts that the position's Liquidation price will be above Mark Price if the order is fulfilled." });
        } else if (reqBody.buyorsell == "sell" && liquidityPrice < reqBody.price) {
            return res.status(400).json({ 'status': false, 'message': "Opening this position may cause immediate liquidation as the system predicts that the position's Liquidation price will be beloww Mark Price if the order is fulfilled." });
        }
        let positionDetails = await checkUserPosition(reqBody.pairId, req.user.id, reqBody.buyorsell)

        if (positionDetails && positionDetails.status == 'POSITIONED') {
            if (positionDetails.orderList && positionDetails.orderList.length > 0) {

                if (reqBody.buyorsell == 'sell') {
                    let positionQuantity = Math.max(0, positionDetails.positionQuantity - positionDetails.openQuantity)

                    if (reqBody.price < positionDetails.orderList[0].price) {
                        if (reqBody.quantity > positionQuantity) {
                            balanceCheck = true;

                            let remainingQuantity = reqBody.quantity - positionQuantity;

                            orderCost = calculateInverseOrderCost({
                                'price': positionDetails.orderList[0].price,
                                'quantity': remainingQuantity,
                                'leverage': reqBody.leverage,
                                'takerFee': pairData.taker_fees,
                                'buyorsell': reqBody.buyorsell
                            })

                        }
                    } else {
                        if (reqBody.quantity > positionQuantity) {
                            balanceCheck = true;
                            let remainingQuantity = reqBody.quantity - positionQuantity;
                            orderCost = calculateInverseOrderCost({
                                'price': reqBody.price,
                                'quantity': remainingQuantity,
                                'leverage': reqBody.leverage,
                                'takerFee': pairData.taker_fees,
                                'buyorsell': reqBody.buyorsell
                            })
                        }
                    }
                } else if (reqBody.buyorsell == 'buy') {
                    let positionQuantity = Math.max(0, positionDetails.positionQuantity - positionDetails.openQuantity)

                    if (reqBody.price > positionDetails.orderList[0].price) {
                        if (reqBody.quantity > positionQuantity) {
                            balanceCheck = true;

                            let remainingQuantity = reqBody.quantity - positionQuantity;

                            orderCost = calculateInverseOrderCost({
                                'price': positionDetails.orderList[0].price,
                                'quantity': remainingQuantity,
                                'leverage': reqBody.leverage,
                                'takerFee': pairData.taker_fees,
                                'buyorsell': reqBody.buyorsell
                            })

                        }
                    } else {
                        if (reqBody.quantity > positionQuantity) {
                            balanceCheck = true;
                            let remainingQuantity = reqBody.quantity - positionQuantity;
                            orderCost = calculateInverseOrderCost({
                                'price': reqBody.price,
                                'quantity': remainingQuantity,
                                'leverage': reqBody.leverage,
                                'takerFee': pairData.taker_fees,
                                'buyorsell': reqBody.buyorsell
                            })
                        }
                    }
                }
            } else if (positionDetails.orderList && positionDetails.orderList.length == 0) {
                if (reqBody.quantity > positionDetails.positionQuantity) {
                    balanceCheck = true;

                    let remainingQuantity = reqBody.quantity - positionDetails.positionQuantity;
                    orderCost = calculateInverseOrderCost({
                        'price': reqBody.price,
                        'quantity': remainingQuantity,
                        'leverage': reqBody.leverage,
                        'takerFee': pairData.taker_fees,
                        'buyorsell': reqBody.buyorsell
                    })

                }
            }
        } else {
            let openOrder = await PerpetualOrder.aggregate([
                {
                    "$match": {
                        'pairId': ObjectId(reqBody.pairId),
                        'userId': ObjectId(req.user.id),
                        'status': { "$in": ['open', 'filled'] },
                        'positionStatus': 'closed',
                    }
                },
                {
                    "$project": {
                        'buyOrderCost': {
                            "$cond": [
                                { "$eq": ["$buyorsell", "buy"] },
                                "$orderCost",
                                0
                            ]
                        },
                        'sellOrderCost': {
                            "$cond": [
                                { "$eq": ["$buyorsell", "sell"] },
                                "$orderCost",
                                0
                            ]
                        }
                    }
                },
                {
                    "$group": {
                        "_id": null,
                        "buyOrderCost": { "$sum": "$buyOrderCost" },
                        "sellOrderCost": { "$sum": "$sellOrderCost" },
                    }
                }
            ])

            if (openOrder && openOrder.length > 0) {
                if (reqBody.buyorsell == 'buy') {
                    let totalBuyOrderCost = openOrder[0].buyOrderCost - openOrder[0].sellOrderCost;
                    if (totalBuyOrderCost >= 0) {
                        balanceCheck = true;
                        orderCost = calculateInverseOrderCost({
                            'price': reqBody.price,
                            'quantity': reqBody.quantity,
                            'leverage': reqBody.leverage,
                            'takerFee': pairData.taker_fees,
                            'buyorsell': reqBody.buyorsell
                        })
                    } else {
                        let givenOrderCost = calculateInverseOrderCost({
                            'price': reqBody.price,
                            'quantity': reqBody.quantity,
                            'leverage': reqBody.leverage,
                            'takerFee': pairData.taker_fees,
                            'buyorsell': reqBody.buyorsell
                        })

                        if (givenOrderCost > Math.abs(totalBuyOrderCost)) {
                            balanceCheck = true;
                            orderCost = givenOrderCost - Math.abs(totalBuyOrderCost)
                        }
                    }
                } else if (reqBody.buyorsell == 'sell') {
                    let totalSellOrderCost = openOrder[0].sellOrderCost - openOrder[0].buyOrderCost;
                    if (totalSellOrderCost >= 0) {
                        balanceCheck = true;
                        orderCost = calculateInverseOrderCost({
                            'price': reqBody.price,
                            'quantity': reqBody.quantity,
                            'leverage': reqBody.leverage,
                            'takerFee': pairData.taker_fees,
                            'buyorsell': reqBody.buyorsell
                        })
                    } else {
                        let givenOrderCost = calculateInverseOrderCost({
                            'price': reqBody.price,
                            'quantity': reqBody.quantity,
                            'leverage': reqBody.leverage,
                            'takerFee': pairData.taker_fees,
                            'buyorsell': reqBody.buyorsell
                        })
                        if (givenOrderCost > Math.abs(totalSellOrderCost)) {
                            balanceCheck = true;
                            orderCost = givenOrderCost - Math.abs(totalSellOrderCost)
                        }
                    }
                }
            } else {
                balanceCheck = true;
                orderCost = calculateInverseOrderCost({
                    'price': reqBody.price,
                    'quantity': reqBody.quantity,
                    'leverage': reqBody.leverage,
                    'takerFee': pairData.taker_fees,
                    'buyorsell': reqBody.buyorsell
                })
            }

            if (reqBody.buyorsell == 'sell' && liquidityPrice < pairData.markPrice) {
                return res.status(400).json({ 'status': false, 'message': "Opening this position may cause immediate liquidation as the system predicts that the position's Liquidation price will be below Mark Price if the order is fullfilled" });
            } else if (reqBody.buyorsell == 'buy' && liquidityPrice > pairData.markPrice) {
                return res.status(400).json({ 'status': false, 'message': "Opening this position may cause immediate liquidation as the system predicts that the position's Liquidation price will be below Mark Price if the order is fullfilled" });
            }
        }

        let usrWallet = await Wallet.findOne({ "_id": userId })
        if (!usrWallet) {
            return res.status(400).json({ 'status': false, 'message': "Wallet not found" });
        }

        let usrAsset = usrWallet.assets.id(pairData.firstCurrencyId)
        if (!usrAsset) {
            return res.status(400).json({ 'status': false, 'message': "Wallet not found" });
        }

        if (balanceCheck) {
            if (usrAsset.derivativeBal < orderCost) {
                return res.status(400).json({ 'status': false, 'message': "Due to insuffient balance order cannot be placed" });
            }

            usrAsset.derivativeBal = usrAsset.derivativeBal - toFixed(orderCost, pairData.firstFloatDigit);
            await usrWallet.save()
        }

        const newOrder = new PerpetualOrder({
            'pairId': pairData._id,
            'pairName': `${pairData.firstCurrencySymbol}${pairData.secondCurrencySymbol}`,
            'userId': userId,
            'firstCurrencyId': pairData.firstCurrencyId,
            'firstCurrency': pairData.firstCurrencySymbol,
            'firstCurrencyId': pairData.firstCurrencyId,
            'firstCurrency': pairData.firstCurrencySymbol,
            'secondCurrencyId': pairData.secondCurrencyId,
            'secondCurrency': pairData.secondCurrencySymbol,
            'buyorsell': reqBody.buyorsell,
            'orderType': reqBody.orderType,
            'price': reqBody.price,
            'quantity': reqBody.quantity,
            'liquidityPrice': liquidityPrice,
            'leverage': reqBody.leverage,
            'orderValue': orderValue,
            'orderCost': calculateInverseOrderCost({
                'price': reqBody.price,
                'quantity': reqBody.quantity,
                'leverage': reqBody.leverage,
                'takerFee': pairData.taker_fees,
                'buyorsell': reqBody.buyorsell
            }),
            'orderDate': new Date(),
            'takerFee': pairData.taker_fees,
            'takeProfitPrice': reqBody.takeProfitPrice,
            'stopLossPrice': reqBody.stopLossPrice,
            'isProfitLoss': reqBody.isProfitLoss,
            'typeTIF': reqBody.typeTIF,
            'status': 'open',
        });

        let newOrderData = await newOrder.save();

        tradeList(newOrderData, pairData)
        getOpenOrderSocket(newOrderData.userId, newOrderData.pairId)
        getOrderBookSocket(newOrderData.pairId)
        getTradeHistorySocket(newOrderData.userId, newOrderData.pairId)

        return res.status(200).json({ 'status': false, 'message': "Your order placed successfully." });

    } catch (err) {
        return res.status(500).json({ 'status': false, 'message': "Error occured." });
    }
}

/** 
 * Trade list data
*/
export const tradeList = async (newOrder, pairData) => {
    try {
        let matchQuery = {
            "$or": [
                { "status": "open" },
                { "status": "pending" }
            ],
            "userId": { "$ne": ObjectId(newOrder.userId) },
            "pairId": ObjectId(newOrder.pairId)
        };

        let sortQuery = { "price": 1 }

        if (newOrder.buyorsell == 'buy') {
            matchQuery['buyorsell'] = 'sell';
            matchQuery['price'] = { "$lte": newOrder.price };
        } else if (newOrder.buyorsell == 'sell') {
            matchQuery['buyorsell'] = 'buy';
            matchQuery['price'] = { "$gte": newOrder.price };
            sortQuery = { "price": -1 }
        }

        let orderList = await PerpetualOrder.aggregate([
            { '$match': matchQuery },
            { '$sort': sortQuery },
            { '$limit': 50 },
        ])

        if (newOrder.typeTIF == 'FOK') {
            let orderBookQuantity = 0;
            for (let orderBookData of orderList) {
                orderBookQuantity = orderBookQuantity + (orderBookData.quantity - orderBookData.filledQuantity)
            }
            if (orderBookQuantity < newOrder.quantity) {
                console.log("Fill or Kill")
                newOrder.status = 'cancel'
                await newOrder.save();

                await ordercancelTIF(newOrder, pairData);
                return false
            }
        }

        if (orderList && orderList.length > 0) {
            return await tradeMatching(newOrder, orderList, 0, pairData)
        } else {
            console.log("---newOrder.orderType == 'limit' && newOrder.typeTIF == 'IOC'", newOrder.orderType, newOrder.typeTIF)
            if (newOrder.orderType == 'limit' && newOrder.typeTIF == 'IOC') {
                await ordercancelTIF(newOrder, pairData);
            }
            console.log("No trade record")
            return false
        }

        return true

    } catch (err) {
        console.log("Error on Trade match ", err)
        return false
    }
}

/** 
 * Market Order Place
 * METHOD : POST
 * URL : /api/
 * BODY : pairId, buyorsell(buy,sell), quantity, leverage, takeProfitPrice, stopLossPrice
*/
export const marketOrderPlace = async (req, res) => {
    try {
        let reqBody = req.body;
        let userId = req.user.id;
        let balanceCheck = false;

        // reqBody.price = parseFloat(reqBody.price);
        reqBody.quantity = parseFloat(reqBody.quantity);
        reqBody.leverage = parseFloat(reqBody.leverage);

        let pairData = await PerpetualPair.findOne({ "_id": reqBody.pairId });
        if (!pairData) {
            return res.status(400).json({ "success": false, 'message': "Invalid pair detail" })
        }

        if (reqBody.quantity < pairData.minQuantity) {
            return res.status(400).json({ 'status': false, 'message': "Quantity of contract must not be lesser than " + pairData.minQuantity });
        } else if (reqBody.quantity > pairData.maxQuantity) {
            return res.status(400).json({ 'status': false, 'message': "Quantity of contract must not be higher than " + pairData.maxQuantity });
        }

        let usrWallet = await Wallet.findOne({ "_id": userId })
        if (!usrWallet) {
            return res.status(400).json({ 'status': false, 'message': "Wallet not found" });
        }

        let usrAsset = usrWallet.assets.id(pairData.firstCurrencyId)
        if (!usrAsset) {
            return res.status(400).json({ 'status': false, 'message': "Wallet not found" });
        }

        let perpetualOrder = await PerpetualOrder.aggregate([
            {
                "$match": {
                    'pairId': ObjectId(reqBody.pairId),
                    'userId': { "$ne": ObjectId(req.user.id) },
                    'status': { "$in": ['open', 'pending'] },
                    'buyorsell': reqBody.buyorsell == 'buy' ? "sell" : "buy"
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

        if ((perpetualOrder && perpetualOrder.length == 0) || (perpetualOrder[0].orderBook && perpetualOrder[0].orderBook.length == 0)) {
            return res.status(400).json({ 'status': false, 'message': "NO_ORDER" });
        }

        let orderBookQuantity = 0, orderBookPrice = 0;
        for (const key in perpetualOrder[0].orderBook) {
            let item = perpetualOrder[0].orderBook[key];
            orderBookQuantity = orderBookQuantity + (item.quantity - item.filledQuantity);

            if (orderBookQuantity >= reqBody.quantity) {
                orderBookPrice = item._id;
                break;
            } else if (key == (perpetualOrder[0].orderBook.length - 1)) {
                orderBookPrice = item._id;;
            }
        }


        reqBody.price = parseFloat(orderBookPrice);

        let orderValue = (reqBody.price * reqBody.quantity);
        let orderCost = 0;
        let liquidityPrice = isolatedLiquidationPrice({
            'buyorsell': reqBody.buyorsell,
            'price': reqBody.price,
            'leverage': reqBody.leverage,
            'maintanceMargin': pairData.maintenanceMargin
        })

        let positionDetails = await checkUserPosition(reqBody.pairId, req.user.id, reqBody.buyorsell)

        if (positionDetails && positionDetails.status == 'POSITIONED') {
            if (positionDetails.orderList && positionDetails.orderList.length > 0) {

                if (reqBody.buyorsell == 'sell') {
                    let positionQuantity = Math.max(0, positionDetails.positionQuantity - positionDetails.openQuantity)

                    if (reqBody.price < positionDetails.orderList[0].price) {
                        if (reqBody.quantity > positionQuantity) {
                            balanceCheck = true;

                            let remainingQuantity = reqBody.quantity - positionQuantity;

                            orderCost = calculateInverseOrderCost({
                                'price': positionDetails.orderList[0].price,
                                'quantity': remainingQuantity,
                                'leverage': reqBody.leverage,
                                'takerFee': pairData.taker_fees,
                                'buyorsell': reqBody.buyorsell
                            })

                        }
                    } else {
                        if (reqBody.quantity > positionQuantity) {
                            balanceCheck = true;
                            let remainingQuantity = reqBody.quantity - positionQuantity;
                            orderCost = calculateInverseOrderCost({
                                'price': reqBody.price,
                                'quantity': remainingQuantity,
                                'leverage': reqBody.leverage,
                                'takerFee': pairData.taker_fees,
                                'buyorsell': reqBody.buyorsell
                            })
                        }
                    }
                } else if (reqBody.buyorsell == 'buy') {
                    let positionQuantity = Math.max(0, positionDetails.positionQuantity - positionDetails.openQuantity)

                    if (reqBody.price > positionDetails.orderList[0].price) {
                        if (reqBody.quantity > positionQuantity) {
                            balanceCheck = true;

                            let remainingQuantity = reqBody.quantity - positionQuantity;

                            orderCost = calculateInverseOrderCost({
                                'price': positionDetails.orderList[0].price,
                                'quantity': remainingQuantity,
                                'leverage': reqBody.leverage,
                                'takerFee': pairData.taker_fees,
                                'buyorsell': reqBody.buyorsell
                            })

                        }
                    } else {
                        if (reqBody.quantity > positionQuantity) {
                            balanceCheck = true;
                            let remainingQuantity = reqBody.quantity - positionQuantity;
                            orderCost = calculateInverseOrderCost({
                                'price': reqBody.price,
                                'quantity': remainingQuantity,
                                'leverage': reqBody.leverage,
                                'takerFee': pairData.taker_fees,
                                'buyorsell': reqBody.buyorsell
                            })
                        }
                    }
                }
            } else if (positionDetails.orderList && positionDetails.orderList.length == 0) {
                if (reqBody.quantity > positionDetails.positionQuantity) {
                    balanceCheck = true;

                    let remainingQuantity = reqBody.quantity - positionDetails.positionQuantity;
                    orderCost = calculateInverseOrderCost({
                        'price': reqBody.price,
                        'quantity': remainingQuantity,
                        'leverage': reqBody.leverage,
                        'takerFee': pairData.taker_fees,
                        'buyorsell': reqBody.buyorsell
                    })

                }
            }
        } else {
            let openOrder = await PerpetualOrder.aggregate([
                {
                    "$match": {
                        'pairId': ObjectId(reqBody.pairId),
                        'userId': ObjectId(req.user.id),
                        'status': { "$in": ['open', 'filled'] },
                        'positionStatus': 'closed',
                    }
                },
                {
                    "$project": {
                        'buyOrderCost': {
                            "$cond": [
                                { "$eq": ["$buyorsell", "buy"] },
                                "$orderCost",
                                0
                            ]
                        },
                        'sellOrderCost': {
                            "$cond": [
                                { "$eq": ["$buyorsell", "sell"] },
                                "$orderCost",
                                0
                            ]
                        }
                    }
                },
                {
                    "$group": {
                        "_id": null,
                        "buyOrderCost": { "$sum": "$buyOrderCost" },
                        "sellOrderCost": { "$sum": "$sellOrderCost" },
                    }
                }
            ])

            if (openOrder && openOrder.length > 0) {
                if (reqBody.buyorsell == 'buy') {
                    let totalBuyOrderCost = openOrder[0].buyOrderCost - openOrder[0].sellOrderCost;
                    if (totalBuyOrderCost >= 0) {
                        balanceCheck = true;
                        orderCost = calculateInverseOrderCost({
                            'price': reqBody.price,
                            'quantity': reqBody.quantity,
                            'leverage': reqBody.leverage,
                            'takerFee': pairData.taker_fees,
                            'buyorsell': reqBody.buyorsell
                        })
                    } else {
                        let givenOrderCost = calculateInverseOrderCost({
                            'price': reqBody.price,
                            'quantity': reqBody.quantity,
                            'leverage': reqBody.leverage,
                            'takerFee': pairData.taker_fees,
                            'buyorsell': reqBody.buyorsell
                        })

                        if (givenOrderCost > Math.abs(totalBuyOrderCost)) {
                            balanceCheck = true;
                            orderCost = givenOrderCost - Math.abs(totalBuyOrderCost)
                        }
                    }
                } else if (reqBody.buyorsell == 'sell') {
                    let totalSellOrderCost = openOrder[0].sellOrderCost - openOrder[0].buyOrderCost;
                    if (totalSellOrderCost >= 0) {
                        balanceCheck = true;
                        orderCost = calculateInverseOrderCost({
                            'price': reqBody.price,
                            'quantity': reqBody.quantity,
                            'leverage': reqBody.leverage,
                            'takerFee': pairData.taker_fees,
                            'buyorsell': reqBody.buyorsell
                        })
                    } else {
                        let givenOrderCost = calculateInverseOrderCost({
                            'price': reqBody.price,
                            'quantity': reqBody.quantity,
                            'leverage': reqBody.leverage,
                            'takerFee': pairData.taker_fees,
                            'buyorsell': reqBody.buyorsell
                        })
                        if (givenOrderCost > Math.abs(totalSellOrderCost)) {
                            balanceCheck = true;
                            orderCost = givenOrderCost - Math.abs(totalSellOrderCost)
                        }
                    }
                }
            } else {
                balanceCheck = true;
                orderCost = calculateInverseOrderCost({
                    'price': reqBody.price,
                    'quantity': reqBody.quantity,
                    'leverage': reqBody.leverage,
                    'takerFee': pairData.taker_fees,
                    'buyorsell': reqBody.buyorsell
                })
            }
        }

        if (balanceCheck) {
            if (usrAsset.derivativeBal < orderCost) {
                return res.status(400).json({ 'status': false, 'message': "Due to insuffient balance order cannot be placed" });
            }

            usrAsset.derivativeBal = usrAsset.derivativeBal - toFixed(orderCost, pairData.firstFloatDigit);
            await usrWallet.save()
        }

        const newOrder = new PerpetualOrder({
            'pairId': pairData._id,
            'pairName': `${pairData.firstCurrencySymbol}${pairData.secondCurrencySymbol}`,
            'userId': userId,
            'firstCurrencyId': pairData.firstCurrencyId,
            'firstCurrency': pairData.firstCurrencySymbol,
            'firstCurrencyId': pairData.firstCurrencyId,
            'firstCurrency': pairData.firstCurrencySymbol,
            'secondCurrencyId': pairData.secondCurrencyId,
            'secondCurrency': pairData.secondCurrencySymbol,
            'buyorsell': reqBody.buyorsell,
            'orderType': reqBody.orderType,
            'price': reqBody.price,
            'quantity': reqBody.quantity,
            'liquidityPrice': liquidityPrice,
            'leverage': reqBody.leverage,
            'orderValue': orderValue,
            'orderCost': calculateInverseOrderCost({
                'price': reqBody.price,
                'quantity': reqBody.quantity,
                'leverage': reqBody.leverage,
                'takerFee': pairData.taker_fees,
                'buyorsell': reqBody.buyorsell
            }),
            'orderDate': new Date(),
            'takerFee': pairData.taker_fees,
            'takeProfitPrice': reqBody.takeProfitPrice,
            'stopLossPrice': reqBody.stopLossPrice,
            'status': 'open',
        });

        let newOrderData = await newOrder.save();

        let matchStatus = await tradeMatching(newOrderData, perpetualOrder[0].orderList, 0, pairData)
        if (!matchStatus) {
            return res.status(400).json({ 'status': false, 'message': "Market order match error" });
        }

        // tradeList(newOrderData, pairData)
        // getOpenOrderSocket(newOrderData.userId, newOrderData.pairId)
        // getOrderBookSocket(newOrderData.pairId)
        // getTradeHistorySocket(newOrderData.userId, newOrderData.pairId)

        return res.status(200).json({ 'status': false, 'message': "Your order placed successfully." });

    } catch (err) {
        return res.status(500).json({ 'status': false, 'message': "Error occured." });
    }
}

/** 
 * Trade matching
*/
export const tradeMatching = async (newOrder, orderData, count = 0, pairData) => {
    try {
        if (!['open', 'pending'].includes(newOrder.status)) {
            return true;
        } else if (isEmpty(orderData[count])) {
            if (newOrder.orderType == 'limit' && newOrder.typeTIF == 'IOC') {
                await ordercancelTIF(newOrder, pairData);
            }
            return true;
        }
        let
            sellOrderData,
            buyOrderData;

        if (newOrder.buyorsell == 'buy') {
            buyOrderData = newOrder;
            sellOrderData = orderData[count];
        } else if (newOrder.buyorsell == 'sell') {
            sellOrderData = newOrder;
            buyOrderData = orderData[count];
        }

        let uniqueId = Math.floor(Math.random() * 1000000000);

        let newOrderQuantity = newOrder.quantity - newOrder.filledQuantity;
        let orderDataQuantity = orderData[count].quantity - orderData[count].filledQuantity;

        if (newOrderQuantity == orderDataQuantity) {
            let price = newOrder.buyorsell == 'buy' ? orderData[count].price : newOrder.price;

            /* New Order */
            let takerOrderValue = price * newOrderQuantity;
            let takerFee = takerOrderValue * (pairData.taker_fees / 100);
            let takerOrderCost = calculateInverseOrderCost({
                'price': price,
                'quantity': newOrderQuantity,
                'leverage': newOrder.leverage,
                'takerFee': pairData.taker_fees,
                'buyorsell': newOrder.buyorsell
            })

            let newOrderUpdate = await await PerpetualOrder.findOneAndUpdate({
                '_id': newOrder._id
            }, {
                'status': 'completed',
                'filledQuantity': newOrder.filledQuantity + newOrderQuantity,
                "$push": {
                    "filled": {
                        "pairId": newOrder.pairId,
                        "sellUserId": newOrder.buyorsell == 'sell' ? newOrder.userId : orderData[count].userId,
                        "buyUserId": newOrder.buyorsell == 'buy' ? newOrder.userId : orderData[count].userId,
                        "userId": newOrder.userId,
                        "sellOrderId": newOrder.buyorsell == 'sell' ? newOrder._id : orderData[count]._id,
                        "buyOrderId": newOrder.buyorsell == 'buy' ? newOrder._id : orderData[count]._id,
                        "uniqueId": uniqueId,
                        "price": price,
                        "filledQuantity": newOrderQuantity,
                        "Fees": takerFee,
                        "feesRate": pairData.taker_fees,
                        "status": "filled",
                        "Type": newOrder.buyorsell,
                        "createdAt": new Date(),
                        "orderValue": takerOrderValue,
                        "orderCost": takerOrderCost
                    }
                }
            }, { 'new': true });

            await positionMatching(newOrderUpdate, price, newOrderQuantity, pairData, 'taker')
            await getOpenOrderSocket(newOrder.userId, newOrder.pairId)
            await getFilledOrderSocket(newOrder.userId, newOrder.pairId)
            await getTradeHistorySocket(newOrder.userId, newOrder.pairId)
            await getPositionOrderSocket(pairData, newOrder.userId)


            /* Order Book */
            let makerOrderValue = price * orderDataQuantity;
            let makerFee = makerOrderValue * (pairData.maker_rebate / 100);
            let makerOrderCost = calculateInverseOrderCost({
                'price': price,
                'quantity': orderDataQuantity,
                'leverage': orderData[count].leverage,
                'takerFee': pairData.taker_fees,
                'buyorsell': orderData[count].buyorsell
            })

            let orderBookUpdate = await PerpetualOrder.findOneAndUpdate({
                '_id': orderData[count]._id
            }, {
                'status': 'completed',
                'filledQuantity': orderData[count].filledQuantity + orderDataQuantity,
                "$push": {
                    "filled": {
                        "pairId": orderData[count].pairId,
                        "sellUserId": orderData[count].buyorsell == 'sell' ? orderData[count].userId : newOrder.userId,
                        "buyUserId": orderData[count].buyorsell == 'buy' ? orderData[count].userId : newOrder.userId,
                        "userId": orderData[count].userId,
                        "sellOrderId": orderData[count].buyorsell == 'sell' ? orderData[count]._id : newOrder._id,
                        "buyOrderId": orderData[count].buyorsell == 'buy' ? orderData[count]._id : newOrder._id,
                        "uniqueId": uniqueId,
                        "price": price,
                        "filledQuantity": orderDataQuantity,
                        "Fees": makerFee,
                        "feesRate": pairData.maker_rebate,
                        "status": "filled",
                        "Type": orderData[count].buyorsell,
                        "createdAt": new Date(),
                        "orderValue": makerOrderValue,
                        "orderCost": makerOrderCost
                    }
                }
            }, { 'new': true });

            // Balance Retrieve
            if (sellOrderData.price < buyOrderData.price) {
                await assetUpdate({
                    'currencyId': buyOrderData.secondCurrencyId,
                    'userId': buyOrderData.userId,
                    'balance': (buyOrderData.price * orderDataQuantity) - (sellOrderData.price * orderDataQuantity)
                })
            }

            await positionMatching(orderBookUpdate, price, orderDataQuantity, pairData, 'maker')
            await getOpenOrderSocket(orderData[count].userId, orderData[count].pairId)
            await getFilledOrderSocket(orderData[count].userId, orderData[count].pairId)
            await getTradeHistorySocket(orderData[count].userId, orderData[count].pairId)
            await getPositionOrderSocket(pairData, orderData[count].userId)

            await getOrderBookSocket(orderData[count].pairId)
            await marketPriceSocket(orderData[count].pairId)

            return true
        } else if (newOrderQuantity < orderDataQuantity) {
            let price = newOrder.buyorsell == 'buy' ? orderData[count].price : newOrder.price;

            /* New Order */
            let takerOrderValue = price * newOrderQuantity;
            let takerRequiredMargin = takerOrderValue / newOrder.leverage;
            let takerFee = takerOrderValue * (pairData.taker_fees / 100);
            let takerOrderCost = calculateInverseOrderCost({
                'price': price,
                'quantity': newOrderQuantity,
                'leverage': newOrder.leverage,
                'takerFee': pairData.taker_fees,
                'buyorsell': newOrder.buyorsell
            })

            let newOrderUpdate = await PerpetualOrder.findOneAndUpdate({
                '_id': newOrder._id
            }, {
                'status': 'completed',
                'filledQuantity': newOrder.filledQuantity + newOrderQuantity,
                "$push": {
                    "filled": {
                        "pairId": newOrder.pairId,
                        "sellUserId": newOrder.buyorsell == 'sell' ? newOrder.userId : orderData[count].userId,
                        "buyUserId": newOrder.buyorsell == 'buy' ? newOrder.userId : orderData[count].userId,
                        "userId": newOrder.userId,
                        "sellOrderId": newOrder.buyorsell == 'sell' ? newOrder._id : orderData[count]._id,
                        "buyOrderId": newOrder.buyorsell == 'buy' ? newOrder._id : orderData[count]._id,
                        "uniqueId": uniqueId,
                        "price": price,
                        "filledQuantity": newOrderQuantity,
                        "Fees": takerFee,
                        "feesRate": pairData.taker_fees,
                        "status": "filled",
                        "Type": newOrder.buyorsell,
                        "createdAt": new Date(),
                        "orderValue": takerOrderValue,
                        "orderCost": takerOrderCost
                    }
                }
            }, { 'new': true });

            await positionMatching(newOrderUpdate, price, newOrderQuantity, pairData, 'taker')
            await getOpenOrderSocket(newOrder.userId, newOrder.pairId)
            await getFilledOrderSocket(newOrder.userId, newOrder.pairId)
            await getTradeHistorySocket(newOrder.userId, newOrder.pairId)
            await getPositionOrderSocket(pairData, newOrder.userId)

            /* Order Book */
            let makerOrderValue = price * newOrderQuantity;
            let makerRequiredMargin = makerOrderValue / orderData[count].leverage;
            let makerFee = makerOrderValue * (pairData.maker_rebate / 100);
            let makerOrderCost = calculateInverseOrderCost({
                'price': price,
                'quantity': orderDataQuantity,
                'leverage': orderData[count].leverage,
                'takerFee': pairData.taker_fees,
                'buyorsell': orderData[count].buyorsell
            })

            let orderBookUpdate = await PerpetualOrder.findOneAndUpdate({
                '_id': orderData[count]._id
            }, {
                'status': 'pending',
                'filledQuantity': orderData[count].filledQuantity + newOrderQuantity,
                "$push": {
                    "filled": {
                        "pairId": orderData[count].pairId,
                        "sellUserId": orderData[count].buyorsell == 'sell' ? orderData[count].userId : newOrder.userId,
                        "buyUserId": orderData[count].buyorsell == 'buy' ? orderData[count].userId : newOrder.userId,
                        "userId": orderData[count].userId,
                        "sellOrderId": orderData[count].buyorsell == 'sell' ? orderData[count]._id : newOrder._id,
                        "buyOrderId": orderData[count].buyorsell == 'buy' ? orderData[count]._id : newOrder._id,
                        "uniqueId": uniqueId,
                        "price": price,
                        "filledQuantity": newOrderQuantity,
                        "Fees": makerFee,
                        "feesRate": pairData.maker_rebate,
                        "status": "filled",
                        "Type": orderData[count].buyorsell,
                        "createdAt": new Date(),
                        "orderValue": makerOrderValue,
                        "orderCost": makerOrderCost
                    }
                }
            }, { 'new': true });

            // Balance Retrieve
            if (sellOrderData.price < buyOrderData.price) {
                await assetUpdate({
                    'currencyId': buyOrderData.secondCurrencyId,
                    'userId': buyOrderData.userId,
                    'balance': (buyOrderData.price * newOrderQuantity) - (sellOrderData.price * newOrderQuantity)
                })
            }

            await positionMatching(orderBookUpdate, price, newOrderQuantity, pairData, 'maker')
            await getOpenOrderSocket(orderData[count].userId, orderData[count].pairId)
            await getFilledOrderSocket(orderData[count].userId, orderData[count].pairId)
            await getTradeHistorySocket(orderData[count].userId, orderData[count].pairId)
            await getPositionOrderSocket(pairData, orderData[count].userId)

            await getOrderBookSocket(orderData[count].pairId)
            await marketPriceSocket(orderData[count].pairId)

            return true
        } else if (newOrderQuantity > orderDataQuantity) {
            let price = newOrder.buyorsell == 'buy' ? orderData[count].price : newOrder.price;

            /* New Order */
            let takerOrderValue = price * orderDataQuantity;
            let takerFee = takerOrderValue * (pairData.taker_fees / 100);
            let takerOrderCost = calculateInverseOrderCost({
                'price': price,
                'quantity': orderDataQuantity,
                'leverage': newOrder.leverage,
                'takerFee': pairData.taker_fees,
                'buyorsell': newOrder.buyorsell
            })

            let newOrderUpdate = await PerpetualOrder.findOneAndUpdate({
                '_id': newOrder._id
            }, {
                'status': 'pending',
                'filledQuantity': newOrder.filledQuantity + orderDataQuantity,
                "$push": {
                    "filled": {
                        "pairId": newOrder.pairId,
                        "sellUserId": newOrder.buyorsell == 'sell' ? newOrder.userId : orderData[count].userId,
                        "buyUserId": newOrder.buyorsell == 'buy' ? newOrder.userId : orderData[count].userId,
                        "userId": newOrder.userId,
                        "sellOrderId": newOrder.buyorsell == 'sell' ? newOrder._id : orderData[count]._id,
                        "buyOrderId": newOrder.buyorsell == 'buy' ? newOrder._id : orderData[count]._id,
                        "uniqueId": uniqueId,
                        "price": price,
                        "filledQuantity": orderDataQuantity,
                        "Fees": takerFee,
                        "feesRate": pairData.taker_fees,
                        "status": "filled",
                        "Type": newOrder.buyorsell,
                        "createdAt": new Date(),
                        "orderValue": takerOrderValue,
                        "orderCost": takerOrderCost
                    }
                }
            }, { 'new': true });

            await positionMatching(newOrderUpdate, price, orderDataQuantity, pairData, 'taker')
            await getOpenOrderSocket(newOrder.userId, newOrder.pairId)
            await getFilledOrderSocket(newOrder.userId, newOrder.pairId)
            await getTradeHistorySocket(newOrder.userId, newOrder.pairId)
            await getPositionOrderSocket(pairData, newOrder.userId)

            /* Order Book */
            let makerOrderValue = price * orderDataQuantity;
            let makerFee = makerOrderValue * (pairData.maker_rebate / 100);
            let makerOrderCost = calculateInverseOrderCost({
                'price': price,
                'quantity': orderDataQuantity,
                'leverage': orderData[count].leverage,
                'takerFee': pairData.taker_fees,
                'buyorsell': orderData[count].buyorsell
            })

            let orderBookUpdate = await PerpetualOrder.findOneAndUpdate({
                '_id': orderData[count]._id
            }, {
                'status': 'completed',
                'filledQuantity': orderData[count].filledQuantity + orderDataQuantity,
                "$push": {
                    "filled": {
                        "pairId": orderData[count].pairId,
                        "sellUserId": orderData[count].buyorsell == 'sell' ? orderData[count].userId : newOrder.userId,
                        "buyUserId": orderData[count].buyorsell == 'buy' ? orderData[count].userId : newOrder.userId,
                        "userId": orderData[count].userId,
                        "sellOrderId": orderData[count].buyorsell == 'sell' ? orderData[count]._id : newOrder._id,
                        "buyOrderId": orderData[count].buyorsell == 'buy' ? orderData[count]._id : newOrder._id,
                        "uniqueId": uniqueId,
                        "price": price,
                        "filledQuantity": orderDataQuantity,
                        "Fees": makerFee,
                        "feesRate": pairData.maker_rebate,
                        "status": "filled",
                        "Type": orderData[count].buyorsell,
                        "createdAt": new Date(),
                        "orderValue": makerOrderValue,
                        "orderCost": makerOrderCost
                    }
                }
            }, { 'new': true });

            // Balance Retrieve
            if (sellOrderData.price < buyOrderData.price) {
                await assetUpdate({
                    'currencyId': buyOrderData.secondCurrencyId,
                    'userId': buyOrderData.userId,
                    'balance': (buyOrderData.price * orderDataQuantity) - (sellOrderData.price * orderDataQuantity)
                })
            }

            await positionMatching(orderBookUpdate, price, orderDataQuantity, pairData, 'maker')
            await getOpenOrderSocket(orderData[count].userId, orderData[count].pairId)
            await getFilledOrderSocket(orderData[count].userId, orderData[count].pairId)
            await getTradeHistorySocket(orderData[count].userId, orderData[count].pairId)
            await getPositionOrderSocket(pairData, orderData[count].userId)

            await getOrderBookSocket(orderData[count].pairId)
            await marketPriceSocket(orderData[count].pairId)

            return await tradeMatching(newOrderUpdate, orderData, count = count + 1, pairData)
        }

    } catch (err) {
    }
}

/** 
 * Position Matching
*/
export const positionMatching = async (orderDetail, price, quantity, pairData, side) => {
    try {
        // if (quantity == 0) {
        //     return true
        // }

        let positionDetails = await PerpetualOrder.findOne({
            'pairId': orderDetail.pairId,
            'userId': orderDetail.userId,
            // 'status': { "$in": ['pending', 'completed', 'cancel'] },
            'positionStatus': 'open',
            // 'buyorsell': orderDetail.buyorsell,
            'buyorsell': orderDetail.buyorsell == 'buy' ? 'sell' : 'buy'
        })

        if (!positionDetails) {
            orderDetail.positionStatus = 'open';
            orderDetail.positionQuantity = orderDetail.positionQuantity + quantity;

            orderDetail.filled = orderDetail.filled.map(item => {
                item.positionQuantity = item.filledQuantity;
                item.positionStatus = 'open';
                return item
            })

            await orderDetail.save();
            return true
        }

        console.log("---positionDetails", positionDetails)

        let positionQuantity = positionDetails.positionQuantity;

        let sellOrderPrice = orderDetail.buyorsell == 'buy' ? positionDetails.price : price
        let buyOrderPrice = orderDetail.buyorsell == 'buy' ? price : positionDetails.price

        if (positionQuantity == quantity) {
            let tradeFee = 0, entryPrice = 0, filledQty = quantity;

            positionDetails.positionQuantity = 0;
            positionDetails.positionStatus = 'closed';

            for (const [key, item] of Object.entries(positionDetails.filled)) {
                if (item.positionStatus == 'open') {
                    filledQty = filledQty - item.positionQuantity;

                    if (filledQty > 0) {
                        entryPrice = entryPrice + item.price;
                        tradeFee = tradeFee + tradeFeeCalc({
                            'price': item.price,
                            'quantity': item.positionQuantity,
                            'feeRate': item.feesRate
                        })

                        positionDetails.filled[key].positionQuantity = 0;
                        positionDetails.filled[key].positionStatus = 'closed';
                    } else {
                        entryPrice = entryPrice + item.price;
                        tradeFee = tradeFee + tradeFeeCalc({
                            'price': item.price,
                            'quantity': item.positionQuantity - Math.abs(filledQty),
                            'feeRate': item.feesRate
                        })

                        positionDetails.filled[key].positionQuantity = Math.abs(filledQty);
                        positionDetails.filled[key].positionStatus = 'closed';
                        break;
                    }
                }
            }

            await positionDetails.save();

            let pAndL = inversePositionPnL({
                'avgEntryPrice': entryPrice / positionDetails.filled.length,
                'exitPrice': price,
                'quantity': quantity,
                'side': orderDetail.buyorsell == 'buy' ? 'sell' : 'buy'
            }) - tradeFee;

            console.log("----tradeFee", tradeFee)
            console.log("------entryPrice", entryPrice)
            console.log("------positionDetails.filled.length", positionDetails.filled.length)
            console.log("------price", price)
            console.log("------quantity", quantity)
            console.log("------orderDetail", orderDetail)

            console.log("-----inversePositionPnL", inversePositionPnL({
                'avgEntryPrice': entryPrice / positionDetails.filled.length,
                'exitPrice': price,
                'quantity': quantity,
                'side': orderDetail.buyorsell == 'buy' ? 'sell' : 'buy'
            }))

            pAndL = toFixed(pAndL, 8);

            console.log("-----pAndL", pAndL)
            console.log("----quantity", quantity)
            let orderCost = calculateInverseOrderCost({
                'price': positionDetails.price,
                'quantity': quantity,
                'leverage': positionDetails.leverage,
                'takerFee': pairData.taker_fees,
                'buyorsell': positionDetails.buyorsell == 'buy' ? 'sell' : 'buy'
            }) + (pAndL);
            console.log('------calculateInverseOrderCost', calculateInverseOrderCost({
                'price': positionDetails.price,
                'quantity': quantity,
                'leverage': positionDetails.leverage,
                'takerFee': pairData.taker_fees,
                'buyorsell': positionDetails.buyorsell == 'buy' ? 'sell' : 'buy'
            }))

            if (orderCost > 0) {
                await assetUpdate({
                    'currencyId': orderDetail.firstCurrencyId,
                    'userId': orderDetail.userId,
                    'balance': orderCost
                })
            }

            const newposition = new ClosedPosition({
                userId: orderDetail.userId,
                pairId: orderDetail.pairId,
                pairName: orderDetail.pairName,
                quantity: quantity,
                profitnloss: pAndL,
                exitType: "Trade",
                orderCost: orderCost,
            });

            if (orderDetail.buyorsell == 'buy') {
                newposition.closingDirection = 'Closed short';
                newposition.entryPrice = sellOrderPrice;
                newposition.exitPrice = buyOrderPrice;
            }
            else {
                newposition.closingDirection = 'Closed long';
                newposition.entryPrice = buyOrderPrice;
                newposition.exitPrice = sellOrderPrice;
            }
            await newposition.save();

            return true
        } else if (positionQuantity > quantity) {
            let tradeFee = 0, entryPrice = 0, filledQty = quantity;

            positionDetails.positionQuantity = positionQuantity - quantity;

            for (const [key, item] of Object.entries(positionDetails.filled)) {
                if (item.positionStatus == 'open') {
                    filledQty = filledQty - item.positionQuantity;

                    if (filledQty > 0) {
                        entryPrice = entryPrice + item.price;
                        tradeFee = tradeFee + tradeFeeCalc({
                            'price': item.price,
                            'quantity': item.positionQuantity,
                            'feeRate': item.feesRate
                        })
                        positionDetails.filled[key].positionQuantity = 0;
                        positionDetails.filled[key].positionStatus = 'closed';
                    } else {
                        entryPrice = entryPrice + item.price;
                        tradeFee = tradeFee + tradeFeeCalc({
                            'price': item.price,
                            'quantity': item.positionQuantity - Math.abs(filledQty),
                            'feeRate': item.feesRate
                        })

                        positionDetails.filled[key].positionQuantity = Math.abs(filledQty);
                        positionDetails.filled[key].positionStatus = 'closed';
                        break;
                    }
                }
            }

            await positionDetails.save();

            let pAndL = inversePositionPnL({
                'avgEntryPrice': entryPrice / positionDetails.filled.length,
                'exitPrice': price,
                'quantity': quantity,
                'side': orderDetail.buyorsell == 'buy' ? 'sell' : 'buy'
            }) - tradeFee;
            pAndL = toFixed(pAndL, 8);

            let orderCost = calculateInverseOrderCost({
                'price': positionDetails.price,
                'quantity': quantity,
                'leverage': positionDetails.leverage,
                'takerFee': pairData.taker_fees,
                'buyorsell': positionDetails.buyorsell == 'buy' ? 'sell' : 'buy'
            }) + (pAndL)

            if (orderCost > 0) {
                await assetUpdate({
                    'currencyId': orderDetail.firstCurrencyId,
                    'userId': orderDetail.userId,
                    'balance': orderCost
                })
            }

            const newposition = new ClosedPosition({
                userId: orderDetail.userId,
                pairId: orderDetail.pairId,
                pairName: orderDetail.pairName,
                quantity: quantity,
                profitnloss: pAndL,
                exitType: "Trade",
                orderCost: orderCost,
            });

            if (orderDetail.buyorsell == 'buy') {
                newposition.closingDirection = 'Closed short';
                newposition.entryPrice = sellOrderPrice;
                newposition.exitPrice = buyOrderPrice;
            }
            else {
                newposition.closingDirection = 'Closed long';
                newposition.entryPrice = buyOrderPrice;
                newposition.exitPrice = sellOrderPrice;
            }
            await newposition.save();
            return true
        } else if (positionQuantity < quantity) {
            let tradeFee = 0, entryPrice = 0, filledQty = positionFilled;

            positionDetails.positionQuantity = 0;
            positionDetails.positionStatus = 'closed';

            for (const [key, item] of Object.entries(positionDetails.filled)) {
                if (item.positionStatus == 'open') {
                    filledQty = filledQty - item.positionQuantity;

                    if (filledQty > 0) {
                        entryPrice = entryPrice + item.price;
                        tradeFee = tradeFee + tradeFeeCalc({
                            'price': item.price,
                            'quantity': item.positionQuantity,
                            'feeRate': item.feesRate
                        })

                        positionDetails.filled[key].positionQuantity = 0;
                        positionDetails.filled[key].positionStatus = 'closed';

                    } else {
                        entryPrice = entryPrice + item.price;
                        tradeFee = tradeFee + tradeFeeCalc({
                            'price': item.price,
                            'quantity': item.positionQuantity - Math.abs(filledQty),
                            'feeRate': item.feesRate
                        })
                        positionDetails.filled[key].positionQuantity = Math.abs(filledQty);
                        positionDetails.filled[key].positionStatus = 'closed';
                        break;
                    }
                }
            }

            await positionDetails.save();

            let pAndL = inversePositionPnL({
                'avgEntryPrice': entryPrice / positionDetails.filled.length,
                'exitPrice': price,
                'quantity': positionQuantity,
                'side': orderDetail.buyorsell == 'buy' ? 'sell' : 'buy'
            }) - tradeFee;
            pAndL = toFixed(pAndL, 8);

            let orderCost = calculateInverseOrderCost({
                'price': positionDetails.price,
                'quantity': quantity - positionQuantity,
                'leverage': positionDetails.leverage,
                'takerFee': pairData.taker_fees,
                'buyorsell': positionDetails.buyorsell == 'buy' ? 'sell' : 'buy'
            }) + (pAndL)

            if (orderCost > 0) {
                await assetUpdate({
                    'currencyId': orderDetail.firstCurrencyId,
                    'userId': orderDetail.userId,
                    'balance': orderCost
                })
            }

            const newposition = new ClosedPosition({
                userId: orderDetail.userId,
                pairId: orderDetail.pairId,
                pairName: orderDetail.pairName,
                quantity: quantity - positionQuantity,
                profitnloss: pAndL,
                exitType: "Trade",
                orderCost: orderCost,
            });

            if (orderDetail.buyorsell == 'buy') {
                newposition.closingDirection = 'Closed short';
                newposition.entryPrice = sellOrderPrice;
                newposition.exitPrice = buyOrderPrice;
            }
            else {
                newposition.closingDirection = 'Closed long';
                newposition.entryPrice = buyOrderPrice;
                newposition.exitPrice = sellOrderPrice;
            }
            await newposition.save();

            return await positionMatching(orderDetail, price, quantity - positionQuantity, pairData)
        }
        return true
    } catch (err) {
        return false
    }
}

/** 
 * Get Order Book
 * URL : /api/perpetual/ordeBook/:{{pairId}}
 * METHOD : GET
 * PARAMS : pairId
*/
export const getOrderBook = async (req, res) => {
    try {
        let result = await orderBookData({
            'pairId': req.params.pairId
        })

        return res.status(200).json({ 'success': true, result })
    } catch (err) {
        return res.status(500).json({ 'success': false })
    }
}

/** 
 * Get Order Book Socket
 * PARAMS : pairId
*/
export const getOrderBookSocket = async (pairId) => {
    try {
        let result = await orderBookData({
            'pairId': pairId
        })

        result['pairId'] = pairId;
        socketEmitAll('perpetualOrderBook', result)
        return true
    } catch (err) {
        return false
    }
}

export const orderBookData = async ({ pairId }) => {
    try {
        let buyOrder = await PerpetualOrder.aggregate([
            {
                "$match": {
                    "pairId": ObjectId(pairId),
                    "$or": [
                        { "status": "open" },
                        { "status": "pending" },
                    ],
                    'buyorsell': 'buy'
                }
            },
            {
                "$group": {
                    '_id': "$price",
                    'quantity': { "$sum": "$quantity" },
                    'filledQuantity': { "$sum": "$filledQuantity" },
                }
            },
            { "$sort": { "_id": -1 } },
            { "$limit": 10 }
        ])

        let sellOrder = await PerpetualOrder.aggregate([
            {
                "$match": {
                    "pairId": ObjectId(pairId),
                    "$or": [
                        { "status": "open" },
                        { "status": "pending" },
                    ],
                    'buyorsell': 'sell'
                }
            },
            {
                "$group": {
                    '_id': "$price",
                    'quantity': { "$sum": "$quantity" },
                    'filledQuantity': { "$sum": "$filledQuantity" },
                }
            },
            { "$sort": { "_id": 1 } },
            { "$limit": 10 }
        ])

        if (buyOrder.length > 0) {
            let sumamount = 0
            for (let i = 0; i < buyOrder.length; i++) {
                let quantity = parseFloat(buyOrder[i].quantity) - parseFloat(buyOrder[i].filledQuantity);
                sumamount = parseFloat(sumamount) + parseFloat(quantity);
                buyOrder[i].total = sumamount;
                buyOrder[i].quantity = quantity;
            }
        }

        if (sellOrder.length > 0) {
            let sumamount = 0
            for (let i = 0; i < sellOrder.length; i++) {
                let quantity = parseFloat(sellOrder[i].quantity) - parseFloat(sellOrder[i].filledQuantity);
                sumamount = parseFloat(sumamount) + parseFloat(quantity);
                sellOrder[i].total = sumamount;
                sellOrder[i].quantity = quantity;
            }
        }
        sellOrder = sellOrder.reverse();

        return {
            buyOrder,
            sellOrder
        }

    } catch (err) {
        return {
            buyOrder: [],
            sellOrder: []
        }

    }
}

/**
 * Get User Open Order
 * URL : /api/perpetual/openOrder/{{pairId}}
 * METHOD : GET
 * Query : page, limit
*/
export const getOpenOrder = async (req, res) => {
    try {
        let pagination = paginationQuery(req.query);

        let count = await PerpetualOrder.countDocuments({
            "userId": req.user.id,
            'pairId': req.params.pairId,
            "status": { "$in": ['open', 'pending', 'conditional'] }
        });
        let data = await PerpetualOrder.aggregate([
            {
                "$match": {
                    "userId": ObjectId(req.user.id),
                    'pairId': ObjectId(req.params.pairId),
                    "status": { "$in": ['open', 'pending', 'conditional'] }
                }
            },
            { "$sort": { '_id': -1 } },
            { "$skip": pagination.skip },
            { "$limit": pagination.limit },
            {
                "$project": {
                    "orderDate": {
                        "$dateToString": {
                            "date": '$orderDate',
                            "format": "%Y-%m-%d %H:%M"
                        }
                    },
                    "firstCurrency": 1,
                    "secondCurrency": 1,
                    "orderType": 1,
                    "buyorsell": 1,
                    "price": 1,
                    "quantity": 1,
                    "filledQuantity": 1,
                    "orderValue": 1,
                    "status": 1,
                    "takeProfitPrice": 1,
                    "stopLossPrice": 1,
                    "isProfitLoss": 1
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
        return res.status(200).json({ 'success': true, result })
    } catch (err) {
        return res.status(500).json({ 'success': false })
    }
}

/**
 * Get All User Open Order
 * URL : /api/perpetual/allOpenOrder
 * METHOD : GET
 * Query : page, limit, pairName, orderType
*/
export const allOpenOrder = async (req, res) => {
    try {
        let pagination = paginationQuery(req.query);
        let filter = {}, reqQuery = req.query;

        filter = {
            "userId": ObjectId(req.user.id),
            "status": { "$in": ['open', 'pending', 'conditional'] }
        }

        if (!isEmpty(reqQuery.pairName) && reqQuery.pairName != 'all') {
            filter['pairName'] = reqQuery.pairName;
        }

        if (!isEmpty(reqQuery.orderType) && reqQuery.orderType != 'all') {
            filter['orderType'] = reqQuery.orderType;
        }

        let count = await PerpetualOrder.countDocuments(filter);
        let data = await PerpetualOrder.aggregate([
            { "$match": filter },
            { "$sort": { 'orderDate': -1 } },
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
                    "status": 1
                }
            }
        ])

        let result = {
            count,
            data
        }
        return res.status(200).json({ 'success': true, result })
    } catch (err) {
        return res.status(500).json({ 'success': false })
    }
}

/**
 * Get All User Open Order Doc
 * URL : /api/perpetual/allOpenOrderDoc
 * METHOD : GET
 * Query : page, limit, pairName, orderType
*/
export const allOpenOrderDoc = async (req, res) => {
    try {
        let filter = {}, reqQuery = req.query;

        filter = {
            "userId": ObjectId(req.user.id),
            "status": { "$in": ['open', 'pending', 'conditional'] }
        }

        if (!isEmpty(reqQuery.pairName) && reqQuery.pairName != 'all') {
            filter['pairName'] = reqQuery.pairName;
        }

        if (!isEmpty(reqQuery.orderType) && reqQuery.orderType != 'all') {
            filter['orderType'] = reqQuery.orderType;
        }

        let count = await PerpetualOrder.countDocuments(filter);
        let data = await PerpetualOrder.aggregate([
            { "$match": filter },
            { "$sort": { 'orderDate': -1 } },
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
                    "status": 1
                }
            }
        ])

        let result = {
            data
        }
        return res.status(200).json({ 'success': true, result })
    } catch (err) {
        return res.status(500).json({ 'success': false })
    }
}

/**
 * Get User Open Order Socket
 * userId, pairId
*/
export const getOpenOrderSocket = async (userId, pairId) => {
    try {
        let count = await PerpetualOrder.countDocuments({
            "userId": userId,
            'pairId': pairId,
            "status": { "$in": ['open', 'pending', 'conditional'] }
        });
        let data = await PerpetualOrder.aggregate([
            {
                "$match": {
                    "userId": ObjectId(userId),
                    'pairId': ObjectId(pairId),
                    "status": { "$in": ['open', 'pending', 'conditional'] }
                }
            },
            { "$sort": { '_id': -1 } },
            { "$limit": 10 },
            {
                "$project": {
                    "orderDate": {
                        "$dateToString": {
                            "date": '$orderDate',
                            "format": "%Y-%m-%d %H:%M"
                        }
                    },
                    "firstCurrency": 1,
                    "secondCurrency": 1,
                    "orderType": 1,
                    "buyorsell": 1,
                    "price": 1,
                    "quantity": 1,
                    "filledQuantity": 1,
                    "orderValue": 1,
                    "status": 1,
                    "takeProfitPrice": 1,
                    "stopLossPrice": 1,
                    "isProfitLoss": 1
                }
            }
        ])

        let result = {
            pairId,
            count,
            'currentPage': 1,
            'nextPage': count > data.length,
            'limit': 10,
            data
        }

        socketEmitOne('perpetualOpenOrder', result, userId)
        return true
    } catch (err) {
        return false
    }
}

/**
 * Get User Filled Order
 * URL : /api/perpetual/openOrder/{{pairId}}
 * METHOD : GET
 * Query : page, limit
*/
export const getFilledOrder = async (req, res) => {
    try {
        let pagination = paginationQuery(req.query);

        let count = await PerpetualOrder.countDocuments({
            "userId": req.user.id,
            'pairId': req.params.pairId,
            "status": 'completed'
        });
        let data = await PerpetualOrder.aggregate([
            {
                "$match": {
                    "userId": ObjectId(req.user.id),
                    'pairId': ObjectId(req.params.pairId),
                    "status": 'completed'
                }
            },
            { "$sort": { '_id': -1 } },
            { "$skip": pagination.skip },
            { "$limit": pagination.limit },
            {
                "$project": {
                    "orderDate": {
                        "$dateToString": {
                            "date": '$orderDate',
                            "format": "%Y-%m-%d %H:%M"
                        }
                    },
                    "firstCurrency": 1,
                    "secondCurrency": 1,
                    "orderType": 1,
                    "buyorsell": 1,
                    "price": 1,
                    "quantity": 1,
                    "filledQuantity": 1,
                    "orderValue": 1
                }
            }
        ])

        let result = {
            count,
            'currentPage': pagination.page,
            'limit': pagination.limit,
            data
        }
        return res.status(200).json({ 'success': true, result })
    } catch (err) {
        return res.status(500).json({ 'success': false })
    }
}

/**
 * Get User Filled Order Socket
 * userId, pairId
*/
export const getFilledOrderSocket = async (userId, pairId) => {
    try {
        let count = await PerpetualOrder.countDocuments({
            "userId": userId,
            'pairId': pairId,
            "status": 'completed'
        });
        let data = await PerpetualOrder.aggregate([
            {
                "$match": {
                    "userId": ObjectId(userId),
                    'pairId': ObjectId(pairId),
                    "status": 'completed'
                }
            },
            { "$sort": { '_id': -1 } },
            { "$limit": 10 },
            {
                "$project": {
                    "orderDate": {
                        "$dateToString": {
                            "date": '$orderDate',
                            "format": "%Y-%m-%d %H:%M"
                        }
                    },
                    "firstCurrency": 1,
                    "secondCurrency": 1,
                    "orderType": 1,
                    "buyorsell": 1,
                    "price": 1,
                    "quantity": 1,
                    "filledQuantity": 1,
                    "orderValue": 1
                }
            }
        ])

        let result = {
            pairId,
            count,
            'currentPage': 1,
            'limit': 10,
            data
        }
        socketEmitOne('perpetualFilledOrder', result, userId)
        return true
    } catch (err) {
        return false
    }
}

/**
 * Get User Trade History
 * URL : /api/perpetual/tradeHistory/{{pairId}}
 * METHOD : GET
 * Query : page, limit
*/
export const getTradeHistory = async (req, res) => {
    try {
        let pagination = paginationQuery(req.query);
        let count = await PerpetualOrder.countDocuments({
            "userId": req.user.id,
            'pairId': req.params.pairId,
        });
        let data = await PerpetualOrder.aggregate([
            {
                "$match": {
                    "userId": ObjectId(req.user.id),
                    'pairId': ObjectId(req.params.pairId),
                }
            },
            { "$sort": { '_id': -1 } },
            { "$skip": pagination.skip },
            { "$limit": pagination.limit },
            {
                "$project": {
                    "orderDate": {
                        "$dateToString": {
                            "date": '$orderDate',
                            "format": "%Y-%m-%d %H:%M"
                        }
                    },
                    "firstCurrency": 1,
                    "secondCurrency": 1,
                    "orderType": 1,
                    "buyorsell": 1,
                    "price": 1,
                    "quantity": 1,
                    "filledQuantity": 1,
                    "orderValue": 1,
                    "status": 1,
                }
            }
        ])

        let result = {
            count,
            'currentPage': pagination.page,
            'limit': pagination.limit,
            data
        }
        return res.status(200).json({ 'success': true, result })
    } catch (err) {
        return res.status(500).json({ 'success': false })
    }
}

/**
 * Get User Trade History
 * URL : /api/perpetual/allTradeHist
 * METHOD : GET
 * Query : page, limit
*/
export const allTradeHist = async (req, res) => {
    try {
        let pagination = paginationQuery(req.query);
        let filter = {}, reqQuery = req.query;

        filter = {
            "userId": ObjectId(req.user.id),
        }

        if (!isEmpty(reqQuery.pairName) && reqQuery.pairName != 'all') {
            filter['pairName'] = reqQuery.pairName;
        }

        if (!isEmpty(reqQuery.orderType) && reqQuery.orderType != 'all') {
            filter['orderType'] = reqQuery.orderType;
        }

        let count = await PerpetualOrder.countDocuments(filter);
        let data = await PerpetualOrder.aggregate([
            { "$match": filter },
            { "$sort": { 'orderDate': -1 } },
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
                    "status": 1,
                }
            }
        ])

        let result = {
            count,
            data
        }
        return res.status(200).json({ 'success': true, result })
    } catch (err) {
        return res.status(500).json({ 'success': false })
    }
}

/**
 * Get User Trade History
 * URL : /api/perpetual/allTradeHistDoc
 * METHOD : GET
 * Query : pairName, orderType
*/
export const allTradeHistDoc = async (req, res) => {
    try {
        let filter = {}, reqQuery = req.query;

        filter = {
            "userId": ObjectId(req.user.id),
        }

        if (!isEmpty(reqQuery.pairName) && reqQuery.pairName != 'all') {
            filter['pairName'] = reqQuery.pairName;
        }

        if (!isEmpty(reqQuery.orderType) && reqQuery.orderType != 'all') {
            filter['orderType'] = reqQuery.orderType;
        }

        let data = await PerpetualOrder.aggregate([
            { "$match": filter },
            { "$sort": { 'orderDate': -1 } },
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
                    "status": 1,
                }
            }
        ])

        let result = {
            data
        }
        return res.status(200).json({ 'success': true, result })
    } catch (err) {
        return res.status(500).json({ 'success': false })
    }
}

/**
 * Get User Trade History Socket
*/
export const getTradeHistorySocket = async (userId, pairId) => {
    try {
        let count = await PerpetualOrder.countDocuments({
            "userId": userId,
            'pairId': pairId,
        });
        let data = await PerpetualOrder.aggregate([
            {
                "$match": {
                    "userId": ObjectId(userId),
                    'pairId': ObjectId(pairId),
                }
            },
            { "$sort": { '_id': -1 } },
            { "$limit": 10 },
            {
                "$project": {
                    "orderDate": {
                        "$dateToString": {
                            "date": '$orderDate',
                            "format": "%Y-%m-%d %H:%M"
                        }
                    },
                    "firstCurrency": 1,
                    "secondCurrency": 1,
                    "orderType": 1,
                    "buyorsell": 1,
                    "price": 1,
                    "quantity": 1,
                    "filledQuantity": 1,
                    "orderValue": 1,
                    "status": 1
                }
            }
        ])

        let result = {
            pairId,
            count,
            'currentPage': 1,
            'limit': 10,
            data
        }
        socketEmitOne('perpetualTradeHistory', result, userId)
        return true
    } catch (err) {
        return false
    }
}

/** 
 * Get User Position Order
 * URL : /api/perpetual/positionOrder/{{pairId}}
 * METHOD : GET
 * PARAMS : pairId
*/
export const getPositionOrder = async (req, res) => {
    try {
        let pairData = await PerpetualPair.findOne({ "_id": req.params.pairId })
        if (!pairData) {
            return res.status(400).json({ 'success': false, 'message': "NOT_PAIR" })
        }
        let positionOrder = await userPositionOrder(pairData, req.user.id);

        if (positionOrder.status) {
            return res.status(200).json({ 'success': true, 'result': positionOrder.result })
        }
        return res.status(400).json({ 'success': false, 'message': "NOT_POSITION" })
    } catch (err) {
        return res.status(500).json({ "success": false, 'message': "Something went worng" })
    }
}

/** 
 * Get Position Order Socket
*/
export const getPositionOrderSocket = async (pairData, userId) => {
    try {
        let positionOrder = await userPositionOrder(pairData, userId);
        if (positionOrder.status) {
            let result = {
                "pairId": pairData._id,
                "data": positionOrder.result
            }
            socketEmitOne('perpetualPositionOrder', result, userId)
            return true
        }
        return false
    } catch (err) {
        return false
    }
}
export const userPositionOrder = async (pairData, userId) => {
    try {
        let positionDetails = await PerpetualOrder.aggregate([
            {
                "$match": {
                    'pairId': ObjectId(pairData._id),
                    'userId': ObjectId(userId),
                    'status': { "$in": ['pending', 'completed', 'cancel'] },
                    'positionStatus': 'open',
                    // 'buyorsell': reqBody.buyorsell == 'buy' ? 'sell' : 'buy'
                }
            },
            {
                "$project": {
                    "pairName": 1,
                    "positionQuantity": 1,
                    "marginImpact": {
                        "$reduce": {
                            'input': "$filled",
                            'initialValue': 0,
                            'in': {
                                "$avg": { "$add": ["$$value", "$$this.orderCost"] }
                            }
                        }
                    },
                    "price": {
                        "$reduce": {
                            'input': "$filled",
                            'initialValue': 0,
                            'in': {
                                "$avg": { "$add": ["$$value", "$$this.price"] }
                            }
                        }
                    },
                    "buyorsell": 1,
                    // "buyorsell": {
                    //     "$cond": [
                    //         { "$eq": ["$buyorsell", 'buy'] }, 'sell', 'buy'
                    //     ]
                    // },
                    "leverage": 1,
                    "firstCurrency": 1,
                    "secondCurrency": 1,
                    "initialMargin": { "$literal": 0 },
                    "positionMargin": { "$literal": 0 },
                    "liquidityPrice": { "$literal": 0 },
                    "taker_fees": { "$literal": pairData.taker_fees },
                    "takeProfitPrice": 1,
                    "stopLossPrice": 1,
                    "isProfitLoss": 1
                }
            },
            {
                "$group": {
                    "_id": null,
                    "firstCurrency": { "$first": "$firstCurrency" },
                    "secondCurrency": { "$first": "$secondCurrency" },
                    "positionQuantity": { "$sum": "$positionQuantity" },
                    "price": { "$avg": "$price" },
                    "buyorsell": { "$first": "$buyorsell" },
                    "leverage": { "$last": "$leverage" },
                    "positionMargin": { "$first": "$liquidityPrice" },
                    "liquidityPrice": { "$first": "$liquidityPrice" },
                    "taker_fees": { "$first": "$taker_fees" },
                    "tpSL": {
                        "$push": {
                            "isProfitLoss": "$isProfitLoss",
                            "takeProfitPrice": "$takeProfitPrice",
                            "stopLossPrice": "$stopLossPrice",
                        }
                    }
                }
            }
        ])

        if (positionDetails && positionDetails.length > 0) {

            positionDetails[0].positionMargin = inversePositionMargin({
                'price': positionDetails[0].price,
                'quantity': positionDetails[0].positionQuantity,
                'leverage': positionDetails[0].leverage,
                'takerFee': pairData.taker_fees,
                'buyorsell': positionDetails[0].buyorsell,
            })

            positionDetails[0].liquidityPrice = isolatedLiquidationPrice({
                'buyorsell': positionDetails[0].buyorsell,
                'price': positionDetails[0].price,
                'leverage': positionDetails[0].leverage,
                'maintanceMargin': pairData.maintenanceMargin,
            })

            return {
                status: true,
                result: positionDetails[0]
            }
        }
        return {
            status: false,
        }
    } catch (err) {
        return {
            status: false,
        }
    }
}

/**
 * Get market price
 * URL : /api/perpetual/marketPrice/{{pairId}}
 * METHOD : GET
*/
export const getMarketPrice = async (req, res) => {
    try {
        let tickerPrice = await marketPrice(req.params.pairId)
        if (tickerPrice.status) {
            return res.status(200).json({ 'success': true, 'result': tickerPrice.result })
        }
        return res.status(409).json({ 'success': false })

    } catch (err) {
        return res.status(500).json({ 'success': false })
    }
}


/**
 * Get Recent Trade
 * URL : /api/perpetual/recentTrade/{{pairId}}
 * METHOD : GET
*/
export const getRecentTrade = async (req, res) => {
    try {
        let pairData = await PerpetualPair.findOne(
            { "_id": req.params.pairId },
            {
                "firstCurrencySymbol": 1,
                "secondCurrencySymbol": 1,
                "botstatus": 1
            }
        );
        if (!pairData) {
            return res.status(400).json({ 'success': false })
        }

        let recentTradeData = await recentTrade(req.params.pairId);
        if (recentTradeData.status) {
            return res.status(200).json({ 'success': true, 'result': recentTradeData.result })
        }

        return res.status(409).json({ 'success': false })
    } catch (err) {
        return res.status(500).json({ 'success': false })
    }
}

/**
 * Get Recent Trade Socket
 * pairId
*/
export const recentTradeSocket = async (pairId) => {
    try {
        let recentTradeData = await recentTrade(pairId);
        if (recentTradeData.status) {
            socketEmitAll('perpetualRecentTrade', {
                pairId,
                'data': recentTradeData.result
            })
            return true
        }
        return false
    } catch (err) {
        return false
    }
}

export const recentTrade = async (pairId) => {
    try {
        let recentTrade = await PerpetualOrder.aggregate([
            {
                "$match": {
                    'pairId': ObjectId(pairId),
                    "status": { "$in": ['pending', 'completed'] }
                }
            },
            { "$unwind": "$filled" },
            { "$sort": { 'filled.createdAt': -1 } },
            { "$limit": 20 },
            {
                "$group": {
                    "_id": {
                        "buyUserId": '$filled.buyUserId',
                        "sellUserId": '$filled.sellUserId',
                        "sellOrderId": "$filled.sellOrderId",
                        "buyOrderId": "$filled.buyOrderId"
                    },
                    "createdAt": { "$first": "$filled.createdAt" },
                    "Type": { "$first": "$filled.Type" },
                    "price": { "$first": "$filled.price" },
                    "filledQuantity": { "$first": "$filled.filledQuantity" },
                }
            },
            {
                "$project": {
                    "_id": 0
                }
            }
        ])

        if (recentTrade.length > 0) {
            return {
                status: true,
                result: recentTrade
            }
        }
        return {
            status: true,
            result: []
        }

    } catch (err) {
        return {
            status: true,
            result: []
        }
    }
}

/**
 * Get market price socket
 * pairId
*/
export const marketPriceSocket = async (pairId) => {
    try {
        let tickerPrice = await marketPrice(pairId)
        if (tickerPrice.status) {
            socketEmitAll('perpetualMarketPrice', {
                pairId,
                'data': tickerPrice.result
            })
            return true
        }
        return false
    } catch (err) {
        return false
    }
}

export const marketPrice = async (pairId) => {
    try {
        let pairData = await PerpetualPair.findOne({ "_id": pairId });
        if (pairData) {
            if (pairData.botstatus == 'off') {

                let ticker24hrs = await PerpetualOrder.aggregate([
                    {
                        "$match": {
                            "pairId": ObjectId(pairId),
                            "buyorsell": "sell",
                            "status": { "$in": ['pending', 'completed'] },
                        }
                    },
                    { "$unwind": "$filled" },
                    {
                        "$match": {
                            "filled.createdAt": {
                                "$gte": new Date(Date.now() - 24 * 60 * 60 * 1000),
                                "$lte": new Date()
                            },
                        }
                    },
                    {
                        "$sort": { 'filled.createdAt': 1 }
                    },
                    {
                        "$group": {
                            "_id": null,
                            'open': { "$first": '$filled.price' },
                            'close': { "$last": '$filled.price' },
                            'high': { "$max": '$filled.price' },
                            'low': { "$min": '$filled.price' },
                            'firstVolume': { "$sum": "$filled.filledQuantity" },
                            'secondVolume': { "$sum": "$filled.order_value" }
                        }
                    },
                    {
                        "$project": {
                            "low": 1,
                            "high": 1,
                            "firstVolume": 1,
                            "secondVolume": 1,
                            "changePrice": {
                                "$subtract": [
                                    { "$cond": [{ "$eq": ["$close", null] }, 0, '$close'] },
                                    { "$cond": [{ "$eq": ["$open", null] }, 0, '$open'] },
                                ]
                            },
                            "changePercentage": {
                                "$multiply": [
                                    {
                                        "$divide": [
                                            {
                                                "$subtract": [
                                                    { "$cond": [{ "$eq": ["$close", null] }, 0, '$close'] },
                                                    { "$cond": [{ "$eq": ["$open", null] }, 0, '$open'] },
                                                ]
                                            },
                                            { "$cond": [{ "$eq": ["$open", null] }, 0, '$open'] },
                                        ]
                                    },
                                    100
                                ]

                            }
                        }
                    },
                ])

                if (ticker24hrs.length > 0) {
                    pairData.low = ticker24hrs[0].low;
                    pairData.high = ticker24hrs[0].high;
                    pairData.changePrice = ticker24hrs[0].changePrice;
                    pairData.change = ticker24hrs[0].changePercentage;
                    pairData.firstVolume = ticker24hrs[0].firstVolume;
                    pairData.secondVolume = ticker24hrs[0].secondVolume;
                } else {
                    pairData.low = 0;
                    pairData.high = 0;
                    pairData.changePrice = 0;
                    pairData.change = 0;
                    pairData.firstVolume = 0;
                    pairData.secondVolume = 0;
                }

                let recentTrade = await PerpetualOrder.aggregate([
                    {
                        "$match": {
                            "pairId": ObjectId(pairId),
                            "buyorsell": "sell",
                            "status": { "$in": ['pending', 'completed'] },
                        }
                    },
                    { "$unwind": "$filled" },
                    {
                        "$sort": { 'filled.createdAt': -1 }
                    },
                    { "$limit": 1 },
                    {
                        "$project": {
                            'price': '$filled.price'
                        }
                    }
                ])

                if (recentTrade.length > 0) {
                    pairData.last = recentTrade[0].price;
                    // pairData.markPrice = recentTrade[0].price;
                }

                let updatePairData = await pairData.save();
                let result = {
                    'last': updatePairData.last,
                    'markPrice': updatePairData.markPrice,
                    'low': updatePairData.low,
                    'high': updatePairData.high,
                    'firstVolume': updatePairData.firstVolume,
                    'secondVolume': updatePairData.secondVolume,
                    'changePrice': updatePairData.changePrice,
                    'change': updatePairData.change,
                    'botstatus': updatePairData.botstatus,
                }

                return {
                    'status': true,
                    'result': result
                }
            }
        }
        return {
            'status': false
        }
    } catch (err) {
        return {
            'status': false
        }
    }
}

export const forcedLiquidation = async (pairData) => {
    try {
        let positionDetails = await PerpetualOrder.aggregate([
            {
                "$match": {
                    'pairId': ObjectId(pairData._id),
                    'status': { "$in": ['pending', 'completed', 'cancel'] },
                    'positionStatus': 'open',
                    // 'buyorsell': reqBody.buyorsell == 'buy' ? 'sell' : 'buy'
                }
            },
            {
                "$project": {
                    '_id': 1,
                    "userId": 1,
                    "pairName": 1,
                    "positionQuantity": 1,
                    "marginImpact": {
                        "$reduce": {
                            'input': "$filled",
                            'initialValue': 0,
                            'in': {
                                "$avg": { "$add": ["$$value", "$$this.orderCost"] }
                            }
                        }
                    },
                    "price": {
                        "$reduce": {
                            'input': "$filled",
                            'initialValue': 0,
                            'in': {
                                "$avg": { "$add": ["$$value", "$$this.price"] }
                            }
                        }
                    },
                    "buyorsell": {
                        "$cond": [
                            { "$eq": ["$buyorsell", 'buy'] }, 'sell', 'buy'
                        ]
                    },
                    "leverage": 1,
                    "firstCurrency": 1,
                    "secondCurrency": 1,
                    "initialMargin": { "$literal": 0 },
                    "liquidityPrice": { "$literal": 0 },
                }
            },
            {
                "$group": {
                    "_id": "$userId",
                    "userId": { "$first": "$userId" },
                    "orderId": { "$push": "$_id" },
                    "firstCurrency": { "$first": "$firstCurrency" },
                    "secondCurrency": { "$first": "$secondCurrency" },
                    "positionQuantity": { "$sum": "$positionQuantity" },
                    "positionMargin": { "$avg": "$marginImpact" },
                    "price": { "$avg": "$price" },
                    "buyorsell": { "$first": "$buyorsell" },
                    "leverage": { "$first": "$leverage" },
                    "liquidityPrice": { "$first": "$liquidityPrice" }
                }
            }
        ])

        if (positionDetails && positionDetails.length > 0) {
            await forceUpdate(positionDetails, pairData, 0)
            return true
        }
        return true
    } catch (err) {
        return false
    }
}

export const forceUpdate = async (positionDetails, pairData, count = 0) => {
    try {
        if (isEmpty(positionDetails[count])) {
            return true
        }

        let liquidityPrice = isolatedLiquidationPrice({
            'buyorsell': positionDetails[count].buyorsell,
            'price': positionDetails[count].price,
            'leverage': positionDetails[count].leverage,
            'maintanceMargin': pairData.maintenanceMargin,
        })

        if (positionDetails[count].buyorsell == 'sell' && liquidityPrice < pairData.markPrice) {
            await PerpetualOrder.updateMany({ "_id": { "$in": positionDetails[count].orderId } }, {
                "$set": {
                    'positionStatus': 'closed',
                }
            }, { "multi": true })

            let sellOrderId = ObjectId();
            let buyOrderId = ObjectId();
            let uniqueId = Math.floor(Math.random() * 1000000000);

            let sellLiquidityPrice = isolatedLiquidationPrice({
                'buyorsell': 'sell',
                'price': liquidityPrice,
                'leverage': positionDetails[count].leverage,
                'maintanceMargin': pairData.maintenanceMargin,
            })

            let orderValue = liquidityPrice * positionDetails[count].positionQuantity
            let requiredMargin = orderValue / positionDetails[count].leverage;
            let takerFee = orderValue * (pairData.taker_fees / 100)
            let orderCost = requiredMargin + takerFee;

            let sellOrder = new PerpetualOrder({
                '_id': sellOrderId,
                'pairId': pairData._id,
                'pairName': `${pairData.firstCurrencySymbol}${pairData.secondCurrencySymbol}`,
                'userId': positionDetails[count].userId,
                'firstCurrencyId': pairData.firstCurrencyId,
                'firstCurrency': pairData.firstCurrencySymbol,
                'firstCurrencyId': pairData.firstCurrencyId,
                'firstCurrency': pairData.firstCurrencySymbol,
                'secondCurrencyId': pairData.secondCurrencyId,
                'secondCurrency': pairData.secondCurrencySymbol,
                'buyorsell': 'sell',
                'orderType': "market",
                'price': liquidityPrice,
                'quantity': positionDetails[count].positionQuantity,
                'liquidityPrice': liquidityPrice,
                'leverage': sellLiquidityPrice,
                'orderValue': orderValue,
                'orderCost': orderCost,
                'orderDate': new Date(),
                'status': 'completed',
                'filled': [{
                    "pairId": pairData.pairId,
                    "sellUserId": positionDetails[count].userId,
                    "buyUserId": ObjectId("5e567694b912240c7f0e4299"),
                    "userId": positionDetails[count].userId,
                    "sellOrderId": sellOrderId,
                    "buyOrderId": buyOrderId,
                    "uniqueId": uniqueId,
                    "price": liquidityPrice,
                    "filledQuantity": positionDetails[count].positionQuantity,
                    "Fees": takerFee,
                    "status": "filled",
                    "Type": positionDetails[count].buyorsell,
                    "createdAt": new Date(),
                    "orderValue": orderValue,
                    "orderCost": orderCost
                }]
            })

            await sellOrder.save();

            let buyLiquidityPrice = isolatedLiquidationPrice({
                'buyorsell': 'buy',
                'price': liquidityPrice,
                'leverage': positionDetails[count].leverage,
                'maintanceMargin': pairData.maintenanceMargin,
            })

            let buyOrder = new PerpetualOrder({
                '_id': buyOrderId,
                'pairId': pairData._id,
                'pairName': `${pairData.firstCurrencySymbol}${pairData.secondCurrencySymbol}`,
                'userId': ObjectId("5e567694b912240c7f0e4299"),
                'firstCurrencyId': pairData.firstCurrencyId,
                'firstCurrency': pairData.firstCurrencySymbol,
                'firstCurrencyId': pairData.firstCurrencyId,
                'firstCurrency': pairData.firstCurrencySymbol,
                'secondCurrencyId': pairData.secondCurrencyId,
                'secondCurrency': pairData.secondCurrencySymbol,
                'buyorsell': 'buy',
                'orderType': "market",
                'price': liquidityPrice,
                'quantity': positionDetails[count].positionQuantity,
                'liquidityPrice': liquidityPrice,
                'leverage': buyLiquidityPrice,
                'orderValue': orderValue,
                'orderCost': orderCost,
                'orderDate': new Date(),
                'status': 'completed',
                'filled': [{
                    "pairId": pairData.pairId,
                    "sellUserId": positionDetails[count].userId,
                    "buyUserId": ObjectId("5e567694b912240c7f0e4299"),
                    "userId": ObjectId("5e567694b912240c7f0e4299"),
                    "sellOrderId": sellOrderId,
                    "buyOrderId": buyOrderId,
                    "uniqueId": uniqueId,
                    "price": liquidityPrice,
                    "filledQuantity": positionDetails[count].positionQuantity,
                    "Fees": takerFee,
                    "status": "filled",
                    "Type": positionDetails[count].buyorsell,
                    "createdAt": new Date(),
                    "orderValue": orderValue,
                    "orderCost": orderCost
                }]
            })

            await buyOrder.save();
            return await forceUpdate(positionDetails, pairData, count + 1)
        } else if (positionDetails[count].buyorsell == 'buy' && liquidityPrice > pairData.markPrice) {
            await PerpetualOrder.updateMany({ "_id": { "$in": positionDetails[count].orderId } }, {
                "$set": {
                    'positionStatus': 'closed',
                }
            }, { "multi": true })

            let sellOrderId = ObjectId();
            let buyOrderId = ObjectId();
            let uniqueId = Math.floor(Math.random() * 1000000000);

            let sellLiquidityPrice = isolatedLiquidationPrice({
                'buyorsell': 'sell',
                'price': liquidityPrice,
                'leverage': positionDetails[count].leverage,
                'maintanceMargin': pairData.maintenanceMargin,
            })

            let orderValue = liquidityPrice * positionDetails[count].positionQuantity
            let requiredMargin = orderValue / positionDetails[count].leverage;
            let takerFee = orderValue * (pairData.taker_fees / 100)
            let orderCost = requiredMargin + takerFee;

            let sellOrder = new PerpetualOrder({
                '_id': sellOrderId,
                'pairId': pairData._id,
                'pairName': `${pairData.firstCurrencySymbol}${pairData.secondCurrencySymbol}`,
                'userId': ObjectId("5e567694b912240c7f0e4299"),
                'firstCurrencyId': pairData.firstCurrencyId,
                'firstCurrency': pairData.firstCurrencySymbol,
                'firstCurrencyId': pairData.firstCurrencyId,
                'firstCurrency': pairData.firstCurrencySymbol,
                'secondCurrencyId': pairData.secondCurrencyId,
                'secondCurrency': pairData.secondCurrencySymbol,
                'buyorsell': 'sell',
                'orderType': "market",
                'price': liquidityPrice,
                'quantity': positionDetails[count].positionQuantity,
                'liquidityPrice': liquidityPrice,
                'leverage': sellLiquidityPrice,
                'orderValue': orderValue,
                'orderCost': orderCost,
                'orderDate': new Date(),
                'status': 'completed',
                'filled': [{
                    "pairId": pairData.pairId,
                    "sellUserId": ObjectId("5e567694b912240c7f0e4299"),
                    "buyUserId": positionDetails[count].userId,
                    "userId": ObjectId("5e567694b912240c7f0e4299"),
                    "sellOrderId": sellOrderId,
                    "buyOrderId": buyOrderId,
                    "uniqueId": uniqueId,
                    "price": liquidityPrice,
                    "filledQuantity": positionDetails[count].positionQuantity,
                    "Fees": takerFee,
                    "status": "filled",
                    "Type": 'sell',
                    "createdAt": new Date(),
                    "orderValue": orderValue,
                    "orderCost": orderCost
                }]
            })

            await sellOrder.save();

            let buyLiquidityPrice = isolatedLiquidationPrice({
                'buyorsell': 'buy',
                'price': liquidityPrice,
                'leverage': positionDetails[count].leverage,
                'maintanceMargin': pairData.maintenanceMargin,
            })

            let buyOrder = new PerpetualOrder({
                '_id': buyOrderId,
                'pairId': pairData._id,
                'pairName': `${pairData.firstCurrencySymbol}${pairData.secondCurrencySymbol}`,
                'userId': positionDetails[count].userId,
                'firstCurrencyId': pairData.firstCurrencyId,
                'firstCurrency': pairData.firstCurrencySymbol,
                'firstCurrencyId': pairData.firstCurrencyId,
                'firstCurrency': pairData.firstCurrencySymbol,
                'secondCurrencyId': pairData.secondCurrencyId,
                'secondCurrency': pairData.secondCurrencySymbol,
                'buyorsell': 'buy',
                'orderType': "market",
                'price': liquidityPrice,
                'quantity': positionDetails[count].positionQuantity,
                'liquidityPrice': liquidityPrice,
                'leverage': buyLiquidityPrice,
                'orderValue': orderValue,
                'orderCost': orderCost,
                'orderDate': new Date(),
                'status': 'completed',
                'filled': [{
                    "pairId": pairData.pairId,
                    "sellUserId": positionDetails[count].userId,
                    "buyUserId": ObjectId("5e567694b912240c7f0e4299"),
                    "userId": ObjectId("5e567694b912240c7f0e4299"),
                    "sellOrderId": sellOrderId,
                    "buyOrderId": buyOrderId,
                    "uniqueId": uniqueId,
                    "price": liquidityPrice,
                    "filledQuantity": positionDetails[count].positionQuantity,
                    "Fees": takerFee,
                    "status": "filled",
                    "Type": 'buy',
                    "createdAt": new Date(),
                    "orderValue": orderValue,
                    "orderCost": orderCost
                }]
            })

            await buyOrder.save();
            return await forceUpdate(positionDetails, pairData, count + 1)

        }
    } catch (err) {
        return false
    }
}

/** 
 * Take Profit and Stop Loss Position Close
*/
export const triggerProfitLoss = async (pairData) => {
    try {
        let buyOrderData = await PerpetualOrder.find({
            'isProfitLoss': true,
            'positionStatus': "open",
            'buyorsell': "buy",
            '$or': [
                { "takeProfitPrice": { "$gte": pairData.markPrice } },
                { "stopLossPrice": { "$lt": pairData.markPrice } }
            ]
        })

        if (buyOrderData && buyOrderData.length > 0) {
            profitLossPositionClosed(buyOrderData, 0, pairData)
        }

        let sellOrderData = await PerpetualOrder.find({
            'isProfitLoss': true,
            'positionStatus': "open",
            'buyorsell': "sell",
            '$or': [
                { "takeProfitPrice": { "$lt": pairData.markPrice } },
                { "stopLossPrice": { "$gte": pairData.markPrice } }
            ]
        })

        if (sellOrderData && sellOrderData.length > 0) {
            profitLossPositionClosed(sellOrderData, 0, pairData)
        }


    } catch (err) {

    }
}

export const profitLossPositionClosed = async (orderData, count = 0, pairData) => {
    try {
        if (isEmpty(orderData[count])) {
            return false
        }

        let price = pairData.markPrice > orderData[count].stopLossPrice ? orderData[count].stopLossPrice : orderData[count].takeProfitPrice;
        let orderValue = (price * orderData[count].positionQuantity);
        let requiredMargin = orderValue / orderData[count].leverage;
        let fee = orderValue * (pairData.taker_fees / 100);
        let orderCost = requiredMargin + fee;
        let liquidityPrice = isolatedLiquidationPrice({
            'buyorsell': orderData[count].buyorsell == 'buy' ? 'sell' : 'buy',
            'price': price,
            'leverage': orderData[count].leverage,
            'maintanceMargin': pairData.maintenanceMargin
        })

        // let adminOrderId = ObjectId()
        // let uniqueId = Math.floor(Math.random() * 1000000000);

        let newOrderDoc = new PerpetualOrder({
            'pairId': pairData._id,
            'pairName': `${pairData.firstCurrencySymbol}${pairData.secondCurrencySymbol}`,
            'userId': orderData[count].userId,
            'firstCurrencyId': pairData.firstCurrencyId,
            'firstCurrency': pairData.firstCurrencySymbol,
            'firstCurrencyId': pairData.firstCurrencyId,
            'firstCurrency': pairData.firstCurrencySymbol,
            'secondCurrencyId': pairData.secondCurrencyId,
            'secondCurrency': pairData.secondCurrencySymbol,
            'buyorsell': orderData[count].buyorsell == 'buy' ? 'sell' : 'buy',
            'orderType': 'market',
            'price': price,
            'quantity': orderData[count].positionQuantity,
            'liquidityPrice': liquidityPrice,
            'leverage': orderData[count].leverage,
            'orderValue': orderValue,
            'orderCost': orderCost,
            'orderDate': new Date(),
            'takerFee': pairData.taker_fees,
            'status': 'open',
        })

        let newOrder = await newOrderDoc.save();

        tradeList(newOrder, pairData)
        await profitLossPositionClosed(orderData, count + 1, pairData)

    } catch (err) {

    }
}

/** 
 * Calculate Leverage Calculation
*/
export const leverageCalculation = ({ buyorsell, price, leverage, maintanceMargin }) => {
    let leveragePrice = 0;
    if (buyorsell == 'buy') {
        leveragePrice = (price * leverage) / (leverage + 1 - maintanceMargin * leverage);
    } else if (buyorsell == 'sell') {
        leveragePrice = (price * leverage) / (leverage - 1 + maintanceMargin * leverage);
    }

    return leveragePrice;
}

/** 
 * Trade Fee Calculate
*/
const tradeFeeCalc = ({ price, quantity, feeRate }) => {
    try {
        price = parseFloat(price);
        quantity = parseFloat(quantity);
        feeRate = parseFloat(feeRate);
        return ((quantity / price) * (feeRate / 100))
    } catch (err) {
        return 0
    }
}

/** 
 * Update user asset
*/
export const assetUpdate = async ({ currencyId, userId, balance }) => {
    try {
        let walletData = await Wallet.findOne({
            '_id': userId,
        })
        if (walletData) {
            let usrAsset = walletData.assets.id(currencyId)
            if (usrAsset) {
                usrAsset.derivativeBal = usrAsset.derivativeBal + parseFloat(balance);
                await walletData.save();
                socketEmitOne('updateTradeAsset', {
                    'currencyId': usrAsset._id,
                    'spotBal': usrAsset.spotBal,
                    'derivativeBal': usrAsset.derivativeBal,
                }, userId)
            }
        }
    } catch (err) {
    }
}

export const closePosition = async () =>{
    try{
        let positionData = await ClosedPosition.find({})
        console.log("🚀 ~ file: derivativeTrade.controller.js ~ line 3521 ~ closePosition ~ positionData", positionData)
    }catch(err){}
}