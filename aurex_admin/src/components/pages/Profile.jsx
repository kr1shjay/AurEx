import React, { Component, Fragment } from "react";
import Navbar from "../partials/Navbar";
import { Modal, Form } from "react-bootstrap";
import classnames from "classnames";
import Sidebar from "../partials/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons/faList";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateProfile } from "../../actions/userActions";
import axios from "axios";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import keys from "../../actions/config";
import { withRouter } from "react-router-dom";
import { getProfile } from "../../actions/admin";
import EditProfileModel from "../partials/EditProfileModeal"
const url = keys.baseUrl;
class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addFormModal: false,
            records: ''
        };
       
    }
  
    handleCloseAddForm = () => {
        this.setState({ addFormModal: false })
    }
    getAdminDetails = async () => {
        let { status, message, result } = await getProfile()
        if (status) {
            this.setState({ records: result })
        }
    }
    addRecord = () =>{
        this.setState({ addFormModal: true })
    }
      componentDidMount() {
       this.getAdminDetails()
    }
    render() {
        const { records,addFormModal } = this.state;
        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <EditProfileModel
                        recorddata = {records}
                        isShow={addFormModal}
                        onHide={this.handleCloseAddForm}
                        fetchData={this.getAdminDetails}
                    />
                    <div id="page-content-wrapper">

                       
                        <div className="container-fluid">

                        <button
                                    onClick={() => this.addRecord()}
                                    className="btn btn-outline-primary float-right mt-3 mr-2"
                                ><FontAwesomeIcon icon={faPlus} className="mr-1" />Edit Profile
                                </button>
                                <div className="clearfix" />
                            <h3 className="mt-2 text-secondary">Profile Page</h3>

                            <div >
                                <form class="form-group">
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Name</label>
                                        </div>
                                        <div className="col-md-6">
                                            <input
                                                class="form-control"
                                                value={records.name}
                                                id="name"
                                                type="text"
                                                disabled
                                            />

                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Email</label>
                                        </div>
                                        <div className="col-md-6">
                                            <input
                                                class="form-control"
                                                value={records.email}
                                                id="name"
                                                type="text"
                                                disabled
                                            />

                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Role</label>
                                        </div>
                                        <div className="col-md-6">
                                            <input
                                                class="form-control"
                                                value={records.role}
                                                id="name"
                                                type="text"
                                                disabled
                                            />

                                        </div>

                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">2FA Status</label>
                                        </div>
                                        <div className="col-md-6">
                                            <input
                                                class="form-control"
                                                value={records && records.google2Fa && records.google2Fa.secret && records.google2Fa.uri ? 'Enabled' : 'Disabled'}
                                                id="name"
                                                type="text"
                                                disabled
                                            />

                                        </div>

                                    </div>

                                </form>


                            </div>

                        </div>
                    </div>
                   
                    <ToastContainer />
                </div>
            </div>
        );
    }

}

Profile.propTypes = {
    updateProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { updateProfile }
)(withRouter(Profile));
