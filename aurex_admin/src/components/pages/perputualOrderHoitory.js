import React, { Component, Fragment } from "react";

//import compoents
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import ReactDatatable from '@ashvin27/react-datatable';

//import Actions
import { perpetualOrderHistory } from '../../actions/reportActions'

//Downloads
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { CSVLink } from "react-csv";


class tradehistory extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                key: "orderDate",
                text: "Date",
                className: "Date",
                align: "left",
                sortable: true,
                width: 200,

            },
            {
                key: "firstCurrency",
                text: "Base Currency",
                className: "pairName",
                align: "left",
                sortable: true,
                width: 200,
            },
            {
                key: "secondCurrency",
                text: "Quote Currency",
                className: "name",
                align: "left",
                sortable: true,
            },
            {
                key: "orderType",
                text: "Type",
                className: "Type",
                align: "left",
                sortable: true,
                width: 200,
            },
            {
                key: "buyorsell",
                text: "Side",
                className: "Side",
                align: "left",
                sortable: true,
                width: 200,
            },
            {
                key: "averagePrice",
                text: "Average",
                className: "Average",
                align: "left",
                sortable: true,
                width: 200,
            },
            {
                key: "price",
                text: "Price",
                className: "Price",
                align: "left",
                sortable: true,
                width: 200,
            },

            {
                key: "filledQuantity",
                text: "Excuted",
                className: "Excuted",
                align: "left",
                sortable: true,
                width: 200,
            },
            {
                key: "quantity",
                text: "Amount",
                className: "Amount",
                align: "left",
                sortable: true,
                width: 200,
            },
            {
                key: "orderValue",
                text: "Total",
                className: "Total",
                align: "left",
                sortable: true,
                width: 200,
            },

        ];

        this.config = {
            page_size: 10,
            length_menu: [10, 20, 50],
            filename: "Order",
            no_data_text: 'No Email Templates found!',
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
            loader: false,
            page: 1,
            limit: 10,
            count: 0,


        };
        this.handlePagination = this.handlePagination.bind(this);
        this.exportPDF = this.exportPDF.bind(this);
        this.DownloadeCsv = this.DownloadeCsv.bind(this);
        this.DownloadeXls = this.DownloadeXls.bind(this);

    }
    componentDidMount() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export: 'false'
        }
        this.getPerpetualOrder(reqData)
    };

    handlePagination(index) {
        let reqData = {
            page: index.page_number,
            limit: index.page_size,
            search: index.filter_value
        }
        this.getPerpetualOrder(reqData);
        this.setState({ page: index.page_number, limit: index.page_size, search: index.filter_value })
    }


    async getPerpetualOrder(reqData) {
        try {
            this.setState({ 'loader': true })

            const { status, loading, result } = await perpetualOrderHistory(reqData);
            this.setState({ 'loader': loading })
            if (status == 'success') {
                this.setState({ "count": result.count, 'records': result.data })
            }
        } catch (err) { }
    }
    async DownloadeCsv() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export: 'csv'
        }
        const { status, loading, result } = await perpetualOrderHistory(reqData);
    }

    async DownloadeXls() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export: 'xls'
        }
        const { status, loading, result } = await perpetualOrderHistory(reqData);
    }



    async exportPDF() {
        const { records } = this.state
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export: 'pdf'
        }
        const { status, loading, result } = await perpetualOrderHistory(reqData);
        if (status == 'success') {
            const unit = "pt";
            const size = "A4"; // Use A1, A2, A3 or A4
            const orientation = "landscape"; // portrait or landscape

            const marginLeft = 40;
            const doc = new jsPDF(orientation, unit, size);

            doc.setFontSize(13);

            const title = "perpetualOrderHistory";
            const headers = [
                [
                    "Date",
                    "Base Currency",
                    "Quote Currency",
                    "Type",
                    "Side",
                    "Average",
                    "Price",
                    "Excuted",
                    "Amount",
                    "Total"
                    // "Fees",
                ],
            ];

            const data =
                result && result.pdfData.length > 0 &&
                result.pdfData.map((elt) => [
                    elt.orderDate,
                    elt.firstCurrency,
                    elt.secondCurrency,
                    elt.orderType,
                    elt.buyorsell,
                    elt.averagePrice,
                    elt.price,
                    elt.filledQuantity,
                    elt.quantity,
                    elt.orderValue,
                ]);

            let content = {
                startY: 50,
                head: headers,
                body: data,
            };

            doc.text(title, marginLeft, 40);
            doc.autoTable(content);
            doc.save("perpetualTradeHistory.pdf");
        }
    }


    render() {

        const { records, count, loader } = this.state
        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <h3 className="mt-2 text-secondary">Perpetual Order History</h3>

                            {records && records.length > 0 ? (
                                <button onClick={this.exportPDF} className='btn btn-info' style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(PDF)</button>
                            ) : (
                                ""
                            )}

                            {records && records.length > 0 ? (
                                // <CSVLink
                                //     data={records}
                                //     filename={"perpetualOrderHistory.csv"}
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
                                //     filename={"perpetualOrderHistory.xls"}

                                // >
                                <button className='btn btn-info' onClick={this.DownloadeXls} style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(XLS)</button>
                                // </CSVLink>
                            ) : (
                                ""
                            )}
                            <ReactDatatable className="table table-bordered table-striped user_management_table"
                                config={this.config}
                                records={this.state.records}
                                columns={this.columns}
                                total_record={count}
                                dynamic={true}
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



export default (tradehistory);
