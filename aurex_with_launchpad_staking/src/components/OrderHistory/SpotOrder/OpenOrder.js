// import package
import React, { Fragment, useState, useEffect } from "react";
import { MenuItem, Select, Button } from '@material-ui/core';
import DataTable from 'react-data-table-component';
import clsx from 'classnames'
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useTranslation } from 'react-i18next';
// import action
import { allOpenOrder, allOpenOrderDoc } from '../../../actions/spotTradeAction'


// import component
import CancelOrder from './CancelOrder';

// import lib
import { dateTimeFormat } from '../../../lib/dateTimeHelper'
import { capitalize } from '../../../lib/stringCase'


const columns = [
    {
        name: 'Date',
        selector: 'Date',
        sortable: false,
    },
    {
        name: 'Pair',
        selector: 'Pair',
        sortable: false,
    },
    {
        name: 'Side',
        selector: 'Side',
        sortable: false,
    },
    {
        name: 'Order',
        selector: 'Order',
        sortable: false,
    },
    {
        name: 'Filled',
        selector: 'Filled',
        sortable: false,
    },
    {
        name: 'Price',
        selector: 'Price',
        sortable: false,
    },
    {
        name: 'Quantity',
        selector: 'Quantity',
        sortable: false,
    },
    {
        name: 'Total',
        selector: 'Total',
        sortable: false,
    },
    {
        name: 'Action',
        selector: 'Action',
        sortable: false,
    },


];

const initialFormValue = {
    count: 0,
    data: [],
}

const initialFilter = {
    page: 1,
    limit: 10,
    pairName: 'all',
    orderType: 'all'
}

const OpenOrder = (props) => {
    // props
    const { filter: { pairList, orderTypes } } = props

    // state
    const [orderData, setOrderData] = useState(initialFormValue)
    const [filter, setFilter] = useState(initialFilter)
    const [loader, setLoader] = useState(false)

    const { count, data } = orderData
    const { page, limit, pairName, orderType } = filter
    const { t, i18n } = useTranslation();
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
            const { status, loading, result } = await allOpenOrder(reqQuery)
            setLoader(loading)
            if (status == 'success') {
                if (result && result.data && result.data.length > 0) {
                    let resultArr = []
                    result.data.map((item) => {
                        resultArr.push({
                            'Date': dateTimeFormat(item.orderDate, 'YYYY-MM-DD HH:mm'),
                            'Pair': `${item.firstCurrency}/${item.secondCurrency}`,
                            'Side': <div className="apy_section"><span className={clsx({ "color_red": item.buyorsell == 'sell' }, { "color_green": item.buyorsell == 'buy' })}>{capitalize(item.buyorsell)}</span></div>,
                            'Order': capitalize(item.orderType),
                            'Filled': item.filledQuantity == 0 ? '-' : item.filledQuantity,
                            'Price': item.price,
                            'Quantity': item.quantity,
                            'Total': item.price * item.quantity,
                            'Action': <CancelOrder orderId={item._id} refetch={refetch} />
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
            const { status, loading, result } = await allOpenOrderDoc(reqQuery)
            if (status == 'success') {
                if (result && result.data && result.data.length > 0) {
                    let resultArr = []
                    result.data.map((item) => {
                        resultArr.push([
                            dateTimeFormat(item.orderDate, 'YYYY-MM-DD HH:mm'),
                            `${item.firstCurrency}/${item.secondCurrency}`,
                            capitalize(item.buyorsell),
                            capitalize(item.orderType),
                            item.filledQuantity == 0 ? '-' : item.filledQuantity,
                            item.price,
                            item.price * item.quantity,
                        ])
                    })

                    const unit = "pt";
                    const size = "A4"; // Use A1, A2, A3 or A4
                    const orientation = "landscape"; // portrait or landscape

                    const marginLeft = 40;
                    const doc = new jsPDF(orientation, unit, size);

                    doc.setFontSize(13);

                    const title = "Spot open order";
                    const headers = [
                        [
                            "Date",
                            "Pair",
                            "Side",
                            "Order",
                            "Filled",
                            "Price",
                            "Quantity",
                            "Total"
                        ],
                    ]

                    let content = {
                        startY: 50,
                        head: headers,
                        body: resultArr,
                    };

                    doc.text(title, marginLeft, 40);
                    doc.autoTable(content);
                    doc.save("spotOpenOrder.pdf");
                }
            }
        } catch (err) {
        }
    }

    const refetch = () => {
        let reqQuery = {
            page,
            limit
        }
        fetchHistory(reqQuery)
    }

    useEffect(() => {
        let reqQuery = {
            page,
            limit
        }
        fetchHistory(reqQuery)
    }, [])

    return (
        <Fragment>
            <div className="order_header_">
                <div className="d-flex">
                </div>
                <div className="select_section">
                    <div className="select_lable_">
                        <label>{t('Pairs')}</label>
                        <Select
                            name="pairName"
                            label="- All coins -"
                            value={pairName}
                            onChange={handleChange}
                        >
                            <MenuItem value={'all'}>{t('ALL')}</MenuItem>
                            {
                                pairList && pairList.length > 0 && pairList.map((item, key) => {
                                    return (
                                        <MenuItem key={key} value={`${item.firstCurrencySymbol}${item.secondCurrencySymbol}`}>{item.firstCurrencySymbol}/{item.secondCurrencySymbol}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </div>
                    <div className="select_lable_">
                        <label>{t('ORDER_TYPE')}</label>
                        <Select
                            name="orderType"
                            label="orderType"
                            value={orderType}
                            onChange={handleChange}
                        >
                            <MenuItem value={'all'}>{t('ALL')}</MenuItem>
                            {
                                orderTypes && orderTypes.length > 0 && orderTypes.map((item, key) => {
                                    return (
                                        <MenuItem value={item.value}>{item.label}</MenuItem>
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
                columns={columns}
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

export default OpenOrder;