// import package
import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import DataTable from 'react-data-table-component';
import { Select, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
// import action
import { getTrnxHistory } from '../../actions/walletAction'

// import lib
import isEmpty from '../../lib/isEmpty';
import { transactionStatus } from '../../lib/displayStatus';
import { dateTimeFormat } from '../../lib/dateTimeHelper'

const columns = [
    {
        name: 'Date',
        selector: 'date',
        sortable: false,
    },
    {
        name: 'Type',
        selector: 'type',
        sortable: false,
    },
    {
        name: 'Currency',
        selector: 'currency',
        sortable: false,
    },
    {
        name: 'Amount',
        selector: 'amount',
        sortable: false,
    },
    {
        name: 'Address',
        selector: 'address',
        sortable: false,
        width: "350px",
    },
    {
        name: 'Status',
        selector: 'status',
        sortable: false,
    },
];

const CryptoHistory = (props) => {
    // props
    const { currencyOption } = props;
    const { t, i18n } = useTranslation();
    // state
    const [loader, setLoader] = useState(false)
    const [record, setRecord] = useState({
        'data': [],
        'count': 0
    })
    const [filter, setFilter] = useState({
        'coin': 'all',
        'type': 'all',
        'search': '',
        'page': 1,
        'limit': 10
    })
    const [typingTimeout, setTypingTimeout] = useState(0)

    const { coin, type, search } = filter

    // function
    const fetchHistory = async (reqQuery) => {
        try {
            setLoader(true)
            const { status, loading, result } = await getTrnxHistory('crypto', reqQuery)
            setLoader(loading)
            if (status == 'success') {
                if (result && result.data && result.data.length > 0) {
                    let resultArr = []
                    result.data.map((item) => {
                        resultArr.push({
                            'date': dateTimeFormat(item.createdAt, 'YYYY-MM-DD HH:mm'),
                            'type': transactionStatus(item.paymentType),
                            'currency': item.coin,
                            'amount': item.amount,
                            'address': item.toAddress,
                            'status': <div className="textStatusGreen">{item.status}</div>
                        })

                        //textStatusOrange,textStatusGreen
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

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let filterData = {
            ...filter,
            [name]: value
        }
        setFilter(filterData)
        if (name == 'search') {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            setTypingTimeout(setTimeout(function () {
                fetchHistory(filterData)
            }, 1000))
        } else {
            fetchHistory(filterData)
        }
    }


    useEffect(() => {
        fetchHistory(filter)
    }, [])

    return (
        <div className="dashboard_box stakingHistoryTable">
            <div className="newUsersFilter contact_form settingsSelect mb-0 historyPageFilter">
                <div className="newsSelectGroup input_minw_selc">
                    <label>{t('FILTER_BY')}</label>
                    <Select
                        value={type}
                        name="type"
                        onChange={handleChange}
                    >
                        <MenuItem value={'all'}>{t('ALL')}</MenuItem>
                        <MenuItem value={'withdraw'}>{t('WITHDRAW')}</MenuItem>
                        <MenuItem value={'deposit'}>{t('DEPOSIT')}</MenuItem>
                        {/*<MenuItem value={'transfer'}>{t('TRANSFER')}</MenuItem>*/}
                    </Select>
                    <Select
                        className="marginSpace"
                        value={coin}
                        name="coin"
                        onChange={handleChange}
                    >
                        <MenuItem value={'all'}>{t('ALL')}</MenuItem>
                        {
                            currencyOption && currencyOption.length > 0 && currencyOption.map((item, key) => {
                                if (item.type == 'crypto' || item.type == 'token') {
                                    return (
                                        <MenuItem value={item.coin} key={key}>
                                            {item.coin}
                                        </MenuItem>
                                    )
                                }
                            })
                        }
                    </Select>
                    <div className="tableSearchBox">
                        <div class="input-group">
                            <input
                                type="text"
                                name="search"
                                value={search}
                                onChange={handleChange}
                                class="form-control"
                                placeholder="Search by Trans.Ref / Bank"
                            />
                            <div class="input-group-append">
                                <span class="btnType1"><i class="fas fa-search"></i></span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="newsSelectGroup">
                    <button className="btn btn-outline text-uppercase py-1 m-0">Download PDF</button>
                </div> */}
            </div>
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

CryptoHistory.propTypes = {
    currencyOption: PropTypes.array.isRequired
};

CryptoHistory.defaultProps = {
    currencyOption: [],
};

export default CryptoHistory;