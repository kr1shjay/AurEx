// import package
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import {
    MenuItem, Select
} from "@material-ui/core/";
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next';
// import action
import { getStakeHistory } from '../../actions/stakingAction';

//lib
import { momentFormat } from 'lib/dateTimeHelper';


const StakeHistory = () => {
    // state
    const [loader, setLoader] = useState(true)
    const [record, setRecord] = useState({
        'data': [],
        'count': 0
    })
    const { t, i18n } = useTranslation();
    const [filter, setFilter] = useState({
        'coin': 'all',
        'type': 'interest',
        'page': 1,
        'limit': 10
    })

    const { coin, type } = filter

    // redux
    const currencyData = useSelector(state => state.currency)

    //table colum
    const columns = [
        {
            name: 'Date',
            selector: 'date',
            sortable: false,
            cell: (record) => {
                return momentFormat(record.date, 'YYYY-MM-DD HH:mm')
            }
        },
        {
            name: 'Crypto',
            selector: 'crypto',
            sortable: false,
        },
        {
            name: 'Amount',
            selector: 'amount',
            sortable: false,
        },
        {
            name: 'APY',
            selector: 'apy',
            sortable: false,
        },

        {
            name: 'Type',
            selector: 'type',
            sortable: false,
        },
        {
            name: ((filter.type == 'subscription') || (filter.type == 'redemption')) ? null : 'Interest Earned',
            selector: 'interestEarned',
            sortable: false,
            cell: (record) => {
                if (filter && ((filter.type != 'subscription') && (filter.type != 'redemption'))) {
                    return record.interestEarned
                }

            }
        },
        {
            name: filter.type == 'subscription' ? 'Status' : null,
            selector: 'status',
            sortable: false,
            cell: (record) => {
                if (filter && filter.type == 'subscription') {
                    return record.status
                }

            }
        },

    ];



    // function
    const fetchHistory = async (reqData) => {
        try {
            setLoader(true)
            const { status, loading, result } = await getStakeHistory(reqData);
            setLoader(loading)
            if (status == 'success') {
                let newRecord = [];
                result.data && result.data.length > 0 && result.data.map((item, key) => {
                    newRecord.push({
                        "date": item.createdAt,
                        "crypto": item.coin,
                        "amount": `${item.stakeAmount} ${item.coin}`,
                        "apy": `${item.APY}%`,
                        "interestEarned": `${item.amount} ${item.coin}`,
                        "type": item.type,
                        'status': item.status
                    })
                })
                setRecord({
                    'count': result.count,
                    'data': newRecord,
                })
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
        fetchHistory(filterData)
    }

    useEffect(() => {
        fetchHistory(filter)
    }, [])
    // alert(filter)
    return (

        <div className="dashboard_box stakingHistoryTable">
            <div className="newUsersFilter contact_form settingsSelect mb-0">
                <div className="newsSelectGroup">
                    <label className='mb-0'>{t('FILTER_BY')}</label>
                    <Select
                        className="marginSpace min_height_select"
                        value={coin}
                        name="coin"
                        onChange={handleChange}
                    >
                        <MenuItem value={'all'}>{t('ALL')}</MenuItem>
                        {
                            currencyData && currencyData.length > 0 && currencyData.map((item, key) => {
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
                    <Select
                        className="marginSpace min_height_select"
                        value={type}
                        name="type"
                        onChange={handleChange}
                    >
                        <MenuItem value={'subscription'}>{t('SUBSCRIPTION')}</MenuItem>
                        <MenuItem value={'redemption'}>{t('REDEMPTION')}</MenuItem>
                        <MenuItem value={'interest'}>{t('INTEREST')}</MenuItem>
                    </Select>
                </div>
                <div className="newsSelectGroup">
                    {/* <button className="btn btn-outline text-uppercase py-1 m-0">Download PDF</button> */}
                </div>
            </div>
            <DataTable
                columns={columns}
                data={record.data}
                noHeader
                paginationTotalRows={record.count}
                progressPending={loader}
                pagination
                paginationServer
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}  className='text_center_div_table stak_his_table'
            />
        </div>
    )
}

export default StakeHistory;