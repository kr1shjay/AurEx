import React, { Component, Fragment } from "react";
import { Modal, Button } from 'react-bootstrap';
import ReactDatatable from '@ashvin27/react-datatable';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";


import keys from "../../actions/config";

// import component
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";

const url = keys.baseUrl;

class Liquidated extends Component {
    constructor(props) {
        super(props);
        this.columns = [

            {
                key: "pairname",
                text: "Pairname",
                className: "pairname",
                align: "left",
                sortable: true
            },
            {
                key: "user_id",
                text: "User email",
                className: "user_id",
                align: "left",
                sortable: true,
                width: 200,
            },

            {
                key: "quantity",
                text: "Quantity",
                className: "quantity",
                align: "left",
                sortable: true
            },
            {
                key: "entry_price",
                text: "Entry price",
                className: "entry_price",
                align: "left",
                sortable: true
            },
            {
                key: "exit_price",
                text: "Exit price",
                className: "exit_price",
                align: "left",
                sortable: true
            },
            {
                key: "profitnloss",
                text: "Proft/Loss",
                className: "profitnloss",
                align: "left",
                sortable: true,
            },
            {
                key: "closing_direction",
                text: "Type",
                className: "closing_direction",
                align: "left",
                sortable: true
            },
            {
                key: "createdDate",
                text: "createdDate",
                className: "createdDate",
                align: "left",
                sortable: true
            },

        ];

        this.config = {
            page_size: 10,
            length_menu: [10, 20, 50],
            filename: "Withdraw",
            no_data_text: 'No Records found!',
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
            showDetails: false,
            id: '',
            status: '',
            transferamount: '',
            cryptoType: '',
            userId: '',
            receiveraddress: '',
            tagid: '',
            errors: ''

        };
        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        this.getData()
    };
    showDetails = (record) => {
        this.setState({ receiveraddress: record.receiveraddress.address })
        this.setState({ tagid: record.receiveraddress.tagid })
        this.setState({ id: record._id })
        this.setState({ cryptoType: record.cryptoType })
        this.setState({ transferamount: record.transferamount })
        this.setState({ status: record.status })
        this.setState({ showDetails: true })
    }
    confirmSubmit = () => {
        var id = this.state.id;
        var passVal = { id: id, status: "Confirmed" };
        axios
            .post(url + "api/updatewithdraw", passVal)
            .then(res => {
                toast(res.data.message, {
                    position: toast.POSITION.TOP_CENTER
                });
                this.setState({ showDetails: false });
                this.getData();
            })
            .catch()
    }
    rejectSubmit = () => {
        var id = this.state.id;
        var passVal = { id: id, status: "Rejected" };
        axios
            .post(url + "api/updatewithdraw", passVal)
            .then(res => {
                toast(res.data.message, {
                    position: toast.POSITION.TOP_CENTER
                });
                this.setState({ showDetails: false });
                this.getData();
            })
            .catch()
    }

    handleClosedetails = (record) => {
        this.setState({ showDetails: false })
    }
    getData() {
        axios
            .post(url + "api/liquidated-data")
            .then(res => {
                console.log(res);
                this.setState({ records: res.data })
            })
            .catch()
    }


    pageChange(pageData) {
        console.log("OnPageChange", pageData);
    }

    render() {
        return (
            <div>
                <Modal show={this.state.showDetails} onHide={this.handleClosedetails} aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="popUpSpace">
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="answer">To address</label>
                                </div>
                                <div className="col-md-9">
                                <span className="word_brak">{this.state.receiveraddress}</span>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="answer">Tag id/Memo</label>
                                </div>
                                <div className="col-md-9">
                                    {this.state.tagid}
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="answer">Transfer Coin</label>
                                </div>
                                <div className="col-md-9">
                                    {this.state.cryptoType}
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="answer">Transfer Amount</label>
                                </div>
                                <div className="col-md-9">
                                    {this.state.transferamount}
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="answer">Status</label>
                                </div>
                                <div className="col-md-9">
                                    {this.state.status}
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger btnDefaultNewBlue" onClick={this.rejectSubmit}>
                            Reject
                        </Button>
                        <Button onClick={this.confirmSubmit} variant="success btnDefaultNew" >
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <h3 className="mt-2 text-secondary">Liquidated List</h3>
                            <ReactDatatable className="table table-bordered table-striped user_management_table"
                                config={this.config}
                                records={this.state.records}
                                columns={this.columns}
                                onPageChange={this.pageChange.bind(this)}
                            />
                        </div>
                    </div>
                    <ToastContainer />
                </div>
            </div>
        );
    }

}

Liquidated.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    records: state.records
});

export default connect(
    mapStateToProps
)(Liquidated);
