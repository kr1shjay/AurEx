import React, { Component, Fragment } from "react";
import ReactDatatable from '@ashvin27/react-datatable';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { ToastContainer } from "react-toastify";

// import component
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import AdminAddModal from "../partials/AddAdminModal";
import EditAdminModal from "../partials/EditAdminModal";

// import action
import { list } from '../../actions/admin';
// import Routers from '../pages/routes'
class SubAdmin extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                key: "name",
                text: "Name",
                className: "name",
                align: "left",
                sortable: true,
                width: 200
            },
            {
                key: "_id",
                text: "Admin Id",
                className: "currencyName",
                align: "left",
                sortable: true,
                width: 200
            },
            {
                key: "email",
                text: "Email",
                className: "currencyName",
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

        this.fetchList = this.fetchList.bind(this);
        this.handleCloseAddForm = this.handleCloseAddForm.bind(this);
        this.handleCloseEditForm = this.handleCloseEditForm.bind(this);
        this.refetch = this.refetch.bind(this);
    }

    componentDidMount() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit
        }
        this.fetchList(reqData)
    };

    async fetchList(reqData) {
        this.setState({ 'loader': true })
        try {
            const { status, loading, message, result } = await list(reqData)
            this.setState({ 'loader': loading })
            if (status == 'success') {
                this.setState({ "count": result.count, 'records': result, 'imageUrl': result.imageUrl })
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

    refetch() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit
        }
        this.fetchCurrencyList(reqData)
    }

    render() {
        const { addFormModal, editFormModal, editRecord, loader, count, imageUrl } = this.state;

        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <AdminAddModal
                        isShow={addFormModal}
                        onHide={this.handleCloseAddForm}
                        fetchData={this.fetchList}
                    />
                    <EditAdminModal
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
                            ><FontAwesomeIcon icon={faPlus} /> creat Admin
                            </button>
                            <div className="clearfix" />
                            <h3 className="mt-2 text-secondary"> Sub Admin</h3>
                            <ReactDatatable className="table table-bordered table-striped user_management_table"
                                config={this.config}
                                records={this.state.records}
                                columns={this.columns}
                                // dynamic={true}
                                // total_record={count}
                                loading={loader}
                                // onChange={this.handlePagination}
                            />
                        </div>
                    </div>
                    <ToastContainer />
                </div>
            </div>
        );
    }

}
export default SubAdmin
