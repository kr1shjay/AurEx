import React, { Component, Fragment } from "react";
import ReactDatatable from '@ashvin27/react-datatable';

// import component
import CoinDepositModal from '../partials/CoinDepositModal';
import FiatDepositModal from '../partials/FiatDepositModal';
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";

// import action
import { fundList } from '../../actions/walletAction'

// impport lib
import { paymentType } from '../../lib/displayStatus'

class FundTransfer extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                key: "createdAt",
                text: "Created date",
                className: "created_date",
                align: "left",
                sortable: true
            },
            {
                key: "userId",
                text: "User Id",
                className: "created_date",
                align: "left",
                sortable: true
            },
            {
                key: "toUserId",
                text: "To User",
                className: "toaddress",
                align: "left",
                sortable: true,
                width: 200,
            },
            {
                key: "coin",
                text: "Coin",
                className: "currency",
                align: "left",
                sortable: true
            },
            {
                key: "amount",
                text: "Transfer Amount",
                className: "amount",
                align: "left",
                sortable: true
            }
        ];

        this.config = {
            page_size: 10,
            length_menu: [10, 20, 50],
            filename: "Withdraw",
            no_data_text: 'No Records found!',
            sort: { column: "Created date", order: "desc" },
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
            show_length_menu: false,
            show_filter: true,
            show_pagination: true,
            show_info: true,
        };

        this.state = {
            records: [],
            search: '',
            page: 1,
            limit: 10,
            count: 0,
            loader: false,
            coinFormModal: false,
            fiatFormModal: false,
            depositRecord: {}
        };
        this.fetchDeposit = this.fetchDeposit.bind(this);
        this.refetchDeposit = this.refetchDeposit.bind(this);
        this.handlePagination = this.handlePagination.bind(this)
        this.handleCloseCoinForm = this.handleCloseCoinForm.bind(this);
        this.handleCloseFiatForm = this.handleCloseFiatForm.bind(this);
    }

    componentDidMount() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit
        }

        this.fetchDeposit(reqData);
    };

    async fetchDeposit(reqData) {
        try {
            this.setState({ "loader": true })
            const { status, loading, result } = await fundList(reqData);
            this.setState({ "loader": loading })
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
        this.fetchDeposit(reqData);
        this.setState({ page: index.page_number, limit: index.page_size, search: index.filter_value })
    }

    handleCloseCoinForm() {
        this.setState({ coinFormModal: false })
    }

    handleCloseFiatForm() {
        this.setState({ fiatFormModal: false })
    }

    refetchDeposit() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit
        }
        this.fetchDeposit(reqData)
    }

    render() {
        const { loader, count, records, coinFormModal, fiatFormModal, depositRecord } = this.state;

        return (
            <div>
                <CoinDepositModal
                    isShow={coinFormModal}
                    onHide={this.handleCloseCoinForm}
                    record={depositRecord}
                    fetchData={this.refetchDeposit}
                />
                <FiatDepositModal
                    isShow={fiatFormModal}
                    onHide={this.handleCloseFiatForm}
                    record={depositRecord}
                    fetchData={this.refetchDeposit}
                />
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <h3 className="mt-2 text-secondary">Fund List</h3>
                            <ReactDatatable className="table table-bordered table-striped user_management_table"
                                config={this.config}
                                records={records}
                                columns={this.columns}
                                dynamic={true}
                                total_record={count}
                                loading={loader}
                                onChange={this.handlePagination}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default FundTransfer;