import React, { Component, Fragment } from "react";
import Navbar from "../partials/Navbar";
import classnames from "classnames";
import Sidebar from "../partials/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons/faList";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateChangepassword } from "../../actions/userActions";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import keys from "../../actions/config";
import { getProfile, sendMail, changePassword } from '../../actions/admin'

//lib
import { toastAlert } from '../../lib/toastAlert'

import { withRouter } from "react-router-dom";
const url = keys.baseUrl;


let initialValue = {
    otp: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
}
class Changepassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formValue: initialValue,
            record: {},
            validErr: {}
        };
        this.handleChange = this.handleChange.bind(this)
        this.sendOTP = this.sendOTP.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(e) {
        let { name, value } = e.target
        this.setState({ formValue: { ...this.state.formValue, ...{ [name]: value } } })
        if (value) {
            this.setState({ validErr: {} })
        }
    }

    async sendOTP() {
        let { record } = this.state
        let Data = {
            email: record.email
        }

        let { status, message } = await sendMail(Data)
        if (status) {
            toastAlert('success', message)
        } else {
            toastAlert('error', message)
        }
    }

    async handleSubmit() {

        const { otp, newPassword, oldPassword, confirmPassword } = this.state.formValue;

        let Data = {
            otp,
            newPassword,
            oldPassword,
            confirmPassword,
            email: this.state.record.email
        }

        let { status, message, error } = await changePassword(Data)
        if (status) {
            toastAlert('success', message)
        } else {
            toastAlert('error', message)
        }

        if (error) {
            this.setState({ validErr: error })
        }

    }

    async componentDidMount() {
        let { status, result } = await getProfile()
        if (status) {
            this.setState({ record: result })
        }
    };




    render() {
        const { validErr } = this.state
        const { otp, newPassword, oldPassword, confirmPassword } = this.state.formValue;
        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">


                            <h3 className="mt-2 text-secondary">Change Password</h3>


                            <form>
                                <div className="row mt-2">
                                    <div className="col-md-3">
                                        <label htmlFor="password">Email</label>
                                    </div>
                                    <div className="col-md-6">
                                        <button form="otp-form" className="btn btn-secondary" onClick={this.sendOTP}>Send OTP</button>

                                    </div>
                                </div>

                            </form>


                            <form noValidate onSubmit={this.onChangepasswordUpdate} id="update-Changepassword">

                                <div className="row mt-2">
                                    <div className="col-md-3">
                                        <label htmlFor="name">Otp</label>
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            onChange={this.handleChange}
                                            name='otp'
                                            value={otp}
                                            type="number"
                                            error={validErr.otp}
                                            className={classnames("form-control", {
                                                invalid: validErr.otp
                                            })} />
                                        <span className="text-danger">{validErr.otp}</span>
                                    </div>
                                </div>



                                <div className="row mt-2">
                                    <div className="col-md-3">
                                        <label htmlFor="name">Old Password</label>
                                    </div>
                                    <div className="col-md-6">

                                    <div class="input-group input_grp_width">
                                    <input
                                            onChange={this.handleChange}
                                            name='oldPassword'
                                            value={oldPassword}
                                            type="password"
                                            error={validErr.oldPassword}
                                            className={classnames("form-control", {
                                                invalid: validErr.oldPassword
                                            })} />
                                                    <div className="input-group-append">
                                                        <span className="input-group-text" id="basic-addon2">
                                                        <i className="fa fa-eye cur_pointer_icon"></i>
                                                        </span>
                                                    </div>
                                                    </div>

                                                    <span className="text-danger">{validErr.oldPassword}</span>

                                      
                                    </div>
                                </div>

                                <div className="row mt-2">
                                    <div className="col-md-3">
                                        <label htmlFor="password">New Password</label>
                                    </div>
                                    <div className="col-md-6">
                                    <div class="input-group input_grp_width">
                                        <input
                                            onChange={this.handleChange}
                                            name='newPassword'
                                            value={newPassword}
                                            type="password"
                                            error={validErr.newPassword}
                                            className={classnames("form-control", {
                                                invalid: validErr.newPassword
                                            })} />
                                            <div className="input-group-append">
                                                        <span className="input-group-text" id="basic-addon2">
                                                        <i className="fa fa-eye cur_pointer_icon"></i>
                                                        </span>
                                                    </div>
                                       </div>
                                       <span className="text-danger">{validErr.newPassword}</span>
                                    </div>
                                </div>

                                <div className="row mt-2">
                                    <div className="col-md-3">
                                        <label htmlFor="password2">Confirm Password</label>
                                    </div>
                                    <div className="col-md-6">
                                    <div class="input-group input_grp_width">
                                        <input
                                            onChange={this.handleChange}
                                            name='confirmPassword'
                                            value={confirmPassword}
                                            id="password2"
                                            type="password"
                                            error={validErr.confirmPassword}
                                            className={classnames("form-control", {
                                                invalid: validErr.confirmPassword
                                            })} />
                                            <div className="input-group-append">
                                                        <span className="input-group-text" id="basic-addon2">
                                                        <i className="fa fa-eye cur_pointer_icon"></i>
                                                        </span>
                                                    </div>
                                       
                                    </div>
                                    <span className="text-danger">{validErr.confirmPassword}</span>
                                    </div>
                                </div>
                            </form>
                            <br />
                            <button className="btn btn-primary" onClick={this.handleSubmit}>Submit</button>
                        </div>
                    </div>
                    <ToastContainer />
                </div>
            </div>
        );
    }

}

Changepassword.propTypes = {
    updateChangepassword: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { updateChangepassword }
)(withRouter(Changepassword));
