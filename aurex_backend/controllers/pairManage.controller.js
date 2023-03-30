// import package

// import model
import {
    Currency,
    SpotPair,
    SpotTrade,
    PerpetualOrder

} from '../models'

// import controller
import * as binanceCtrl from './binance.controller';
import * as symbolDatabase from './chart/symbols_database';
import {nodeBinanceAPI} from '../config/binance'
// import lib
import {
    paginationQuery,
    filterSearchQuery
} from '../lib/adminHelpers';

/** 
 * Add Spot Trade Pair
 * METHOD : POST
 * URL : /adminapi/spotPair
 * BODY : firstCurrencyId, firstFloatDigit, secondCurrencyId, secondFloatDigit, minPricePercentage, maxPricePercentage, maxQuantity, minQuantity, maker_rebate, taker_fees, markupPercentage, botstatus
*/
export const addSpotPair = async (req, res) => {
    try {
        let reqBody = req.body;
        let pairName = ""
        let firstCurrencyData = await Currency.findOne({ "_id": reqBody.firstCurrencyId });
        if (!firstCurrencyData) {
            return res.status(400).json({ "success": false, 'errors': { 'firstCurrencyId': "Invalid currency" } })
        }

        let secondCurrencyData = await Currency.findOne({ "_id": reqBody.secondCurrencyId });
        if (!secondCurrencyData) {
            return res.status(400).json({ "success": false, 'errors': { 'secondCurrencyId': "Invalid currency" } })
        }
        pairName = firstCurrencyData.coin+secondCurrencyData.coin

        let checkSpotPair = await SpotPair.findOne({ 'firstCurrencyId': reqBody.firstCurrencyId, 'secondCurrencyId': reqBody.secondCurrencyId })
        if (checkSpotPair) {
            return res.status(400).json({ "success": false, 'errors': { 'firstCurrencyId': "Currency pair is already exists" } })
        }
        if (pairName) {
            const checkPair = await nodeBinanceAPI.exchangeInfo();
            const pairDetails = checkPair?.symbols.find(el => el.symbol == pairName)
            if(pairDetails == undefined ||pairDetails ==  null || pairDetails == {}){
                return res.status(400).json({ "success": false, 'errors': { 'pairName': "Currency pair is not exists in binance" } })
            }
        }
        let newDoc = new SpotPair({
            'tikerRoot': `${firstCurrencyData.coin}${secondCurrencyData.coin}`,
            'firstCurrencyId': reqBody.firstCurrencyId,
            'firstCurrencySymbol': firstCurrencyData.coin,
            'firstFloatDigit': reqBody.firstFloatDigit,
            'secondCurrencyId': reqBody.secondCurrencyId,
            'secondCurrencySymbol': secondCurrencyData.coin,
            'secondFloatDigit': reqBody.secondFloatDigit,
            'minPricePercentage': reqBody.minPricePercentage,
            'maxPricePercentage': reqBody.maxPricePercentage,
            'minQuantity': reqBody.minQuantity,
            'maxQuantity': reqBody.maxQuantity,
            'maker_rebate': reqBody.maker_rebate,
            "markPrice": reqBody.markPrice,
            'taker_fees': reqBody.taker_fees,
            'markupPercentage': reqBody.markupPercentage,
            'botstatus': reqBody.botstatus
        })
        let addedDoc = await newDoc.save();

        symbolDatabase.initialChartSymbol()
        if (addedDoc.botstatus == 'binance') {
            binanceCtrl.getSpotPair();
            binanceCtrl.spotOrderBookWS();
            binanceCtrl.spotTickerPriceWS();
        }
        

        return res.status(200).json({ 'message': 'Pair added successfully. Refreshing data...' })
    } catch (err) {
        return res.status(500).json({ "success": false, 'message': "Error on server" })
    }
}

/** 
 * Add Spot Trade Pair
 * METHOD : POST
 * URL : /adminapi/spotPair
 * BODY : pairId, firstCurrencyId, firstFloatDigit, secondCurrencyId, secondFloatDigit, minPricePercentage, maxPricePercentage, maxQuantity, minQuantity, maker_rebate, taker_fees, markupPercentage, botstatus
*/
export const editSpotPair = async (req, res) => {
    try {
        let reqBody = req.body;

        let firstCurrencyData = await Currency.findOne({ "_id": reqBody.firstCurrencyId });
        if (!firstCurrencyData) {
            return res.status(400).json({ "success": false, 'errors': { 'firstCurrencyId': "Invalid currency" } })
        }

        let secondCurrencyData = await Currency.findOne({ "_id": reqBody.secondCurrencyId });
        if (!secondCurrencyData) {
            return res.status(400).json({ "success": false, 'errors': { 'secondCurrencyId': "Invalid currency" } })
        }


        let checkSpotPair = await SpotPair.findOne({ 'firstCurrencyId': reqBody.firstCurrencyId, 'secondCurrencyId': reqBody.secondCurrencyId, "_id": { "$ne": reqBody.pairId } })
        if (checkSpotPair) {
            return res.status(400).json({ "success": false, 'errors': { 'firstCurrencyId': "Currency pair is already exists" } })
        }

        let updateDoc = await SpotPair.findOneAndUpdate({
            "_id": reqBody.pairId
        }, {
            'tikerRoot': `${firstCurrencyData.coin}${secondCurrencyData.coin}`,
            'firstCurrencyId': reqBody.firstCurrencyId,
            'firstCurrencySymbol': firstCurrencyData.coin,
            'firstFloatDigit': reqBody.firstFloatDigit,
            'secondCurrencyId': reqBody.secondCurrencyId,
            'secondCurrencySymbol': secondCurrencyData.coin,
            'secondFloatDigit': reqBody.secondFloatDigit,
            'minPricePercentage': reqBody.minPricePercentage,
            'maxPricePercentage': reqBody.maxPricePercentage,
            'minQuantity': reqBody.minQuantity,
            'maxQuantity': reqBody.maxQuantity,
            'maker_rebate': reqBody.maker_rebate,
            'taker_fees': reqBody.taker_fees,
            "markPrice": reqBody.markPrice,
            'markupPercentage': reqBody.markupPercentage,
            'botstatus': reqBody.botstatus,
            'status': reqBody.status,
        })
        symbolDatabase.initialChartSymbol()
        // if (updateDoc.botstatus == 'binance') {
        //     binanceCtrl.getSpotPair();
        //     binanceCtrl.spotOrderBookWS();
        //     binanceCtrl.spotTickerPriceWS();
        // }
        if ((reqBody.botstatus == 'binance' && updateDoc.botstatus == 'off') ||(reqBody.botstatus == 'off' && updateDoc.botstatus == 'binance') ) {
            binanceCtrl.getSpotPair();
            binanceCtrl.spotOrderBookWS();
            binanceCtrl.spotTickerPriceWS();
            binanceCtrl.recentTradeWS();
        } 

        return res.status(200).json({ 'message': 'Pair updated successfully. Refreshing data...' })
    } catch (err) {
        return res.status(500).json({ "success": false, 'message': "Error on server" })
    }
}

/** 
 * Get Spot Trade Pair
 * METHOD : GET
*/
export const spotPairList = async (req, res) => {
    try {
        let pagination = paginationQuery(req.query);
        let filter = filterSearchQuery(req.query, ['firstCurrencySymbol', 'secondCurrencySymbol', 'botstatus', 'status']);

        let count = await SpotPair.countDocuments(filter)
        let data = await SpotPair.find(filter, {
            'firstCurrencyId': 1,
            'firstCurrencySymbol': 1,
            'firstFloatDigit': 1,
            'secondCurrencyId': 1,
            'secondCurrencySymbol': 1,
            'secondFloatDigit': 1,
            'minPricePercentage': 1,
            'maxPricePercentage': 1,
            'minQuantity': 1,
            'maxQuantity': 1,
            'maker_rebate': 1,
            'taker_fees': 1,
            "markPrice": 1,
            'markupPercentage': 1,
            'botstatus': 1,
            'status': 1
        }).skip(pagination.skip).limit(pagination.limit)

        let result = {
            count,
            data
        }
        return res.status(200).json({ 'success': true, "messages": "success", result })
    }
    catch (err) {
        return res.status(500).json({ "success": false, 'errors': { 'messages': "Error on server" } })
    }
}
