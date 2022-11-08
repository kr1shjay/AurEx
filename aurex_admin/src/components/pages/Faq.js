import React, { Component, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDatatable from '@ashvin27/react-datatable';
import { faPlus } from "@fortawesome/free-solid-svg-icons";

// import component
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import FaqAddModal from "../partials/FaqAddModal";
import FaqUpdateModal from "../partials/FaqUpdateModal";

// import action
import { getFaqCategory, faqList } from '../../actions/faqActions'



class FaqPage extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                key: "categoryName",
                text: "Category Name",
                className: "question",
                align: "left",
                sortable: true,
                width: 200
            },
            {
                key: "question",
                text: "Question",
                className: "question",
                align: "left",
                sortable: true,
                width: 200
            },
            {
                key: "answer",
                text: "Answer",
                className: "answer",
                align: "left",
                sortable: true
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
                            {/* <button
                                className="btn btn-danger btn-sm"
                                onClick={() => this.deleteRecord(record)}>
                                <i className="fa fa-trash"></i>
                            </button> */}
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
            addFormModal: false,
            editFormModal: false,
            editRecord: {},
            records: [],
            search: '',
            page: 1,
            limit: 10,
            count: 0,
            loader: false,
            categoryOption: []
        };

        this.fetchFaq = this.fetchFaq.bind(this);
        this.refetch = this.refetch.bind(this);
        this.fetchFaqCategoryDropDown = this.fetchFaqCategoryDropDown.bind(this);
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
        this.fetchFaq(reqData)
        this.fetchFaqCategoryDropDown()
    };

    async fetchFaq(reqData) {
        this.setState({ 'loader': true })
        try {
            const { status, loading, message, result } = await faqList(reqData)
            this.setState({ 'loader': loading })
            if (status == 'success') {
                this.setState({ "count": result.count, 'records': result.data })
            }
        } catch (err) { }
    }

    async fetchFaqCategoryDropDown() {
        try {
            const { status, result } = await getFaqCategory()
            if (status == 'success') {
                this.setState({ 'categoryOption': result })
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
        this.fetchFaq(reqData)
    }

    handlePagination(index) {
        let reqData = {
            page: index.page_number,
            limit: index.page_size,
            search: index.filter_value
        }
        this.fetchFaq(reqData);
        this.setState({ page: index.page_number, limit: index.page_size, search: index.filter_value })
    }

    render() {
        const { addFormModal, editFormModal, editRecord, loader, count, categoryOption } = this.state;

        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <FaqAddModal
                        isShow={addFormModal}
                        onHide={this.handleCloseAddForm}
                        categoryOption={categoryOption}
                        fetchData={this.refetch}
                    />
                    <FaqUpdateModal
                        isShow={editFormModal}
                        onHide={this.handleCloseEditForm}
                        fetchData={this.refetch}
                        categoryOption={categoryOption}
                        record={editRecord}
                    />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <button onClick={() => this.addRecord()}
                                className="btn btn-outline-primary float-right mt-3 mr-2" ><FontAwesomeIcon icon={faPlus}  className="mr-1" /> Add FAQ</button>
                                 <div className="clearfix" />
                            <h3 className="mt-2 text-secondary">FAQ List</h3>
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
                </div>
            </div>
        );
    }

}

export default FaqPage;
