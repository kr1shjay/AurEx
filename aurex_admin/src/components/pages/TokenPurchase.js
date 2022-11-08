import React, { Component } from "react";
import ReactDatatable from '@ashvin27/react-datatable';

// import component
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";

// import action
import { purchaseTknList } from '../../actions/launchPad';

// import lib
import { dateTimeFormat } from '../../lib/dateTimeHelper'
import { toFixed } from '../../lib/roundOf'


//import downloads
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { CSVLink } from "react-csv";


class TokenPurchase extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                key: "createdAt",
                text: "Purchase Date",
                className: "date",
                align: "left",
                sortable: true,
                cell: record => {
                    return dateTimeFormat(record.createdAt, 'YYYY-MM-DD HH:mm')
                }
            },
            {
                key: "userId",
                text: "User Id",
                className: "email",
                align: "left",
                sortable: true
            },
            {
                key: "coin",
                text: "Buy Coin",
                className: "email",
                align: "left",
                sortable: true
            },
            {
                key: "sendCoin",
                text: "Sell Coin",
                className: "email",
                align: "left",
                sortable: true
            },
            {
                key: "price",
                text: "Price",
                className: "email",
                align: "left",
                sortable: true,
                cell: (record) => {
                    return record && record.price && toFixed(record.price, 8)
                }

            },
            {
                key: "quantity",
                text: "Quantity",
                className: "email",
                align: "left",
                sortable: true
            },
            {
                key: "discount",
                text: "Discount",
                className: "email",
                align: "left",
                sortable: true
            },
            {
                key: "total",
                text: "Total",
                className: "email",
                align: "left",
                sortable: true,
                cell: (record) => {
                    return record && record.total && toFixed(record.total, 8)
                }
            }
        ];

        this.config = {
            page_size: 10,
            length_menu: [10, 20, 50],
            filename: "Launchpad",
            no_data_text: 'No user found!',
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
            defaultSortAsc: true,
        };

        this.state = {
            search: '',
            records: [],
            page: 1,
            limit: 10,
            count: 0,
            loader: false
        };

        this.fetchList = this.fetchList.bind(this)
        this.exportPDF = this.exportPDF.bind(this)
        this.DownloadeCsv = this.DownloadeCsv.bind(this)
        this.DownloadeXls = this.DownloadeXls.bind(this)
    }

    componentDidMount() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export: 'fasle'
        }
        this.fetchList(reqData);
    };

    async fetchList(reqData) {
        try {
            this.setState({ 'loader': true })
            const { status, loading, result } = await purchaseTknList(reqData);
            this.setState({ 'loader': loading })
            if (status == 'success') {
                this.setState({
                    "count": result.count,
                    'records': result.data,
                })
            }
        } catch (err) { }
    }

    pageChange(pageData) {
        console.log("OnPageChange", pageData);
    }
    async DownloadeCsv() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export: 'csv'
        }
        const { status, loading, result } = await purchaseTknList(reqData);
    }

    async DownloadeXls() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export: 'xls'
        }
        const { status, loading, result } = await purchaseTknList(reqData);
    }


    async exportPDF() {
        const { records } = this.state;
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export: 'pdf'
        }
        const { status, loading, result } = await purchaseTknList(reqData);
        if (status == 'success') {
            const unit = "pt";
            const size = "A4"; // Use A1, A2, A3 or A4
            const orientation = "landscape"; // portrait or landscape

            const marginLeft = 40;
            const doc = new jsPDF(orientation, unit, size);

            doc.setFontSize(13);

            const title = "TokenPurchase";
            const headers = [
                [
                    "Purchase Date",
                    "User Id",
                    "Buy Coin",
                    "Sell Coin",
                    "Price",
                    "Quantity",
                    "Discount",
                    "Total"

                ],
            ];

            const data =
                records.length > 0 &&
                records.map((elt) => [
                    elt.createdAt,
                    elt.userId,
                    elt.coin,
                    elt.sendCoin,
                    elt.price,
                    elt.quantity,
                    elt.discount,
                    elt.total
                ]);

            let content = {
                startY: 50,
                head: headers,
                body: data,
            };

            doc.text(title, marginLeft, 40);
            doc.autoTable(content);
            doc.save("TokenPurchase.pdf");
        }
    }

    render() {
        const { records, count, loader } = this.state;
        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />

                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <h3 className="mt-2 text-secondary">Token Purchase History</h3>
                            {records && records.length > 0 ? (
                                <button onClick={this.exportPDF} className='btn btn-info' style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(PDF)</button>
                            ) : (
                                ""
                            )}

                            {records && records.length > 0 ? (
                                // <CSVLink
                                //     data={records}
                                //     filename={"TokenPurchase.csv"}
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
                                //     filename={"TokenPurchase.xls"}

                                // >
                                <button className='btn btn-info' onClick={this.DownloadeXls} style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(XLS)</button>
                                // </CSVLink>
                            ) : (
                                ""
                            )}
                            <ReactDatatable className="table table-bordered table-striped user_management_table"
                                responsive={this.state.responsive}
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

export default TokenPurchase;