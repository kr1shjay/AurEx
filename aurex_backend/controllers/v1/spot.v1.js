// import package
import mongoose from 'mongoose';

// import model
import {
    SpotPair,
    SpotTrade
} from '../../models'

// import lib
import isEmpty from '../../lib/isEmpty';

const ObjectId = mongoose.Types.ObjectId;

/** 
 * Get All Spot Order
 * URL : /api/v1/spot/allOrders
 * METHOD : GET
 * Query : symbol
*/
export const getAllOrder = async (req, res) => {
    try {
        let reqQuery = req.query;
        if (isEmpty(reqQuery.symbol)) {
            return res.status(400).json({ 'success': false, 'message': "Parameter 'symbol' was empty." })
        }

        let pairData = await SpotPair.findOne({ 'tikerRoot': reqQuery.symbol });
        if (!pairData) {
            return res.status(400).json({ 'success': false, 'message': 'INVALID_SYMBOL' })
        }


        let orderData = await SpotTrade.aggregate([
            {
                '$match': {
                    'userId': ObjectId(req.user.id),
                    'pairId': ObjectId(pairData._id),

                }
            },
            {
                "$project": {
                    'symbol': {
                        "$concat": ["$firstCurrency", "$secondCurrency"]
                    },
                    'orderId': "$_id",
                    'price': 1,
                    'quantity': 1,
                    'filledQuantity': 1,
                    'status': 1,
                    'orderType': 1,
                    'side': "$buyorsell"
                }
            }
        ])

        return res.status(200).json(orderData)
    } catch (err) {
        return res.status(400).json({ 'success': false, 'message': 'SOMETHING_WRONG' })
    }
}

/** 
 * Get Spot Order by order id
 * URL : /api/v1/spot/order
 * METHOD : GET
 * Query : symbol
*/
export const getOrder = async (req, res) => {
    try {
        let reqQuery = req.query;
        if (isEmpty(reqQuery.symbol)) {
            return res.status(400).json({ 'success': false, 'message': "Parameter 'symbol' was empty." })
        }

        if (isEmpty(reqQuery.orderId)) {
            return res.status(400).json({ 'success': false, 'message': "Parameter 'orderId' was empty." })
        }

        let pairData = await SpotPair.findOne({ 'tikerRoot': reqQuery.symbol });
        if (!pairData) {
            return res.status(400).json({ 'success': false, 'message': 'INVALID_SYMBOL' })
        }

        let orderData = await SpotTrade.aggregate([
            {
                '$match': {
                    'userId': ObjectId(req.user.id),
                    'pairId': ObjectId(pairData._id),
                }
            },
            {
                "$project": {
                    'symbol': {
                        "$concat": ["$firstCurrency", "$secondCurrency"]
                    },
                    'orderId': "$_id",
                    'price': 1,
                    'quantity': 1,
                    'filledQuantity': 1,
                    'status': 1,
                    'orderType': 1,
                    'side': "$buyorsell"
                }
            }
        ])

        return res.status(200).json(orderData && orderData.length > 0 ? orderData[0] : {})
    } catch (err) {
        return res.status(400).json({ 'success': false, 'message': 'SOMETHING_WRONG' })
    }
}

/** 
 * Get Spot Open Order by order id
 * URL : /api/v1/spot/order
 * METHOD : GET
 * Query : symbol
*/
export const getOpenOrders = async (req, res) => {
    try {
        let reqQuery = req.query;
        if (isEmpty(reqQuery.symbol)) {
            return res.status(400).json({ 'success': false, 'message': "Parameter 'symbol' was empty." })
        }

        let pairData = await SpotPair.findOne({ 'tikerRoot': reqQuery.symbol });
        if (!pairData) {
            return res.status(400).json({ 'success': false, 'message': 'INVALID_SYMBOL' })
        }

        let orderData = await SpotTrade.aggregate([
            {
                '$match': {
                    'userId': ObjectId(req.user.id),
                    'pairId': ObjectId(pairData._id),
                    'status': { "$in": ['open', 'pending'] }
                }
            },
            {
                "$project": {
                    'symbol': {
                        "$concat": ["$firstCurrency", "$secondCurrency"]
                    },
                    'orderId': "$_id",
                    'price': 1,
                    'quantity': 1,
                    'filledQuantity': 1,
                    'status': 1,
                    'orderType': 1,
                    'side': "$buyorsell"
                }
            }
        ])

        return res.status(200).json(orderData)
    } catch (err) {
        return res.status(400).json({ 'success': false, 'message': 'SOMETHING_WRONG' })
    }
}

/** 
 * Get Spot Trade History
 * URL : /api/v1/spot/tradeHistory
 * METHOD : GET
 * Query : symbol, limit
*/
export const getTradeHistory = async (req, res) => {
    try {
        let reqQuery = req.query;
        let limit = 500;
        if (isEmpty(reqQuery.symbol)) {
            return res.status(400).json({ 'success': false, 'message': "Parameter 'symbol' was empty." })
        }

        if (isEmpty(reqQuery.limit) || reqQuery.limit > 500) {
            limit = 500;
        } else {
            limit = parseInt(reqQuery.limit)
        }
        let pairData = await SpotPair.findOne({ 'tikerRoot': reqQuery.symbol });

        if (!pairData) {
            return res.status(400).json({ 'success': false, 'message': 'INVALID_SYMBOL' })
        }

        let orderData = await SpotTrade.aggregate([
            {
                '$match': {
                    'userId': ObjectId(req.user.id),
                    'pairId': ObjectId(pairData._id),
                    'status': { "$in": ['pending', 'completed', 'cancel'] }
                }
            },
            { "$unwind": "$filled" },
            {
                "$sort": { 'filled.createdAt': -1 }
            },
            { "$limit": limit },
            {
                "$project": {
                    'id': "$filled._id",
                    'price': "$filled.price",
                    'quantity': "$filled.filledQuantity",
                }
            }
        ])

        return res.status(200).json(orderData)
    } catch (err) {
        return res.status(400).json({ 'success': false, 'message': 'SOMETHING_WRONG' })
    }
}