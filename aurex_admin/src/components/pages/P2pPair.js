import React, { Component, Fragment } from "react";
import ReactDatatable from '@ashvin27/react-datatable';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//import compoents
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import P2PPairAddModal from "../partials/P2PPairAddModal";
import PairUpdateModal from "../partials/P2PPairUpdateModal"


//import action
import { pairList } from '../../actions/p2pAction'
import { getCurrency } from '../../actions/currency'


//import downloads
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { CSVLink } from "react-csv";



class P2pPair extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                key: "firstCoin",
                text: "Base Coin",
                className: "firstCurrencySymbol",
                align: "left",
                sortable: true,
                width: 200
            },
            {
                key: "secondCoin",
                text: "Quote Coin",
                className: "secondCurrencySymbol",
                align: "left",
                sortable: true,
                width: 200
            },
            {
                key: "feePct",
                text: "Fee(%)",
                className: "Transaction Fee",
                align: "left",
                sortable: true,
                width: 200
            },
            {
                key: "status",
                text: "Status",
                className: "status",
                align: "left",
                sortable: true,
                width: 200
            },

            {
                key: "action",
                text: "Action",
                className: "action",
                width: 100,
                align: "left",
                sortable: false,
                cell: record => {
                    return (
                        <Fragment>
                            <button
                                data-toggle="modal"
                                data-target="#update-spot-modal"
                                className="btn btn-primary btn-sm"
                                onClick={() => this.editRecord(record)}
                                style={{ marginRight: '5px' }}>
                                <i className="fa fa-edit"></i>
                            </button>

                        </Fragment>
                    );
                }
            }
        ];

        this.config = {
            page_size: 10,
            length_menu: [10, 20, 50],
            filename: "Perpetual",
            no_data_text: 'No Contracts found!',
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
            addFormModal: false,
            editFormModal: false,
            currencyOptions: [],
            editRecord: {},
            loader: "",
            page: 1,
            limit: 10,
            count: 0,
            // exports: false

        };


        this.getP2PPairData = this.getP2PPairData.bind(this);
        this.handleCloseAddForm = this.handleCloseAddForm.bind(this);
        this.handleCloseEditForm = this.handleCloseEditForm.bind(this);
        this.handlePagination = this.handlePagination.bind(this)
        this.getCurrencyData = this.getCurrencyData.bind(this)
        this.exportPDF = this.exportPDF.bind(this)
        this.handlePairs = this.handlePairs.bind(this)
        this.DownloadeCsv = this.DownloadeCsv.bind(this)
        this.DownloadeXls = this.DownloadeXls.bind(this)
    }

    componentDidMount() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            exports: 'false'
        }
        this.getP2PPairData(reqData);
        this.getCurrencyData()
    };

    async handlePairs() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            exports: 'false'
        }
        this.getP2PPairData(reqData);
        this.getCurrencyData()
    };



    async getP2PPairData(reqData) {
        try {
            this.setState({ 'loader': true })
            const { status, loading, result } = await pairList(reqData);
            this.setState({ 'loader': loading })
            if (status == 'success') {
                this.setState({ "count": result.count, 'records': result.data })
            }
        } catch (err) { }

    }

    async getCurrencyData() {
        const { result, status } = await getCurrency();
        if (status == "success") {
            this.setState({ currencyOptions: result });
        }
    }

    editRecord(record) {
        this.setState({
            editFormModal: true,
            editRecord: record
        })
    }

    addRecord() {
        this.setState({ addFormModal: true })
    }

    handleCloseAddForm() {
        this.setState({ addFormModal: false })
    }

    handleCloseEditForm() {
        this.setState({ editFormModal: false })
    }

    handlePagination(index) {
        let reqData = {
            page: index.page_number,
            limit: index.page_size,
            search: index.filter_value
        }
        this.getP2PPairData(reqData);
        this.setState({ page: index.page_number, limit: index.page_size, search: index.filter_value })
    }

    async DownloadeCsv() {
        const { page, limit } = this.state;

        let reqData = {
            page,
            limit,
            export: 'csv'
        }
        this.getP2PPairData(reqData)
    }

    async DownloadeXls() {
        const { page, limit } = this.state;

        let reqData = {
            page,
            limit,
            export: 'xls'
        }
        this.getP2PPairData(reqData)
    }



    async exportPDF() {
        const { page, limit } = this.state;

        let reqData = {
            page,
            limit,
            export: 'pdf'
        }
        const { status, loading, result } = await pairList(reqData);
        if (status == 'success') {
            const { records } = this.state

            const unit = "pt";
            const size = "A4"; // Use A1, A2, A3 or A4
            const orientation = "landscape"; // portrait or landscape

            const marginLeft = 40;
            const doc = new jsPDF(orientation, unit, size);

            doc.setFontSize(13);

            const title = "P2PPair";
            const headers = [
                [

                    "Base Coin",
                    "Quote Coin",
                    "Fee(%)",
                    "Status"

                ],
            ];

            const data =
                result && result.pdfData.length > 0 &&
                result.pdfData.map((elt) => [
                    elt.firstCoin,
                    elt.secondCoin,
                    elt.feePct,
                    elt.status,


                ]);

            let content = {
                startY: 50,
                head: headers,
                body: data,
            };

            doc.text(title, marginLeft, 40);
            doc.autoTable(content);
            doc.save("P2PPair.pdf");
        }

    }




    render() {
        const { addFormModal, editRecord, editFormModal, currencyOptions, records } = this.state;

        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <P2PPairAddModal
                        isShow={addFormModal}
                        onHide={this.handleCloseAddForm}
                        currencyOptions={currencyOptions}
                        fetchData={this.handlePairs}
                    />
                    <PairUpdateModal

                        isShow={editFormModal}
                        onHide={this.handleCloseEditForm}
                        currencyOptions={currencyOptions}
                        fetchData={this.handlePairs}
                        record={editRecord}
                    />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <button onClick={() => this.addRecord()}
                                className="btn btn-outline-primary float-right mt-3 mr-2"><FontAwesomeIcon icon={faPlus}  className="mr-1" /> Add Pair</button>
                                 <div className="clearfix" />
                            <h3 className="mt-2 text-secondary">P2P Pairs</h3>
                            {records && records.length > 0 ? (
                                <button onClick={() => this.exportPDF(true)} className='btn btn-info' style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(PDF)</button>
                            ) : (
                                ""
                            )}

                            {records && records.length > 0 ? (
                                <button className='btn btn-info' onClick={this.DownloadeCsv} style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(CSV)</button>

                            ) : (
                                ""
                            )}

                            {records && records.length > 0 ? (

                                <button className='btn btn-info' onClick={this.DownloadeXls} style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(XLS)</button>
                            ) : (
                                ""
                            )}
                            <ReactDatatable className="table table-bordered table-striped user_management_table"
                                config={this.config}
                                records={this.state.records}
                                columns={this.columns}
                                onChange={this.handlePagination}
                            />
                        </div>
                    </div>

                </div>
            </div>
        );
    }

}


export default P2pPair;
