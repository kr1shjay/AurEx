import React, { Component, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDatatable from '@ashvin27/react-datatable';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
//import downloads
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { CSVLink } from "react-csv";
//import components
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import PerpetualAddModal from "../partials/PerpetualAddModal";
import PerpetualUpdateModal from "../partials/PerpetualUpdateModal";

//import actions
import { perpetualPairList } from '../../actions/perpetualActions'
import { getCurrency } from '../../actions/currency'



class Perpetual extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                key: "firstCurrencySymbol",
                text: "Base Currency",
                className: "firstCurrencySymbol",
                align: "left",
                sortable: true,
                width: 200
            },
            {
                key: "secondCurrencySymbol",
                text: "Quote Currency",
                className: "secondCurrencySymbol",
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
            loader: false,
            page: 1,
            limit: 10,
            count: 0,
        };





        this.geterpetualData = this.getPerpetualData.bind(this);
        this.getCurrencyData = this.getCurrencyData.bind(this);
        this.handleCloseAddForm = this.handleCloseAddForm.bind(this);
        this.handleCloseEditForm = this.handleCloseEditForm.bind(this);
        this.handlePagination = this.handlePagination.bind(this);
        this.exportPDF = this.exportPDF.bind(this)
        this.DownloadeCSV = this.DownloadeCSV.bind(this)
        this.DownloadeXLS = this.DownloadeXLS.bind(this)



    }

    componentDidMount() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export: 'false'
        }

        this.getPerpetualData(reqData);
        this.getCurrencyData()
    };

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
        this.getPerpetualData(reqData);
        this.setState({ page: index.page_number, limit: index.page_size, search: index.filter_value })
    }

    async getCurrencyData() {
        const { result, status } = await getCurrency();
        if (status == "success") {
            var currencyarray = [];
            result.map((item, i) => {
                const id = item._id;
                const label = item.coin;
                const obj = { 'value': id, 'label': label };
                currencyarray.push(obj);
                this.setState({ currencyOptions: currencyarray });

            });
        }
    }


    async getPerpetualData(reqData) {

        try {
            this.setState({ 'loader': true })

            const { status, loading, result } = await perpetualPairList(reqData);
            this.setState({ 'loader': loading })
            if (status == 'success') {
                this.setState({ "count": result.count, 'records': result.data })
            }
        } catch (err) { }

    }


    editRecord(record) {

        this.setState({
            editFormModal: true,
            editRecord: record
        })
    }
    addRecord() {
        this.setState({ addFormModal: true });
    }



    async exportPDF() {
        const { records } = this.state
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export: 'pdf'
        }
        const { status, loading, result } = await perpetualPairList(reqData);
        if (status) {
            const unit = "pt";
            const size = "A4"; // Use A1, A2, A3 or A4
            const orientation = "landscape"; // portrait or landscape

            const marginLeft = 40;
            const doc = new jsPDF(orientation, unit, size);

            doc.setFontSize(13);

            const title = "PerpetualPair";
            const headers = [
                [

                    "Base Currency",
                    "Quote Currency",
                    "Status",

                ],
            ];

            const data =
                result && result.pdfData.length > 0 &&
                result.pdfData.map((elt) => [
                    elt.firstCurrencySymbol,
                    elt.secondCurrencySymbol,
                    elt.status

                ]);

            let content = {
                startY: 50,
                head: headers,
                body: data,
            };

            doc.text(title, marginLeft, 40);
            doc.autoTable(content);
            doc.save("PerpetualPair.pdf");
        }
    }

    async DownloadeCSV() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export: 'csv'
        }
        const { status, loading, result } = await perpetualPairList(reqData);
    }
    async DownloadeXLS() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export: 'xls'
        }
        const { status, loading, result } = await perpetualPairList(reqData);
    }
    render() {
        const { addFormModal, editRecord, editFormModal, currencyOptions, count, records } = this.state;

        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <PerpetualAddModal
                        isShow={addFormModal}
                        onHide={this.handleCloseAddForm}
                        currencyOptions={currencyOptions}
                        fetchData={this.getPerpetualData}
                    />
                    <PerpetualUpdateModal
                        isShow={editFormModal}
                        onHide={this.handleCloseEditForm}
                        currencyOptions={currencyOptions}
                        fetchData={this.getPerpetualData}
                        record={editRecord}
                    />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <button onClick={() => this.addRecord()} className="btn btn-outline-primary float-right mt-3 mr-2" data-toggle="modal" data-target="#add-perpetual-modal"><FontAwesomeIcon icon={faPlus}  className="mr-1" /> Add Perpetual Pair</button>
                            <div className="clearfix" />
                            <h3 className="mt-2 text-secondary"> Perpetual Pair</h3>
                            <div>

                                {records && records.length > 0 ? (
                                    <button onClick={this.exportPDF} className='btn btn-info' style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(PDF)</button>
                                ) : (
                                    ""
                                )}

                                {records && records.length > 0 ? (
                                    // <CSVLink
                                    //     data={records}
                                    //     filename={"PerpetualPair.csv"}
                                    //     className="btn btnTrade1 py-4"
                                    // >
                                    <button className='btn btn-info' onClick={this.DownloadeCSV} style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(CSV)</button>
                                    // </CSVLink>
                                ) : (
                                    ""
                                )}

                                {records && records.length > 0 ? (
                                    // <CSVLink
                                    //     data={records}
                                    //     filename={"PerpetualPair.xls"}

                                    // >
                                    <button className='btn btn-info' onClick={this.DownloadeXLS} style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(XLS)</button>
                                    // </CSVLink> 
                                ) : (
                                    ""
                                )}
                            </div>
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
            </div>
        );
    }

}



export default Perpetual;
