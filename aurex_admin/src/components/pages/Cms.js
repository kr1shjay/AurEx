// import package
import React, { Component } from "react";
import ReactDatatable from '@ashvin27/react-datatable';

// import component
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
// import CmsAddModal from "../partials/CmsAddModal";
import CmsUpdateModal from "../partials/CmsUpdateModal";

// import action
import { getCmsList } from '../../actions/cmsActions'

class CmsPage extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                key: "identifier",
                text: "Page name",
                className: "identifier",
                align: "left",
                sortable: true
            },
            {
                key: "status",
                text: "Status",
                className: "identifier",
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
                        <button
                            data-toggle="modal"
                            data-target="#update-cms-modal"
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
            filename: "Cms",
            no_data_text: 'No CMS found!',
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
            loader: false,
            records: [],
            addFormModal: false,
            editFormModal: false,
            editRecord: {},
        };

        this.fetchCmsData = this.fetchCmsData.bind(this);
        this.handleCloseEditForm = this.handleCloseEditForm.bind(this);
    }

    componentDidMount() {
        this.fetchCmsData();
    };

    async fetchCmsData() {
        try {
            this.setState({ "loader": true })
            const { status, loading, result , errors } = await getCmsList();
            this.setState({ "loader": loading })
            if (status == 'success') {
                this.setState({ "records": result })
            }
            if(errors){
                console.log(errors,'//////////////////////')
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

    handleCloseEditForm() {
        this.setState({ editFormModal: false, editRecord: {} })
    }

    render() {
        const { editFormModal, editRecord, loader } = this.state;

        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    {/* <CmsAddModal
                        isShow={addFormModal}
                        onHide={this.handleCloseAddForm}
                        fetchData={this.fetchLanguage}
                    /> */}
                    <CmsUpdateModal
                        isShow={editFormModal}
                        onHide={this.handleCloseEditForm}
                        fetchData={this.fetchCmsData}
                        record={editRecord}
                    />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <h3 className="mt-2 text-secondary">Cms List</h3>
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

export default CmsPage
