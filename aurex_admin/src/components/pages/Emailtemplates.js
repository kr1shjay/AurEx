import React, { Component, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDatatable from '@ashvin27/react-datatable';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

// import component
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
// import TemplateAddModal from "../partials/TemplateAddModal";
import TemplateUpdateModal from "../partials/TemplateUpdateModal";

// import action
import { templateList } from '../../actions/emailTemplateAction';
import { getLanguage } from '../../actions/languageAction';

class Emailtemplates extends Component {

    constructor(props) {
        super(props);

        this.columns = [
            {
                key: "identifier",
                text: "Identifier",
                className: "identifier",
                align: "left",
                sortable: true
            },
            {
                key: "subject",
                text: "Subject",
                className: "subject",
                align: "left",
                sortable: true,
            },
            {
                key: "langCode",
                text: "Language Code",
                className: "subject",
                align: "left",
                sortable: true,
            },
            {
                key: "status",
                text: "Status",
                className: "subject",
                align: "left",
                sortable: true,
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
                            data-target="#update-template-modal"
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
            filename: "Emailtemplates",
            no_data_text: 'No Email Templates found!',
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
            languageOption: []
        };

        this.fetchTemplate = this.fetchTemplate.bind(this);
        this.refetch = this.refetch.bind(this);
        this.fetchLanguageDropDown = this.fetchLanguageDropDown.bind(this);
        this.handleCloseAddForm = this.handleCloseAddForm.bind(this);
        this.handleCloseEditForm = this.handleCloseEditForm.bind(this);
        this.handlePagination = this.handlePagination.bind(this)
    }

    componentDidMount() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit
        }
        this.fetchTemplate(reqData)
        this.fetchLanguageDropDown()
    };

    async fetchLanguageDropDown() {
        try {
            const { status, result } = await getLanguage()
            if (status == 'success') {
                this.setState({ 'languageOption': result })
            }
        } catch (err) { }
    }

    async fetchTemplate(reqData) {
        this.setState({ 'loader': true })
        try {
            const { status, loading, message, result } = await templateList(reqData)
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

    handlePagination(index) {
        let reqData = {
            page: index.page_number,
            limit: index.page_size,
            search: index.filter_value
        }
        this.fetchTemplate(reqData);
        this.setState({ page: index.page_number, limit: index.page_size, search: index.filter_value })
    }

    addRecord() {
        this.setState({ addFormModal: true })
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
        this.fetchTemplate(reqData)
    }

    render() {
        const { addFormModal, editFormModal, editRecord, loader, count, languageOption } = this.state;

        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    {/* <TemplateAddModal
                        isShow={addFormModal}
                        onHide={this.handleCloseAddForm}
                        languageOption={languageOption}
                        fetchData={this.refetch}
                    /> */}
                    <TemplateUpdateModal
                        isShow={editFormModal}
                        onHide={this.handleCloseEditForm}
                        fetchData={this.refetch}
                        languageOption={languageOption}
                        record={editRecord}
                    />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            {/* <button onClick={() => this.addRecord()} className="btn btn-outline-primary float-right mt-3 mr-2" data-toggle="modal" data-target="#add-template-modal"><FontAwesomeIcon icon={faPlus} /> Add Template</button> */}
                            <h3 className="mt-2 text-secondary">Email Templates List</h3>
                            <ReactDatatable className="table table-bordered table-striped email_table"
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
                </div>
            </div>
        );
    }

}

Emailtemplates.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    records: state.records
});

export default connect(
    mapStateToProps
)(Emailtemplates);
