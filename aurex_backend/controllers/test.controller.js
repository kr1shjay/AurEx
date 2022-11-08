// import package
import axios from 'axios'
import fs from 'fs'
import nacl from 'tweetnacl'
import CryptoJS from 'crypto-js'
import { createHash } from '../lib/crypto'

// import model
import {
    User
} from '../models'

export const createUser = async (req, res) => {
    try {
        res.send('success')
        for (let i = 0; i < 2000; i++) {
            var randomstring = Math.random().toString(36).slice(-8);
            // console.log("-----i", i)
            let reqData = {
                'email': `${randomstring}@yopmail.com`,
                'password': "Test@123",
                'confirmPassword': 'Test@123',
                'referalcode': '',
                'langCode': 'en',
                'reCaptcha': '',
                'isTerms': 'true',
            }


            let respData = await axios({
                'url': 'http://192.168.29.63:2053/api/register',
                'method': 'post',
                data: reqData
            })
            console.log("-----respData", respData.data)
        }


    } catch (err) {
    }
}

export const getJWTToken = async (rea, res) => {
    let userData = await User.find()
    let arr = [];
    for (let item of userData) {
        let payloadData = {
            "_id": item._id
        }
        let token = new User().generateJWT(payloadData);
        arr.push('"' + token + '"')
    }

    // var log_file = "log/common_log_" + ".txt";
    // fs.appendFileSync(log_file, arr);

    fs.writeFileSync("programming.txt", arr);

    console.log("----arr", arr.toString())
}

// getJWTToken()




// const crypto = require("crypto");

// // The `generateKeyPairSync` method accepts two arguments:
// // 1. The type ok keys we want, which in this case is "rsa"
// // 2. An object with the properties of the key
// const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
//     // The standard secure default length for RSA keys is 2048 bits
//     modulusLength: 2048,
// });

// console.log("------publicKey", publicKey)
// console.log("------privateKey", privateKey)


// const data = "my secret data";

// const encryptedData = crypto.publicEncrypt(
//     {
//         key: publicKey,
//         padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
//         oaepHash: "sha256",
//     },
//     // We convert the data string to a buffer using `Buffer.from`
//     Buffer.from(data)
// );

// // The encrypted data is in the form of bytes, so we print it in base64 format
// // so that it's displayed in a more readable form
// console.log("encypted data: ", encryptedData.toString("base64"));


// const decryptedData = crypto.privateDecrypt(
//     {
//         key: privateKey,
//         // In order to decrypt the data, we need to specify the
//         // same hashing function and padding scheme that we used to
//         // encrypt the data in the previous step
//         padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
//         oaepHash: "sha256",
//     },
//     encryptedData
// );

// // The decrypted data is of the Buffer type, which we can convert to a
// // string to reveal the original data
// console.log("decrypted data: ", decryptedData.toString());

// 2FMDFzzfQzK-0at1abEPvreC
// nOuG1Vp3v9wS9QjVdOYEI3_qqUD4YU0kwPnPfkfFhAI27gbX

// var keyPair = nacl.sign.keyPair();
// var secretKey = keyPair.secretKey;
// var publicKey = keyPair.publicKey;
// var msgStr = "The quick brown fox jumps over the lazy dog";
// var msg = nacl.util.decodeUTF8(msgStr);
// var signature = nacl.sign(msg, secretKey);
// var signatureB64 = nacl.util.encodeBase64(signature);
// console.log(signatureB64.replace(/(.{64})/g, '$1\n')); // Display signature plus message (Base64 encoded)
// var signatureMsgPart = signature.slice(64);
// console.log(nacl.util.encodeUTF8(signatureMsgPart));  // Display message from nacl.sign() return value: signing is not for encryption!
// var verifiedMsg = nacl.sign.open(signature, publicKey);
// console.log(nacl.util.encodeUTF8(verifiedMsg));

import { generateKeyPairSync } from 'crypto'


// const {
//     publicKey,
//     privateKey,
// } = generateKeyPairSync('rsa', {
//     modulusLength: 4096,
//     publicKeyEncoding: {
//         type: 'spki',
//         format: 'der'
//     },
//     privateKeyEncoding: {
//         type: 'pkcs8',
//         format: 'der',
//         cipher: 'aes-256-cbc',
//         passphrase: 'top secret'
//     }
// });

// console.log("-----publicKey", privateKey.toString('utf8'))
// console.log("-----privateKey", publicKey)

// console.log("-----test")

// console.log("------KEY---", 'u5xBKWSd4apu7OXsFg1uBFRoZSBxdWljayBicm93biBmb3gganVtcHMgb3ZlciB0'.length)
// console.log("--------sect", 'w7oKfiakpsGUsjXvRHMJBOY796lHVZXLgOZBL9SHg07Z4r6f579pjfecBLdlUGGa'.length)

// console.log("--------id-----bitmax", '2FMDFzzfQzK-0at1abEPvreC'.length)
// console.log("--------sect-----bitmax", 'dgf9_KaPYQPuUoS_Gr5zzMqsraBiIbHm06Xbh3CtX3S7TyNh'.length)



/* ****************************************************CRYPTO********************************************* */

const crypto = require("crypto");

// const {
//     publicKey,
//     privateKey,
// } = generateKeyPairSync('rsa', {
//     modulusLength: 4096,
//     publicKeyEncoding: {
//         type: 'spki',
//         format: 'der'
//     },
//     privateKeyEncoding: {
//         type: 'pkcs8',
//         format: 'der',
//         cipher: 'aes-256-cbc',
//         passphrase: 'top secret'
//     }
// });


// for (let i = 0; i < 10; i++) {
//     require('crypto').randomBytes(32, function (err, buffer) {
//         var token = buffer.toString('hex');
//         console.log("-----token", token, token.length)
//     });
// }

// const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
//     // The standard secure default length for RSA keys is 2048 bits
//     modulusLength: 2048,
//   });

// let privateKey1 = 'e560ddb663ba0dcd18d581157182db70022151965b4b1e8b244c2a1a07711434';

let privateKey1 = 'BAFbS5rPu12kdkiHe8cpqe0JQxdg9LZsPpui+CoiF1WVKraOhfA019M5GeXM3ch9LGu/EVtIJA4U2TpF8fTfKuhQpQEyCv9Pow+mHVJR7ae5mLvhbREm4XOMAlE8/QbmXHadyrfjuJstdE8xfsyJk4OwwZFK9FgodPtrN2AE4QKrPX2rsg==';
let privateKey2 = 'AwCE7CY9RzMSrGD1EIeE0JKkTW+XsScSEAZiRx53hX78UzO4Xzh1IFqAdMCe/3r/ZSmoUXyCXFaOD7hDGAdta+0gfg==';

let payload = {
    'test': 1,
};

if (payload.constructor === Object) {
    payload = JSON.stringify(payload);
}

if (payload.constructor !== Buffer) {
    payload = Buffer.from(payload, 'utf8');
}

const signature = crypto.createHash('sha256');
signature.update(payload);
signature.update(new Buffer.from(privateKey1, 'utf8'));

// console.log("----signature.digest('hex')", signature.digest('hex'))


const signature1 = crypto.createHash('sha256');
signature1.update(payload);
signature1.update(new Buffer.from(privateKey2, 'utf8'));

// console.log("----signature1.digest('hex')", signature1.digest('hex'))

// const crypto = require('crypto');

const secret = 'abcdefg';
const hash = crypto.createHmac('sha256', secret)
    .update('I love cupcakes')
    .digest('hex');
// console.log("-------------hash--------", hash)

const createHmacString = (privateKey, ts) => {
    const key = CryptoJS.enc.Utf8.parse(privateKey)
    const timestamp = CryptoJS.enc.Utf8.parse(ts)
    const hmac = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(timestamp, key))

    //  const hmac = CryptoJS.HmacSHA256(ts, privateKey).toString(CryptoJS.enc.Hex)
    return hmac;
}

let ts = new Date().getTime();
let signature2 = createHmacString("your-private-key", ts);

// console.log("------signature1", signature2)
// Generate an ECDH object for geekA
// const geekA = crypto.createECDH('secp521r1');

// // Generate keys for geekA in base64 encoding
// const geekAkey = geekA.generateKeys('base64');

// console.log("Public Key of Geek A is:", geekAkey);

// // Generate an ECDH object for geekB
// const geekB = crypto.createECDH('secp521r1');

// // Generate keys for geekB in base64
// // encoding and compressed
// const geekBkey = geekB.generateKeys('base64', 'compressed');

// console.log("Public Key of Geek B is:", geekBkey);

//c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e
//c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e

// 8f8d9a5dfdd587af6b05ed5e56194bb773aca78a07dd2ad4f6620748ab608783
// 8f8d9a5dfdd587af6b05ed5e56194bb773aca78a07dd2ad4f6620748ab608783
// const { KeyObject } = require('crypto')
// let data1 = crypto.createSecretKey(Buffer.from('test'))
// console.log("----test", data1, KeyObject.from(data1))

// require('crypto').randomBytes(32, function (err, buffer) {
//     var token = buffer.toString('hex');
//     console.log("-----token", token, token.length)
// });


// require('crypto').randomBytes(32, function (err, buffer) {
//     var token = buffer.toString('hex');
//     console.log("-----token", token, token.length)
// });


export const v1GenerateSign = (payload = '') => {

    const qs = require(`querystring`);
    console.log("-------payload", payload)
    const paramString = qs.stringify(payload).replace(/%20/g, `+`);
    console.log("-------paramString", paramString)
    const calcHmac = crypto
        .createHmac(`sha512`, 'testing')
        .update(paramString)
        .digest(`hex`);
    console.log("-------calcHmac", calcHmac)
    // console.log("-------hmac", hmac)


}


let payloadData = { "address": "TNfZYzjcsvC1hrTNtTqwosoponAcHvScXA", "amount": "2.00000000", "amounti": "200000000", "confirms": "4", "currency": "TRX", "deposit_id": "CDFKIF3KY5UHK2YF2I3MFLIH7O", "fiat_amount": "0.20662340", "fiat_amounti": "20662340", "fiat_coin": "USD", "ipn_id": "de4b65f7a05b4463e8f10fe204250a67", "ipn_mode": "hmac", "ipn_type": "deposit", "ipn_version": "1.0", "label": "GM-TEST_TRX", "merchant": "c5079ace09de33613f7ca7aab790a658", "status": "0", "status_text": "Deposit seen on network, but not confirmed", "txn_id": "133122a5f57a79220b72c6d189b8f15045c673e5520baed04a1fb14ce6140821" }



let header = { "host": "3.142.137.131:2053", "user-agent": "CoinPayments.net IPN Generator", "accept": "*/*", "hmac": "c572ed00f242e714d947d6b832aba699efbc6002fc0c80f1c7859b356636989613479a738f61a211992d00baa6c860edfad7e151cad383f530d596077f7629b7", "content-type": "application/x-www-form-urlencoded; charset=utf-8", "content-length": "484" }


console.log("-----newDate",new Date(1640197800000))
// v1GenerateSign(payloadData)

// https://stackoverflow.com/questions/66469430/how-to-ref-to-multiple-models-mongoose-mongodb