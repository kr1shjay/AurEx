import React, { Component, Fragment } from "react";
import ReactDatatable from '@ashvin27/react-datatable';
import { momentFormat } from "../../lib/dateTimeHelper";
//import components

import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";

//import actions
import { spotTradeHistory } from '../../actions/reportActions';


//import
import isEmpty from '../../lib/isEmpty'

//import downloads
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { CSVLink } from "react-csv";
class tradehistory extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                key: 'createdAt',
                text: "Date",
                className: "Date",
                align: "left",
                sortable: true,
                width: 300,
                cell: (record) => {
                    return (

                        <p>{momentFormat(record.createdAt, 'YYYY-MM-DD HH:mm')}</p>
                    )
                }

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
                key: "buyUserId",
                text: "Buyer Id",
                className: "Buyer",
                align: "left",
                sortable: true,
                width: 200,
            },
            {
                key: "sellUserId",
                text: "Seller Id",
                className: "Seller",
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
                key: "buyorsell",
                text: "Side",
                className: "Side",
                align: "left",
                sortable: true,
                width: 200,
            },
            {
                key: "orderType",
                text: "order Type",
                className: "orderType",
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
                text: "Executed",
                className: "Executed",
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
            {
                key: "Fees",
                text: "Fees",
                className: "Fees",
                align: "left",
                sortable: true,
                width: 200,
            },



        ];

        this.config = {
            page_size: 10,
            length_menu: [10, 20, 50],
            filename: "Order",
            no_data_text: 'No Records found!',
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
            files: [],
            loader: false,
            page: 1,
            limit: 10,
            count: 0,
        };
        this.handlePagination = this.handlePagination.bind(this);
        this.exportPDF = this.exportPDF.bind(this);
        this.DownloadeCSV = this.DownloadeCSV.bind(this);
        this.DownloadeXLS = this.DownloadeXLS.bind(this);

    }

    componentDidMount() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            exports: 'false'
        }
        this.getData(reqData)
    };

    // componentWillReceiveProps(){
    //     this.reoprtDownloade()
    // }


    handlePagination(index) {

        let reqData = {
            page: index.page_number,
            limit: index.page_size,
            search: index.filter_value
        }
        this.getData(reqData);
        this.setState({ page: index.page_number, limit: index.page_size, search: index.filter_value })
    }


    async getData(reqData) {
        try {
            this.setState({ 'loader': true })

            const { status, loading, result } = await spotTradeHistory(reqData);
            this.setState({ 'loader': loading })
            if (status == 'success') {
                this.setState({ "count": result.count, 'records': result.data, 'files': result.exportData })
            }
        } catch (err) { }
    }

    async exportData(reqData) {
        try {
            this.setState({ 'loader': true })

            const { status, loading, result } = await spotTradeHistory(reqData);
            this.setState({ 'loader': loading })
            if (status == 'success') {
                this.setState({ 'files': result.exportData })
            }
        } catch (err) { }
    }


    async DownloadeCSV() {
        let reqData = {
            exports: 'csv'
        }

        // this.exportData(reqData)
        const { status, loading, result } = await spotTradeHistory(reqData);
        if (status == 'success') {
            // this.setState({ "count": result.count, 'records': result.data, 'files': result.exportData })
        }
    }

    async DownloadeXLS() {
        let reqData = {
            exports: 'xls'
        }

        // this.exportData(reqData)
        const { status, loading, result } = await spotTradeHistory(reqData);
        if (status == 'success') {
            // this.setState({ "count": result.count, 'records': result.data, 'files': result.exportData })
        }
    }




    async exportPDF() {


        let reqData = {
            exports: 'pdf'
        }


        const { status, loading, result } = await spotTradeHistory(reqData);
        if (status == 'success') {

            if (!isEmpty(result)) {
                const unit = "pt";
                const size = "A4"; // Use A1, A2, A3 or A4
                const orientation = "landscape"; // portrait or landscape

                const marginLeft = 40;
                const doc = new jsPDF(orientation, unit, size);

                doc.setFontSize(13);

                const title = "SpotTradeHistory";
                const headers = [
                    [
                        "Date",
                        "Base Currency",
                        "Buyer Id",
                        "seller Id",
                        "Quote Currency",
                        "Side",
                        "order Type",
                        "Price",
                        "Excuted",
                        "Total",
                        "Fees",
                    ],
                ];

                const data =
                    result && result.exportData && result.exportData.length > 0 &&
                    result.exportData.map((elt) => [
                        elt.createdAt,
                        elt.firstCurrency,
                        elt.buyUserId,
                        elt.sellUserId,
                        elt.secondCurrency,
                        elt.buyorsell,
                        elt.orderType,
                        elt.price,
                        elt.filledQuantity,
                        elt.orderValue,
                        elt.Fees,
                    ]);

                let content = {
                    startY: 50,
                    head: headers,
                    body: data,
                };

                doc.text(title, marginLeft, 40);
                doc.autoTable(content);
                doc.save("SpotTradeHistory.pdf");
            }
        }

    }

    render() {

        const { records, count, files } = this.state
        console.log(files, 'filesfilesfilesfiles')
        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <h3 className="mt-2 text-secondary">Spot Trade History</h3>
                            {records && records.length > 0 ? (
                                <button onClick={this.exportPDF} className='btn btn-info mr-2 mb-2' style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(PDF)</button>
                            ) : (
                                ""
                            )}

                            {records && records.length > 0 ? (

                                <button className='btn btn-info mr-2 mb-2' onClick={this.DownloadeCSV} style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(CSV)</button>
                            ) : (
                                ""
                            )}

                            {records && records.length > 0 ? (

                                <button className='btn btn-info mb-2' onClick={this.DownloadeXLS} style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(XLS)</button>
                            ) : (
                                ""
                            )}

                            <ReactDatatable className="table table-bordered table-striped user_management_table"
                                config={this.config}
                                records={this.state.records}
                                columns={this.columns}
                                dynamic={true}
                                total_record={count}
                                onChange={this.handlePagination}
                            />
                        </div>
                    </div>
                </div>
            </div >
        );
    }

}



export default (tradehistory);
