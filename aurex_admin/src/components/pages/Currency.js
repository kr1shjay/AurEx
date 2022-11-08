import React, { Component, Fragment } from "react";
import ReactDatatable from '@ashvin27/react-datatable';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { ToastContainer } from "react-toastify";

// import component
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import CurrencyAddModal from "../partials/CurrencyAddModal";
import CurrencyUpdateModal from "../partials/CurrencyUpdateModal";

// import action
import { currencyList } from '../../actions/currency';

//import downloads
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { CSVLink } from "react-csv";

class Currency extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                key: "name",
                text: "Name",
                className: "currencyName",
                align: "left",
                sortable: true,
                width: 200
            },
            {
                key: "type",
                text: "Type",
                className: "currencyName",
                align: "left",
                sortable: true,
                width: 200
            },
            {
                key: "coin",
                text: "Coin",
                className: "currencyName",
                align: "left",
                sortable: true,
                width: 200
            },
            {
                key: "status",
                text: "status",
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
                    return (
                        <Fragment>
                            <button
                                data-toggle="modal"
                                data-target="#update-currency-modal"
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
            filename: "Currency",
            no_data_text: 'No Currency found!',
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
            addFormModal: false,
            editFormModal: false,
            page: 1,
            limit: 10,
            count: 0,
            loader: false,
            records: [],
            imageUrl: '',
        };

        this.fetchCurrencyList = this.fetchCurrencyList.bind(this);
        this.handlePagination = this.handlePagination.bind(this);
        this.handleCloseAddForm = this.handleCloseAddForm.bind(this);
        this.handleCloseEditForm = this.handleCloseEditForm.bind(this);
        this.refetch = this.refetch.bind(this);
        this.exportPDF = this.exportPDF.bind(this);
        this.DownloadeCSV = this.DownloadeCSV.bind(this);
        this.DownloadeXLS = this.DownloadeXLS.bind(this);
    }

    componentDidMount() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export:'false'
        }
        this.fetchCurrencyList(reqData)
    };

    async fetchCurrencyList(reqData) {
        this.setState({ 'loader': true })
        try {
            const { status, loading, message, result } = await currencyList(reqData)
            this.setState({ 'loader': loading })
            if (status == 'success') {
                this.setState({ "count": result.count, 'records': result.data, 'imageUrl': result.imageUrl })
            }
        } catch (err) { }
    }

    handlePagination(index) {
        let reqData = {
            page: index.page_number,
            limit: index.page_size,
            search: index.filter_value
        }
        this.fetchCurrencyList(reqData);
        this.setState({ page: index.page_number, limit: index.page_size, search: index.filter_value })
    }

    addRecord() {
        this.setState({ addFormModal: true })
    }

    editRecord(record) {
        this.setState({
            editFormModal: true,
            editRecord: record
        })
    }

    handleCloseAddForm() {
        this.setState({ addFormModal: false })
    }

    handleCloseEditForm() {
        this.setState({ editFormModal: false, editRecord: {} })
    }

    refetch() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit
        }
        this.fetchCurrencyList(reqData)
    }

    async exportPDF() {
        const { records } = this.state;
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export:'pdf'
        }
        
        const { status, loading, message, result } = await currencyList(reqData)
        if(status){
            const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "landscape"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(13);

        const title = "Currency";
        const headers = [
            [
                "Name",
                "Type",
                "Coin",
               "status",

            ],
        ];

        const data =
        result && result.pdfData.length > 0 &&
        result.pdfData.map((elt) => [

              elt.name,
              elt.type,
              elt.coin,
              elt.status
            ]);

        let content = {
            startY: 50,
            head: headers,
            body: data,
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("Currency.pdf");
        }
        
    }

    async DownloadeCSV (){
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export:'csv'
        }
        
        const { status, loading, message, result } = await currencyList(reqData)
    }
    async DownloadeXLS (){
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export:'xls'
        }
        
        const { status, loading, message, result } = await currencyList(reqData)
    }

    render() {
        const { addFormModal, editFormModal, editRecord, loader, count, imageUrl ,records } = this.state;

        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <CurrencyAddModal
                        isShow={addFormModal}
                        onHide={this.handleCloseAddForm}
                        fetchData={this.refetch}
                    />
                    <CurrencyUpdateModal
                        isShow={editFormModal}
                        onHide={this.handleCloseEditForm}
                        fetchData={this.refetch}
                        record={editRecord}
                        imageUrl={imageUrl}
                    />


                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <button
                                onClick={() => this.addRecord()}
                                className="btn btn-outline-primary float-right mt-3 mr-2"
                            ><FontAwesomeIcon icon={faPlus}  className="mr-1" /> Add Currency
                            </button>
                            <div className="clearfix" />
                            <h3 className="mt-2 text-secondary"> Currency List</h3>
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
                            <ReactDatatable className="table table-bordered table-striped"
                                config={this.config}
                                records={this.state.records}
                                columns={this.columns}
                                dynamic={true}
                                total_record={count}
                                loading={loader}
                                onChange={this.handlePagination}
                            />
                        </div>
                    </div>
                    <ToastContainer />
                </div>
            </div>
        );
    }

}
export default Currency
