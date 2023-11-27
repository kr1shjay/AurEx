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
      "mongodb+srv://aurex-prod:JiT6Gy2ngjB5C2DO@aurex-production.wvbvo.mongodb.net/wXZeko",
    RUN_CRON: true,
    PORT: PORT,
    FRONT_URL: "https://aurexchange.com",
    ADMIN_URL: "https://contorls.aurexchange.com",
    SERVER_URL: `${API_URL}`,
    IMAGE_URL: `${API_URL}`,
    RECAPTCHA_SECRET_KEY: "6LfCM7kgAAAAABRF1c3QnDWCs_TEqyKOI_6Su_B9",
    IPN_URL: `${API_URL}/api/depositwebhook`,
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
      ACCOUMENT_PATH: "public/images/anouncement",
      ACCOUMENT_URL_PATH: "/anouncement/",
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
        ADMINAMTSENTTOUSER: 50,
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
        adminAmtSentToUser: 50,
      },
    },
    BINANCE_GATE_WAY: {
      // API_KEY: 'LohrjuucqdzFKCoNGm2Uku7aw9uaIh1jyVD5wAOxuZZP6uW4RBqbXCxdgiIB2GTr',
      API_KEY:
        "sTyQceNiRnMZd06EnwxRALv83l8mXgctsZr3b1aqal0tyQXxIZC9jTu8GPjgpPb3",
      // API_SECRET: 'qFNvYopTOmf9LBhgJvKDvuU46k5jCJoTOJTsRN2yxxesdspXjYpxdch3WMqFhZZD',
      API_SECRET:
        "It9KcIzwZjoClj18zlW58kNDH79qaYlnQkiDBivB3gXl18zWQBqAfb3iTGnbMzJo",
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
  };
} else if (process.env.NODE_ENV === "demo") {
  console.log("\x1b[35m%s\x1b[0m", `Set Demo Config`);

  const API_URL = "https://backend-aurex.maticz.in/";
  const PORT = 9360;
  key = {
    SITE_NAME: "tradingone",
    secretOrKey: "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3",
    cryptoSecretKey: "1234567812345678",
    DATABASE_URL: "mongodb://XMxnWnAlra:LLtgjmidvw@127.0.0.1:27017/CluxChange",
    RUN_CRON: true,
    PORT: PORT,
    FRONT_URL: "https://aurex.maticz.in/",
    ADMIN_URL: "https://control-aurex.maticz.in/",
    SERVER_URL: `${API_URL}`,
    IMAGE_URL: `${API_URL}`,
    RECAPTCHA_SECRET_KEY: "6LeHezUfAAAAABKS-mUfSrqlHD9jBQbmevozwzgr",
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
      NAME: "Aurex",
      QR_IMAGE:
        "https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=",
    },
    COIN_GATE_WAY: {
      BTC: {
        URL: "",
      },
      LTC: {
        URL: "",
      },
      DOGE: {
        URL: "",
      },
      ETH: {
        URL: "https://rpc.sepolia.org",
        ADDRESS: "0x836f583975FFC53599Eb07619e7D514d1FF5Bf62",
        PRIVATE_KEY:
          "U2FsdGVkX1++Gdq0OxzFCBSMsq+gceH7PskUPhYo4A+1t2qoE5ipcrsu6Xw0XOhIqNGR3TAFOhvaZxAVpWBiX1/N+TUWWHyl8rbimH6XgHXeArhrN7EXKpm/2lXAU6h9",

        START_BLOCK: 0,
        DEPOSIT_URL:
          "https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=##USER_ADDRESS##&startblock=##START_BLOCK##&endblock=##END_BLOCK##&sort=asc&apikey=5RJWEAZM1FHHFBST9HBNZP1H4EAZWF8SUG",
        DEPOSIT_TOKEN_URL:
          "https://api-sepolia.etherscan.io/api?module=account&action=tokentx&address=##USER_ADDRESS##&startblock=##START_BLOCK##&endblock=##END_BLOCK##&sort=asc&apikey=5RJWEAZM1FHHFBST9HBNZP1H4EAZWF8SUG",
        NETWORK_ID: 11155111,
        CHAIN_ID: 11155111,
      },
      // BNB: {
      //     URL: "https://bsc-dataseed.binance.org/",
      //     START_BLOCK: 0,
      //     DEPOSIT_URL: 'https://api.bscscan.com/api?module=account&action=txlist&address=##USER_ADDRESS##&startblock=##START_BLOCK##&endblock=##END_BLOCK##&sort=asc&apikey=EWRUSHE7B64KNR5S5J7IQBT43PSTXTWHSI',
      //     DEPOSIT_TOKEN_URL: "https://api.bscscan.com/api?module=account&action=tokentx&address=##USER_ADDRESS##&startblock=##START_BLOCK##&endblock=##END_BLOCK##&sort=asc&apikey=EWRUSHE7B64KNR5S5J7IQBT43PSTXTWHSI",
      //     NETWORK_ID: 56,
      //     CHAIN_ID: 56,
      //     ADDRESS: '0x836f583975FFC53599Eb07619e7D514d1FF5Bf62',
      //     PRIVATE_KEY: "U2FsdGVkX1++Gdq0OxzFCBSMsq+gceH7PskUPhYo4A+1t2qoE5ipcrsu6Xw0XOhIqNGR3TAFOhvaZxAVpWBiX1/N+TUWWHyl8rbimH6XgHXeArhrN7EXKpm/2lXAU6h9"
      // },
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
      // TRON: {
      //     FULLNODE: "https://api.trongrid.io",
      //     SOLIDITYNODE: "https://api.trongrid.io",
      //     EVENTSERVER: "https://api.trongrid.io",
      //     contractAddress: "TBpfYjBhLTRW5cFKtLkqG2XvJwRjqSaXyU",
      //     PRIVATEKEY: "U2FsdGVkX1804FveNbJaF1sGyBEtiW76UF2TDxLlzi0lk63z7Bcs1RIAcpVF9Fk8Am97h1ukICcG9EGCmTfvaRM50C0cfuOuQ3M0RfIFs+jrJUOBAh85/wOE+ogOmNgr",
      //     ADDRESS: "TKfmsKc7RFjNHGAJf8WUVLxhoEixySpwyk",
      //     TRANSACTIONURL: "https://api.trongrid.io/v1/accounts/##USER_ADDRESS##/transactions?only_to=true&limit=50",
      //     TRANSACTIONCONTRACTURL: "https://api.trongrid.io/v1/accounts/##USER_ADDRESS##/transactions/trc20?limit=100&contract_address=##CONTRACT_ADDRESS##",
      //     DECIMAL: 100000000, //8
      //     TRONDECIMAL: 1000000, //6
      //     ADMINAMTSENTTOUSER: 10,
      // }
      TRON: {
        FULLNODE: "https://nile.trongrid.io",
        SOLIDITYNODE: "https://nile.trongrid.io",
        EVENTSERVER: "https://nile.trongrid.io",
        contractAddress: "TTtYtVVekf9GG3UvmZouKeeEao8HFe1AcA",
        PRIVATEKEY:
          "U2FsdGVkX1+/1hKILbKT3dz4lt/P8xtGLR6hmvkm5azp5PaCIUtDa53HGxoLh+XQOVqMORbjdgvAjxt6FNtePjmov7t+wGfOQHRZSzh0ZN4iRciSDnveGYDGJbMvxn6g",
        ADDRESS: "TKSjgi7i4MX5Bg1NBtKA5XD7c8vmqE2BHF",
        TRANSACTIONURL:
          "https://nile.trongrid.io/v1/accounts/##USER_ADDRESS##/transactions?only_to=true&limit=50",
        TRANSACTIONCONTRACTURL:
          "https://nile.trongrid.io/v1/accounts/##USER_ADDRESS##/transactions/trc20?limit=100&contract_address=##CONTRACT_ADDRESS##",
        DECIMAL: 100000000, //8
        TRONDECIMAL: 1000000, //6
        ADMINAMTSENTTOUSER: 5.00004,
      },
    },

    coinGateway: {
      // eth: {
      //   url: "http://139.162.1.152:3000",
      //   startBlock: 11504800,
      //   mode: "ropsten", // ropsten
      //   address: "0x836f583975FFC53599Eb07619e7D514d1FF5Bf62",
      //   privateKey:
      //     "U2FsdGVkX1+qPHe80YXasGLBvZaovbS0o8AShWZrDZ4ja2Xt3j553iM260o+sJFjyZTC2ohXhwGK91MyTAaITTn3iq2kZs8wroYiQ5QkGJM+x3+MAgSskcFJLxGP1PfP",
      //   etherscanUrl: "https://api.etherscan.io/api?", // https://api-ropsten.etherscan.io/api?
      //   ethDepositUrl:
      //     "https://api.etherscan.io/api?module=account&action=txlist&address=##USER_ADDRESS##&startblock=##START_BLOCK##&endblock=##END_BLOCK##&sort=asc&apikey=CSM5YXQG5MTE8XWM57UWH6DBXQRS8SQP3K",
      //   ethTokenDepositUrl:
      //     "https://api.etherscan.io/api?module=account&action=tokentx&address=##USER_ADDRESS##&startblock=##START_BLOCK##&endblock=##END_BLOCK##&sort=asc&apikey=CSM5YXQG5MTE8XWM57UWH6DBXQRS8SQP3K",
      // },
      eth: {
        url: "https://rpc.sepolia.org",
        address: "0x836f583975FFC53599Eb07619e7D514d1FF5Bf62",
        privateKey:
          "U2FsdGVkX1++Gdq0OxzFCBSMsq+gceH7PskUPhYo4A+1t2qoE5ipcrsu6Xw0XOhIqNGR3TAFOhvaZxAVpWBiX1/N+TUWWHyl8rbimH6XgHXeArhrN7EXKpm/2lXAU6h9",
        startBlock: 0,
        ethDepositUrl:
          "https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=##USER_ADDRESS##&startblock=##START_BLOCK##&endblock=##END_BLOCK##&sort=asc&apikey=5RJWEAZM1FHHFBST9HBNZP1H4EAZWF8SUG",
        ethTokenDepositUrl:
          "https://api-sepolia.etherscan.io/api?module=account&action=tokentx&address=##USER_ADDRESS##&startblock=##START_BLOCK##&endblock=##END_BLOCK##&sort=asc&apikey=5RJWEAZM1FHHFBST9HBNZP1H4EAZWF8SUG",
        NETWORK_ID: 11155111,
        CHAIN_ID: 11155111,
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
        address: "TKfmsKc7RFjNHGAJf8WUVLxhoEixySpwyk",
        transactionUrl:
          "https://api.trongrid.io/v1/accounts/##USER_ADDRESS##/transactions?only_to=true&limit=50",
        transactionContractUrl:
          "https://api.trongrid.io/v1/accounts/##USER_ADDRESS##/transactions/trc20?limit=100&contract_address=##CONTRACT_ADDRESS##",
        decimal: 1000000, //18
        tronDecimal: 1000000, //6
        adminAmtSentToUser: 50,
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
} else {
  console.log("\x1b[35m%s\x1b[0m", `Set Development Config`);
  const API_URL = "http://localhost";
  const PORT = 2053;
  key = {
    SITE_NAME: "CluxChange",
    secretOrKey: "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3",
    cryptoSecretKey: "1234567812345678",
    // DATABASE_URL: "mongodb://localhost:27017/cluxold",
    DATABASE_URL: "mongodb://localhost:27017/wXZeko",

    // DATABASE_URL: "mongodb://cluxdb:Fvdhcdcedhf6wed34sxdz@172.105.40.100:10730/cluxdb",
    // DATABASE_URL: "mongodb://clux:Password__2022__PasworD@23.239.23.84:10330/clux",
    RUN_CRON: false,
    PORT: PORT,
    FRONT_URL: "http://localhost:3001",
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
      DEFAULT_SIZE: 1 * 1024 * 1024, // 1 MB,
      URL_PATH: "/images/profile/",
      PROFILE_SIZE: 1 * 1024 * 1024, // 1 MB
      PROFILE_PATH: "public/profile",
      PROFILE_URL_PATH: "/profile/",

      ID_DOC_SIZE: 12 * 1024 * 1024, // 12 MB,
      KYC_PATH: "public/images/kyc",
      KYC_URL_PATH: "/images/kyc/",
      CMS_PATH: "public/images/cms/",

      CURRENCY_SIZE: 0.02 * 1024 * 1024, // 20 KB
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
      ACCOUMENT_PATH: "public/images/anouncement",
      ACCOUMENT_URL_PATH: "/images/anouncement/",

      P2P_SIZE: 2 * 1024 * 1024, // 2 MB
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
    smsGateway: {
      TWILIO_ACCOUT_SID: "AC7654c3f84cd47fcd7f24498864a90b57",
      TWILIO_AUTH_TOKEN: "6edafaafac25137753acfa2f75593aba",
      TWILIO_PHONE_NUMBER: "+16402306943",
      TWILIO_SERVICE_SID: "VA0458e76ca85dddadfddcf5acad39709d",
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
        URL: "https://rpc.sepolia.org",
        ADDRESS: "0x836f583975FFC53599Eb07619e7D514d1FF5Bf62",
        PRIVATE_KEY:
          "U2FsdGVkX1++Gdq0OxzFCBSMsq+gceH7PskUPhYo4A+1t2qoE5ipcrsu6Xw0XOhIqNGR3TAFOhvaZxAVpWBiX1/N+TUWWHyl8rbimH6XgHXeArhrN7EXKpm/2lXAU6h9",

        START_BLOCK: 0,
        DEPOSIT_URL:
          "https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=##USER_ADDRESS##&startblock=##START_BLOCK##&endblock=##END_BLOCK##&sort=asc&apikey=5RJWEAZM1FHHFBST9HBNZP1H4EAZWF8SUG",
        DEPOSIT_TOKEN_URL:
          "https://api-sepolia.etherscan.io/api?module=account&action=tokentx&address=##USER_ADDRESS##&startblock=##START_BLOCK##&endblock=##END_BLOCK##&sort=asc&apikey=5RJWEAZM1FHHFBST9HBNZP1H4EAZWF8SUG",
        NETWORK_ID: 11155111,
        CHAIN_ID: 11155111,
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
        FULLNODE: "https://nile.trongrid.io",
        SOLIDITYNODE: "https://nile.trongrid.io",
        EVENTSERVER: "https://nile.trongrid.io",
        contractAddress: "TTtYtVVekf9GG3UvmZouKeeEao8HFe1AcA",
        PRIVATEKEY:
          "U2FsdGVkX1+/1hKILbKT3dz4lt/P8xtGLR6hmvkm5azp5PaCIUtDa53HGxoLh+XQOVqMORbjdgvAjxt6FNtePjmov7t+wGfOQHRZSzh0ZN4iRciSDnveGYDGJbMvxn6g",
        ADDRESS: "TKSjgi7i4MX5Bg1NBtKA5XD7c8vmqE2BHF",
        TRANSACTIONURL:
          "https://nile.trongrid.io/v1/accounts/##USER_ADDRESS##/transactions?only_to=true&limit=50",
        TRANSACTIONCONTRACTURL:
          "https://nile.trongrid.io/v1/accounts/##USER_ADDRESS##/transactions/trc20?limit=100&contract_address=##CONTRACT_ADDRESS##",
        DECIMAL: 100000000, //8
        TRONDECIMAL: 1000000, //6
        ADMINAMTSENTTOUSER: 5.00004,
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
        fullNode: "https://nile.trongrid.io",
        solidityNode: "https://nile.trongrid.io",
        eventServer: "https://nile.trongrid.io",
        contractAddress: "TTtYtVVekf9GG3UvmZouKeeEao8HFe1AcA",
        privateKey:
          "U2FsdGVkX1+/1hKILbKT3dz4lt/P8xtGLR6hmvkm5azp5PaCIUtDa53HGxoLh+XQOVqMORbjdgvAjxt6FNtePjmov7t+wGfOQHRZSzh0ZN4iRciSDnveGYDGJbMvxn6g",
        address: "TKSjgi7i4MX5Bg1NBtKA5XD7c8vmqE2BHF",
        transactionUrl:
          "https://nile.trongrid.io/v1/accounts/##USER_ADDRESS##/transactions?only_to=true&limit=50",
        transactionContractUrl:
          "https://nile.trongrid.io/v1/accounts/##USER_ADDRESS##/transactions/trc20?limit=100&contract_address=##CONTRACT_ADDRESS##",
        decimal: 100000000, //8
        tronDecimal: 1000000, //6
        adminAmtSentToUser: 5.00004,
      },
    },

    BINANCE_GATE_WAY: {
      // API_KEY: 'LohrjuucqdzFKCoNGm2Uku7aw9uaIh1jyVD5wAOxuZZP6uW4RBqbXCxdgiIB2GTr',
      API_KEY:
        "sTyQceNiRnMZd06EnwxRALv83l8mXgctsZr3b1aqal0tyQXxIZC9jTu8GPjgpPb3",
      // API_SECRET: 'qFNvYopTOmf9LBhgJvKDvuU46k5jCJoTOJTsRN2yxxesdspXjYpxdch3WMqFhZZD',
      API_SECRET:
        "It9KcIzwZjoClj18zlW58kNDH79qaYlnQkiDBivB3gXl18zWQBqAfb3iTGnbMzJo",
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

export default {
  ...key,
  emailGateway: require("./smtpConfig.json"),
};
