import React, { Component, Fragment } from "react";
import ReactDatatable from '@ashvin27/react-datatable';

// import component
import CoinDepositModal from '../partials/CoinDepositModal';
import FiatDepositModal from '../partials/FiatDepositModal';
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";

// import action
import { getDepositList } from '../../actions/walletAction'

// impport lib
import { paymentType } from '../../lib/displayStatus'

//import downloads
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { CSVLink } from "react-csv";

class Deposit extends Component {
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
                key: "toaddress",
                text: "To Address",
                className: "toaddress",
                align: "left",
                sortable: true,
                width: 200,
                cell: record => {
                    if (record.paymentType == 'fiat_deposit') {
                        return '-'
                    } if (record.paymentType == 'coin_deposit') {
                        return record.toAddress
                    }
                }
            },
            {
                key: "coin",
                text: "Coin",
                className: "currency",
                align: "left",
                sortable: true
            },
            {
                key: "paymentType",
                text: "Payment Type",
                className: "currency",
                align: "left",
                sortable: true,
                cell: record => {
                    return paymentType(record.paymentType)
                }
            },
            {
                key: "amount",
                text: "Transfer Amount",
                className: "amount",
                align: "left",
                sortable: true
            },
            {
                key: "status",
                text: "Status",
                className: "status",
                align: "left",
                sortable: true
            },
            {
                key: "action",
                text: "Action",
                className: "action",
                width: 100,
                align: "left",
                sortable: false,
                cell: record => {
                    if (record.paymentType == "coin_deposit") {

                        return (
                            <Fragment>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => this.setState({ 'coinFormModal': true, 'depositRecord': record })}
                                    style={{ marginRight: '5px' }}>
                                    <i className="fa fa-check"></i>
                                </button>
                            </Fragment>
                        );
                    } else if (record.paymentType == "fiat_deposit") {
                        return (
                            <Fragment>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => this.setState({ 'fiatFormModal': true, 'depositRecord': record })}
                                    style={{ marginRight: '5px' }}>
                                    <i className="fa fa-check"></i>
                                </button>
                            </Fragment>
                        );
                    }
                }
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
        this.exportPDF = this.exportPDF.bind(this);
        this.DowloadeCsv = this.DowloadeCsv.bind(this);
        this.DowloadeXls = this.DowloadeXls.bind(this);
    }

    componentDidMount() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export:'false'
        }

        this.fetchDeposit(reqData);
    };

    async fetchDeposit(reqData) {
        try {
            this.setState({ "loader": true })
            const { status, loading, result } = await getDepositList(reqData);
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

    async DowloadeCsv() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export: 'csv'
        }
        const { status, loading, result } = await getDepositList(reqData);
    }

    async DowloadeXls() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export: 'xls'
        }
        const { status, loading, result } = await getDepositList(reqData);
    }


    async exportPDF() {
        const { records } = this.state;
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export: 'pdf'
        }
        const { status, loading, result } = await getDepositList(reqData);
        if (status == 'success') {
            const unit = "pt";
            const size = "A4"; // Use A1, A2, A3 or A4
            const orientation = "landscape"; // portrait or landscape

            const marginLeft = 40;
            const doc = new jsPDF(orientation, unit, size);

            doc.setFontSize(13);

            const title = "Deposit";
            const headers = [
                [

                    "Created date",
                    "User Id",
                    "To Address",
                    "Coin",
                    "Payment Type",
                    "Transfer Amount",
                    "Status"

                ],
            ];

            const data =
                result && result.pdfData.length > 0 &&
                result.pdfData.map((elt) => [

                    // moment(elt.createdAt).format(
                    //     "DD-MM-YYYY k:mm:s"
                    // ),
                    elt.createdAt,
                    elt.userId,
                    // elt.toaddress,
                    elt.paymentType == 'coin_deposit' ? '-' : elt.toAddress,
                    elt.coin,
                    paymentType(elt.paymentType),
                    elt.amount,
                    elt.status
                ]);

            let content = {
                startY: 50,
                head: headers,
                body: data,
            };

            doc.text(title, marginLeft, 40);
            doc.autoTable(content);
            doc.save("Deposit.pdf");
        }
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
                            <h3 className="mt-2 text-secondary">Deposit List</h3>
                            {records && records.length > 0 ? (
                                <button onClick={this.exportPDF} className='btn btn-info mr-2 mb-2' style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(PDF)</button>
                            ) : (
                                ""
                            )}

                            {records && records.length > 0 ? (
                                // <CSVLink
                                //     data={records}
                                //     filename={"Deposit.csv"}
                                //     className="btn btnTrade1 py-4"
                                // >
                                    <button className='btn btn-info mr-2 mb-2' onClick={this.DowloadeCsv} style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(CSV)</button>
                                // </CSVLink>
                            ) : (
                                ""
                            )}

                            {records && records.length > 0 ? (
                                // <CSVLink
                                //     data={records}
                                //     filename={"Deposit.xls"}

                                // >
                                <button className='btn btn-info mb-2' onClick={this.DowloadeXls} style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(XLS)</button>
                                // </CSVLink>
                            ) : (
                                ""
                            )}
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

export default Deposit;
