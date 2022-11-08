// import package
import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'

// import action
import { orderHistory } from '../../actions/p2pAction'

// import lib
import { dateTimeFormat } from '../../lib/dateTimeHelper'
import isEmpty from '../../lib/isEmpty';

const columns = [
    {
        name: 'Status',
        selector: 'status',
        sortable: false,
    },
    {
        name: 'Info',
        selector: 'side',
        sortable: false,
    },
    {
        name: 'Trader',
        selector: 'traderId',
        sortable: false,
    },
    {
        name: 'Price',
        selector: 'price',
        sortable: false,
    },
    {
        name: 'Quantity',
        selector: 'receiveValue',
        sortable: false
    },
    {
        name: 'Created Date',
        selector: 'createdAt',
        sortable: false,
    },
    {
        name: 'Action',
        selector: 'createdAt',
        sortable: false,
        cell: (row, index, column, id) => {
            return <Link to={`chat/${row.id}`}>View/Chat</Link>
        }
    }
];

const P2pOrderHistory = (props) => {

    // state
    const [loader, setLoader] = useState(false)
    const [record, setRecord] = useState({
        'data': [],
        'count': 0
    })
    const [filter, setFilter] = useState({
        'page': 1,
        'limit': 10
    })

    // redux
    const { uniqueId } = useSelector(state => state.auth)

    // function
    const fetchHistory = async (reqQuery) => {
        try {
            setLoader(true)
            const { status, loading, result } = await orderHistory(reqQuery)
            setLoader(loading)
            if (status == 'success') {
                if (result && result.data && result.data.length > 0) {
                    let resultArr = []
                    result.data.map((item) => {
                        resultArr.push({
                            'id': item._id,
                            'status': item.status,
                            'side': uniqueId == item.sellUniqueId ? `Sell ${item.firstCoin}` : `Buy ${item.firstCoin}`,
                            'traderId': item.side == 'sell' ? item.sellUniqueId : item.buyUniqueId,
                            'price': item.price,
                            'receiveValue': item.receiveValue,
                            'createdAt': dateTimeFormat(item.createdAt, 'YYYY-MM-DD HH:mm')
                        })
                    })
                    setRecord({
                        'data': resultArr,
                        count: result.count
                    })
                } else {
                    setRecord({
                        'data': result.data,
                        'count': result.count
                    })
                }
            }
        } catch (err) { }
    }

    const handlePageChange = page => {
        let filterData = { ...filter, ...{ 'page': page } }
        setFilter(filterData)
        fetchHistory(filterData)
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        let filterData = { ...filter, ...{ 'page': page, 'limit': newPerPage } }
        setFilter(filterData)
        fetchHistory(filterData)
    };

    useEffect(() => {
        if (!isEmpty(uniqueId)) {
            fetchHistory(filter)
        }
    }, [uniqueId])

    return (
        <div className="dashboard_box stakingHistoryTable">
            <DataTable
                columns={columns}
                data={record.data}
                paginationTotalRows={record.count}
                noHeader
                progressPending={loader}
                pagination
                paginationServer
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
            />
        </div>
    )
}

P2pOrderHistory.propTypes = {
    currencyOption: PropTypes.array.isRequired
};

P2pOrderHistory.defaultProps = {
    currencyOption: [],
};

export default P2pOrderHistory;