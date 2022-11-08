import React, { Component, Fragment } from "react";
import ReactDatatable from '@ashvin27/react-datatable';
//import compoentns
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import { momentFormat, dateTimeFormat } from "../../lib/dateTimeHelper";
//imprt actions
import { TicketList } from '../../actions/supportAction'


//import downloads
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { CSVLink } from "react-csv";

class Support extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                key: "tickerId",
                text: "Ticket ID",
                className: "Id",
                align: "left",
                sortable: false,
            },
            {
                key: "ursUiqueId",
                text: "User Id",
                className: "userName",
                align: "left",
                sortable: false,
            },
            {
                key: "categoryName",
                text: "Category Name",
                className: "categoryName",
                align: "left",
                sortable: false,
            },
            {
                key: "status",
                text: "Status",
                className: "status",
                align: "left",
                sortable: false,
            },
            {
                key: "createdAt",
                text: "Date",
                className: "createdAt",
                align: "left",
                sortable: false,
                filter: 'between',
                cell: (record) => {
                    return momentFormat(record.createdAt, 'YYYY-MM-DD HH:mm')
                },
            },
            {
                key: "action",
                text: "Action",
                className: "action",
                width: 100,
                align: "left",
                sortable: false,
                cell: record => {
                    if(record.status == "closed"){
                        return "-"
                    }
                    if(record.status == "open"){
                        return (
                            <Fragment>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => this.editRecord(record.tickerId)}
                                    style={{ marginRight: '5px' }}>
                                    <i className="fa fa-reply"></i>
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
            filename: "Cms",
            no_data_text: 'No Enquires found!',
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
            page: 1,
            limit: 10,
            count: 0,
            loader: false,
        };

        this.getData = this.getData.bind(this);
        this.handlePagination = this.handlePagination.bind(this)
        this.exportPDF = this.exportPDF.bind(this)
        this.DownoladeCSV = this.DownoladeCSV.bind(this)
        this.DownoladeXLS = this.DownoladeXLS.bind(this)

    }

    componentDidMount() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export: 'false'
        }

        this.getData(reqData)
    };

    async getData(reqData) {

        try {
            this.setState({ 'loader': true })

            const { status, loading, result } = await TicketList(reqData);
            this.setState({ 'loader': loading })
            if (status == 'success') {
                this.setState({ "count": result.count, 'records': result.data })
            }
        } catch (err) { }
    }

    async exportPDF() {
        const { records } = this.state;
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export: 'pdf'
        }
        const { status, loading, result } = await TicketList(reqData);
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "landscape"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(13);

        const title = "Support";
        const headers = [
            [
                "Ticket ID",
                "Category Name",
                "Status",
                "Date",

            ],
        ];

        const data =
            result && result.pdfData.length > 0 &&
            result.pdfData.map((elt) => [

                elt.tickerId,
                elt.categoryName,
                elt.status,
                elt.createdAt
            ]);

        let content = {
            startY: 50,
            head: headers,
            body: data,
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("Support.pdf");
    }

    handlePagination(index) {
        console.log(index, 'indexindex')
        let reqData = {
            page: index.page_number,
            limit: index.page_size,
            search: index.filter_value
        }
        this.getData(reqData);
        this.setState({ page: index.page_number, limit: index.page_size, search: index.filter_value })
    }

    editRecord(id) {

        this.props.history.push('/support_reply/' + id)

    }

    async DownoladeCSV() {
        const { records } = this.state;
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export: 'csv'
        }
        const { status, loading, result } = await TicketList(reqData);
    }

    async DownoladeXLS() {
        const { records } = this.state;
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export: 'xls'
        }
        const { status, loading, result } = await TicketList(reqData);
    }


    render() {
        const { count, records } = this.state;
        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <div id="page-content-wrapper">
                        <div className="container-fluid user_asset_modal_table">
                            <h3 className="mt-2 text-secondary mb-4">Support Ticket List</h3>

                            {records && records.length > 0 ? (
                                <button onClick={this.exportPDF} className='btn btn-info mr-2 mb-2' style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(PDF)</button>
                            ) : (
                                ""
                            )}

                            {records && records.length > 0 ? (



                                <button className='btn btn-info mr-2 mb-2' onClick={this.DownoladeCSV}style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(CSV)</button>

                            ) : (
                                ""
                            )}

                            {records && records.length > 0 ? (

                                <button className='btn btn-info mb-2' onClick={this.DownoladeXLS} style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(XLS)</button>

                            ) : (
                                ""
                            )}
                            <ReactDatatable className="table table-bordered table-striped  support_table"
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



export default (Support);
