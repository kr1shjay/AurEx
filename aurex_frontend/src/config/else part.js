//admin panel
else {
    console.log("Set Development Config")
    const API_URL = 'http://localhost';
    key = {
        secretOrKey: "FxUum76z",
        Recaptchakey: "6LeHezUfAAAAAE_uuY_HFN5HoEVsQv8bpyC3xTat", //local
        API_URL: `${API_URL}:2053`,
        TRADE_URL: 'http://54.211.230.83:8081/api/trade',

        getGeoInfo: "https://ipapi.co/json/",

        socialMedia: {
            facebook: {
                appId: "1034988646970193"
            },
            linkedIn: {
                clientId: '78szlpfkw7ee7s',
                redirectUrl: 'https://99893158a13c.ngrok.io/signup',
                oauthUrl: 'https://www.linkedin.com/oauth/v2/authorization?response_type=code',
                scope: 'r_liteprofile%20r_emailaddress',
                state: '123456'
            }
        },

    };
}
//backend
else {
    console.log("\x1b[35m%s\x1b[0m", `Set Development Config`);
    const API_URL = "http://localhost";
    const PORT = 2053;
    key = {
      SITE_NAME: "CluxChange",
      secretOrKey: "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3",
      cryptoSecretKey: "1234567812345678",
      // DATABASE_URL: "mongodb://localhost:27017/cluxold",
      DATABASE_URL: "mongodb://localhost:27017/CluxChange",
  
      // DATABASE_URL: "mongodb://cluxdb:Fvdhcdcedhf6wed34sxdz@172.105.40.100:10730/cluxdb",
      // DATABASE_URL: "mongodb://clux:Password__2022__PasworD@23.239.23.84:10330/clux",
      RUN_CRON: false,
      PORT: PORT,
      FRONT_URL: "http://localhost:3000",
      ADMIN_URL: "http://localhost:3000/admin",
      SERVER_URL: `${API_URL}:${PORT}`,
      RECAPTCHA_SECRET_KEY: "6LeHezUfAAAAABKS-mUfSrqlHD9jBQbmevozwzgr",
  
      NUM_VERIFY: {
        API_KEY: "",
      },
  
      //Sms GateWay
      smsGateway: {
        TWILIO_ACCOUT_SID: "AC4d78592207e69542cefd5388ea3993b8",
        TWILIO_AUTH_TOKEN: "c8d4b4d1b00406e5a906d0275d52a1b4",
        TWILIO_PHONE_NUMBER: "+12055390747",
        TWILIO_SERVICE_SID: "VA62d3e1146360cde9289bb8c26e098d1d",
      },
  
      //EnailGateWay
      // emailGateway: {
      //     SENDGRID_API_KEY: 'G2_6DHfmSaWcrRQ1RxTHrQ',
      //     fromMail: "mailto:support@alwin.com",
      //     nodemailer: {
      //         host: "smtp.gmail.com",
      //         port: 587,
      //         secure: false, // true for 465, false for other ports
      //         auth: {
      //             user: 'mailto:ajith@britisheducationonline.org', // generated ethereal user
      //             pass: 'Ajith@97', // generated ethereal password
      //         },
      //     }
      // },
  
      IMAGE: {
        DEFAULT_SIZE: 1  *1024 * 1024, // 1 MB,
        URL_PATH: "/images/profile/",
        PROFILE_SIZE: 1 * 1024  *1024, // 1 MB
        PROFILE_PATH: "public/profile",
        PROFILE_URL_PATH: "/profile/",
  
        ID_DOC_SIZE: 12  *1024 * 1024, // 12 MB,
        KYC_PATH: "public/images/kyc",
        KYC_URL_PATH: "/images/kyc/",
        CMS_PATH: "public/images/cms/",
  
        CURRENCY_SIZE: 0.02  *1024 * 1024, // 20 KB
        CURRENCY_PATH: "public/images/currency",
        CURRENCY_URL_PATH: "/images/currency/",
        DEPOSIT_PATH: "public/deposit",
        DEPOSIT_URL_PATH: "/deposit/",
        SETTINGS_URL_PATH: "public/settings",
        LAUNCHPAD_SIZE: 20 * 1024 * 1024, // 500 KB
        LAUNCHPAD_PATH: "public/launchpad",
        LAUNCHPAD_URL_PATH: "/launchpad/",
        SUPPORT_PATH: "public/images/support",
        SUPPORT_URL_PATH: "/images/support/",
        ACCOUMENT_PATH:"public/images/anouncement",
        ACCOUMENT_URL_PATH:"/anouncement/",      
  
        P2P_SIZE: 2  *1024 * 1024, // 2 MB
        P2P_PATH: "public/p2p",
        P2P_URL_PATH: "/p2p/",
      },
  
      WAZIRIX: {
        API: "vcvdffs1212", //using for orderplace
        SECRET: "12323232323", //using for orderplace
      },
  
      NODE_TWOFA: {
        NAME: "Clux Exchange",
        QR_IMAGE:
          "https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=",
      },
  
      COIN_GATE_WAY: {
        BTC: {
          URL: "http://45.79.42.88:3000",
        },
        LTC: {
          URL: "http://104.237.132.25:3000",
        },
        DOGE: {
          URL: "http://45.33.1.14:3000",
        },
        ETH: {
          URL: "http://173.230.156.107:3000",
        },
        BNB: {
          URL: "https://data-seed-prebsc-1-s1.binance.org:8545",
          START_BLOCK: 0,
          DEPOSIT_URL:
            "https://api-testnet.bscscan.com/api?module=account&action=txlist&address=##USER_ADDRESS##&startblock=##START_BLOCK##&endblock=##END_BLOCK##&sort=asc&apikey=15YENF4YFTS1N8SWJWX8X4WTKTM17M8I49",
          DEPOSIT_TOKEN_URL:
            "https://api-testnet.bscscan.com/api?module=account&action=tokentx&address=##USER_ADDRESS##&startblock=##START_BLOCK##&endblock=##END_BLOCK##&sort=asc&apikey=15YENF4YFTS1N8SWJWX8X4WTKTM17M8I49",
          NETWORK_ID: 97,
          CHAIN_ID: 97,
          ADDRESS: "0x836f583975FFC53599Eb07619e7D514d1FF5Bf62",
          PRIVATE_KEY:
            "U2FsdGVkX1++Gdq0OxzFCBSMsq+gceH7PskUPhYo4A+1t2qoE5ipcrsu6Xw0XOhIqNGR3TAFOhvaZxAVpWBiX1/N+TUWWHyl8rbimH6XgHXeArhrN7EXKpm/2lXAU6h9",
          // privateKey: 'U2FsdGVkX1+/WJmhPLIsNFWGGR4QO8trtIhrljMvR3opvf3DStEFHskqSBrNTwUHVOF2Y9/ddiVL7TDpYijbBMxsWX0OSddX4uM2X/BBhtD93s9G89xv7460U8ea7N4o',
        },
        XRP: {
          URL: "wss://s1.ripple.com",
          ADDRESS: "rKJfjNZporeg4AMZAczpTkVyTwWbVzy1if",
          PRIVATE_KEY:
            "U2FsdGVkX1/TinQdTyZCjQ5xfbhvxYUqnOMPCYJ2ufGr3zzzKDeP6T6qBMCT4/O6",
        },
        ETC: {
          URL: "http://173.255.221.129:3000",
        },
        TRON: {
          FULLNODE: "https://api.shasta.trongrid.io",
          SOLIDITYNODE: "https://api.shasta.trongrid.io",
          EVENTSERVER: "https://api.shasta.trongrid.io",
          contractAddress: "TTtYtVVekf9GG3UvmZouKeeEao8HFe1AcA",
          PRIVATEKEY:
            "U2FsdGVkX1+/1hKILbKT3dz4lt/P8xtGLR6hmvkm5azp5PaCIUtDa53HGxoLh+XQOVqMORbjdgvAjxt6FNtePjmov7t+wGfOQHRZSzh0ZN4iRciSDnveGYDGJbMvxn6g",
          ADDRESS: "TKSjgi7i4MX5Bg1NBtKA5XD7c8vmqE2BHF",
          TRANSACTIONURL:
            "https://api.shasta.trongrid.io/v1/accounts/##USER_ADDRESS##/transactions?only_to=true&limit=50",
          TRANSACTIONCONTRACTURL:
            "https://api.shasta.trongrid.io/v1/accounts/##USER_ADDRESS##/transactions/trc20?limit=100&contract_address=##CONTRACT_ADDRESS##",
          DECIMAL: 100000000, //8
          TRONDECIMAL: 1000000, //6
          ADMINAMTSENTTOUSER: 2.00004,
        },
      },
  
      coinGateway: {
        eth: {
          url: "http://139.162.1.152:3000",
          startBlock: 11504800,
          address: "0x836f583975FFC53599Eb07619e7D514d1FF5Bf62",
          privateKey:
            "U2FsdGVkX1+qPHe80YXasGLBvZaovbS0o8AShWZrDZ4ja2Xt3j553iM260o+sJFjyZTC2ohXhwGK91MyTAaITTn3iq2kZs8wroYiQ5QkGJM+x3+MAgSskcFJLxGP1PfP",
          etherscanUrl: "https://api.etherscan.io/api?", // https://api-ropsten.etherscan.io/api?
          ethDepositUrl:
            "https://api-ropsten.etherscan.io/api?module=account&action=txlist&address=##USER_ADDRESS##&startblock=##START_BLOCK##&endblock=##END_BLOCK##&sort=asc&apikey=CSM5YXQG5MTE8XWM57UWH6DBXQRS8SQP3K",
          ethTokenDepositUrl:
            "https://api-ropsten.etherscan.io/api?module=account&action=tokentx&address=##USER_ADDRESS##&startblock=##START_BLOCK##&endblock=##END_BLOCK##&sort=asc&apikey=CSM5YXQG5MTE8XWM57UWH6DBXQRS8SQP3K",
        },
        btc: {
          url: "http://3.1.6.100:3003",
        },
        tron: {
          fullNode: "https://api.shasta.trongrid.io",
          solidityNode: "https://api.shasta.trongrid.io",
          eventServer: "https://api.shasta.trongrid.io",
          contractAddress: "TTtYtVVekf9GG3UvmZouKeeEao8HFe1AcA",
          privateKey:
            "U2FsdGVkX1+/1hKILbKT3dz4lt/P8xtGLR6hmvkm5azp5PaCIUtDa53HGxoLh+XQOVqMORbjdgvAjxt6FNtePjmov7t+wGfOQHRZSzh0ZN4iRciSDnveGYDGJbMvxn6g",
          address: "TKSjgi7i4MX5Bg1NBtKA5XD7c8vmqE2BHF",
          transactionUrl:
            "https://api.shasta.trongrid.io/v1/accounts/##USER_ADDRESS##/transactions?only_to=true&limit=50",
          transactionContractUrl:
            "https://api.shasta.trongrid.io/v1/accounts/##USER_ADDRESS##/transactions/trc20?limit=100&contract_address=##CONTRACT_ADDRESS##",
          decimal: 100000000, //8
          tronDecimal: 1000000, //6
          adminAmtSentToUser: 2.00004,
        },
      },
  
      BINANCE_GATE_WAY: {
        API_KEY: "",
        API_SECRET: "",
        // API_KEY: 'LohrjuucqdzFKCoNGm2Uku7aw9uaIh1jyVD5wAOxuZZP6uW4RBqbXCxdgiIB2GTr',
        // API_SECRET: 'qFNvYopTOmf9LBhgJvKDvuU46k5jCJoTOJTsRN2yxxesdspXjYpxdch3WMqFhZZD',
      },
      coinpaymentGateway: {
        PUBLIC_KEY:
          "9458d22b0afe1f705a6bff34232b482b383759a19773d280cbe98978da21fe72",
        PRIVATE_KEY:
          "1449dcd2e83623535753e5B8A0Ee05d9d418855f4ca3ceeb9251aB6Fd54a1CD7",
        IPN_SECRET: "testing",
        MERCHANT_ID: "c5079ace09de33613f7ca7aab790a658",
      },
      CLOUDINARY_GATE_WAY: {
        CLOUD_NAME: "",
        API_KEY: "",
        API_SECRET: "",
      },
      COINMARKETCAP: {
        API_KEY: "",
        PRICE_CONVERSION: "",
      },
    };
  }
//front end 
//else if (process.env.REACT_APP_MODE === "demo") {
//     console.log("Set Demo Config")
//     const API_URL = 'https://aurex.maticz.com/api';

//     key = {
//         secretOrKey: "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3",
//         CRYPTO_SECRET_KEY: "1234567812345678",
//         RECAPTCHA_SITE_KEY: "6Lc0jA4jAAAAADmNtnnGw7Px86Pscz2sgpavPIcn", //local
//         API_URL: 'https://aurex.maticz.com/api',
//         FRONT_URL: 'https://aurex.maticz.com',
//         ADMIN_URL: 'https://aurex.maticz.com/admin',
//         SOCKET_URL: 'https://aurex.maticz.com/api',
//         getGeoInfo: "https://ipapi.co/json/",
//         AUTHENTICATOR_URL: {
//             PLAY_STORE: "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2",
//             APP_STORE: "https://apps.apple.com/us/app/google-authenticator/id388497605",
//         }
//     };

//} 
else {
    console.log("Set Development Config")
    // const API_URL = 'https://api.cluxchange.com/';
    const API_URL ='http://localhost'// 'http://localhost' 'http://192.168.0.124';  //http://192.168.29.63:3000/  http://192.168.0.124
    key = {
        secretOrKey: "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3",
        CRYPTO_SECRET_KEY: "1234567812345678",
        RECAPTCHA_SITE_KEY: "6LeHezUfAAAAAE_uuY_HFN5HoEVsQv8bpyC3xTat", //local
        API_URL: `${API_URL}:2053`,
        FRONT_URL: 'http://localhost', //'http://localhost:3000',
        ADMIN_URL: 'http://localhost:3001/admin',
        SOCKET_URL: `${API_URL}:2053`,
        getGeoInfo: "https://ipapi.co/json/",
        AUTHENTICATOR_URL: {
            PLAY_STORE: "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2",
            APP_STORE: "https://apps.apple.com/us/app/google-authenticator/id388497605",
        }
    };
}

