let key = {};
// empty string
if (process.env.NODE_ENV === "production") {
  console.log("\x1b[35m%s\x1b[0m", `Set Production Config`);

  const API_URL = "https://api.aurexchange.com";
  const PORT = 2053;
  key = {
    SITE_NAME: "Aurexchange",
    secretOrKey: "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3",
    cryptoSecretKey: "1234567812345678",
    DATABASE_URL:
    "mongodb://NcgFbT:xMAgsK@139.162.66.242:53818/wXZeko",
    RUN_CRON: true,
    PORT: PORT,
    FRONT_URL: "https://aurexchange.com",
    ADMIN_URL: "https://contorls.aurexchange.com",
    SERVER_URL: `${API_URL}`,
    IMAGE_URL: `${API_URL}`,
    RECAPTCHA_SECRET_KEY: "6LfCM7kgAAAAABRF1c3QnDWCs_TEqyKOI_6Su_B9",
    NUM_VERIFY: {
      API_KEY: "",
    },

    //Sms Gateway
    smsGateway: {
      TWILIO_ACCOUT_SID: "AC7654c3f84cd47fcd7f24498864a90b57",
      TWILIO_AUTH_TOKEN: "6edafaafac25137753acfa2f75593aba",
      TWILIO_PHONE_NUMBER: "+16402306943",
      TWILIO_SERVICE_SID: "VA0458e76ca85dddadfddcf5acad39709d",
    },
    // SENDIN_BLUE_ADDRESS: {
    //     USER_NAME: "support",
    //     EMAIL: 'mailto:support@coingoldx.com',
    //     API_KEY: ' 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',
    // },

    // Email Gateway
    // emailGateway: {
    //     SENDGRID_API_KEY: 'G2_6DHfmSaWcrRQ1RxTHrQ',
    //     fromMail: "support@alwin.com",
    //     nodemailer: {
    //         host: "smtp.gmail.com",
    //         port: 587,
    //         secure: false, // true for 465, false for other ports
    //         auth: {
    //             user: 'ajith@britisheducationonline.org', // generated ethereal user
    //             pass: 'Ajith@97', // generated ethereal password
    //         },
    //     }
    // },

    IMAGE: {
      DEFAULT_SIZE: 1 * 1024 * 1024, // 1 MB,
      PROFILE_SIZE: 1 * 1024 * 1024, // 1 MB
      PROFILE_PATH: "public/profile",
      PROFILE_URL_PATH: "/profile/",
      URL_PATH: "/images/profile/",
      KYC_PATH: "public/images/kyc",
      KYC_URL_PATH: "/images/kyc/",
      CMS_PATH: "public/images/cms/",
      CURRENCY_SIZE: 0.5 * 1024 * 1024, // 500 KB
      CURRENCY_PATH: "public/images/currency",
      CURRENCY_URL_PATH: "/images/currency/",
      DEPOSIT_PATH: "public/deposit",
      DEPOSIT_URL_PATH: "/deposit/",
      SETTINGS_URL_PATH: "public/settings",
      LAUNCHPAD_SIZE: 20 * 1024 * 1024, // 20 MB
      LAUNCHPAD_PATH: "public/launchpad",
      LAUNCHPAD_URL_PATH: "/launchpad/",
      SUPPORT_PATH: "public/images/support",
      SUPPORT_URL_PATH: "/images/support/",
      P2P_SIZE: 2 * 1024 * 1024, // 2 MB
      P2P_PATH: "public/p2p",
      P2P_URL_PATH: "/p2p/",
    },
    WAZIRIX: {
      API: "34234rff", //using for orderplace
      SECRET: "dfdsff333333", //using for orderplace
    },

    NODE_TWOFA: {
      NAME: "Aurexchange",
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
        ADDRESS: "0x836f583975FFC53599Eb07619e7D514d1FF5Bf62",
        PRIVATE_KEY:
          "U2FsdGVkX1++Gdq0OxzFCBSMsq+gceH7PskUPhYo4A+1t2qoE5ipcrsu6Xw0XOhIqNGR3TAFOhvaZxAVpWBiX1/N+TUWWHyl8rbimH6XgHXeArhrN7EXKpm/2lXAU6h9",
      },
      BNB: {
        URL: "https://bsc-dataseed.binance.org/",
        START_BLOCK: 0,
        DEPOSIT_URL:
          "https://api.bscscan.com/api?module=account&action=txlist&address=##USER_ADDRESS##&startblock=##START_BLOCK##&endblock=##END_BLOCK##&sort=asc&apikey=EWRUSHE7B64KNR5S5J7IQBT43PSTXTWHSI",
        DEPOSIT_TOKEN_URL:
          "https://api.bscscan.com/api?module=account&action=tokentx&address=##USER_ADDRESS##&startblock=##START_BLOCK##&endblock=##END_BLOCK##&sort=asc&apikey=EWRUSHE7B64KNR5S5J7IQBT43PSTXTWHSI",
        NETWORK_ID: 56,
        CHAIN_ID: 56,
        ADDRESS: "0x836f583975FFC53599Eb07619e7D514d1FF5Bf62",
        PRIVATE_KEY:
          "U2FsdGVkX1++Gdq0OxzFCBSMsq+gceH7PskUPhYo4A+1t2qoE5ipcrsu6Xw0XOhIqNGR3TAFOhvaZxAVpWBiX1/N+TUWWHyl8rbimH6XgHXeArhrN7EXKpm/2lXAU6h9",
      },
      XRP: {
        URL: "wss://s1.ripple.com",
        ADDRESS: "rKJfjNZporeg4AMZAczpTkVyTwWbVzy1if",
        PRIVATE_KEY:
          "U2FsdGVkX1/TinQdTyZCjQ5xfbhvxYUqnOMPCYJ2ufGr3zzzKDeP6T6qBMCT4/O6",
      },
      TRON: {
        FULLNODE: "https://api.trongrid.io",
        SOLIDITYNODE: "https://api.trongrid.io",
        EVENTSERVER: "https://api.trongrid.io",
        contractAddress: "TBpfYjBhLTRW5cFKtLkqG2XvJwRjqSaXyU",
        PRIVATEKEY:
          "U2FsdGVkX1804FveNbJaF1sGyBEtiW76UF2TDxLlzi0lk63z7Bcs1RIAcpVF9Fk8Am97h1ukICcG9EGCmTfvaRM50C0cfuOuQ3M0RfIFs+jrJUOBAh85/wOE+ogOmNgr",
        ADDRESS: "TKfmsKc7RFjNHGAJf8WUVLxhoEixySpwyk",
        TRANSACTIONURL:
          "https://api.trongrid.io/v1/accounts/##USER_ADDRESS##/transactions?only_to=true&limit=50",
        TRANSACTIONCONTRACTURL:
          "https://api.trongrid.io/v1/accounts/##USER_ADDRESS##/transactions/trc20?limit=100&contract_address=##CONTRACT_ADDRESS##",
        DECIMAL: 100000000, //8
        TRONDECIMAL: 1000000, //6
        ADMINAMTSENTTOUSER: 10,
      },
    },

    coinGateway: {
      eth: {
        url: "http://139.162.1.152:3000",
        startBlock: 11504800,
        mode: "ropsten", // ropsten
        address: "0x836f583975FFC53599Eb07619e7D514d1FF5Bf62",
        privateKey:
          "U2FsdGVkX1+qPHe80YXasGLBvZaovbS0o8AShWZrDZ4ja2Xt3j553iM260o+sJFjyZTC2ohXhwGK91MyTAaITTn3iq2kZs8wroYiQ5QkGJM+x3+MAgSskcFJLxGP1PfP",
        etherscanUrl: "https://api.etherscan.io/api?", // https://api-ropsten.etherscan.io/api?
        ethDepositUrl:
          "https://api.etherscan.io/api?module=account&action=txlist&address=##USER_ADDRESS##&startblock=##START_BLOCK##&endblock=##END_BLOCK##&sort=asc&apikey=CSM5YXQG5MTE8XWM57UWH6DBXQRS8SQP3K",
        ethTokenDepositUrl:
          "https://api.etherscan.io/api?module=account&action=tokentx&address=##USER_ADDRESS##&startblock=##START_BLOCK##&endblock=##END_BLOCK##&sort=asc&apikey=CSM5YXQG5MTE8XWM57UWH6DBXQRS8SQP3K",
      },
      btc: {
        url: "http://3.1.6.100:3003",
      },
      tron: {
        fullNode: "https://api.trongrid.io",
        solidityNode: "https://api.trongrid.io",
        eventServer: "https://api.trongrid.io",
        contractAddress: "TBpfYjBhLTRW5cFKtLkqG2XvJwRjqSaXyU",
        privateKey:
          "U2FsdGVkX1804FveNbJaF1sGyBEtiW76UF2TDxLlzi0lk63z7Bcs1RIAcpVF9Fk8Am97h1ukICcG9EGCmTfvaRM50C0cfuOuQ3M0RfIFs+jrJUOBAh85/wOE+ogOmNgr",
        // privateKey: "45365BE9280C6066E65857004F932DE9A90F7EF60387533D6AFFDB4A3608A2AC", // original privatekey
        address: "TKfmsKc7RFjNHGAJf8WUVLxhoEixySpwyk",
        transactionUrl:
          "https://api.trongrid.io/v1/accounts/##USER_ADDRESS##/transactions?only_to=true&limit=50",
        transactionContractUrl:
          "https://api.trongrid.io/v1/accounts/##USER_ADDRESS##/transactions/trc20?limit=100&contract_address=##CONTRACT_ADDRESS##",
        decimal: 1000000, //18
        tronDecimal: 1000000, //6
        adminAmtSentToUser: 10,
      },
    },

    BINANCE_GATE_WAY: {
      // API_KEY: 'LohrjuucqdzFKCoNGm2Uku7aw9uaIh1jyVD5wAOxuZZP6uW4RBqbXCxdgiIB2GTr',
      API_KEY:
        "bmqqEolaBTg488Nyygo0fu1F0PE2P7kICljuqo6YKyvhFFPMcpzpT3JMeBOfVwIg",
      // API_SECRET: 'qFNvYopTOmf9LBhgJvKDvuU46k5jCJoTOJTsRN2yxxesdspXjYpxdch3WMqFhZZD',
      API_SECRET:
        "RW7gMRoV9CC0frrjK2E4asxExP3ZbsHLOFvgKbiMqLLzYq2rHVRGXd0i3re7P2qv",
    },
    coinpaymentGateway: {
      PUBLIC_KEY:
        "5299072eb40c2e4f259acacf20f1bfc283c07f177c662f388bf0943ce91e4517",
      PRIVATE_KEY:
        "FE760285a5cFd6c7F1eB6d8c593cF0E91A531B3458Dea547fAc4a618D4dAe658",
      IPN_SECRET: "erhoryptic",
      MERCHANT_ID: "19aa9c53f994083147f93e8e9cd50d5f",
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
  }
 } 


export default {
  ...key,
  emailGateway: require("./smtpConfig.json"),
}
