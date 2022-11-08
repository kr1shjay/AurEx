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
import ContactUpdateModal from "../partials/ContactUpdateModal";
import { toast, ToastContainer } from "react-toastify";
import keys from "../../actions/config";


//action
import { GetData } from '../../actions/contactusAction'


const url = keys.baseUrl;
class Contactus extends Component {
    constructor(props) {
        super(props);

        this.columns = [

            {
                key: "name",
                text: "Name",
                className: "name",
                align: "left",
                sortable: true,
            },
            {
                key: "email",
                text: "Email",
                className: "email",
                align: "left",
                sortable: true
            },
            {
                key: "usrMsg",
                text: "Message",
                className: "message",
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
                                data-target="#update-contact-modal"
                                className="btn btn-primary btn-sm"
                                onClick={() => this.editRecord(record)}
                                style={{ marginRight: '5px' }}>
                                <i className="fa fa-reply"></i>
                            </button>
                            {/* <button
                                className="btn btn-danger btn-sm"
                                onClick={() => this.FetchData()}>
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
            records: []
        };

        this.state = {
            currentRecord: {
                _id: '',
                name: '',
                email: '',
                mobilenumber: '',
                message: '',
                reply: ''
            }
        };

        this.FetchData = this.FetchData.bind(this);
    }

    componentDidMount() {
        this.FetchData()
    };



    async FetchData() {
        let { status, result } = await GetData()
        if (status) {
            this.setState({ records: result })
        }
    }

    async

    editRecord(record) {
        this.setState({ currentRecord: record });
    }

    // async deleteRecord(record) {

    //     let {status } = await DeleteData()
    // console.log(record);
    // axios
    //     .post(url + "api/contact-delete", { _id: record._id })
    //     .then(res => {
    //         if (res.status === 200) {
    //             toast(res.data.message, {
    //                 position: toast.POSITION.TOP_CENTER,
    //             })
    //         }
    //     })
    //     .catch();
    // this.getData();
    // }



    render() {
        let { records } = this.state
        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <ContactUpdateModal
                        record={this.state.currentRecord}
                        onDelete={this.FetchData}
                    />
                    <div id="page-content-wrapper">
                        <div className="container-fluid user_asset_modal_table" style={{ 'overflow': 'auto' }}>
                            <h3 className="mt-2 text-secondary">Enquires List</h3>
                            <ReactDatatable className="table table-bordered table-striped user_management_table"
                                config={this.config}
                                records={records}
                                columns={this.columns}
                            // onPageChange={this.pageChange.bind(this)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

Contactus.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    records: state.records
});

export default connect(
    mapStateToProps
)(Contactus);
