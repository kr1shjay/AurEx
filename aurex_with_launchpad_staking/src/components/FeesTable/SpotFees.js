// import package
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

// import 
import { spotPiar } from '../../actions/commonAction'

const columns = [
    {
        name: 'Pair',
        selector: 'tikerRoot',
        sortable: false,
    },
    {
        name: 'Maker(%)',
        selector: 'maker_rebate',
        sortable: false,
    },
    {
        name: 'Taker(%)',
        selector: 'taker_fees',
        sortable: false,
    },
];


const SpotFees = () => {

    // state
    const [orderData, setOrderData] = useState([])
    const [loader, setLoader] = useState(false)

    // function
    const fetchPair = async () => {
        try {
            setLoader(true)
            const { status, loading, result } = await spotPiar()
            setLoader(loading)
            if (status == 'success') {
                setOrderData(result)
            }
        } catch (err) { }
    }

    useEffect(() => {
        fetchPair()
    }, [])

    return (
        <DataTable
            columns={columns}
            data={orderData}
            noHeader
            pagination
            progressPending={loader}
            paginationComponentOptions={{ noRowsPerPage: true }}
        />
    )
}

export default SpotFees;