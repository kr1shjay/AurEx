import React, { Component } from "react";
import { Card, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons/faList";
import { Link } from "react-router-dom";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons/faUserAlt";
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import { totalCount } from '../../actions/dashboardAction'
import isEmpty from '../../lib/isEmpty'


//component
import OrderHist from '../../components/pages/DashboardOrderHistory'
import TradeHist from '../../components/pages/DashboardTradeHistory'
import DepositHist from '../../components/pages/DashboardDepositHistory'
import WithdrawHist from '../../components/pages/DashboardWithdrawHistory'

var CanvasJSReact = require('../../canvasjs.react');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;




class Dashboard extends Component {

    constructor() {
        super()
        this.state = {
            records: {}
        }
        this.getTotalCount = this.getTotalCount.bind(this)
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    async getTotalCount() {
        let { status, result } = await totalCount()
        if (status) {
            this.setState({ records: result })
        }
    }
    componentDidMount() {
        this.getTotalCount()
    }

    render() {
        const { records } = this.state
        //const { user } = this.props.auth;
        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <h3 className="mt-2 text-secondary">Dashboard</h3>
                            <div className="row px-0 px-md-2">

                                <div className="col-md-6 col-xl-4 p-sm-2 mb-4 mb-sm-0">
                                    <div className="card text-white shadow-lg" style={{ backgroundColor: "cornflowerblue" }}>
                                        <div className="card-body">
                                            <h5 className="card-title">Users</h5>
                                            <p className="card-text">{records && records.userCount}</p>
                                            <Link to="/users" className="btn btn-light">Go to Users</Link>
                                        </div>
                                    </div>
                                </div>


                                <div className="col-md-6 col-xl-4 p-sm-2 mb-4 mb-sm-0">
                                    <div className="card text-white shadow-lg" style={{ backgroundColor: "cadetblue" }}>
                                        <div className="card-body">
                                            <h5 className="card-title">Enquires</h5>
                                            <p className="card-text">{records && records.contactCount}</p>
                                            <Link to="/contactus" className="btn btn-light">Go to Contact</Link>
                                        </div>

                                    </div>
                                </div>

                                <div className="col-md-6 col-xl-4 p-sm-2 mb-4 mb-sm-0">
                                    <div className="card text-white shadow-lg" style={{ backgroundColor: "#00c8b9" }}>
                                        <div className="card-body">
                                            <h5 className="card-title">Withdraw Request</h5>
                                            <p className="card-text">{records && records.transCount}</p>
                                            <Link to="/withdraw" className="btn btn-light">Go to Withdraw</Link>
                                        </div>

                                    </div>
                                </div>

                                <div className="col-md-6 col-xl-4 p-sm-2 mb-4 mb-sm-0">
                                    <div className="card text-white shadow-lg" style={{ backgroundColor: "#181b1a" }}>
                                        <div className="card-body">
                                            <h5 className="card-title">KYC Request</h5>
                                            <p className="card-text">{records && records.kycCount}</p>
                                            <Link to="/kyc" className="btn btn-light">Go to Kyc</Link>
                                        </div>

                                    </div>
                                </div>

                                 <div className="col-md-6 col-xl-4 p-sm-2 mb-4 mb-sm-0">
                                    <div className="card text-white shadow-lg" style={{ backgroundColor: "cornflowerblue" }}>
                                        <div className="card-body">
                                            <h5 className="card-title">Support Request</h5>
                                            <p className="card-text">{records && records.supportCount}</p>
                                            <Link to="/support" className="btn btn-light">Go to Support</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Dashboard.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(Dashboard);
