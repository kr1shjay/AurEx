// import package
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';

// import config
import config from '../config'

// import model
import {
    Currency,
    Launchpad,
    Wallet,
    PriceConversion,
    TokenPurchase
} from '../models';

// import lib
import { pdfFilter } from '../lib/imageFilter';
import isEmpty from '../lib/isEmpty';
import { getTimeStamp } from '../lib/dateHelper';
import { paginationQuery, filterSearchQuery } from '../lib/adminHelpers'
import { withoutServiceFee } from '../lib/calculation'

const ObjectId = mongoose.Types.ObjectId;

/** 
 * Multer Image Uploade 
*/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config.IMAGE.LAUNCHPAD_PATH);
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, 'whitepaper-' + Date.now() + path.extname(file.originalname));
    }
});

let whitePaperUpload = multer({
    storage: storage,
    fileFilter: pdfFilter,
    limits: { fileSize: config.IMAGE.LAUNCHPAD_SIZE }
}).fields([
    { name: 'whitePaper', maxCount: 1 },
])

export const uploadWhitePaper = (req, res, next) => {
    whitePaperUpload(req, res, function (err) {
        if (!isEmpty(req.validationError)) {
            return res.status(400).json({ "success": false, 'errors': { [req.validationError.fieldname]: req.validationError.messages } })
        }
        else if (err instanceof multer.MulterError) {
            return res.status(400).json({ "success": false, 'errors': { [err.field]: "TOO_LARGE" } })
        }
        else if (err) {
            return res.status(500).json({ "success": false, 'message': "SOMETHING_WRONG" })
        }
        return next();
    })
}

/** 
 * Launchpad List
 * URL : /adminapi/launchpad
 * METHOD : GET
*/
export const launchpadList = async (req, res) => {
    try {
        let pagination = paginationQuery(req.query);
        let filter = filterSearchQuery(req.query, ['industry', 'website']);

        let count = await Launchpad.countDocuments(filter);
        let data = await Launchpad.aggregate([
            { "$match": filter },
            {
                "$lookup": {
                    "from": 'currency',
                    "localField": "currencyId",
                    "foreignField": "_id",
                    "as": "currencyInfo"
                }
            },
            { "$unwind": "$currencyInfo" },
            { "$sort": { "createdAt": -1 } },
            {
                "$project": {
                    'currencyId': 1,
                    'availableCoin': 1,
                    'whitePaper': 1,
                    'launchPrice': 1,
                    'launchCoin': 1,
                    'minAmount': 1,
                    'discount': 1,
                    'availableSupply': 1,
                    'maxSupply': 1,
                    'industry': 1,
                    'website': 1,
                    'content': 1,
                    'startTimeStamp': 1,
                    'endTimeStamp': 1,
                    'telegram': 1,
                    'twitter': 1,
                    'facebook': 1,
                    'youtube': 1,
                    'linkedIn': 1,
                    'coin': '$currencyInfo.coin',
                    'name': '$currencyInfo.name'
                }
            },
            { "$skip": pagination.skip },
            { "$limit": pagination.limit }

        ])

        let result = {
            count,
            data,
            whitePaperUrl: `${config.SERVER_URL}${config.IMAGE.LAUNCHPAD_URL_PATH}`
        }
        return res.status(200).json({ 'success': true, 'message': 'FETCH_SUCCESS', 'result': result })
    } catch (err) {
        return res.status(500).json({ 'success': false, 'message': "Something went wrong" })
    }
}

/** 
 * Add Launchpad
 * URL : /adminapi/launchpad
 * METHOD : POST
 * BODY : currencyId, availableCoin(array), whitePaper, launchPrice, launchCoin, minAmount, discount, availableSupply, maxSupply, industry, website, startTimeStamp, endTimeStamp, telegram, twitter, facebook, youtube, linkedIn, content
*/
export const addLaunchpad = async (req, res) => {
    try {
        let reqBody = req.body, reqFile = req.files;;

        let currencyDoc = await Currency.findOne({ "_id": reqBody.currencyId });
        if (!currencyDoc) {
            return res.status(400).json({ 'success': false, 'errors': { "currencyId": "Currency does not exists" } })
        }

        let checkLaunchCoin = await Currency.findOne({ "_id": reqBody.launchCoin });
        if (!checkLaunchCoin) {
            return res.status(400).json({ 'success': false, 'errors': { "launchCoin": "Currency does not exists" } })
        }

        let checkDoc = await Launchpad.findOne({ 'currencyId': reqBody.currencyId });
        if (checkDoc) {
            return res.status(400).json({ 'success': false, 'errors': { "currencyId": "Token alreay exists" } })
        }

        let newDoc = new Launchpad({
            'currencyId': reqBody.currencyId,
            'availableCoin': reqBody.availableCoin.split(','),
            'whitePaper': reqFile.whitePaper[0].filename,
            'launchPrice': reqBody.launchPrice,
            'launchCoin': reqBody.launchCoin,
            'minAmount': reqBody.minAmount,
            'discount': reqBody.discount,
            'availableSupply': reqBody.availableSupply,
            'maxSupply': reqBody.maxSupply,
            'industry': reqBody.industry,
            'website': reqBody.website,
            'startTimeStamp':reqBody.startTimeStamp,
            'endTimeStamp':reqBody.endTimeStamp,
            'telegram': reqBody.telegram,
            'twitter': reqBody.twitter,
            'facebook': reqBody.facebook,
            'youtube': reqBody.youtube,
            'linkedIn': reqBody.linkedIn,
            'content': reqBody.content,
        })

        await newDoc.save();
        return res.status(200).json({ 'success': true, 'message': 'Launchpad token added successfully' })
    } catch (err) {
        return res.status(500).json({ 'success': false, 'message': 'Something went wrong' })
    }
}

/** 
 * Edit Launchpad
 * URL : /adminapi/launchpad
 * METHOD : POST
 * BODY : launchId, currencyId, availableCoin(array), whitePaper, launchPrice, launchCoin, minAmount, discount, availableSupply, maxSupply, industry, website, startTimeStamp, endTimeStamp, telegram, twitter, facebook, youtube, linkedIn, content
*/
export const updateLaunchpad = async (req, res) => {
    try {
        let reqBody = req.body, reqFile = req.files;;

        let currencyDoc = await Currency.findOne({ "_id": reqBody.currencyId });
        if (!currencyDoc) {
            return res.status(400).json({ 'success': false, 'errors': { "currencyId": "Currency does not exists" } })
        }

        let checkLaunchCoin = await Currency.findOne({ "_id": reqBody.launchCoin });
        if (!checkLaunchCoin) {
            return res.status(400).json({ 'success': false, 'errors': { "launchCoin": "Currency does not exists" } })
        }

        let checkDoc = await Launchpad.findOne({ 'currencyId': reqBody.currencyId, '_id': { "$ne": reqBody.launchId } });
        if (checkDoc) {
            return res.status(400).json({ 'success': false, 'errors': { "currencyId": "Token alreay exists" } })
        }

        let updateDoc = {
            'currencyId': reqBody.currencyId,
            'availableCoin': reqBody.availableCoin.split(','),
            'launchPrice': reqBody.launchPrice,
            'launchCoin': reqBody.launchCoin,
            'minAmount': reqBody.minAmount,
            'discount': reqBody.discount,
            'availableSupply': reqBody.availableSupply,
            'maxSupply': reqBody.maxSupply,
            'industry': reqBody.industry,
            'website': reqBody.website,
            'startTimeStamp':reqBody.startTimeStamp,
            'endTimeStamp': reqBody.endTimeStamp,
            'telegram': reqBody.telegram,
            'twitter': reqBody.twitter,
            'facebook': reqBody.facebook,
            'youtube': reqBody.youtube,
            'linkedIn': reqBody.linkedIn,
            'content': reqBody.content,
        }
        if (reqFile && reqFile.whitePaper && reqFile.whitePaper[0] && reqFile.whitePaper[0].filename) {
            updateDoc['whitePaper'] = reqFile.whitePaper[0].filename;
        }

        await Launchpad.updateOne({
            '_id': reqBody.launchId
        }, {
            "$set": updateDoc
        })

        return res.status(200).json({ 'success': true, 'message': 'Launchpad token updated successfully' })
    } catch (err) {
        console.log(err,'updateLaunchpad')
        return res.status(500).json({ 'success': false, 'message': 'Something went wrong' })
    }
}

/** 
 * Launch pad Active List
 * URL : /api/launchpad/list/:{{listType}}
 * METHOD : GET
 * PARAMS : listType (active, completed)
*/
export const getAllLaunchpad = async (req, res) => {
    try {
        let reqParam = req.params;
        let findObj = {};
        let pagination = paginationQuery(req.query);

        if (reqParam.listType == 'active') {
            findObj['startTimeStamp'] = { "$lte": getTimeStamp('current') }
            findObj['endTimeStamp'] = { "$gte": getTimeStamp('current') }
        } 
        else if (reqParam.listType == 'completed') {
            findObj['endTimeStamp'] = { "$lt": getTimeStamp('current') }
        }
        let totalLaunches = await Launchpad.countDocuments({})
        let totalPurchased = await TokenPurchase.find({}).select({ "total": 1, "quantity": 1, "_id": 0});
        var totalBought = totalPurchased.reduce(function (acc, obj) { return acc + parseFloat(obj.total); }, 0);
        var totalSold = totalPurchased.reduce(function (acc, obj) { return acc + parseFloat(obj.quantity); }, 0);
        let count = await Launchpad.countDocuments(findObj)
        let launchpadDoc = await Launchpad.find(findObj, {
            "availableCoin": 1,
            "discount": 1,
            "content": 1,
            "currencyId": 1,
            "whitePaper": 1,
            "launchPrice": 1,
            "launchCoin": 1,
            "minAmount": 1,
            "availableSupply": 1,
            "maxSupply": 1,
            "industry": 1,
            "website": 1,
            "startTimeStamp": 1,
            "endTimeStamp": 1,
        }).sort({ 'createdAt': -1 }).skip(pagination.skip).limit(pagination.limit)
        let result = {
            count,
            data: launchpadDoc,
            bought: totalBought,
            sold: totalSold,
            all:totalLaunches

        }
        return res.status(200).json({ 'success': true, 'message': 'FETCH_SUCCESS', result })
    } catch (err) {
        return res.status(200).json({ 'success': true, 'message': 'FETCH_SUCCESS', 'results': [] })
    }
}

/** 
 * GET Launch pad
 * URL : /api/launchpad/:{{id}}
 * METHOD : GET
*/
export const getLaunchpad = async (req, res) => {
    let nowTime = getTimeStamp('current')
    // console.log("-----nowTime",nowTime)
    // 'startTimeStamp': { "$lte": nowTime },
    // 'endTimeStamp': { "$gte": nowTime },
    Launchpad.aggregate([
        {
            "$match": {
                '_id': ObjectId(req.params.id),
            }
        },
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
            "$lookup": {
                "from": 'currency',
                "localField": "launchCoin",
                "foreignField": "_id",
                "as": "launchCoinInfo"
            }
        },
        { "$unwind": "$launchCoinInfo" },

        {
            "$lookup": {
                "from": 'currency',
                "let": {
                    "availableCoin": "$availableCoin"
                },
                "pipeline": [
                    {
                        "$match": {
                            "$expr": {
                                "$in": ["$_id", "$$availableCoin"]
                            }
                        }
                    },
                    {
                        "$group": {
                            "_id": null,
                            "coin": { "$push": "$coin" }
                        }
                    }
                ],
                "as": "availCoinInfo"
            }
        },
        { "$unwind": "$availCoinInfo" },

        {
            "$project": {
                "name": '$currencyInfo.name',
                "coin": '$currencyInfo.coin',
                "symbol": '$currencyInfo.symbol',
                "image": {
                    "$cond": [
                        { "$eq": ['$image', ''] },
                        "",
                        { "$concat": [config.SERVER_URL, config.IMAGE.CURRENCY_URL_PATH, "$currencyInfo.image"] }
                    ]
                },
                "industry": 1,
                "website": 1,
                "content": 1,
                "startTimeStamp": 1,
                "endTimeStamp": 1,
                "launchPrice": 1,
                "launchCoin": '$launchCoinInfo.coin',
                "minAmount": 1,
                "availableCoin": "$availCoinInfo.coin",
                "discount": 1,
                "availableSupply": 1,
                "maxSupply": 1,
                "whitePaper": { "$concat": [config.SERVER_URL, config.IMAGE.LAUNCHPAD_URL_PATH, "$whitePaper"] },
                'telegram': 1,
                'twitter': 1,
                'facebook': 1,
                'youtube': 1,
                'linkedIn': 1,
                'createdAt':1,
                'dateStatus': {
                    "$cond": [{
                        "$and": [
                            { "$lte": ["$startTimeStamp", nowTime] },
                            { "$gte": ["$endTimeStamp", nowTime] }
                        ]
                    }, 'active', 'completed']
                }
            }
        }
    ], (err, data) => {
        if (err) {
            return res.status(500).json({ 'success': false, 'message': 'SOMETHING_WRONG', })
        }
        if (data && data.length == 0) {
            return res.status(404).json({ 'success': false, 'message': 'SOMETHING_WRONG' })
        }
        return res.status(200).json({ 'success': true, 'message': 'FETCH_SUCCESS', 'result': data[0] })
    })
}

/** 
 * User Purchase token
 * URL : /api/purchaseToken
 * METHOD : POST
 * BODY : quantity, currencyId, launchId
*/
export const purchaseToken = async (req, res) => {
    try {
        let reqBody = req.body;
        let nowTime = getTimeStamp('current')
        reqBody.quantity = parseFloat(reqBody.quantity)
        console.log(reqBody.currencyId,'purchaseToken1')
        let tokenData = await Launchpad.findOne({ "_id": reqBody.launchId });
        if (!tokenData) {
            return res.status(400).json({ 'success': false, 'message': "SOMETHING_WRONG" })
        }

        if (tokenData.endTimeStamp < nowTime) {
            return res.status(400).json({ 'success': false, 'message': "TOKEN_PURCHASE_EXPIRED" })
        }
        if (tokenData.minAmount > reqBody.quantity) {
            return res.status(400).json({ 'success': false, 'message': "MINIMUM_QUANTITY" })
        }
        if (tokenData.availableSupply < reqBody.quantity) {
            return res.status(400).json({ 'success': false, 'message': "TOTAL_SUPPLY_LESS" })
        }
        if (!tokenData.availableCoin.includes(reqBody.currencyId)) {
            return res.status(400).json({ 'success': false, 'message': "INVALID_COIN" })
        }

        let launchCoinData = await Currency.findOne({ "_id": tokenData.launchCoin })
        if (!launchCoinData) {
            return res.status(400).json({ 'success': false, 'message': "SOMETHING_WRONG" })
        }

        let usrWallet = await Wallet.findOne({ "userId": req.user.userId })
        if (!usrWallet) {
            return res.status(400).json({ 'success': false, 'message': "SOMETHING_WRONG" })
        }

        let sentAsset = usrWallet.assets.id(reqBody.currencyId)
        if (!sentAsset) {
            return res.status(400).json({ 'success': false, 'message': "SOMETHING_WRONG" })
        }

        let receiverAsset = usrWallet.assets.id(tokenData.currencyId)
        if (!receiverAsset) {
            return res.status(400).json({ 'success': false, 'message': "SOMETHING_WRONG" })
        }

        let conversion = await PriceConversion.findOne({ "baseSymbol": sentAsset.coin, "convertSymbol": launchCoinData.coin })
        if (!conversion) {
            return res.status(400).json({ 'success': false, 'message': "SOMETHING_WRONG" })
        }

        let price = tokenData.launchPrice / conversion.convertPrice;
        let total = price * reqBody.quantity;

        if (!isEmpty(tokenData.discount) && !isNaN(tokenData.discount) && tokenData.discount > 0) {
            total = withoutServiceFee({
                'price': total,
                'serviceFee': tokenData.discount
            })
        }

        if (sentAsset.spotBal <= 0) {
            return res.status(400).json({ 'success': false, 'message': "NOT_AVAILABLE_BALANCE" })
        }

        if (sentAsset.spotBal < total) {
            return res.status(400).json({ 'success': false, 'message': "INSUFFICIENT_BALANCE" })
        }
       

        sentAsset.spotBal = sentAsset.spotBal - total;
        receiverAsset.spotBal = receiverAsset.spotBal + reqBody.quantity;
        await usrWallet.save();

        tokenData.availableSupply = tokenData.availableSupply - reqBody.quantity;
        let updateToken = await tokenData.save();

        let newDoc = new TokenPurchase({
            userId: req.user.userId,
            launchId: reqBody.launchId,
            currencyId: tokenData.currencyId,
            coin: receiverAsset.coin,
            price: price,
            sendCoin: sentAsset.coin,
            quantity: reqBody.quantity,
            discount: tokenData.discount,
            total: total
        })

        let purchaseTkn = await newDoc.save();
        let result = {
            tokenDetail: {
                'availableSupply': updateToken.availableSupply
            },
            wallet: {
                'assetId': sentAsset._id,
                'spotBal': sentAsset.spotBal
            },
            purchaseToken: {
                'sendCoin': purchaseTkn.sendCoin,
                'price': purchaseTkn.price,
                'quantity': purchaseTkn.quantity,
                'discount': purchaseTkn.discount,
                'total': purchaseTkn.total,
                'createdAt': purchaseTkn.createdAt,
            }
        }
        return res.status(200).json({ 'status': true, 'message': "TOKEN_PURCHASE_SUCCESS", result })
    } catch (err) {
        return res.status(500).json({ 'success': false, 'message': "SOMETHING_WRONG" })
    }
}

/** 
 * Get All User Purchase Token 
 * URL : /api/getPurchaseTkn/{{launchId}}
 * METHOD : GET
 * PARAMS : launchId
*/
export const getPurchaseTkn = async (req, res) => {
    TokenPurchase.find({
        'userId': req.user.userId,
        'launchId': req.params.launchId
    }, {
        '_id': 0,
        'sendCoin': 1,
        'price': 1,
        'quantity': 1,
        'discount': 1,
        'total': 1,
        'createdAt': 1
    }, (err, data) => {
        if (err) {
            return res.status(500).json({ 'success': false, 'message': 'SOMETHING_WRONG' })
        }
        return res.status(200).json({ 'success': true, 'message': 'FETCH_SUCCESS', 'result': data })
    })
}

/** 
 * Get overall purchase token list
 * URL : /adminapi/purchaseToken
 * METHOD : GET
*/
export const purchaseTknList = async (req, res) => {
    try {
        let pagination = paginationQuery(req.query);
        let filter = filterSearchQuery(req.query, ['userId', 'coin', 'sendCoin']);
        let Export = req.query.export
        const header = [
                "Purchase Date",
                "User Id",
                "Buy Coin",
                "Sell Coin",
                "Price",
                "Quantity",
                "Discount",
                "Total"
        ];
        if (Export == 'csv' || Export == 'xls') {
            let exportData = await TokenPurchase.find(filter, {
                'userId': 1,
                'coin': 1,
                'sendCoin': 1,
                'price': 1,
                'quantity': 1,
                'discount': 1,
                'total': 1,
                'createdAt': 1,
            }).sort({ 'createdAt': -1 })
            let csvData = [
                header
            ]
            if (exportData && exportData.length > 0) {
                for (let item of exportData) {
                    let arr = []
                    arr.push(
                        item.createdAt.toLocaleString(),
                        item.userId,
                        item.coin,
                        item.sendCoin,
                        item.price,
                        item.quantity,
                        item.discount,
                        item.total
                    )
                    csvData.push(arr)
                }
            }
            return res.csv(csvData)
        } else if (Export == 'pdf') {
            let count = await TokenPurchase.countDocuments(filter);
            let data = await TokenPurchase.find(filter, {
                'userId': 1,
                'coin': 1,
                'sendCoin': 1,
                'price': 1,
                'quantity': 1,
                'discount': 1,
                'total': 1,
                'createdAt': 1,
            }).sort({ 'createdAt': -1 })
            // .skip(pagination.skip).limit(pagination.limit)
            let result = {
                count,
                pdfData: data
            }
            return res.status(200).json({ 'success': true, 'message': 'FETCH_SUCCESS', 'result': result })
        } else {

            let count = await TokenPurchase.countDocuments(filter);
            let data = await TokenPurchase.find(filter, {
                'userId': 1,
                'coin': 1,
                'sendCoin': 1,
                'price': 1,
                'quantity': 1,
                'discount': 1,
                'total': 1,
                'createdAt': 1,
            }).sort({ 'createdAt': -1 }).skip(pagination.skip).limit(pagination.limit)

            let result = {
                count,
                data
            }
            return res.status(200).json({ 'success': true, 'message': 'FETCH_SUCCESS', 'result': result })
        }
    } catch (err) {
        return res.status(500).json({ 'success': false, 'message': "Something went wrong" })
    }
}