//import npm package
const
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

//import function
import config from './index';


var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretOrKey;
opts.passReqToCallback = true

//import model
import { UserToken, Admin, ApiKey } from '../models';

export const usersAuth = (passport) => {
        //  console.log("demo passport >>>>>>>>>>>>>>>>>>>>>>",passport)
   passport("usersAuth",
        new JwtStrategy(opts, async function (req,jwt_payload, done) {
            try {
                // console.log(req.rawHeaders[1],'passport >>>>>>>>>>>>>>>>>>>>>>')
                this.getToken = ExtractJwt.fromHeader('authorization')
                // console.log(this.getToken,"auth777")
                this.token = this.getToken(req)
                let userDoc = await UserToken.findOne({ 'userId': jwt_payload._id, 'token': this.token }).populate({ path: "userId", select: "_id userId type email google2Fa status" })
                if (userDoc && userDoc.userId && userDoc.userId.status == 'verified') {
                    let data = {
                        id: userDoc.userId._id,
                        userId: userDoc.userId.userId,
                        type: userDoc.userId.type,
                        email: userDoc.userId.email,
                        google2Fa: userDoc.userId.google2Fa
                    }
                    return done(null, data);
                }
               

            } catch (err) {
                console.log(err,'passport >>>>>>>>>>>>>>>>>>>>>>')
                return done(null, false)
            }

            

            //     console.log("demochecking")
            //     // req.headers["api-key"]
            //     this.secretKey = ExtractJwt.fromHeader('api-key')
            //     console.log(this.secretKey,"secretkey")
            //     let userDetails = await ApiKey.findOne({'keyId' : jwt_payload._id}).populate({ path: "userId", select:"_id userId type email google2Fa status"})
            //     if(userDetails && userDetails.userId.status == 'verified'){
            //         let datas = {
            //             id: userDetails.userId._id,
            //             userId: userDetails.userId.userId,
            //             type: userDetails.userId.type,
            //             email: userDetails.userId.email,
            //             google2Fa: userDetails.userId.google2Fa,
            //             withdraw: userDetails.withdraw,
            //             deposit: userDetails.deposit,
            //             trade: userDetails.trade
                       
            //         }
            //         return done(null, datas);
            //     }
            //     else{
            //       return done(err, false) 
            //     }
            // }
                // if() extract api-key
                // apikey findOne (key : key)
                // user id 
                // userDoc
                // done
                //else
                // return done(err, false)
            

            // User.findById(jwt_payload._id, function (err, user) {
            //     if (err) { return done(err, false) }
            //     else if (user) {
            //         let data = {
            //             id: user._id,
            //             userId: user.userId,
            //             type: user.type,
            //             email: user.email,
            //             google2Fa: user.google2Fa,
            //         }
            //         return done(null, data);
            //     }
            //     return done(null, false)
            // })
        })
    
    )
}

export const adminAuth = (passport) => {
    passport.use("adminAuth",
        new JwtStrategy(opts, async function (req,jwt_payload, done) {
            Admin.findById(jwt_payload._id, function (err, user) {
                if (err) { return done(err, false) }
                else if (user) {
                    let data = {
                        id: user._id,
                    }
                    return done(null, data);
                }
                return done(null, false)
            })
        })
    )
}

