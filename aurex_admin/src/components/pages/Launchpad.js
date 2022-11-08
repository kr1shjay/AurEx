import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDatatable from '@ashvin27/react-datatable';
import { faPlus } from "@fortawesome/free-solid-svg-icons";

// import component
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import LaunchpadAddModel from "../partials/LaunchpadAddModal";
import LaunchpadUpdateModal from "../partials/LaunchpadUpdateModal";

// import action
import { getCurrency } from '../../actions/currency';
import { launchpadList } from '../../actions/launchPad';

// import lib
import { dateTimeFormat } from '../../lib/dateTimeHelper'

class Launchpad extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                key: "startTimeStamp",
                text: "Start Date",
                className: "date",
                align: "left",
                sortable: true,
                cell: record => {
                    return dateTimeFormat(record.startTimeStamp, 'YYYY-MM-DD HH:mm')
                }
            },
            {
                key: "endTimeStamp",
                text: "End Date",
                className: "date",
                align: "left",
                sortable: true,
                cell: record => {
                    return dateTimeFormat(record.endTimeStamp, 'YYYY-MM-DD HH:mm')
                }
            },
            {
                key: "name",
                text: "Token Name",
                className: "email",
                align: "left",
                sortable: true
            },
            {
                key: "industry",
                text: "Industry",
                className: "email",
                align: "left",
                sortable: true
            },
            {
                key: "website",
                text: "Web Site",
                className: "email",
                align: "left",
                sortable: true
            },
            {
                key: "action",
                text: "Action",
                className: "action",
                width: 200,
                align: "left",
                sortable: false,
                cell: record => {
                    return (
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => this.editRecord(record)}
                            style={{ marginRight: '5px' }}>
                            <i className="fa fa-edit"></i>
                        </button>

                    );
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
            editRecord: {},
            page: 1,
            limit: 10,
            count: 0,
            loader: false,
            addFormModal: false,
            editFormModal: false,
            currencyOption: [],
            whitePaperUrl: '',
        };

        this.fetchCurrency = this.fetchCurrency.bind(this)
        this.fetchList = this.fetchList.bind(this)
        this.handleCloseAddForm = this.handleCloseAddForm.bind(this);
        this.handleCloseEditForm = this.handleCloseEditForm.bind(this);
        this.refetch = this.refetch.bind(this);
    }

    componentDidMount() {
        this.fetchCurrency();
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit
        }
        this.fetchList(reqData);
    };

    async fetchCurrency() {
        try {
            const { status, result } = await getCurrency();
            if (status == 'success') {
                this.setState({ currencyOption: result })
            }
        } catch (err) { }
    }

    async fetchList(reqData) {
        try {
            this.setState({ 'loader': true })
            const { status, loading, result } = await launchpadList(reqData);
            this.setState({ 'loader': loading })
            if (status == 'success') {
                this.setState({
                    "count": result.count,
                    'records': result.data,
                    'whitePaperUrl': result.whitePaperUrl
                })
            }
        } catch (err) { }
    }

    pageChange(pageData) {
        console.log("OnPageChange", pageData);
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
        this.fetchList(reqData)
    }

    render() {
        const { addFormModal, currencyOption, records, count, loader, editFormModal, editRecord, whitePaperUrl } = this.state;
        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <LaunchpadAddModel
                        isShow={addFormModal}
                        currencyList={currencyOption}
                        onHide={this.handleCloseAddForm}
                        fetchData={this.refetch}
                    />
                    <LaunchpadUpdateModal
                        isShow={editFormModal}
                        currencyList={currencyOption}
                        onHide={this.handleCloseEditForm}
                        fetchData={this.refetch}
                        record={editRecord}
                        whitePaperUrl={whitePaperUrl}
                    />

                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <button
                                className="btn btn-outline-primary float-right mt-3 mr-2"
                                onClick={() => this.addRecord()}
                            ><FontAwesomeIcon icon={faPlus}  className="mr-1" /> Add Launchpad
                            </button>
                            <div className="clearfix" />
                            <h3 className="mt-2 text-secondary">Launchpad Management</h3>
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

export default Launchpad;