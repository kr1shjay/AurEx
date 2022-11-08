import React, { Component, Fragment } from "react";
import ReactDatatable from '@ashvin27/react-datatable';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//import compoents

import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import CategoryAdd from '../partials/supportCategoryAdd';
import CategoryUpdate from "../partials/supportCategoryUpdate"


//import action

import { categoryList } from '../../actions/supportAction'



class SupportCategory extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                key: "categoryName",
                text: "Category Name",
                className: "categoryName",
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
            loader: "",
            page: 1,
            limit: 10,
            count: 0,

        };


        this.getCategoryList = this.getCategoryList.bind(this);
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
        this.getCategoryList(reqData);

    };


    async getCategoryList(reqData) {
        try {
            this.setState({ 'loader': true })

            const { status, loading, result } = await categoryList(reqData);
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
        this.setState({ addFormModal: true })
    }

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
        this.getCategoryList(reqData);
        this.setState({ page: index.page_number, limit: index.page_size, search: index.filter_value })
    }



    render() {
        const { addFormModal, editRecord, editFormModal, currencyOptions } = this.state;

        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <CategoryAdd
                        isShow={addFormModal}
                        onHide={this.handleCloseAddForm}
                        currencyOptions={currencyOptions}
                        fetchData={this.getCategoryList}
                    />
                    <CategoryUpdate
                        isShow={editFormModal}
                        onHide={this.handleCloseEditForm}
                        currencyOptions={currencyOptions}
                        fetchData={this.getCategoryList}
                        record={editRecord}
                    />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <button onClick={() => this.addRecord()} className="btn btn-outline-primary float-right mt-3 mr-2" data-toggle="modal" data-target="#add-spot-modal"><FontAwesomeIcon icon={faPlus}  className="mr-1" />Add Category</button>
                            <div className="clearfix" />
                            <h3 className="mt-2 text-secondary">Support Category List</h3>
                            <ReactDatatable className="table table-bordered table-striped user_management_table"
                                config={this.config}
                                records={this.state.records}
                                columns={this.columns}
                                dynamic={true}
                                onChange={this.handlePagination}
                            />
                        </div>
                    </div>

                </div>
            </div>
        );
    }

}

export default SupportCategory;