import React, { Component, Fragment } from "react";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons/faList";
import ReactDatatable from '@ashvin27/react-datatable';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { toast, ToastContainer } from "react-toastify";
import $ from 'jquery';
import keys from "../../actions/config";

// import action
import { faqCategoryList } from '../../actions/faqActions'

// import component
import AddFaqCategoryModal from "../partials/AddFaqCategoryModal";
import EditFaqCategoryModal from "../partials/EditFaqCategoryModal";

const url = keys.baseUrl;

class FaqCategory extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                key: "name",
                text: "Category Name",
                className: "question",
                align: "left",
                sortable: true,
                width: 200
            },
            {
                key: "status",
                text: "Status",
                className: "answer",
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
                                data-target="#update-faq-modal"
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
            filename: "Faq",
            no_data_text: 'No Faq found!',
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
            loader: false,
            addFormModal: false,
            editFormModal: false,
        };

        this.state = {
            currentRecord: {
                id: '',
                question: '',
                answer: '',
                errors: ''
            }
        };

        this.fetchFaqCategory = this.fetchFaqCategory.bind(this);
        this.handleCloseAddForm = this.handleCloseAddForm.bind(this);
        this.handleCloseEditForm = this.handleCloseEditForm.bind(this);
        
    }

    componentDidMount() {
        this.fetchFaqCategory()
    };

    async fetchFaqCategory() {
        try {
            this.setState({ "loader": true })
            const { status, loading, result } = await faqCategoryList()
            this.setState({ "loader": loading })
            if (status == 'success') {
                this.setState({ "records": result })
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


    render() {
        const { loader, addFormModal, editFormModal, editRecord } = this.state;

        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <AddFaqCategoryModal
                        isShow={addFormModal}
                        onHide={this.handleCloseAddForm}
                        fetchData={this.fetchFaqCategory}
                    />
                    <EditFaqCategoryModal
                        isShow={editFormModal}
                        onHide={this.handleCloseEditForm}
                        fetchData={this.fetchFaqCategory}
                        record={editRecord}
                    />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <button onClick={() => this.addRecord()} className="btn btn-outline-primary float-right mt-3 mr-2" ><FontAwesomeIcon icon={faPlus}  className="mr-1" /> Add FAQ Category</button>
                            <div className="clearfix" />
                            <h3 className="mt-2 text-secondary">FAQ Category List</h3>
                            <ReactDatatable className="table table-bordered table-striped user_management_table"
                                config={this.config}
                                records={this.state.records}
                                columns={this.columns}
                                loading={loader}
                            />
                        </div>
                    </div>
                    <ToastContainer />
                </div>
            </div>
        );
    }

}

export default FaqCategory;