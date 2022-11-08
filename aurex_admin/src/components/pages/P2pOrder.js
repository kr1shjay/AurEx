import React, { Component, Fragment } from "react";
import clsx from 'classnames';
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import ReactDatatable from "@ashvin27/react-datatable";

import * as moment from "moment";

// import action
import { orderReport } from '../../actions/p2pAction'


//import lib
import { momentFormat } from '../../lib/dateTimeHelper'

//import downloads
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { CSVLink } from "react-csv";



class P2pOrder extends Component {
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
                    // return moment(record.startTime).format(
                    //     "DD-MM-YYYY k:mm:s"
                    //);
                    return momentFormat(record.startTime, 'YYYY-MM-DD HH:mm')

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
                key: "side",
                text: "Trade Type",
                className: "userId",
                align: "left",
                sortable: true,
            },
            {
                key: "firstCoin",
                text: "Base Coin",
                className: "userId",
                align: "left",
                sortable: true,
            },
            {
                key: "secondCoin",
                text: "Quote Coin",
                className: "userId",
                align: "left",
                sortable: true,
            },
            {
                key: "price",
                text: "Price",
                className: "userId",
                align: "left",
                sortable: true,
            },
            {
                key: "payValue",
                text: "Pay Price",
                className: "userId",
                align: "left",
                sortable: true,
            },
            {
                key: "receiveValue",
                text: "Get Price",
                className: "userId",
                align: "left",
                sortable: true,
            },
            {
                key: "feePct",
                text: "Fee(%)",
                className: "fee",
                align: "left",
                sortable: true,
            },
            {
                key: "status",
                text: "Status",
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
            loader: false,
            export: false

        };
        this.fetchList = this.fetchList.bind(this);
        this.exportPDF = this.exportPDF.bind(this);
        this.DownloadeXls = this.DownloadeXls.bind(this);
        this.DownloadeCsv = this.DownloadeCsv.bind(this);
    }

    async componentDidMount() {
        let reqData = {
            export: 'false'
        }

        this.fetchList(reqData);
    }

    async fetchList(data) {
        try {

            this.setState({ 'loader': true })
            const { status, loading, result } = await orderReport(data);
            this.setState({ 'loader': false })
            if (status == 'success') {
                this.setState({ 'records': result })
            }
        } catch (err) { }
    }

    viewRecord(record) {
        this.props.history.push({ pathname: `/p2p-ordrView/${record.orderId}`, from: "trade" });
    }
    async DownloadeCsv() {
        const { records } = this.state;
        let reqData = {
            export: 'csv'
        }
        const { status, loading, result } = orderReport(reqData);
    }

    async DownloadeXls() {
        const { records } = this.state;
        let reqData = {
            export: 'xls'
        }
        const { status, loading, result } = orderReport(reqData);
    }

    async exportPDF() {
        const { records } = this.state;
        let reqData = {
            export: 'pdf'
        }
        const { status, loading, result } = await orderReport(reqData);
        if (status == 'success') {
            const unit = "pt";
            const size = "A4"; // Use A1, A2, A3 or A4
            const orientation = "landscape"; // portrait or landscape

            const marginLeft = 40;
            const doc = new jsPDF(orientation, unit, size);

            doc.setFontSize(13);

            const title = "P2PTradeList";
            const headers = [
                [

                    "Date & Time",
                    "Order Id",
                    "Buyer ID",
                    "Seller ID",
                    "Post Type",
                    "Base Coin",
                    "Quote Coin",
                    "Price",
                    "Pay Price",
                    "Get Price",
                    "Fee(%)",
                    "Status"

                ],
            ];

            const data =
                result && result.pdfData.length > 0 &&
                result.pdfData.map((elt) => [

                    moment(elt.createdAt).format(
                        "DD-MM-YYYY k:mm:s"
                    ),
                    elt.orderId,
                    elt.buyUniqueId,
                    elt.sellUniqueId,
                    elt.side,
                    elt.firstCoin,
                    elt.secondCoin,
                    elt.price,
                    elt.payValue,
                    elt.receiveValue,
                    elt.feePct,
                    elt.status


                ]);

            let content = {
                startY: 50,
                head: headers,
                body: data,
            };

            doc.text(title, marginLeft, 40);
            doc.autoTable(content);
            doc.save("P2PTradeList.pdf");
        }
    }


    render() {
        const { loader, records } = this.state;
        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <h3 className="mt-2 text-secondary">
                                P2P Trade List
                            </h3>
                            <div style={{ overflow: "scroll" }}>
                                {records && records.length > 0 ? (
                                    <button onClick={this.exportPDF} className='btn btn-info' style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(PDF)</button>
                                ) : (
                                    ""
                                )}

                                {records && records.length > 0 ? (
                                    // <CSVLink
                                    //     data={records}
                                    //     filename={"P2PTradeList.csv"}
                                    //     className="btn btnTrade1 py-4"
                                    // >
                                    <button className='btn btn-info' onClick={this.DownloadeCsv} style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(CSV)</button>
                                    // </CSVLink>
                                ) : (
                                    ""
                                )}

                                {records && records.length > 0 ? (
                                    // <CSVLink
                                    //     data={records}
                                    //     filename={"P2PTradeList.xls"}

                                    // >
                                    <button className='btn btn-info' onClick={this.DownloadeXls} style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(XLS)</button>
                                    // </CSVLink>
                                ) : (
                                    ""
                                )}
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

export default P2pOrder;