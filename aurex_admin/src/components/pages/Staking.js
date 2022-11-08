import React, { Component, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDatatable from '@ashvin27/react-datatable';
import { faPlus } from "@fortawesome/free-solid-svg-icons";

// import component
import StakingAddModal from "../partials/StakingAddModal";
import StakingUpdateModal from "../partials/StakingUpdateModal";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";


//import downloads
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { CSVLink } from "react-csv";


// import action
import { stakingList } from '../../actions/staking';
import { getCurrency } from '../../actions/currency';

class Staking extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                key: "coin",
                text: "Coin",
                className: "stakingName",
                align: "left",
                sortable: true,
                width: 200
            },
            {
                key: "minimumAmount",
                text: "Minimum Amount",
                className: "stakingName",
                align: "left",
                sortable: true,
                width: 200
            },
            {
                key: "maximumAmount",
                text: "Maximum Amount",
                className: "stakingName",
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
                                data-target="#update-staking-modal"
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
            filename: "Staking",
            no_data_text: 'No Stacking found!',
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
            editRecord: {},
            records: [],
            search: '',
            page: 1,
            limit: 10,
            count: 0,
            loader: false,
            currencyOption: []
        };


        this.fetchStakeList = this.fetchStakeList.bind(this);
        this.handleCloseAddForm = this.handleCloseAddForm.bind(this);
        this.handleCloseEditForm = this.handleCloseEditForm.bind(this);
        this.exportPDF = this.exportPDF.bind(this);
        this.DownloadeCSV = this.DownloadeCSV.bind(this);
        this.DownloadeCSV = this.DownloadeCSV.bind(this);
        this.DownloadeXLS = this.DownloadeXLS.bind(this);
    }

    componentDidMount() {
        this.fetchCurrency()
        this.fetchStakeList()
    };

    async fetchStakeList() {
        try {
            let Data = {
                export : 'false'
            }
            this.setState({ "loader": true })
            const { status, loading, message, result } = await stakingList(Data);
            this.setState({ "loader": loading })
            if (status == 'success') {
                this.setState({ records: result })
            }
        } catch (err) { }
    }

    async fetchCurrency() {
        try {
            const { status, loading, message, result } = await getCurrency();
            if (status == 'success') {
                this.setState({ currencyOption: result })
            }
        } catch (err) { }
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

    async exportPDF() {
        const { records } = this.state;

        let Data = {
            export: 'pdf'
        }
        let { status, loading, message, result } = await stakingList(Data);
        if (status) {
            const unit = "pt";
            const size = "A4"; // Use A1, A2, A3 or A4
            const orientation = "landscape"; // portrait or landscape

            const marginLeft = 40;
            const doc = new jsPDF(orientation, unit, size);

            doc.setFontSize(13);

            const title = "Staking";
            const headers = [
                [
                    "Staking Currency",
                    "Minimum Amount",
                    "Maximum Amount",
                    "Status",

                ],
            ];

            const data =
                result && result.pdfData.length > 0 &&
                result.pdfData.map((elt) => [

                    elt.coin,
                    elt.minimumAmount,
                    elt.maximumAmount,
                    elt.status
                ]);

            let content = {
                startY: 50,
                head: headers,
                body: data,
            };

            doc.text(title, marginLeft, 40);
            doc.autoTable(content);
            doc.save("Staking.pdf");
        }

    }

    async DownloadeCSV() {
        let Data = {
            export: 'csv'
        }
        const { status, loading, message, result } = await stakingList(Data);
    }

    async DownloadeXLS() {
        let Data = {
            export: 'csv'
        }
        const { status, loading, message, result } = await stakingList(Data);
    }


    render() {
        const { addFormModal, currencyOption, loader, editFormModal, editRecord, records } = this.state;

        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <StakingAddModal
                        isShow={addFormModal}
                        onHide={this.handleCloseAddForm}
                        currencyOption={currencyOption}
                        fetchData={this.fetchStakeList}
                    />
                    <StakingUpdateModal
                        isShow={editFormModal}
                        onHide={this.handleCloseEditForm}
                        currencyOption={currencyOption}
                        record={editRecord}
                        fetchData={this.fetchStakeList}
                    />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <button
                                onClick={() => this.addRecord()}
                                className="btn btn-outline-primary float-right mt-3 mr-2" >
                                <FontAwesomeIcon icon={faPlus}  className="mr-1" /> Add Staking

                            </button>
                            <div className="clearfix" />
                            <h3 className="mt-2 text-secondary"> Staking List</h3>
                            {records && records.length > 0 ? (
                                <button onClick={this.exportPDF} className='btn btn-info' style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(PDF)</button>
                            ) : (
                                ""
                            )}

                            {records && records.length > 0 ? (
                                // <CSVLink
                                //     data={records}
                                //     filename={"Staking.csv"}
                                //     className="btn btnTrade1 py-4"
                                // >
                                <button className='btn btn-info' onClick={this.DownloadeCSV} style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(CSV)</button>
                                //</CSVLink> 
                            ) : (
                                ""
                            )}

                            {records && records.length > 0 ? (
                                <CSVLink
                                    data={records}
                                    filename={"Staking.xls"}

                                >
                                    <button className='btn btn-info' style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(XLS)</button>
                                </CSVLink>
                            ) : (
                                ""
                            )}
                            <ReactDatatable className="table table-bordered table-striped user_management_table"
                                config={this.config}
                                records={this.state.records}
                                columns={this.columns}
                                loading={loader}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default Staking;