// import package
import React from 'react';

// import component
import ViewBankDetail from './ViewBankDetail';
import EditBankDetail from './EditBankDetail';
import ListBankDetail from './ListBankDetail';


const BankAccount = () => {

    return (
        <div className="border-none">

            <ListBankDetail />

            <EditBankDetail />

            <ViewBankDetail />


        </div>
    )
}

export default BankAccount;