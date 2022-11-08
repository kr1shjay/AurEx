import React, { Component, Fragment } from "react";
import ReactDatatable from '@ashvin27/react-datatable';

//import components

import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";

//import Actions
import { getUserBalnce } from '../../actions/userActions'


class Userbalance extends Component {
    constructor(props) {
        super(props);
        this.columns = [

            {
                key: "userId",
                text: "User ID",
                className: "userId",
                align: "left",
                sortable: true,
            },
            {
                key: "currencySymbol",
                text: "currency",
                className: "currency",
                align: "left",
                sortable: true,
            },

            {
                key: "spotwallet",
                text: "Spot wallet",
                className: "balance",
                align: "left",
                sortable: true,

            },
            {
                key: "derivativeWallet",
                text: "Derivative Wallet",
                className: "derivativeWallet",
                align: "left",
                sortable: true,
            },


        ];

        this.config = {
            page_size: 10,
            length_menu: [10, 20, 50],
            filename: "Userbalance",
            no_data_text: 'No Userbalance found!',
            language: {
                length_menu: "Show _MENU_ result per page",
                filter: "Filter in records...",
                info: "Showing _START_ to _END_ of _TOTAL_ records",
                pagination: {
                    first: "First",
                    previous: "Previous",
                    next: "Next",
                    last: "Last"
                }
            },
            show_length_menu: true,
            show_filter: true,
            show_pagination: true,
            show_info: true,
        };

        this.state = {
            records: [],
            loader: false,
            page: 1,
            limit: 10,
            count: 0,
            responsive: true,
            loader: false,

        };
        this.getUserBalanceList = this.getUserBalanceList.bind(this);
        this.handlePagination = this.handlePagination.bind(this);
    }

    componentDidMount() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit
        }

        this.getUserBalanceList(reqData)
    };



    async getUserBalanceList(reqData) {
        try {
            this.setState({ 'loader': true })

            const { status, loading, result } = await getUserBalnce(reqData);
            this.setState({ 'loader': loading })
            if (status == 'success') {
                this.setState({ "count": result.count, 'records': result.data })
            }
        } catch (err) { }


    }

    handlePagination(index) {
        let reqData = {
            page: index.page_number,
            limit: index.page_size,
            search: index.filter_value
        }
        this.getUserBalanceList(reqData);
        this.setState({ page: index.page_number, limit: index.page_size, search: index.filter_value })
    }

    render() {
        const { count } = this.state
        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <h3 className="mt-2 text-secondary">User balance List</h3>
                            <ReactDatatable className="table table-bordered table-striped user_management_table"
                                config={this.config}
                                records={this.state.records}
                                columns={this.columns}
                                total_record={count}
                                dynamic={true}
                                onChange={this.handlePagination}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}



export default (Userbalance);
