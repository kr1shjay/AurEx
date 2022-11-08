// import package
import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from "prop-types";
import { MenuItem, Select, Button } from '@material-ui/core';
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import clsx from 'classnames'
import { useTranslation } from 'react-i18next';
// import action
import { orderHistory, orderHistoryDoc } from '../../actions/p2pAction'

// import lib
import { dateTimeFormat } from '../../lib/dateTimeHelper';
import isEmpty from '../../lib/isEmpty'
import { capitalize } from '../../lib/stringCase'

const p2pOrdersColumns = [
    {
        name: 'Date',
        selector: 'Date',
        sortable: false,
    },
    {
        name: 'Type',
        selector: 'Type',
        sortable: false,
    },
    {
        name: 'Coin',
        selector: 'Coin',
        sortable: false,
    },
    {
        name: 'Crypto amount',
        selector: 'Crypto_amount',
        sortable: false,
    },

    {
        name: 'Pay by',
        selector: 'Pay_by',
        sortable: false,
    },
    {
        name: 'Total Ordered',
        selector: 'Total_Ordered',
        sortable: false,
    },
    {
        name: 'Trader ID',
        selector: 'Trader_ID',
        sortable: false,
    },
    {
        name: 'Order ID',
        selector: 'Order_ID',
        sortable: false,
    },
    {
        name: 'Status',
        selector: 'Status',
        sortable: false,
    },
    {
        name: 'Action',
        selector: 'Action',
        sortable: false,
    }
];

const initialFormValue = {
    count: 0,
    data: [],
}

const initialFilter = {
    page: 1,
    limit: 10,
    side: 'all',
    coin: 'all',
    pay: 'all'
}

const P2pOrder = (props) => {

    // props
    const { p2pFilter: { coinList, payment } } = props;
    const { t, i18n } = useTranslation();
    // state
    const [loader, setLoader] = useState(false)
    const [orderData, setOrderData] = useState(initialFormValue)
    const [filter, setFilter] = useState(initialFilter)

    const { count, data } = orderData
    const { page, limit, side, coin, pay } = filter

    // redux
    const { uniqueId } = useSelector(state => state.auth)

    // function
    const handlePageChange = page => {
        let filterData = { ...filter, page: page }
        setFilter(filterData)
        fetchHistory(filterData)
    };

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let filterData = { ...filter, [name]: value }
        setFilter(filterData)
        fetchHistory(filterData)
    }

    const fetchHistory = async (reqQuery) => {
        try {
            setLoader(true)
            const { status, loading, result } = await orderHistory(reqQuery)
            setLoader(loading)
            if (status == 'success') {
                if (result && result.data && result.data.length > 0) {
                    let resultArr = []
                    result.data.map((item) => {
                        let side = uniqueId == item.sellUniqueId ? 'sell' : 'buy'
                        resultArr.push({
                            'Date': dateTimeFormat(item.createdAt, 'YYYY-MM-DD HH:mm'),
                            'Type': <div className="apy_section"><span className={clsx({ 'color_red': side == 'sell' }, { 'color_green': side == 'buy' })} > {`${capitalize(side)} ${item.firstCoin}`}</span></div>,
                            'Coin': <div className="coin_section_table"><div><img src={item.image} alt="logo" className="img-fluid" /></div><span>{item.firstCoin}</span></div>,
                            'Crypto_amount': item.receiveValue,
                            'Pay_by': item.payBy,
                            'Total_Ordered': item.receiveValue,
                            'Trader_ID': item.side == 'sell' ? item.sellUniqueId : item.buyUniqueId,
                            'Order_ID': item.orderId,
                            'Status': <div className="apy_section"><span className="color_green">{item.disputeStatus == 'resolved' ? 'disputed' : item.status}</span></div>,
                            'Action': <Link to={`chat/${item._id}`}>{t('VIEW_CHAT')}</Link>
                        })
                    })
                    setOrderData({
                        'data': resultArr,
                        'count': result.count
                    })
                } else {
                    setOrderData({
                        'data': [],
                        'count': 0
                    })
                }
            }
        } catch (err) { }
    }

    const handlePDF = async (e) => {
        e.preventDefault();
        try {
            let reqQuery = filter;
            const { status, loading, result } = await orderHistoryDoc(reqQuery)
            if (status == 'success') {
                if (result && result.data && result.data.length > 0) {
                    let resultArr = []
                    result.data.map((item) => {
                        let side = uniqueId == item.sellUniqueId ? 'sell' : 'buy'
                        resultArr.push([
                            dateTimeFormat(item.createdAt, 'YYYY-MM-DD HH:mm'),
                            `${capitalize(side)} ${item.firstCoin}`,
                            item.firstCoin,
                            item.receiveValue,
                            item.payBy,
                            item.receiveValue,
                            item.side == 'sell' ? item.sellUniqueId : item.buyUniqueId,
                            item.orderId,
                            item.status,
                        ])
                    })

                    const unit = "pt";
                    const size = "A4"; // Use A1, A2, A3 or A4
                    const orientation = "landscape"; // portrait or landscape

                    const marginLeft = 40;
                    const doc = new jsPDF(orientation, unit, size);

                    doc.setFontSize(13);

                    const title = "P2p Order History";
                    const headers = [
                        [
                            "Date",
                            "Type",
                            "Crypto amount",
                            "Coin",
                            "Pay by",
                            "Total Ordered",
                            "Trader ID",
                            "Order ID",
                            "Status"
                        ],
                    ]

                    let content = {
                        startY: 50,
                        head: headers,
                        body: resultArr,
                    };

                    doc.text(title, marginLeft, 40);
                    doc.autoTable(content);
                    doc.save("p2pOrder.pdf");
                }
            }
        } catch (err) {
        }
    }

    useEffect(() => {
        if (!isEmpty(uniqueId)) {
            let reqQuery = {
                page,
                limit
            }
            fetchHistory(reqQuery)
        }
    }, [uniqueId])

    return (
        <Fragment>
            <div className="order_header_">
                <div className="d-flex">
                </div>

                <div className="select_section">
                    <div className="select_lable_">
                        <label>Type</label>
                        <Select
                            name="side"
                            label="Buy Crypto"
                            value={side}
                            onChange={handleChange}
                        >
                            <MenuItem value={'all'}>{t('ALL')}</MenuItem>
                            <MenuItem value={'buy'}>{t('BUY')}</MenuItem>
                            <MenuItem value={'sell'}>{t('SELL')}</MenuItem>
                        </Select>
                    </div>
                    <div className="select_lable_">
                        <label>{t('COIN')}</label>
                        <Select
                            name="coin"
                            label="Coin"
                            value={coin}
                            onChange={handleChange}
                        >
                            <MenuItem value={'all'}>{t('ALL')}</MenuItem>
                            {
                                coinList && coinList.length > 0 && coinList.map((item, key) => {
                                    return (
                                        <MenuItem key={key} value={item}>{item}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </div>
                    <div className="select_lable_">
                        <label>Pay</label>
                        <Select
                            name="pay"
                            label="BankPay"
                            value={pay}
                            onChange={handleChange}
                        >
                            <MenuItem value={'all'}>{t('ALL')}</MenuItem>
                            {
                                payment && payment.length > 0 && payment.map((item, key) => {
                                    return (
                                        <MenuItem key={key} value={item}>{item}</MenuItem>
                                    )
                                })
                            }

                        </Select>
                    </div>
                    {/* <div className="seacr_box_s">
                        <input type="text" placeholder="Find Coin" />
                        <i class="fas fa-search"></i>
                    </div> */}
                    <div className="submit_btn w70_i p-0 ml-2">
                        <Button onClick={handlePDF} className="m-0">{t('Download_PDF')}</Button>
                    </div>
                </div>
            </div>
            <DataTable
                columns={p2pOrdersColumns}
                data={data}
                noHeader
                pagination
                progressPending={loader}
                paginationServer
                paginationComponentOptions={{ noRowsPerPage: true }}
                paginationTotalRows={count}
                onChangePage={handlePageChange}
            />
        </Fragment>
    )
}

P2pOrder.propTypes = {
    p2pFilter: PropTypes.shape({
        coinList: PropTypes.array,
        payment: PropTypes.array
    }),
};

P2pOrder.defaultProps = {
    pairList: {
        coinList: [],
        payment: []
    },
};


export default P2pOrder;