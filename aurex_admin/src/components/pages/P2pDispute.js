import React, { Component, Fragment } from "react";
import clsx from 'classnames';
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import ReactDatatable from "@ashvin27/react-datatable";

// import * as moment from "moment";

// import action
import { disputeList } from '../../actions/p2pAction'


//import lib
import { momentFormat } from '../../lib/dateTimeHelper'

class P2pDispute extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                // key: "created_date",
                text: "Date & Time",
                className: "date",
                align: "left",
                sortable: true,
                cell: (record) => {
                    return momentFormat(record.disputeDate, 'YYY-MM-DD HH:mm');
                },
            },
            {
                key: "orderId",
                text: "Order Id",
                className: "date",
                align: "left",
                sortable: true,
            },
            {
                key: "buyUniqueId",
                text: "Buyer ID",
                className: "userId",
                align: "left",
                sortable: true,
            },
            {
                key: "sellUniqueId",
                text: "Seller ID",
                className: "userId",
                align: "left",
                sortable: true,
            },
            {
                key: "disputeRaisedBy",
                text: "Dispute By",
                className: "userId",
                align: "left",
                sortable: true,
            },
            {
                key: "disputeStatus",
                text: "Status",
                className: "userId",
                align: "left",
                sortable: true,
            },
            {
                key: "disputeTo",
                text: "Dispute To",
                className: "userId",
                align: "left",
                sortable: true,
            },
            {
                key: "action",
                text: "Action",
                className: "action",
                width: 100,
                align: "left",
                sortable: false,
                cell: (record) => {
                    return (
                        <Fragment>
                            <button
                                className={clsx("btn btn-sm", { "btn-primary": record.status != 'dispute' }, { "btn-danger": record.status == 'dispute' })}
                                onClick={() => this.viewRecord(record)}
                                style={{ marginRight: "5px" }}
                            >
                                {
                                    record.status == 'dispute' ? <i className="fa fa-gavel"></i> : <i className="fa fa-eye"></i>
                                }
                            </button>
                        </Fragment>
                    );
                },
            },
        ];

        this.config = {
            page_size: 10,
            length_menu: [10, 20, 50],
            filename: "Buyhistory",
            no_data_text: "No Record found!",
            sort: { column: "Created date", order: "desc" },
            language: {
                length_menu: "Show _MENU_ result per page",
                filter: "Filter in records...",
                info: "Showing _START_ to _END_ of _TOTAL_ records",
                pagination: {
                    first: "First",
                    previous: "Previous",
                    next: "Next",
                    last: "Last",
                },
            },
            show_length_menu: false,
            show_filter: true,
            show_pagination: true,
            show_info: true,
            defaultSortAsc: true,
        };

        this.state = {
            records: [],
            loader: false
        };
        this.fetchList = this.fetchList.bind(this);
    }

    componentDidMount() {
        this.fetchList();
    }

    async fetchList() {
        try {
            this.setState({ 'loader': true })
            const { status, loading, result } = await disputeList();
            this.setState({ 'loader': false })
            if (status == 'success') {
                this.setState({ 'records': result })
            }
        } catch (err) { }
    }

    viewRecord(record) {
        this.props.history.push({ pathname: `/p2p-ordrView/${record.orderId}`, from: "trade" });
    }

    render() {
        const { loader } = this.state;
        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <h3 className="mt-2 text-secondary">
                                P2P Dispute List
                            </h3>
                            <div style={{ overflow: "scroll" }}>
                                <ReactDatatable className="table table-bordered table-striped user_management_table"
                                    responsive={true}
                                    config={this.config}
                                    records={this.state.records}
                                    columns={this.columns}
                                    loading={loader}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default P2pDispute;