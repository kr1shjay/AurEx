// import package
import mongoose from 'mongoose'

// import model
import {
    Staking,
    StakingOrder,
    StakingSettle,
    Wallet,
    Currency,
    PriceConversion,
    Assets,
    User
} from '../models';

// import config
import config from '../config';
import { flexibleSettleTask, redemListTask, fixedSettleTask } from '../config/cron';

// import lib
import isEmpty from '../lib/isEmpty';
import { toFixed } from '../lib/roundOf';
import { findBtwDates, dateTimeFormat, momentFormat } from '../lib/dateHelper';
import { interestByDays } from '../lib/calculation';
import { paginationQuery, filterSearchQuery } from '../lib/adminHelpers';

const ObjectId = mongoose.Types.ObjectId;

// stackYields()
// async function stackYields() {
//     let data = await fixedYield()
//     // let data1 = await flexibleYield()
// }
async function flexibleYield() {
    try {
        let flexibleData = await Staking.aggregate([
            {
                "$match": {
                    "type": { $in: ["flexible"] }
                }
            },
            {
                "$lookup": {
                    "from": 'stakingOrder',
                    "localField": "_id",
                    "foreignField": "stakeId",
                    "as": "stakingData"
                }
            },
            {
                "$unwind": "$stakingData"
            },
            {
                "$lookup": {
                    "from": 'stakingSettle',
                    "localField": "stakingData._id",
                    "foreignField": "stakeOrderId",
                    "as": "settleData"
                }
            },
            {
                "$unwind": "$settleData"
            },
            {
                "$lookup": {
                    "from": 'currency',
                    "localField": "settleData.currencyId",
                    "foreignField": "_id",
                    "as": "currencyData"
                }
            },
            {
                "$unwind": "$currencyData"
            },
            {
                "$project": {
                    'currencyId': "$currencyData._id",
                    'coin': "$currencyData.coin",
                    'currencySymbol': {
                        "$cond": [
                            { "$eq": ['$currencyData.image', ''] },
                            "",
                            { "$concat": [config.SERVER_URL, config.IMAGE.CURRENCY_URL_PATH, "$currencyData.image"] }
                        ]
                    },
                    'stakeId': "$stakingData.stakeId",
                    'amount': "$stakingData.amount",
                    'type': "$type",
                    'flexibleAPY': "$flexibleAPY",
                }
            },
            {
                "$group": {
                    "_id": { "stakeid": "$stakeId", "type": "flexible" },
                    amount: { $sum: "$amount" },
                    currencyId: { $first: "$currencyId" },
                    stakeid: { $first: "$stakeId" },
                    coin: { $first: "$coin" },
                    flexibleAPY: { $first: "$flexibleAPY" },
                    type: { $first: "$type" },
                    currencySymbol: { $first: "$currencySymbol" }
                }
            },
            { '$limit': 3 }
        ])

        let priceData = await PriceConversion.find({})
        for (let data of flexibleData) {
            let convertData = priceData.find((el) => ((el.baseSymbol == data.coin) && (el.convertSymbol == "INR")))
            let totalAmount = data.amount * convertData.convertPrice
            data.percentage = data.flexibleAPY * 1 / totalAmount;
        }
        return flexibleData

    } catch (err) {
        console.log(err, '------------32')
    }
}


async function fixedYield() {
    try {
        let fixedData = await Staking.aggregate([
            {
                "$match": {
                    "type": { $in: ["fixed"] }
                }
            },
            {
                "$unwind": "$periodList"
            },
            {
                "$lookup": {
                    "from": 'stakingOrder',
                    "localField": "_id",
                    "foreignField": "stakeId",
                    "as": "stakingData"
                }
            },
            {
                "$unwind": "$stakingData"
            },
            {
                "$lookup": {
                    "from": 'stakingSettle',
                    "localField": "stakingData._id",
                    "foreignField": "stakeOrderId",
                    "as": "settleData"
                }
            },
            {
                "$unwind": "$settleData"
            },
            {
                "$lookup": {
                    "from": 'currency',
                    "localField": "settleData.currencyId",
                    "foreignField": "_id",
                    "as": "currencyData"
                }
            },
            {
                "$unwind": "$currencyData"
            },
            {
                "$project": {
                    'day': "$periodList.days",
                    'APY': '$periodList.APY',
                    'amount': "$stakingData.amount",
                    'currencyId': "$currencyData._id",
                    'currencySymbol': {
                        "$cond": [
                            { "$eq": ['$currencyData.image', ''] },
                            "",
                            { "$concat": [config.SERVER_URL, config.IMAGE.CURRENCY_URL_PATH, "$currencyData.image"] }
                        ]
                    },
                    'stakeId': "$stakingData.stakeId",
                    'coin': "$currencyData.coin",
                    'flexibleAPY': "$flexibleAPY",
                    'type': "$type",
                }
            },
            {
                "$group": {
                    "_id": { "stakeid": "$stakeId", "days": "$day", "type": "fixed" },
                    day: { $first: "$day" },
                    amount: { $sum: "$amount" },
                    currencyId: { $first: "$currencyId" },
                    stakeid: { $first: "$stakeId" },
                    coin: { $first: "$coin" },
                    flexibleAPY: { $first: "$APY" },
                    type: { $first: "$type" },
                    currencySymbol: { $first: '$currencySymbol' }
                }
            },
            { '$limit': 2 }
        ])
        let priceData = await PriceConversion.find({})
        for (let data of fixedData) {
            let convertData = priceData.find((el) => ((el.baseSymbol == data.coin) && (el.convertSymbol == "INR")))
            let totalAmount = data.amount * convertData.convertPrice
            data.percentage = data.flexibleAPY * 1 / totalAmount;
        }
        return fixedData
    } catch (err) {
        console.log(err, '------------32')
    }
}

/** 
 * Add Staking
 * URL : /adminapi/staking
 * METHOD : POST
 * BODY : currencyId, minimumAmount, maximumAmount, redemptionPeriod, type, periodList(days,APY), flexibleAPY, status
*/
export const addStaking = async (req, res) => {
    try {
        let reqBody = req.body;
        let checkStake = await Staking.findOne({ "currencyId": reqBody.currencyId });
        if (checkStake) {
            return res.status(400).json({ 'errors': { 'currencyId': 'Staking currency already exists' } });
        }

        let periodList = [];

        if (reqBody.type.some(r => ['fixed'].includes(r))) {
            for (let item of reqBody.periodList) {
                if (!isEmpty(item.days) && !isNaN(item.days) && !isEmpty(item.APY) && !isNaN(item.APY)) {
                    periodList.push(item)
                }
            }

            if (periodList.length == 0) {
                reqBody.type.splice(reqBody.type.indexOf("fixed"), 1);
            }
        }

        const newDoc = new Staking({
            'currencyId': reqBody.currencyId,
            'minimumAmount': reqBody.minimumAmount,
            'maximumAmount': reqBody.maximumAmount,
            'redemptionPeriod': reqBody.redemptionPeriod,
            'type': reqBody.type,
            'flexibleAPY': reqBody.flexibleAPY,
            'periodList': periodList,

        });

        await newDoc.save();

        return res.status(200).json({ 'success': true, 'message': "Staking added successfully. Refreshing data..." })

    } catch (err) {
        return res.status(500).json({ 'success': false, 'message': "Something went wrong" })
    }
}

/** 
 * Edit Staking
 * URL : /adminapi/staking
 * METHOD : GET
*/
export const stakingList = async (req, res) => {
    try {
        let Export = req.query.export
        const header = ["coin", "minimumAmount", "maximumAmount", "status"]
        if (Export == 'csv' || Export == 'xls') {
            let exportData = await Staking.aggregate([
                { "$sort": { "_id": -1 } },
                {
                    "$lookup": {
                        "from": 'currency',
                        "localField": "currencyId",
                        "foreignField": "_id",
                        "as": "currencyInfo"
                    }
                },
                { "$unwind": "$currencyInfo" },
                {
                    "$project": {
                        'currencyId': 1,
                        'coin': "$currencyInfo.coin",
                        'minimumAmount': 1,
                        'maximumAmount': 1,
                        'redemptionPeriod': 1,
                        'type': 1,
                        'flexibleAPY': 1,
                        'periodList': 1,
                        'status': 1
                    }
                }
            ])
            let csvData = [
                header
            ]
            if (exportData && exportData.length > 0) {
                for (let item of exportData) {
                    let arr = []
                    arr.push(
                        item.coin,
                        item.minimumAmount,
                        item.maximumAmount,
                        item.status,
                    )
                    csvData.push(arr)
                }
            }
            return res.csv(csvData)
        } else if (Export == 'pdf') {
            let Data = await Staking.aggregate([
                { "$sort": { "_id": -1 } },
                {
                    "$lookup": {
                        "from": 'currency',
                        "localField": "currencyId",
                        "foreignField": "_id",
                        "as": "currencyInfo"
                    }
                },
                { "$unwind": "$currencyInfo" },
                {
                    "$project": {
                        'currencyId': 1,
                        'coin': "$currencyInfo.coin",
                        'minimumAmount': 1,
                        'maximumAmount': 1,
                        'redemptionPeriod': 1,
                        'type': 1,
                        'flexibleAPY': 1,
                        'periodList': 1,
                        'status': 1
                    }
                }
            ])
            if (!isEmpty(Data)) {
                let result = {
                    pdfData: Data
                }
                return res.status(200).json({ 'success': true, result })
            } else {
                return res.status(400).json({ 'success': false, message: 'failed' })
            }
        } else {
            await Staking.aggregate([
                { "$sort": { "_id": -1 } },
                {
                    "$lookup": {
                        "from": 'currency',
                        "localField": "currencyId",
                        "foreignField": "_id",
                        "as": "currencyInfo"
                    }
                },
                { "$unwind": "$currencyInfo" },
                {
                    "$project": {
                        'currencyId': 1,
                        'coin': "$currencyInfo.coin",
                        'minimumAmount': 1,
                        'maximumAmount': 1,
                        'redemptionPeriod': 1,
                        'type': 1,
                        'flexibleAPY': 1,
                        'periodList': 1,
                        'status': 1
                    }
                }
            ], (err, data) => {
                if (err) {
                    return res.status(500).json({ 'success': false, 'message': "Something went wrong" })
                }
                return res.status(200).json({ 'success': true, 'message': "Fetch successfully", 'result': data })
            })
        }

    } catch (err) {
        return res.status(500).json({ 'success': false, message: 'something went wrong' })
    }
}

/** 
 * Edit Staking
 * URL : /adminapi/staking
 * METHOD : PUT
 * BODY : stakingId, currencyId, minimumAmount, maximumAmount, redemptionPeriod, type(fixed,flexible), flexibleAPY, flexibleAPY, periodList(days,APY)
*/
export const editStaking = async (req, res) => {
    try {
        let reqBody = req.body;
        let checkStake = await Staking.findOne({ "currencyId": reqBody.currencyId, '_id': { "$ne": reqBody.stakingId } });
        if (checkStake) {
            return res.status(400).json({ 'errors': { 'currencyId': 'Staking currency already exists' } });
        }

        let periodList = [];

        if (reqBody.type.some(r => ['fixed'].includes(r))) {
            for (let item of reqBody.periodList) {
                if (!isEmpty(item.days) && !isNaN(item.days) && !isEmpty(item.APY) && !isNaN(item.APY)) {
                    periodList.push(item)
                }
            }

            if (periodList.length == 0) {
                reqBody.type.splice(reqBody.type.indexOf("fixed"), 1);
            }
        }

        let stakingData = await Staking.findOne({ '_id': reqBody.stakingId });
        if (!stakingData) {
            return res.status(400).json({ 'success': false, 'message': "There is no data" })
        }

        stakingData.currencyId = reqBody.currencyId;
        stakingData.minimumAmount = reqBody.minimumAmount;
        stakingData.maximumAmount = reqBody.maximumAmount;
        stakingData.redemptionPeriod = reqBody.redemptionPeriod;
        stakingData.type = reqBody.type;
        stakingData.flexibleAPY = reqBody.flexibleAPY;
        stakingData.periodList = periodList;
        stakingData.status = reqBody.status;

        await stakingData.save();

        return res.status(200).json({ 'success': true, 'message': "Staking updated successfully. Refreshing data..." })

    } catch (err) {
        return res.status(500).json({ 'success': false, 'message': "Something went wrong" })
    }
}

/** 
 * Get Staking 
 * URL : /api/getStaking
 * METHOD : GET
 * PARAMS : type
*/
export const getStaking = async (req, res) => {
    Staking.aggregate([
        { "$match": { "status": "active", "type": { "$in": [req.query.type] } } },
        {
            "$lookup": {
                "from": 'currency',
                "localField": "currencyId",
                "foreignField": "_id",
                "as": "currencyInfo"
            }
        },
        { "$unwind": "$currencyInfo" },
        {
            "$project": {
                'currencyId': 1,
                'image': {
                    "$cond": [
                        { "$eq": ['$currencyInfo.image', ''] },
                        "",
                        { "$concat": [config.SERVER_URL, config.IMAGE.CURRENCY_URL_PATH, "$currencyInfo.image"] }
                    ]
                },
                'coin': "$currencyInfo.coin",
                'name': "$currencyInfo.name",
                'flexibleAPY': 1,
                'type': 1,
                'minimumAmount': 1,
                'maximumAmount': 1,
                'redemptionPeriod': 1,
                'periodList': 1
            }
        }
    ], (err, data) => {
        if (err) {
            return res.status(500).json({ 'success': false, 'message': "Something went wrong" })
        }
        return res.status(200).json({ 'success': true, 'message': "Fetch successfully", 'result': data })
    })
}

/**
 * Staking order place
 * URL : /api/stake/orderPlace
 * METHOD : POST
 * BODY : stakeId, type, price, isTerms
*/
export const orderPlace = async (req, res) => {
    try {
        let reqBody = req.body;

        reqBody.price = parseFloat(reqBody.price);

        let checkStake = await Staking.findOne({ "_id": reqBody.stakeId }).populate({ "path": "currencyId", "select": "symbol image coin" });

        if (reqBody.price < checkStake.minimumAmount) {
            return res.status(400).json({ 'success': false, 'message': 'your price is less then minimum Amount' })
        }
        if (reqBody.price > checkStake.maximumAmount) {
            return res.status(400).json({ 'success': false, 'message': 'your price is greater then maxmimum Amount' })
        }

        if (!checkStake) {
            return res.status(400).json({ 'success': false, 'message': "Invalid staking" })
        }

        if (checkStake && !checkStake.currencyId) {
            return res.status(400).json({ 'success': false, 'message': "Invalid currency" })
        }

        if (checkStake.status != 'active') {
            return res.status(400).json({ 'success': false, 'message': "Inactive" })
        }

        let usrWallet = await Wallet.findOne({ "userId": req.user.userId })
        if (!usrWallet) {
            return res.status(400).json({ 'success': false, 'message': "Invalid asset" })
        }

        let usrAsset = usrWallet.assets.id(checkStake.currencyId._id);
        if (!usrAsset) {
            return res.status(400).json({ 'success': false, 'message': "Invalid asset" })
        }

        if (usrAsset.spotBal < reqBody.price || usrAsset.spotBal <= 0) {
            return res.status(400).json({ 'success': false, 'message': "There is not enough asset in your balance." })
        }
        usrAsset.spotBal = usrAsset.spotBal - reqBody.price;

        await usrWallet.save();

        let nowDate = new Date();
        let orderDate = nowDate.setSeconds(0, 0)
        let nextSettleDate = nowDate.setDate(nowDate.getDate() + checkStake.settlementPeriod)
        let newDoc = new StakingOrder({
            "userId": req.user.id,
            "currencyId": checkStake.currencyId._id,
            "coin": checkStake.currencyId.coin,
            "currencySymbol": checkStake.currencyId.symbol,
            "stakeId": checkStake._id,
            "amount": reqBody.price,
            "type": reqBody.type,
            "APY": checkStake.flexibleAPY,
            "redemptionPeriod": checkStake.redemptionPeriod,
            "createdAt": orderDate,
            "settlementPeriod": checkStake.settlementPeriod,
            "settleStartDate": orderDate,
            "settleEndDate": nextSettleDate,
            "duration": 365
        })

        let newOrder = await newDoc.save()

        let result = {
            'wallet': {
                'userAssetId': usrAsset._id,
                'spotBal': usrAsset.spotBal,
            },
            'orderData': {
                'currencyId': newOrder.currencyId,
                'currencyImage': `${config.SERVER_URL}${config.IMAGE.CURRENCY_URL_PATH}${checkStake.currencyId.currencyImage}`,
                'currencySymbol': checkStake.currencyId.symbol,
                'currencyName': checkStake.currencyId.coin,
                "createdAt": newOrder.createdAt,
                'APY': newOrder.APY,
                'amount': newOrder.amount,
                'status': newOrder.status,
                '_id': newOrder._id
            }
        }

        return res.status(200).json({ 'success': true, 'message': "Staking order added successfully.", 'result': result })

    } catch (err) {
        console.log("🚀 ~ file: staking.controller.js ~ line 573 ~ orderPlace ~ err", err)
        return res.status(500).json({ 'success': false, 'message': "Something went wrong" })
    }
}

/** 
 * Stake order List
 * URL : /api/stake/orderList
 * METHOD : GET
*/
export const orderList = (req, res) => {
    try {
        StakingOrder.aggregate([
            // { "$match": { "userId": ObjectId(req.user.id),status: } },
            {
                "$match": {
                    "userId": ObjectId(req.user.id),
                    "status": { "$in": ['active'] }
                }
            },
            { "$sort": { "createdAt": -1 } },

            {
                "$lookup": {
                    "from": 'currency',
                    "localField": "currencyId",
                    "foreignField": "_id",
                    "as": "currencyInfo"
                }
            },
            { "$unwind": "$currencyInfo" },
            {
                "$project": {
                    'currencyId': 1,
                    'currencyImage': {
                        "$cond": [
                            { "$eq": ['$currencyImage', ''] },
                            "",
                            { "$concat": [config.SERVER_URL, config.IMAGE.CURRENCY_URL_PATH, "$currencyImage"] }
                        ]
                    },
                    'currencySymbol': "$currencyInfo.currencySymbol",
                    'currencyName': "$currencyInfo.currencyName",
                    // "createdAt": {
                    //     "$dateToString": {
                    //         "date": '$createdAt',
                    //         "format": "%Y-%m-%d %H:%M"
                    //     }
                    // },
                    "createdAt": 1,
                    'APY': 1,
                    'amount': 1,
                    'status': 1,
                    'type': 1
                }
            }
        ], (err, data) => {
            if (err) {
                return res.status(500).json({ 'success': false, 'message': "Something went wrong" })
            }
            return res.status(200).json({ 'success': true, 'message': "Fetch successfully", 'result': data })
        })
    } catch (err) {

    }
}

/** 
 * Stake order Cancel
 * URL : /api/stake/cancel
 * METHOD : DELETE
 * PARAMS : stakeId
*/
export const cancelOrder = async (req, res) => {
    try {
        let stakeOrder = await StakingOrder.findOne({ "_id": req.params.stakeId }).populate({ "path": "currencyId", "select": "currencySymbol currencyImage currencyName" });
        if (!stakeOrder) {
            return res.status(400).json({ 'success': false, 'message': "There is no record" })
        }

        if (["User cancelled", 'cancel_date'].includes(stakeOrder.status)) {
            return res.status(400).json({ 'success': false, 'message': "Already cancelled" })
        }

        if (stakeOrder && !stakeOrder.currencyId) {
            return res.status(400).json({ 'success': false, 'message': "Invalid currency" })
        }

        let nowDate = new Date();
        let orderDate = nowDate.setSeconds(0, 0)
        let nextSettleDate = nowDate.setDate(nowDate.getDate() + stakeOrder.redemptionPeriod)

        stakeOrder.status = 'User cancelled';
        stakeOrder.cancelDate = orderDate;
        stakeOrder.redemDate = nextSettleDate;
        stakeOrder.redemStatus = 'process';

        let getHours = findBtwDates(
            stakeOrder.settleStartDate,
            orderDate,
            'hours'
        )

        let updateOrder = await stakeOrder.save();

        let getDays = Math.floor(getHours / 24)
        let interestPerDay = toFixed(interestByDays(stakeOrder.amount, stakeOrder.APY, 365), 8)

        let newSettlement = new StakingSettle({
            "userId": stakeOrder.userId,
            "currencyId": stakeOrder.currencyId._id,
            "stakeOrderId": stakeOrder._id,
            "amount": interestPerDay * getDays,
            "days": getDays,
            "type": "interest",
            "settleDate": new Date()
        })

        await newSettlement.save()
        await Wallet.updateOne({
            "_id": stakeOrder.userId,
            'assets._id': stakeOrder.currencyId._id
        }, {
            "$inc": {
                "assets.$.spotBal": interestPerDay * getDays
            }
        })
        let result = {
            '_id': updateOrder._id,
            'currencyId': stakeOrder.currencyId._id,
            'currencyImage': `${config.SERVER_URL}${config.IMAGE.CURRENCY_URL_PATH}${stakeOrder.currencyId.currencyImage}`,
            'currencySymbol': stakeOrder.currencyId.currencySymbol,
            'currencyName': stakeOrder.currencyId.currencyName,
            "createdAt": updateOrder.createdAt,
            'APY': updateOrder.APY,
            'amount': updateOrder.amount,
            'status': updateOrder.status
        }

        return res.status(200).json({ 'success': true, 'message': "Cancelled successfully", result })
    } catch (err) {
        return res.status(500).json({ 'success': false, 'message': "Something went wrong" })
    }
}

/** 
 * Flexible settle list
*/
let flexibleSettle = false
flexibleSettleTask.start();
export const flexibleSettleList = async () => {
    flexibleSettleTask.stop()
    if (flexibleSettle) {
        return false
    }
    flexibleSettle = true
    try {
        let nowDate = new Date();
        nowDate.setSeconds(0, 0)

        let stakingList = await StakingOrder.find({
            "settleEndDate": { "$lte": nowDate },
            "type": { "$in": ["flexible"] },
            "status": { "$in": ["active"] }
        })


        if (stakingList && stakingList.length > 0) {
            await flexibleSettlement(stakingList, 0, nowDate)
            flexibleSettleTask.start()
        } else {
            flexibleSettleTask.start()
        }
        flexibleSettle = false
    } catch (err) {
        flexibleSettleTask.start()
        flexibleSettle = false
    }
}

export const flexibleSettlement = async (settlementList, count = 0, nowDate) => {
    try {
        if (isEmpty(settlementList[count])) {
            return true
        }

        let endDate = settlementList[count].settleEndDate;
        let isCancel = false;

        let getHours = findBtwDates(
            settlementList[count].settleStartDate,
            endDate,
            'hours'
        )

        let getDays = Math.floor(getHours / 24)


        if (getDays < 1) {
            return await flexibleSettlement(settlementList, count + 1, nowDate)
        } else if (settlementList[count].status == 'active' && getDays > settlementList[count].duration) {
            getDays = settlementList[count].duration
            isCancel = true;
        }


        let interestPerDay = toFixed(interestByDays(settlementList[count].amount, settlementList[count].APY, 365), 8)

        let newSettlement = new StakingSettle({
            "userId": settlementList[count].userId,
            "currencyId": settlementList[count].currencyId,
            "stakeOrderId": settlementList[count]._id,
            "amount": interestPerDay * getDays,
            "days": getDays,
            "type": "interest",
            "settleDate": new Date(),
            'coin': settlementList[count].coin
        })

        let startDate = new Date(settlementList[count].settleEndDate);
        let nextSettleDate = startDate.setDate(startDate.getDate() + settlementList[count].settlementPeriod)


        let updateOrder = {
            "settleStartDate": settlementList[count].settleEndDate,
            "settleEndDate": nextSettleDate,
            "duration": settlementList[count].duration - getDays
        }

        if (isCancel) {
            updateOrder['cancelDate'] = nowDate
            updateOrder['status'] = "cancel_date"
        }

        await StakingOrder.updateOne({
            "_id": settlementList[count]._id
        }, { "$set": updateOrder })

        await newSettlement.save()

        await Wallet.updateOne({
            "_id": settlementList[count].userId,
            'assets._id': settlementList[count].currencyId
        }, {
            "$inc": {
                "assets.$.spotBal": interestPerDay * getDays
            }
        })

        return await flexibleSettlement(settlementList, count + 1, nowDate)

    } catch (err) {
        return await flexibleSettlement(settlementList, count + 1, nowDate)
    }
}

/** 
 * Redemption Order List
*/
redemListTask.start()
export const redemList = async (nowDate) => {
    redemListTask.stop()
    try {
        let orderList = await StakingOrder.find({
            "redemDate": { "$lte": nowDate },
            "status": { "$in": ["User cancelled", "cancel_date"] },
            "redemStatus": { "$in": ["process"] }
        })

        if (orderList && orderList.length > 0) {
            await redemSettlement(orderList, 0, nowDate)
            redemListTask.start()
        } else {
            redemListTask.start()
        }
    } catch (err) {
        redemListTask.start()
    }
}

export const redemSettlement = async (settlementList, count, nowDate) => {
    try {
        if (isEmpty(settlementList[count])) {
            return true
        }

        let newSettlement = new StakingSettle({
            "userId": settlementList[count].userId,
            "currencyId": settlementList[count].currencyId,
            "stakeOrderId": settlementList[count]._id,
            "amount": settlementList[count].amount,
            "days": settlementList[count].redemptionPeriod,
            "type": "redemption",
            "settleDate": nowDate,
            'coin': settlementList[count].coin
        })

        await newSettlement.save()

        await Wallet.updateOne({
            "_id": settlementList[count].userId,
            'assets._id': settlementList[count].currencyId
        }, {
            "$inc": {
                "assets.$.spotBal": settlementList[count].amount
            }
        })

        await StakingOrder.updateOne({
            '_id': settlementList[count]._id
        }, {
            "$set": {
                "redemStatus": "completed"
            }
        })

        return await redemSettlement(settlementList, count + 1, nowDate)

    } catch (err) {
        return await redemSettlement(settlementList, count + 1, nowDate)
    }
}

/**
 * Staking Settlement History
 * URL : /api/stake/settleHistory
 * METHOD : GET
 * Query : page, limit
*/
export const getSettleHistory = async (req, res) => {
    try {
        let filter = {
            "userId": ObjectId(req.user.id)
        };
        let pagination = paginationQuery(req.query);

        if (!isEmpty(req.query.coin) && req.query.coin != 'all') {
            filter['coin'] = req.query.coin
        }

        if (!['subscription', 'redemption', 'interest'].includes(req.query.type)) {
            return res.status(200).json({ 'success': true, result: [] })
        }

        let count, data;

        if (['redemption', 'interest'].includes(req.query.type)) {
            filter['type'] = req.query.type;
            // filter['coin'] = req.query.coin;
            count = await StakingSettle.aggregate([
                { "$match": filter },
                {
                    "$lookup": {
                        "from": 'stakingOrder',
                        "localField": "stakeOrderId",
                        "foreignField": "_id",
                        "as": "stakeInfo"
                    }
                },
                { "$unwind": "$stakeInfo" },
            ]);

            data = await StakingSettle.aggregate([
                { "$match": filter },
                // { "$sort": { "settleDate": -1 } },
                { "$sort": { "_id": -1 } },
                {
                    "$lookup": {
                        "from": 'stakingOrder',
                        "localField": "stakeOrderId",
                        "foreignField": "_id",
                        "as": "stakeInfo"
                    }
                },
                { "$unwind": "$stakeInfo" },
                {
                    "$project": {
                        // "settleDate": {
                        //     "$dateToString": {
                        //         "date": '$settleDate',
                        //         "format": "%Y-%m-%d %H:%M"
                        //     }
                        // },
                        'createdAt': '$settleDate',
                        'coin': '$stakeInfo.coin',
                        'stakeAmount': "$stakeInfo.amount",
                        'APY': "$stakeInfo.APY",
                        "amount": 1,
                        "type": 1,
                        // 'status': '$stakeInfo.status'
                    }
                },
                { "$skip": pagination.skip },
                { "$limit": pagination.limit },
            ])
        } else if (['subscription'].includes(req.query.type)) {
            count = await StakingOrder.aggregate([
                { "$match": filter }
            ]);

            data = await StakingOrder.aggregate([
                { "$match": filter },
                // { "$sort": { "createdAt": -1 } },
                { "$sort": { "_id": -1 } },
                {
                    "$project": {
                        "settleDate": {
                            "$dateToString": {
                                "date": '$createdAt',
                                "format": "%Y-%m-%d %H:%M"
                            }
                        },
                        'createdAt': 1,
                        'coin': 1,
                        'stakeAmount': "$amount",
                        'APY': 1,
                        "amount": 1,
                        "type": 1,
                        "status": 1
                    }
                },
                { "$skip": pagination.skip },
                { "$limit": pagination.limit },
            ])
        }

        let result = {
            count: count.length,
            data
        }
        return res.status(200).json({ 'success': true, result })
    } catch (err) {
        return res.status(500).json({ 'success': false })
    }
}

// StakingOrder

/** 
 * Get Staking Balance Detail
 * URL : /api/stake/balance
 * METHOD : GET
*/
export const getStakeBal = async (req, res) => {
    try {
        const siteSetting = await SiteSetting.findOne({}, { "userDashboard": 1 });
        if (siteSetting) {
            let currencyId = siteSetting.userDashboard.map(item => item.currencyId)

            if (currencyId && currencyId.length > 0) {
                let userAsset = await StakingOrder.find({
                    "userId": req.user.id,
                    "currencyId": { "$in": currencyId }
                }, {
                    '_id': 0,
                    'currencyId': 1,
                    'currencySymbol': 1,
                    'amount': 1,
                }).limit(5).lean()

                if (userAsset && userAsset.length > 0) {
                    let result = []
                    userAsset.map(item => {
                        let findData = siteSetting.userDashboard.find(el => el.currencyId == item.currency.toString())
                        if (findData) {
                            result.push({
                                ...item,
                                ...{
                                    'colorCode': findData.colorCode
                                }
                            })
                        }
                    })
                    return res.status(200).json({ 'success': true, 'message': "Fetch success", result })
                }
            }
            return res.status(400).json({ 'success': false, 'message': "no record" })
        }
    } catch (err) {
        return res.status(500).json({ "success": false, 'message': "SOMETHING_WRONG" })
    }
}


export const settlementHistory = async (req, res) => {
    try {

        let pagination = paginationQuery(req.query);
        let filter = filterSearchQuery(req.query, ['coin']);
        let count = await StakingSettle.countDocuments(filter);
        let data = await StakingSettle.find(filter)
            .sort({ "_id": -1 })
            .skip(pagination.skip)
            .limit(pagination.limit)
            .populate({ path: "userId", select: "email" });
        let result = {
            count,
            data
        }
        return res.status(200).json({ 'success': true, 'message': 'Fetched successfully.', result })



    } catch (err) {
        return res.status(500).json({ 'success': false })
    }
}



/**
 * Staking Settlement History
 * URL : /adminapi/stake/orderHistory
 * METHOD : GET
 * Query : page, limit
*/

export const orderHistory = async (req, res) => {
    try {
        let pagination = paginationQuery(req.query);
        let filter = filterSearchQuery(req.query, ['email', 'coin']);
        let count = await StakingOrder.countDocuments(filter)
        let data = await StakingOrder.aggregate([
            { "$sort": { "_id": -1 } },
            {
                "$lookup": {
                    "from": 'user',
                    "localField": 'userId',
                    "foreignField": '_id',
                    "as": 'userInfo',
                }
            },
            { "$unwind": "$userInfo" },
            {
                "$project": {
                    "email": "$userInfo.email",
                    "settleStartDate": 1,
                    "stakeId": 1,
                    "coin": 1,
                    "amount": 1,
                    "APY": 1,
                    "type": 1,
                    "status": 1,
                    "createdAt": 1
                }
            },
            { "$match": filter },
            { "$skip": pagination.skip },
            { "$limit": pagination.limit }


        ])
        let result = {
            count,
            data
        }
        return res.status(200).json({ 'success': true, result })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ "success": false, 'errors': { 'messages': "Error on server" } })
    }
}

export const orderPlaceLocked = async (req, res) => {
    try {
        let reqBody = req.body;

        reqBody.price = parseFloat(reqBody.price);
        let durations = reqBody.durations;
        let uniqueId = await User.findOne({ _id: req.user.id })
        let checkStake = await Staking.findOne({ _id: reqBody.stakeId }).populate({
            path: "currencyId",
            select: "symbol image name coin",
        });
        if (!checkStake) {
            return res.status(400).json({ success: false, message: "Invalid staking" });
        }

        if (checkStake && !checkStake.currencyId) {
            return res.status(400).json({ success: false, message: "Invalid currency" });
        }

        if (checkStake.status != "active") {
            return res.status(400).json({ success: false, message: "Inactive" });
        }

        if (checkStake.minimumAmount > reqBody.price) {
            return res.status(400).json({ 'success': false, 'message': `Amount must be higher than ${checkStake.minimumAmount}` })
        }

        if (checkStake.maximumAmount < reqBody.price) {
            return res.status(400).json({ 'success': false, 'message': `Amount must be lesser than ${checkStake.maximumAmount}` })
        }

        if (!checkStake.type.includes('fixed')) {
            return res.status(400).json({ success: false, message: "Invalid staking" });
        }

        let stakePeriod = checkStake.periodList.find(el => el.days == reqBody.duration_days)
        if (!stakePeriod) {
            return res.status(400).json({ success: false, message: "Kindly choose the duration days" });
        }

        let usrWallet = await Wallet.findOne({ "userId": req.user.userId })
        if (!usrWallet) {
            return res.status(400).json({ 'success': false, 'message': "Invalid asset" })
        }

        let usrAsset = usrWallet.assets.id(checkStake.currencyId._id);
        if (!usrAsset) {
            return res.status(400).json({ 'success': false, 'message': "Invalid asset" })
        }

        if (usrAsset.spotBal < reqBody.price || usrAsset.spotBal <= 0) {
            return res.status(400).json({ 'success': false, 'message': "There is not enough asset in your balance." })
        }
        usrAsset.spotBal = usrAsset.spotBal - reqBody.price;

        await usrWallet.save();

        let nowDate = new Date();
        let orderDate = nowDate.setSeconds(0, 0);
        let nextSettleDate = nowDate.setDate(
            nowDate.getDate() + checkStake.settlementPeriod
        );

        let newDoc = new StakingOrder({
            userId: req.user.id,
            currencyId: checkStake.currencyId._id,
            coin: checkStake.currencyId.coin,
            stakeId: checkStake._id,
            amount: reqBody.price,
            type: reqBody.type,
            APY: stakePeriod.APY,
            redemptionPeriod: checkStake.redemptionPeriod,
            createdAt: orderDate,
            settlementPeriod: checkStake.settlementPeriod,
            settleStartDate: orderDate,
            settleEndDate: nextSettleDate,
            duration: reqBody.duration_days,
        });

        let newOrder = await newDoc.save();

        let result = {
            wallet: {
                userAssetId: usrAsset._id,
                spotBal: usrAsset.spotBal,
            },
            orderData: {
                currencyId: newOrder.currencyId,
                'image': `${config.baseUrl}currency/${checkStake.currencyId.currencyimage}`,
                coin: checkStake.currencyId.currencySymbol,
                name: checkStake.currencyId.currencyName,
                createdAt: newOrder.createdAt,
                APY: newOrder.APY,
                amount: newOrder.amount,
                status: newOrder.status,
                type: newOrder.type
            },
        };

        return res.status(200).json({
            success: true,
            message: "Staking order added successfully.",
            result: result,
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

fixedSettleTask.start();
export const fixedSettleList = async () => {
    fixedSettleTask.stop();
    try {
        let nowDate = new Date();
        nowDate.setSeconds(0, 0);

        let stakingList = await StakingOrder.find({
            settleEndDate: { $lte: nowDate },
            type: { $in: ["fixed"] },
            status: { $in: ["active"] },
        });

        if (stakingList && stakingList.length > 0) {
            await fixedSettlement(stakingList, 0, nowDate);
            fixedSettleTask.start();
        } else {
            fixedSettleTask.start();
        }
    } catch (err) {
        fixedSettleTask.start();
    }
};

export const fixedSettlement = async (settlementList, count = 0, nowDate) => {
    try {
        if (isEmpty(settlementList[count])) {
            return true;
        }

        let endDate = settlementList[count].settleEndDate;
        let isCancel = false;

        let getHours = findBtwDates(
            settlementList[count].settleStartDate,
            endDate,
            "hours"
        );
        let getDays = Math.floor(getHours / 24);

        if (getDays < 1) {
            return await fixedSettlement(settlementList, count + 1, nowDate);
        } else if (settlementList[count].status == "active" && getDays >= settlementList[count].duration) {
            getDays = settlementList[count].duration;
            isCancel = true;
        } else if (settlementList[count].duration <= 0) {
            let updateOrder = {}
            let nextSettleDate = nowDate.setDate(nowDate.getDate() + settlementList[count].redemptionPeriod)

            updateOrder['cancelDate'] = nowDate
            updateOrder['status'] = "cancel_date"
            updateOrder['redemStatus'] = "process"
            updateOrder['redemDate'] = nextSettleDate

            await StakingOrder.updateOne({
                "_id": settlementList[count]._id
            }, { "$set": updateOrder })

            return await fixedSettlement(settlementList, count + 1, nowDate)
        }


        let interestPerDay = toFixed(
            interestByDays(
                settlementList[count].amount,
                settlementList[count].APY,
                365
            ),
            8
        );

        let newSettlement = new StakingSettle({
            userId: settlementList[count].userId,
            currencyId: settlementList[count].currencyId,
            coin: settlementList[count].coin,
            stakeOrderId: settlementList[count]._id,
            amount: interestPerDay * getDays,
            days: getDays,
            type: "interest",
            StakeType: "Fixed",
            settleDate: new Date(),
        });

        let startDate = new Date(settlementList[count].settleEndDate);
        let nextSettleDate;

        if ((settlementList[count].duration - getDays) < settlementList[count].settlementPeriod) {
            nextSettleDate = startDate.setDate(
                startDate.getDate() + (settlementList[count].duration - getDays)
            );
        } else {
            nextSettleDate = startDate.setDate(
                startDate.getDate() + settlementList[count].settlementPeriod
            );
        }

        let updateOrder = {
            settleStartDate: settlementList[count].settleEndDate,
            settleEndDate: nextSettleDate,
            duration: settlementList[count].duration - getDays,
        };

        if (isCancel) {
            let nextSettleDate = nowDate.setDate(nowDate.getDate() + settlementList[count].redemptionPeriod)

            updateOrder['cancelDate'] = nowDate
            updateOrder['status'] = "cancel_date"
            updateOrder['redemStatus'] = "process"
            updateOrder['redemDate'] = nextSettleDate
        }

        await StakingOrder.updateOne(
            {
                _id: settlementList[count]._id,
            },
            { $set: updateOrder }
        );

        await newSettlement.save();

        // await Wallet.updateOne({
        //     "_id": settlementList[count].userId,
        //     'assets._id': settlementList[count].currencyId
        // }, {
        //     "$inc": {
        //         "assets.$.spotBal": interestPerDay * getDays
        //     }
        // })
        // const aseetData = await Assets.updateOne(
        //     {
        //         userId: settlementList[count].userId,
        //         currency: settlementList[count].currencyId,
        //     },
        //     {
        //         $inc: {
        //             spotwallet: interestPerDay * getDays,
        //         },
        //     },
        //     {
        //         new: true,
        //     }
        // );

        await Wallet.updateOne({
            "_id": settlementList[count].userId,
            'assets._id': settlementList[count].currencyId
        }, {
            "$inc": {
                "assets.$.spotBal": interestPerDay * getDays
            }
        })

        return await fixedSettlement(settlementList, count + 1, nowDate);
    } catch (err) {
        return await fixedSettlement(settlementList, count + 1, nowDate);
    }
};

export const highYield = async (req, res) => {
    try {
        let fixedData = await fixedYield()
        let flexibleData = await flexibleYield()
        if (!isEmpty(fixedData) || !isEmpty(flexibleData)) {
            let data = {
                fixedData,
                flexibleData
            }
            return res.status(200).json({ 'success': true, result: data })
        } else {
            return res.status(400).json({ 'success': false, message: 'Not found' })
        }
    } catch (err) {
        return res.status(500).json({ 'success': false, message: 'error on server' })
    }
}