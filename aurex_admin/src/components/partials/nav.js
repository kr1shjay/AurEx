
const nav = [
    {
        path: "/dashboard",
        name: 'Dashboard',
        exact: true,
        sidemenu: true,
        type: "private"
    },
    {
        header: 'Users',
        href: '#submenu1',
        sidemenu: true,
        childItem: [
            {
                path: "/users",
                name: 'User',
                exact: true,
                sidemenu: true,
                type: "private",
                id: 'submenu1'
            },
            {
                path: "/kyc",
                name: 'Kyc',
                exact: true,
                sidemenu: true,
                type: "private",
                id: 'submenu1'
            },
        ]
    },
    {
        header: 'Currency & Pair',
        href: '#submenu2',
        sidemenu: true,
        childItem: [
            {
                path: "/currency",
                name: 'Currency',
                exact: true,
                sidemenu: true,
                type: "private",
                id: 'submenu2'

            },
            {
                path: "/Pairmanagement",
                name: 'Pair Management',
                exact: true,
                sidemenu: true,
                type: "private",
                id: 'submenu2'
            },
        ]
    },
    {
        header: 'History',
        href: '#submenu3',
        sidemenu: true,
        childItem: [
            {
                path: "/orderhistory",
                name: 'Order History',
                exact: true,
                sidemenu: true,
                type: "private",
                id: 'submenu3'

            },
            {
                path: "/tradehistory",
                name: 'Trade History',
                exact: true,
                sidemenu: true,
                type: "private",
                id: 'submenu3'

            },
            {
                path: "/withdraw",
                name: 'Withdraw',
                exact: true,
                sidemenu: true,
                type: "private",
                id: 'submenu3'

            },
            {
                path: "/deposit",
                name: 'Deposit',
                exact: true,
                sidemenu: true,
                type: "private",
                id: 'submenu3'

            },
        ]
    },
    // {
    //     path: "/sub-admin",
    //     name: 'Sub Admin',
    //     exact: true,
    //     sidemenu: true,
    //     type: "private"
    // },
    // {
    //     path: "/users",
    //     name: 'User',
    //     exact: true,
    //     sidemenu: true,
    //     type: "private"
    // },
    // {
    //     path: "/Pairmanagement",
    //     name: 'Pair Management',
    //     exact: true,
    //     sidemenu: true,
    //     type: "private"
    // },

    {
        header: 'Staking',
        href: '#submenu4',
        sidemenu: true,
        childItem: [
            {
                path: "/Staking",
                name: 'Staking',
                exact: true,
                sidemenu: true,
                type: "private",
                id: 'submenu4'
            },
            {
                path: "/Stake-Settlement",
                name: 'Stake Settlement',
                exact: true,
                sidemenu: true,
                type: "private",
                id: 'submenu4'
            },
            {
                path: "/Stake-History",
                name: 'Stake History',
                exact: true,
                sidemenu: true,
                type: "private",
                id: 'submenu4'
            },
        ]
    },

    {
        header: 'LaunchPad',
        href: '#submenu5',
        sidemenu: true,
        childItem: [
            {
                path: "/launchpad",
                name: 'Launchpad',
                exact: true,
                sidemenu: true,
                type: "private",
                id: 'submenu5'
            },
            {
                path: "/token-purchase",
                name: 'Token Purchase',
                exact: true,
                sidemenu: true,
                type: "private",
                id: 'submenu5'
            },
        ]
    },
   
  
    {
        path: "/site-setting",
        name: 'Site Setting Page',
        exact: true,
        sidemenu: false,
        type: "private"
    },
    {
        path: "/cms",
        name: 'Cms',
        exact: true,
        sidemenu: true,
        type: "private"
    },
    {
        path: "/language",
        name: 'Language',
        exact: true,
        sidemenu: false,
        type: "private"
    },
    {
        path: "/contactus",
        name: 'Contact Us',
        exact: true,
        sidemenu: true,
        type: "private"
    },

    {
        path: "/faq-category",
        name: 'Faq Category',
        exact: true,
        sidemenu: true,
        type: "private"
    },
    {
        path: "/faq",
        name: 'Faq Page',
        exact: true,
        sidemenu: true,
        type: "private"
    },
    {
        path: "/emailtemplates",
        name: 'Email Templates',
        exact: true,
        sidemenu: true,
        type: "private"
    },
    // {
    //     path: "/perpetual",
    //     name: 'Perpetual',
    //     exact: true,
    //     sidemenu: true,
    //     type: 'private'
    // },
    {
        path: "/priceCNVlist",
        name: 'Price Conversion',
        exact: true,
        sidemenu: true,
        type: "private"
    },
    {
        path: "/anouncement",
        name: 'Anouncement',
        exact: true,
        sidemenu: true,
        type: "private"
    },
    {
        path: "/support-category",
        name: 'Support Category',
        exact: true,
        sidemenu: true,
        type: "private"
    },
    {
        path: "/support",
        name: 'Support',
        exact: true,
        sidemenu: true,
        type: "private"
    },
    {
        path: "/support_reply/:id",
        name: 'Support Reply',
        exact: true,
        sidemenu: false,
        type: "private"
    },
    {
        path: "/security",
        name: 'Google Auth',
        exact: true,
        sidemenu: false,
        type: "private"
    },


    // {
    //     path: "/kyc",
    //     name: 'Kyc',
    //     exact: true,
    //     sidemenu: true,
    //     type: "private"
    // },
    // {
    //     path: "/currency",
    //     name: 'Currency',
    //     exact: true,
    //     sidemenu: true,
    //     type: "private"
    // },

    {
        path: "/profile",
        name: 'Profile',
        exact: true,
        sidemenu: false,
        type: "private"
    },
    // {
    //     path: "/profit-management",
    //     name: 'Profit Management',
    //     exact: true,
    //     sidemenu: true,
    //     type: "private"
    // },
    {
        path: "/settings",
        name: 'Settings',
        exact: true,
        sidemenu: false,
        type: "private"
    },
    {
        path: "/changepassword",
        name: 'Change Password',
        exact: false,
        sidemenu: true,
        type: "private"
    },
    // {
    //     path: "/orderhistory",
    //     name: 'Order History',
    //     exact: true,
    //     sidemenu: true,
    //     type: "private"
    // },
    // {
    //     path: "/tradehistory",
    //     name: 'Trade History',
    //     exact: true,
    //     sidemenu: true,
    //     type: "private"
    // },
    // // {
    // //     path: "/perpetual-Trade-History",
    // //     name: 'Perpetual Trade History',
    // //     exact: true,
    // //     sidemenu: true,
    // //     type: "private"
    // // },
    // // {
    // //     path: "/perpetual-Order-History",
    // //     name: 'Perpetual Order History',
    // //     exact: true,
    // //     sidemenu: true,
    // //     type: "private"
    // // },
    // {
    //     path: "/withdraw",
    //     name: 'Withdraw',
    //     exact: true,
    //     sidemenu: true,
    //     type: "private"
    // },
    // {
    //     path: "/deposit",
    //     name: 'Deposit',
    //     exact: true,
    //     sidemenu: true,
    //     type: "private"
    // },

   
    {
        path: "/newsletter",
        name: 'News Letter',
        exact: true,
        sidemenu: true,
    },
    // {
    //     path: "/closedpositions",
    //     name: 'Closed Positions',
    //     exact: true,
    //     sidemenu: true,
    // },
    // {
    //     path: "/feesettings",
    //     name: 'Fees settings',
    //     exact: false,
    //     sidemenu: true,
    // },
    // {
    //     path: "/liquidated",
    //     name: 'Liquidated',
    //     exact: true,
    //     sidemenu: true,
    // },
    // {
    //     path: "/p2p-pair",
    //     name: 'P2p Pair',
    //     exact: true,
    //     sidemenu: true,
    //     type: "private"
    // },
    // {
    //     path: "/p2p-order",
    //     name: 'P2p Order',
    //     exact: true,
    //     sidemenu: true,
    //     type: "private"
    // },
    // {
    //     path: "/p2p-ordrView/:orderId",
    //     name: 'P2p Order View',
    //     exact: true,
    //     sidemenu: false,
    //     type: "private"
    // },
    // {
    //     path: "/p2p-dispute",
    //     name: 'P2p Dispute',
    //     exact: true,
    //     sidemenu: true,
    //     type: "private"
    // },
    {
        path: "/kycupdate/:id",
        name: 'kycupdate',
        exact: true,
        sidemenu: false,
    },
    {
        path: "/Tradingbot",
        name: 'Tradingbot',
        exact: true,
        sidemenu: true,
        type: "private"
    },

]

export default nav









































