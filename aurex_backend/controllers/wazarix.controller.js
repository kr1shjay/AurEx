import mongoose from "mongoose";
import axios from "axios";
import Moment from "moment";
// import model
import { SpotPair, SpotTrade, Assets, PriceConversion } from "../models";

//import lib
import { toFixed } from "../lib/roundOf";
import isEmpty from "../lib/isEmpty";
import { getTimeStamp1 } from "../lib/dateHelper";

//import config
import config from "../config";
import spottradeTable from "../models/spottradeTable";
import { warazixApi, warazix_get_allOrder } from "../config/cron";
import { socketEmitAll, socketEmitOne } from "../config/socketIO";
import {
  calculateServiceFee,
  assetUpdate,
  withoutServiceFee,
} from "./spotTrade.controller";

//import controller
import {
  triggerStopLimitOrder,
  getOrderHistorySocket,
  getOpenOrderSocket,
  getTradeHistorySocket,
} from "../controllers/spotTrade.controller";

const ObjectId = mongoose.Types.ObjectId;
var crypto = require("crypto");
const qs = require("qs");

warazixApi.start();

export const spotPriceTicker = async () => {
  // console.log("wazirx controller spot price  run");

  try{
    const getSpotPair = await SpotPair.find(
      { botstatus: "wazirx" },
      { firstCurrencySymbol: 1, secondCurrencySymbol: 1, markupPercentage: 1 }
    );
  
    getSpotPair.forEach((data, i) => {
      var currencyPair = (data.firstCurrencySymbol + data.secondCurrencySymbol)
        .toLowerCase()
        .toString();
      var markupPercentage = data.markupPercentage;
  
      getSpotPrice(currencyPair, data._id, markupPercentage);
      getorderBook(currencyPair, data._id, markupPercentage);
    });
  }
  catch(err){

  }

  
};

const getSpotPrice = async (currencyPair, pairId, markupPercentage) => {
  // console.log("Wazirxxxx dataaassssss markupPercentage",markupPercentage)

  try{

    const spotPriceData = await axios.get(
      "https://api.wazirx.com/sapi/v1/ticker/24hr?symbol=" + currencyPair
    );
  
    var openPrice = parseFloat(spotPriceData.data.openPrice);
    var closePrice = parseFloat(spotPriceData.data.lastPrice);
    var changePrice = closePrice - openPrice;
    var changePercentage = (changePrice / openPrice) * 100;
    var secondVolume = spotPriceData.data.volume * 24; // for24hours
  
    var lastprice = calculateMarkup(
      spotPriceData.data.lastPrice,
      markupPercentage,
      "+"
    );
    // console.log("spotPriceData.data.lastPricespotPriceData.data.lastPrice",spotPriceData.data.lastPrice)
    // console.log("lastpricelastpricelastpricelastpricelastprice",lastprice)
    let updateSpotPair = await SpotPair.findOneAndUpdate(
      {
        _id: pairId,
      },
      {
        low: toFixed(spotPriceData.data.lowPrice, 6),
        high: toFixed(spotPriceData.data.highPrice, 6),
        firstVolume: toFixed(spotPriceData.data.volume, 6), //1 hours
        secondVolume: toFixed(secondVolume, 6), //26 hours
        last: toFixed(spotPriceData.data.lastPrice, 6),
        markPrice: toFixed(lastprice, 6),
        changePrice: toFixed(changePrice, 6),
        change: toFixed(changePercentage, 4),
      },
      {
        new: true,
      }
    );
  
    PriceUpdate(
      updateSpotPair.firstCurrencySymbol,
      updateSpotPair.secondCurrencySymbol,
      updateSpotPair.markPrice
    );
  
    let marketPriceData = {
      last: updateSpotPair.last,
      markPrice: updateSpotPair.markPrice,
      low: updateSpotPair.low,
      high: updateSpotPair.high,
      firstVolume: updateSpotPair.firstVolume,
      secondVolume: updateSpotPair.secondVolume,
      changePrice: updateSpotPair.changePrice,
      change: updateSpotPair.change,
      botstatus: updateSpotPair.botstatus,
    };
    socketEmitAll("marketPrice", {
      pairId: pairId,
      data: marketPriceData,
    });
    triggerStopLimitOrder(updateSpotPair);
  }

  catch(err){

  }

};

const PriceUpdate = async (firstcur, seccur, markPrice) => {
  // console.log("firstcurfirstcurfirstcur",firstcur)
  // console.log("seccurseccurseccurseccur",seccur)
  // console.log("markPricemarkPricemarkPricemarkPrice",markPrice)

  const getSpotPair = await SpotPair.findOne(
    { firstCurrencySymbol: firstcur, secondCurrencySymbol: seccur },
    { firstCurrencySymbol: 1, secondCurrencySymbol: 1 }
  );

  if (getSpotPair != null) {
    let updateSpotPair = await PriceConversion.findOneAndUpdate(
      {
        baseSymbol: firstcur,
        convertSymbol: seccur,
      },
      {
        convertPrice: markPrice,
      },
      {
        new: true,
      }
    );
  }
};

//wazrix order book
const getorderBook = async (currencyPair, pairId, markupPercentage) => {

  try{
  let wazirxSellOrder = [];
  let wazirxBuyOrder = [];
  const orderBookData = await axios.get(
    " https://api.wazirx.com/sapi/v1/depth?symbol=" + currencyPair + "&limit=10"
  );
  // console.log("orderrrrrrrrrrboookkkkkkkk",orderBookData.data)

  //  console.log("orderrrrrrrrrrboookkkkkkkk",orderBookData.data.asks[0][0],orderBookData.data.asks[0][1])
  var sellOrderLoop = orderBookData.data.asks;
  var buyOrderLoop = orderBookData.data.bids;

  var price = 0;
  var quantity = 0;
  for (var i = 0; i < sellOrderLoop.length; i++) {
    price = sellOrderLoop[i][0];
    quantity = sellOrderLoop[i][1];
    wazirxSellOrder.push({
      price: price,
      quantity: quantity,
    });
  }
  for (var i = 0; i < buyOrderLoop.length; i++) {
    price = buyOrderLoop[i][0];
    quantity = buyOrderLoop[i][1];
    wazirxBuyOrder.push({
      price: price,
      quantity: quantity,
    });
  }

  let sellOrder = [];
  let sellOrderData = await SpotTrade.aggregate([
    {
      $match: {
        pairId: ObjectId(pairId),
        $or: [{ status: "open" }, { status: "pending" }],
        buyorsell: "sell",
      },
    },
    {
      $group: {
        _id: "$price",
        quantity: { $sum: "$quantity" },
        filledQuantity: { $sum: "$filledQuantity" },
      },
    },
    { $sort: { _id: 1 } },
    { $limit: 10 },
  ]);

  sellOrder = sellOrderData;
  for (let sellItem of wazirxSellOrder) {
    let orderData = sellOrderData.find(
      (x) => x._id === parseFloat(sellItem.price)
    );
    if (!orderData) {
      sellOrder.push({
        _id: calculateMarkup(sellItem.price, markupPercentage, "+"),
        quantity: parseFloat(sellItem.quantity),
        filledQuantity: 0,
      });
    }
  }

  sellOrder = sellOrder.sort(
    (a, b) => parseFloat(a.price) - parseFloat(b.price)
  );

  if (sellOrder.length > 0) {
    let sumAmount = 0;
    for (let i = 0; i < sellOrder.length; i++) {
      let quantity =
        parseFloat(sellOrder[i].quantity) -
        parseFloat(sellOrder[i].filledQuantity);
      sumAmount = parseFloat(sumAmount) + parseFloat(quantity);
      sellOrder[i].total = sumAmount;
      sellOrder[i].quantity = quantity;
    }
  }
  sellOrder = sellOrder.reverse();

  let buyOrder = [];

  let buyOrderData = await SpotTrade.aggregate([
    {
      $match: {
        pairId: ObjectId(pairId),
        $or: [{ status: "open" }, { status: "pending" }],
        buyorsell: "buy",
      },
    },
    {
      $group: {
        _id: "$price",
        quantity: { $sum: "$quantity" },
        filledQuantity: { $sum: "$filledQuantity" },
      },
    },
    { $sort: { _id: -1 } },
    { $limit: 10 },
  ]);

  buyOrder = buyOrderData;

  for (let buyItem of wazirxBuyOrder) {
    let orderData = buyOrderData.find(
      (x) => x._id === parseFloat(buyItem.price)
    );
    if (!orderData) {
      buyOrder.push({
        _id: calculateMarkup(buyItem.price, markupPercentage, "-"),
        quantity: parseFloat(buyItem.quantity),
        filledQuantity: 0,
      });
    }
  }

  buyOrder = buyOrder.sort((a, b) => parseFloat(b._id) - parseFloat(a._id));

  if (buyOrder.length > 0) {
    let sumAmount = 0;
    for (let i = 0; i < buyOrder.length; i++) {
      let quantity =
        parseFloat(buyOrder[i].quantity) -
        parseFloat(buyOrder[i].filledQuantity);
      sumAmount = parseFloat(sumAmount) + parseFloat(quantity);
      buyOrder[i].total = sumAmount;
      buyOrder[i].quantity = quantity;
    }
  }

  socketEmitAll("orderBook", {
    pairId: pairId,
    sellOrder: sellOrder,
    buyOrder: buyOrder,
  });
  triggerStopLimitOrder();



}
catch(err){
  
}

};

export const calculateMarkup = (price, percentage, type = "+") => {
  price = parseFloat(price);
  percentage = parseFloat(percentage);

  if (!isEmpty(price)) {
    if (type == "+") {
      return price + price * (percentage / 100);
    } else if (type == "-") {
      return price - price * (percentage / 100);
    }
  }
  return 0;
};

export const calculateMarkup1 = (price, percentage, type = "+") => {
  price = parseFloat(price);
  percentage = parseFloat(percentage);

  // console.log("priceeeeeeeeeeeeeeee", price);
  // console.log("priceeeeeeeeeeeeeeee", percentage);

  if (!isEmpty(price)) {
    if (type == "+") {
      return price + price * (percentage / 100);
    } else if (type == "-") {
      return price - price * (percentage / 100);
    }
  }
  return 0;
};

export const wazirixOrderPlace = async (payloadObj = {}) => {
  try {
    const api = config.WAZIRIX.API;
    const secret = config.WAZIRIX.SECRET;
    const serverTime = await axios.get("https://api.wazirx.com/sapi/v1/time");
    const timeStamp = serverTime.data.serverTime;
    // const timeStamp=Math.floor((new Date()).getTime() / 1000);

    // console.log("timestampl11111111111",timestamp1);
    var sendPrice = 0;
    var payload = {};
    // let calculate_Markup_price = 0;
    let newOrderPayloadObj = payloadObj;
    console.log("payloaddddddddddd", payloadObj);

    // if (payloadObj.type == "stop_limit") {
    //   calculate_Markup_price = payloadObj.stopPrice;
    // }
    // if (payloadObj.type == "limit") {
    //   console.log("payloadObjpayloadObj",payloadObj.price);
    //   calculate_Markup_price = payloadObj.price;
    // }

    // console.log("calculate_Markup_price.....",calculate_Markup_price)
    if (payloadObj.side == "buy") {
      sendPrice = calculateMarkup(
        payloadObj.price,
        payloadObj.markupPercentage,
        "-"
      );
    } else if (payloadObj.side == "sell") {
      sendPrice = calculateMarkup(
        payloadObj.price,
        payloadObj.markupPercentage,
        "+"
      );
    }

    console.log("sendPrice..............", sendPrice);
    if (payloadObj.type == "limit") {
      console.log("limit enterrrr ..........");
      payload = {
        symbol: payloadObj.symbol,
        side: payloadObj.side,
        type: payloadObj.type,
        quantity: payloadObj.quantity,
        price: sendPrice,
        timestamp: timeStamp,
        recvWindow: 50000,
      };
    }

    if (payloadObj.type == "stop_limit") {
      console.log("stop  limit enterrrr ..........");

      payload = {
        symbol: payloadObj.symbol,
        side: payloadObj.side,
        type: payloadObj.type,
        quantity: payloadObj.quantity,
        price: sendPrice,
        stopPrice: payloadObj.stopPrice, //stop price
        timestamp: timeStamp,
        recvWindow: 50000,
      };
    }

    console.log("signature paylod", payload);
    // var payload = {
    //   symbol: "ltcbtc",
    //   side: "buy",
    //   type: "limit",
    //   quantity: 10,
    //   price: 500,
    //   recvWindow: 50000,
    //   timestamp: timeStamp,
    // };

    var queryString = qs.stringify(payload);
    let signature = crypto
      .createHmac("sha256", secret)
      .update(queryString)
      .digest("hex");
    console.log(" orderplace signature  Signature: ", signature);

    orderPlacingwrx(payload, signature, timeStamp, api, newOrderPayloadObj); // orderPlacingwrx ==order placing Wazirix
  } catch (err) {
    console.log("...wazirix orderpalce err  errr", err);
  }
};

const orderPlacingwrx = async (
  payloadObj,
  signature,
  timeStamp,
  api,
  newOrderPayloadObj
) => {
  try {
    console.log("mepauload obje .........", payloadObj);
    let sendPayload = {};

    if (payloadObj.type == "limit") {
      sendPayload = {
        ...payloadObj,
        ...{ timestamp: timeStamp, signature: signature },
      };
    }
    if (payloadObj.type == "stop_limit") {
      sendPayload = {
        ...payloadObj,
        ...{
          stopPrice: newOrderPayloadObj.stopPrice,
          timestamp: timeStamp,
          signature: signature,
        },
      };
    }

    console.log(" limit oe stop limit  sendPyload.......payload", sendPayload);
    // var payload = {
    //   symbol: "ltcbtc",
    //   side: "buy",
    //   type: "limit",
    //   quantity: 10,
    //   price: 500,
    //   recvWindow: 50000,
    //   timestamp: timeStamp,
    //   signature: signature,
    // };

    console.log("sendpayloaddddddddddddd", qs.stringify(sendPayload));
    const resData = await axios({
      method: "post",
      url: "https://api.wazirx.com/sapi/v1/order/ ",
      data: qs.stringify(sendPayload),
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        "X-Api-Key": api,
      },
    });

    // const resData={
    //   data:{
    //     "id": 28,
    //     "symbol": "wrxinr",
    //     "price": "9293.0",
    //     "origQty": "10.0",
    //     "executedQty": "8.2",
    //     "status": "wait",
    //     "type": "limit",
    //     "side": "sell",
    //     "createdTime": 1499827319559,
    //     "updatedTime": 1499827319559
    //   }
    // }
    console.log("limit response........", Object.keys(resData.data));

    console.log("newOrderPayloadObjnewOrderPayloadObj", newOrderPayloadObj);
    if (Object.keys(resData && resData.data).length > 0) {
      console.log("enter after response", resData.data);
      let tradeUpdateObj = {};
      console.log("orderiddddddddddd", typeof resData.data.id, resData.data.id);
      tradeUpdateObj["status"] = resData.data.status;
      tradeUpdateObj["createdAt"] = new Date();
      tradeUpdateObj["wazirixOrderId"] = resData.data.id;
      tradeUpdateObj["botstatus"] = newOrderPayloadObj.botstatus;

      let newOrderUpdate = await SpotTrade.findOneAndUpdate(
        {
          _id: newOrderPayloadObj.newOrder_id,
        },
        tradeUpdateObj,
        { new: true }
      );
    }

    // console.log("new order .......placing upate", newOrderUpdate);
  } catch (err) {
    console.log("...wazirix orderpalce err  errr", err);
  }
};
// wazirixOrderPlace();
// warazix_get_allOrder.start();

export const getAllOrder = async () => {
  try {
    console.log("every min get warix order");
    const spotTradeData = await SpotTrade.find({
      botstatus: "wazirx",
      status: { $in: ["wait", "idle"] },
    });

    spotTradeData &&
      spotTradeData.forEach((data, i) => {
        // var payloadObj = {
        //   symbol: data.pairName.toLowerCase(),
        //   side: data.buyorsell,
        //   type: data.orderType,
        //   quantity: data.quantity,
        //   price: data.price,
        //   //recvWindow: 50000,
        // };

        var payloadObj = {
          orderId: data.wazirixOrderId,
        };
        var orderId = data.wazirixOrderId;

        getAllOrder_1(payloadObj, orderId);
      });
  } catch (err) {
    console.log("getallorder errrr", err);
  }
};

//function  getAllOrder_1  -- create signature

const getAllOrder_1 = async (payloadObj, orderId) => {
  try {
    console.log("enter getall order function 1..............");
    const api = config.WAZIRIX.API;
    const secret = config.WAZIRIX.SECRET;

    const serverTime = await axios.get("https://api.wazirx.com/sapi/v1/time");
    const timeStamp = serverTime.data.serverTime;

    var signaturePayload = {
      ...payloadObj,
      ...{ timestamp: timeStamp },
    };

    console.log("signaturePayloadsignaturePayload", signaturePayload);

    var queryString = qs.stringify(signaturePayload);
    let signature = crypto
      .createHmac("sha256", secret)
      .update(queryString)
      .digest("hex");

    console.log(" get ordersignauter  Signature: ", signature);
    let sendPayload = {
      orderId: orderId,
      timestamp: timeStamp,
      signature: signature,
    };

    console.log("sendPayloaddddddddddd", sendPayload);

    console.log("sendPayloadsendPayload", qs.stringify(sendPayload));

    const resData = await axios({
      method: "GET",
      url: "https://api.wazirx.com/sapi/v1/order/ ",
      data: qs.stringify(sendPayload),
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        "X-Api-Key": api,
      },
    });

    // const   resData={
    //   data:{
    //     "id": 30,
    //     "symbol": "usdtinr",
    //     "price": "100",
    //     "origQty": "1",
    //     "executedQty": "1.0",
    //     "status": "done",
    //     "type": "limit",
    //     "side": "buy",
    //     "createdTime": 1499827319559,
    //     "updatedTime": 1507725176595
    //   }
    // }

    // console.log("resDataaaaaaaaaaa",resData);
    console.log("Waziorxxx order update section", resData.data);
    // console.log("dsssssssssssssss", Object.keys(resData.data).length);
    if (Object.keys(resData.data).length > 0) {
      const spotTradeData = await SpotTrade.findOne({
        botstatus: "wazirx",
        wazirixOrderId: orderId,
        // status: "wait",
      });
      // console.log("spotTradeDataspotTradeData", spotTradeData.buyorsell);

      var currencyId =
        spotTradeData.buyorsell == "buy"
          ? spotTradeData.firstCurrencyId
          : spotTradeData.secondCurrencyId;

      console.log("cureencyId............", currencyId);

      let resposeData = resData.data;
      let pairData = await SpotPair.findOne({ _id: spotTradeData.pairId });
      if (pairData) {
        if (resposeData.status == "idle" || resposeData.status == "wait") {
          console.log("inside idlee funiton call ");
          idle_wait_status(resposeData, currencyId, spotTradeData,pairData);
        } else if (resposeData.status == "done") {
          console.log("inside done funiton call ");

          done_status(resposeData, currencyId, spotTradeData,pairData);
        }
        else if (resposeData.status == "cancel") {
          console.log("inside done funiton call ");

          cancelstatus(resposeData, currencyId, spotTradeData,pairData);
        }
      }
      // }
    }
  } catch (err) {
    console.log("getalorderrrr11111111errr", err);
  }
};
const cancelstatus = async (resData, currencyId, orderData,pairData) => {

  console.log("cancelk ststass")
  let filledQty = Math.abs(orderData.quantity - orderData.filledQuantity)
  var cancelup=   await SpotTrade.findOneAndUpdate({
         '_id': orderData._id
     }, {
         'status': 'cancel',
     }, { 'new': true });


     await assetUpdate({
         'currencyId': orderData.buyorsell == 'buy' ? orderData.secondCurrencyId : orderData.firstCurrencyId,
         'userId': orderData.userId,
         'balance': orderData.buyorsell == 'buy' ? orderData.price * filledQty : filledQty
     })
}
const done_status = async (resData, currencyId, spotTradeData,pairData) => {
  try {
    console.log("done status enter ...........", resData);
    const userAssetsData = await Assets.findOne({
      userId: ObjectId(spotTradeData.userId),
      currency: currencyId,
    });
    // console.log("userAssetsDatauserAssetsData", userAssetsData);
    var executedQty = parseFloat(resData.executedQty);
    var price = parseFloat(resData.price);
    let filledQuantity = parseFloat(spotTradeData.filledQuantity);

    var balanceQty = Math.abs(spotTradeData.filledQuantity - executedQty);

    console.log(
      "balanceqty ............",
      filledQuantity,
      executedQty,
      balanceQty
    );
    // if (resData.side == "buy") {
    //    console.log("esData.by buy buy.side enter", resData.side);
    //   var spotwallet =
    //     parseFloat(userAssetsData.spotwallet) + parseFloat(balanceQty);
    //    console.log("spotwalletspotwallet", spotwallet);
    //   userAssetsData.spotwallet = parseFloat(spotwallet);
    //   await userAssetsData.save();
    // }
    // if (resData.side == "sell") {
    //    console.log("esData.sel sellllll.side enter", resData.side);

    //     balanceQty=parseFloat(executedQty)-parseFloat( spotTradeData.filledQuantity)
    //   var total_Qty_OR_Pice =
    //     parseFloat(resData.price) * parseFloat(balanceQty);
    //   var spotwallet =
    //     parseFloat(userAssetsData.spotwallet) + parseFloat(total_Qty_OR_Pice);
    //  console.log(" done done spotwalletspotwallet", spotwallet);
    //   userAssetsData.spotwallet = parseFloat(spotwallet);
    //   await userAssetsData.save();
    // }

    await assetUpdate({
      currencyId:
        spotTradeData.buyorsell == "sell"
          ? spotTradeData.secondCurrencyId
          : spotTradeData.firstCurrencyId,
      userId: spotTradeData.userId,
      balance: withoutServiceFee({
        price:
          spotTradeData.buyorsell == "sell"
            ? spotTradeData.price * balanceQty
            : balanceQty,
        serviceFee: pairData.taker_fees,
      }),
    });

    console.log("spotTradeData +id ............", spotTradeData._id);

    let update = await SpotTrade.findOneAndUpdate(
      {
        _id: spotTradeData._id,
      },
      {
        status: "completed",
        filledQuantity: executedQty,
        updatedAt: new Date(),
        $push: {
          filled: {
            pairId: spotTradeData.pairId,
            userId: spotTradeData.userId,
            price: price,
            filledQuantity: balanceQty,
            status: "filled",
            Type: resData.side,
            createdAt: new Date(),
            orderValue: balanceQty * price,
          },
        },
      },
      { new: true }
    );
    await getOpenOrderSocket(spotTradeData.userId, spotTradeData.pairId);
    await getOrderHistorySocket(spotTradeData.userId, spotTradeData.pairId);
    await getTradeHistorySocket(spotTradeData.userId, spotTradeData.pairId);
  } catch (err) {
    console.log("... done satstus errrrr", err);
  }
};

const idle_wait_status = async (resData, currencyId, spotTradeData,pairData) => {
  try {
    console.log("idle wait  status enter ...........", resData);

    const userAssetsData = await Assets.findOne({
      userId: ObjectId(spotTradeData.userId),
      currency: currencyId,
    });

    //  console.log("userAssetsDatauserAssetsData", userAssetsData);
    var executedQty = parseFloat(resData.executedQty);
    var price = parseFloat(resData.price);
    var filledQty = 0;
    let filledQuantity = parseFloat(spotTradeData.filledQuantity);

    // var origQty=parseFloat(resData.origQty);
    if (executedQty > 0) {
      filledQty = Math.abs(spotTradeData.filledQuantity - executedQty);

      console.log("-------idel_wait filledQuantity", filledQuantity);
      console.log("-------idel_wait executedQty", executedQty);
      console.log("-------idel_wait filledQty", filledQty);

      // if (resData.side == "buy") {
      //   var spotwallet =
      //     parseFloat(userAssetsData.spotwallet) + parseFloat(filledQty);
      //   console.log("idel_wait spotwalletspotwallet", parseFloat(spotwallet));
      //   userAssetsData.spotwallet = parseFloat(spotwallet);
      //   await userAssetsData.save();
      // }
      // if (resData.side == "sell") {
      //   //  balanceQty=parseFloat(executedQty)-parseFloat( spotTradeData.filledQuantity)
      //   var total_Qty_OR_Pice = spotTradeData.price * filledQty;
      //   var spotwallet =
      //     parseFloat(userAssetsData.spotwallet) + parseFloat(total_Qty_OR_Pice);
      //   // console.log("spotwalletspotwallet", spotwallet);
      //   userAssetsData.spotwallet = parseFloat(spotwallet);
      //   await userAssetsData.save();
      // }

      await assetUpdate({
        currencyId:
          spotTradeData.buyorsell == "sell"
            ? spotTradeData.secondCurrencyId
            : spotTradeData.firstCurrencyId,
        userId: spotTradeData.userId,
        balance: withoutServiceFee({
          price:
            spotTradeData.buyorsell == "sell"
              ? spotTradeData.price * filledQty
              : filledQty,
          serviceFee: pairData.taker_fees,
        }),
      });

      let update = await SpotTrade.findOneAndUpdate(
        {
          _id: spotTradeData._id,
        },
        {
          status: resData.status,
          filledQuantity: executedQty,
          updatedAt: new Date(),
          $push: {
            filled: {
              pairId: spotTradeData.pairId,
              userId: spotTradeData.userId,
              price: price,
              filledQuantity: filledQty,
              status: "filled",
              Type: resData.side,
              createdAt: new Date(),
              orderValue: filledQty * price,
            },
          },
        },
        { new: true }
      );
      await getOpenOrderSocket(spotTradeData.userId, spotTradeData.pairId);
      await getOrderHistorySocket(spotTradeData.userId, spotTradeData.pairId);
      await getTradeHistorySocket(spotTradeData.userId, spotTradeData.pairId);
    }
  } catch (err) {
    console.log("idele wait errrrrrrr .............", err);
  }
};

/*
wazirixCancelOrder
rebody :objId
*/
export const wazirixCancelOrder = async (objId) => {
  try {
    console.log("enter order place for cancel ....");
    const spotTradeData = await SpotTrade.findOne({
      _id: ObjectId(objId),
    });

    console.log("objIdobjIdobjIdobjId", objId);

    if (spotTradeData) {
      var payloadObj = {
        symbol: spotTradeData.pairName.toLowerCase(),
        side: spotTradeData.buyorsell,
        type: spotTradeData.orderType,
        quantity: spotTradeData.quantity,
        price: spotTradeData.price,
        // recvWindow: 50000,
      };

      console.log("paylodobj...............", payloadObj);
      var orderId = spotTradeData.wazirixOrderId;
      console.log("orderidddddddddddddd", orderId);

      cancelOrder_function1(payloadObj, orderId, spotTradeData);
    }
  } catch (err) {
    console.log(".....cancelorderrrrrrrrrr", err);
  }
};

const cancelOrder_function1 = async (payloadObj, orderId, spotTradeData) => {
  try {
    console.log("payload obi obj obj .......", payloadObj);
    const api = config.WAZIRIX.API;
    const secret = config.WAZIRIX.SECRET;

    const serverTime = await axios.get("https://api.wazirx.com/sapi/v1/time");

    const timeStamp = serverTime.data.serverTime;
    var payload = {
      ...payloadObj,
      ...{ timestamp: timeStamp },
    };

    console.log("signaute payloadsssssssssss", payload);

    let sendPayload = {
      symbol: payload.symbol,
      orderId: orderId,
      timestamp: timeStamp,
    };

    var queryString = qs.stringify(sendPayload);
    let signature = crypto
      .createHmac("sha256", secret)
      .update(queryString)
      .digest("hex");

    sendPayload["signature"] = signature;

    console.log("sendpayloadsssssssssssssssssss", sendPayload);

    console.log(
      "qs.stringify(sendPayload)qs.stringify(sendPayload)",
      qs.stringify(sendPayload)
    );

    const resData = await axios({
      method: "DELETE",
      url: "https://api.wazirx.com/sapi/v1/order/ ",
      data: qs.stringify(sendPayload),
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        "X-Api-Key": api,
      },
    });

    // const resData=  {
    //   data: {
    //     "id": 30,
    //     "symbol": "usdtinr",
    //     "price": "100.0",
    //     "origQty": "1.0",
    //     "executedQty": "0.0",
    //     "status": "cancel",
    //     "type": "stop_limit",
    //     "side": "buy",
    //     "createdTime": 1499827319559,
    //     "updatedTime": 1507725176595
    //   }
    // }

    if (Object.keys(resData && resData.data).length > 0) {
      console.log("enter after calcel order response", resData.data);

      const currencyId =
        resData.data.side == "buy"
          ? spotTradeData.secondCurrencyId
          : spotTradeData.firstCurrencyId;

      const userAssetsData = await Assets.findOne({
        userId: ObjectId(spotTradeData.userId),
        currency: currencyId,
      });

      if (resData.data.side == "sell") {
        var totalQty =
          parseFloat(resData.data.origQty) -
          parseFloat(resData.data.executedQty);
        // var calculatePrice=resData.data.price*totalQty;

        var spotwallet =
          parseFloat(userAssetsData.spotwallet) + parseFloat(totalQty);
        console.log("spowalllettttttttttt", userAssetsData.spotwallet);
        console.log(
          "buy buy update cancel spotwalletspotwalletspotwallet ",
          spotwallet
        );
        userAssetsData.spotwallet = spotwallet;
        let assetUpdate = await userAssetsData.save();
        console.log("--------assetUpdate-----sell", assetUpdate);

        socketEmitOne(
          "updateTradeAsset",
          {
            _id: assetUpdate._id,
            spotwallet: assetUpdate.spotwallet,
            derivativeWallet: assetUpdate.derivativeWallet,
          },
          assetUpdate.userId
        );
      }

      if (resData.data.side == "buy") {
        var substraction =
          parseFloat(resData.data.origQty) -
          parseFloat(resData.data.executedQty);

        var total_Qty_OR_Pice =
          parseFloat(spotTradeData.price) * parseFloat(substraction);

        var spotwallet =
          parseFloat(userAssetsData.spotwallet) + parseFloat(total_Qty_OR_Pice);

        console.log("sell sell update cancel spotwalletspotwallet", spotwallet);
        userAssetsData.spotwallet = parseFloat(spotwallet);
        console.log("spowalllettttttttttt", userAssetsData.spotwallet);
        console.log(
          "sell sell update cancel spotwalletspotwalletspotwallet ",
          spotwallet
        );

        let assetUpdate = await userAssetsData.save();
        console.log("--------assetUpdate-----buy", assetUpdate);

        socketEmitOne(
          "updateTradeAsset",
          {
            _id: assetUpdate._id,
            spotwallet: assetUpdate.spotwallet,
            derivativeWallet: assetUpdate.derivativeWallet,
          },
          assetUpdate.userId
        );
      }

      var udateObj = {};
      udateObj["status"] = "cancel";

      console.log("spotTradeData id ...........", spotTradeData._id);
      const update = await SpotTrade.updateOne(
        { _id: spotTradeData._id },
        { $set: udateObj },
        { new: true }
      );
      await getTradeHistorySocket(spotTradeData.userId, spotTradeData.pairId);

      return true;
    }
  } catch (err) {
    console.log("cancel order after response ,,,,,,,,,,", err);

    //  console.log("cancelorderrrr11111111errr", err);
  }
};

// getAllOrder();

// const test=async ()=>{

//   const serverTime = await axios.get("https://api.wazirx.com/sapi/v1/time");
//     const timeStamp = serverTime.data.serverTime;

//  const timestamp1=Math.floor((new Date()).getTime() / 1000);
//     var today = Math.round((new Date()).getTime() / 1000);

// console.log(today);

//      Moment.now()
//     Date.now()
//  const date=   new Date().valueOf()

//   console.log("timestamplaaaaaaaaaaaaaaa",today,timeStamp)
// }
// test();

// warazix_get_allOrder.start();
// export const checkOrder = async () => {
//   try {
//     warazix_get_allOrder.stop();
//     let pairList = await SpotPair.find({ botstatus: "wazirx" });
//     console.log("-----pairList", pairList);
//     if (pairList && pairList.length > 0) {
//       await getAllOrder(pairList, 0);
//       warazix_get_allOrder.start();
//     }
//   } catch (err) {
//     warazix_get_allOrder.start();
//   }
// };

// wazirixCancelOrder();
// getAllOrder();
