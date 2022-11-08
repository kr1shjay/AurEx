import React, { Component, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDatatable from '@ashvin27/react-datatable';


import { faPlus } from "@fortawesome/free-solid-svg-icons";

import CurrencyUpdateModal from "../partials/CurrencyUpdateModal";

import keys from "../../actions/config";

// import action
import { languageList } from '../../actions/languageAction';

// import component
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import LanguageAddModal from '../partials/LanguageAddModal';
import LanguageEditModal from '../partials/LanguageEditModal';


const url = keys.baseUrl;

class LanguagePage extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                key: "name",
                text: "Name",
                className: "currencyName",
                align: "left",
                sortable: true,
                width: 200,
                cell: record => {
                    if (record.isPrimary) {
                        return `${record.name} - Primary`
                    }
                    return `${record.name}`
                }
            },
            {
                key: "code",
                text: "Code",
                className: "status",
                align: "left",
                sortable: true
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
            records: [],
            addFormModal: false,
            editFormModal: false,
            editRecord: {},
        };

        this.fetchLanguage = this.fetchLanguage.bind(this);
        this.handleCloseAddForm = this.handleCloseAddForm.bind(this);
        this.handleCloseEditForm = this.handleCloseEditForm.bind(this);
    }

    componentDidMount() {
        this.fetchLanguage()
    };


    async fetchLanguage() {
        try {
            const { status, loading, result } = await languageList();
            if (status == 'success') {
                this.setState({ 'records': result })
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
        const { addFormModal, editFormModal, editRecord } = this.state;

        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <LanguageAddModal
                        isShow={addFormModal}
                        onHide={this.handleCloseAddForm}
                        fetchData={this.fetchLanguage}
                    />
                    <LanguageEditModal
                        isShow={editFormModal}
                        onHide={this.handleCloseEditForm}
                        fetchData={this.fetchLanguage}
                        record={editRecord}
                    />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <button
                                onClick={() => this.addRecord()}
                                className="btn btn-outline-primary float-right mt-3 mr-2"
                            >
                                <FontAwesomeIcon icon={faPlus}  className="mr-1" /> Add Language
                            </button>
                            <div className="clearfix" />
                            <h3 className="mt-2 text-secondary"> Language List</h3>
                            <ReactDatatable className="table table-bordered table-striped user_management_table"
                                config={this.config}
                                records={this.state.records}
                                columns={this.columns}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default LanguagePage;