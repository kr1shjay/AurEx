// import package
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

// import 
import { p2pPiar } from '../../actions/commonAction'

const columns = [
    {
        name: 'Pair',
        selector: 'tikerRoot',
    },
    {
        name: 'Fees(%)',
        selector: 'feePct',
    },
];

const P2pFees = () => {

    // state
    const [orderData, setOrderData] = useState([])
    const [loader, setLoader] = useState(false)

    // function
    const fetchPair = async () => {
        try {
            setLoader(true)
            const { status, loading, result } = await p2pPiar()
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

export default P2pFees;