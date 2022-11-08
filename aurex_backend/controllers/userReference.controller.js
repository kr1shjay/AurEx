// import package
import mongoose from "mongoose";

// import modal
import { Transaction, User, UserReference } from "../models";

// import lib
import isEmpty from "../lib/isEmpty";

const ObjectId = mongoose.Types.ObjectId;

/**
 * Create New User Reference Modal
 */
export const newUsrReference = (id) => {
  let newDoc = new UserReference({
    _id: id,
  });

  newDoc.save((err, data) => {
    if (err) {
      return console.log("Error on create reference", err.toString());
    }
    return console.log("Reference Create Successfully");
  });
};

/**
 * Add new child
 */
export const addChild = async (childDoc) => {
  try {
    if (isEmpty(childDoc)) {
      return false;
    }
    let parentDoc = await User.findOne({ userId: childDoc.referenceCode });
    if (!parentDoc) {
      return false;
    }
    await UserReference.findOneAndUpdate(
      {
        _id: parentDoc._id,
      },
      {
        $push: {
          referChild: {
            _id: childDoc._id,
            date: new Date(),
            amount: 0,
          },
        },
      },
      { upsert: true }
    );
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Referral History
 * URL : /api/referralHist
 * METHOD : GET
 */
export const referralHist = (req, res) => {
  UserReference.aggregate(
    [
      { $match: { _id: ObjectId(req.user.id) } },
      { $unwind: "$referChild" },
      {
        $lookup: {
          from: "user",
          localField: "referChild._id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          refEmail: "$userInfo.email",
          date: "$referChild.date",
          amount: "$referChild.amount",
        },
      },
    ],
    (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({ status: false, message: "Something went wrong" });
      }
      return res.status(200).json({ status: true, result: data });
    }
  );
};

export const transList = async (req, res) => {
  try {
    console.log(req.user.id, "reqqqqqqqqqqqqqq");
    let datas = await User.findOne({ _id: req.user.id }, { userId: 1 });
    console.log(datas, "----datas");
    let checkdata = await Transaction.findOne(
      { userId: datas.userId },
      { paymentType: 1 }
    );
    return res.status(200).json({ status: true, result: checkdata });
  } catch (err) {
    console.log(err, "error");
  }
};

/**
 * User Referral History
 * URL : /adminapi/referralHist
 * METHOD : GET
 */
export const usrReferralHist = (req, res) => {
  let reqBody = req.body;
  UserReference.aggregate(
    [
      { $match: { _id: ObjectId(reqBody.id) } },
      { $unwind: "$referChild" },
      {
        $lookup: {
          from: "user",
          localField: "referChild._id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          refEmail: "$userInfo.email",
          date: "$referChild.date",
          amount: "$referChild.amount",
        },
      },
    ],
    (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({ status: false, message: "Something went wrong" });
      }
      return res.status(200).json({ status: true, result: data });
    }
  );
};
