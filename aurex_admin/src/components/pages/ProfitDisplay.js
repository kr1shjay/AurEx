import React from 'react'
import { ProfitManagementAction } from '../../actions/ProfitAction';
import Navbar from '../partials/Navbar';
import Sidebar from '../partials/Sidebar'
import ReactDatatable from '@ashvin27/react-datatable';
import { momentFormat } from '../../lib/dateTimeHelper'
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { CSVLink } from "react-csv";

class ProfitManagement extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                key: "createdAt",
                text: "CreatedAt",
                className: "createdAt",
                align: "left",
                sortable: true,
                width: 200,
                cell: records => {
                    return momentFormat(records.createdAt, 'YYYY-MM-DD HH:mm')
                }
            },
            {
                key: "userId",
                text: "UserId",
                className: "UserId",
                align: "left",
                sortable: true,
                width: 200
            },
            {
                key: "coin",
                text: "Coin",
                className: "Coin",
                align: "left",
                sortable: true,
                width: 200
            },
            {
                key: "type",
                text: "Type",
                className: "Type",
                align: "left",
                sortable: true,
                width: 200
            },
            {
                key: "fee",
                text: "Fee",
                className: "Fee",
                align: "left",
                sortable: true,
                width: 200
            },

        ];

        this.config = {
            page_size: 10,
            length_menu: [10, 20, 50],
            filename: "ProfitManagement",
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
            search: '',
            records: [],
            loader: false,
            page: 1,
            limit: 10,
            count: 0,
        };


        this.getProfitManagement = this.getProfitManagement.bind(this);
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
            export: 'false'
        }
        this.getProfitManagement(reqData);
    }
    handlePagination(index) {
        let reqData = {
            page: index.page_number,
            limit: index.page_size,
            search: index.filter_value
        }
        this.getProfitManagement(reqData);
        this.setState({ page: index.page_number, limit: index.page_size, search: index.filter_value })
    }
    async getProfitManagement(reqData) {
        try {
            this.setState({ 'loader': true })
            let { status, loading, message, result } = await ProfitManagementAction(reqData)
            this.setState({ 'loader': loading })
            if (status == 'success') {
                this.setState({ "count": result.count, 'records': result.data })
            }
        }
        catch (err) {

        }

    }
    async exportPDF() {
        const { records } = this.state
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export: 'pdf'
        }
        let { status, loading, message, result } = await ProfitManagementAction(reqData)
        if (status) {
            const unit = "pt";
            const size = "A4"; // Use A1, A2, A3 or A4
            const orientation = "landscape"; // portrait or landscape

            const marginLeft = 40;
            const doc = new jsPDF(orientation, unit, size);

            doc.setFontSize(13);

            const title = "ProfitManagement";
            const headers = [
                [
                    "CreatedAt",
                    "UserId",
                    "Coin",
                    "Type",
                    "Fee"
                ],
            ];

            const data =
                result && result.pdfData.length > 0 &&
                result.pdfData.map((elt) => [
                    elt.createdAt,
                    elt.userId,
                    elt.coin,
                    elt.type,
                    elt.fee
                ]);

            let content = {
                startY: 50,
                head: headers,
                body: data,
            };

            doc.text(title, marginLeft, 40);
            doc.autoTable(content);
            doc.save("ProfitManagement.pdf");
        }

    }

    async DownloadeCSV() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export: 'csv'
        }
        let { status, loading, message, result } = await ProfitManagementAction(reqData)
    }
    async DownloadeXLS() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit,
            export: 'xls'
        }
        let { status, loading, message, result } = await ProfitManagementAction(reqData)
    }
    render() {
        const { records, count } = this.state
        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <div className="container-fluid">
                        <h3 className="mt-2 text-secondary">Profit Management</h3>
                        <div>

                            {records && records.length > 0 ? (
                                <button onClick={this.exportPDF} className='btn btn-info' style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(PDF)</button>
                            ) : (
                                ""
                            )}

                            {records && records.length > 0 ? (

                                <button className='btn btn-info' onClick={this.DownloadeCSV} style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(CSV)</button>
                            ) : (
                                ""
                            )}

                            {records && records.length > 0 ? (

                                <button className='btn btn-info' onClick={this.DownloadeXLS} style={{ width: '118px', height: '35px', fontSize: '13px' }}>Download(XLS)</button>
                            ) : (
                                ""
                            )}
                        </div>
                        <ReactDatatable className="table table-bordered table-striped user_management_table"
                            // responsive={this.state.responsive}
                            config={this.config}
                            records={records}
                            columns={this.columns}
                            dynamic={true}
                            total_record={count}
                            //loading={loader}
                            onChange={this.handlePagination}
                        />
                    </div>
                </div>


            </div>

        );
    }
}

export default ProfitManagement;