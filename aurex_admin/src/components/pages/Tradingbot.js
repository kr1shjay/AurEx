// import package
import React, { Component } from "react";

import classnames from "classnames";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { withRouter } from "react-router-dom";


// import component
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import TradeBot from '../partials/TradeBot/TradeBot';

// import action
import { Botfunction, SpotTradeOrderplacing } from "../../actions/userActions";


// import config
import keys from "../../actions/config";

// import lib



const url = keys.baseUrl;



class Tradingbot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pairList: [],


            _id: "",
            contact_person: "",
            email: "",
            sitename: "",
            site_description: "",
            phone_number: "",
            mobile_number: "",
            address: "",
            google_analytics: "",
            social_link1: "",
            social_link2: "",
            social_link3: "",
            social_link4: "",
            social_link5: "",
            reg_code: "",
            company_info_link: "",
            license_info_link: "",
            copyright_text: "",
            sitelogo: "",
            sitelogourl: "",
            liveprice: 0,
            tradeprice: 0,
            perparray: [],
            ordertypechange: "",
            errors: {}
        };
    }





    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    handleselectChange = selectedOption => {
        this.setState({ pair: selectedOption });
        var perpaarray = this.state.perparray
        var index1 = perpaarray.findIndex(
            (x) => x.tiker_root === selectedOption.value
        );
        console.log("index of the handle", index1);
        var liveprice = this.state.perparray[index1].markprice
        this.setState({ liveprice: liveprice, tradeprice: liveprice })
    };

    handleselectbuyChange = selectedOption => {
        this.setState({ buyorsell: selectedOption })
    };

    
    getData1() {
        axios
            .post(url + "api/spotpair-data")
            .then(res => {
                // this.setState();
                console.log(res, 'res.data')
                console.log(res.data.data, 'res.data')
                if (res.data) {
                    if (typeof res.data.data != 'undefined' && typeof this.state.pair != 'undefined') {
                        console.log(this.state.pair.value, 'this.state.pair')
                        this.setState({ perparray: res.data.data })
                        var perpaarray = res.data.data;
                        console.log(perpaarray);
                        var index1 = perpaarray.findIndex(
                            (x) => x.tiker_root === this.state.pair.value
                        );
                        console.log("index of the handle", index1);
                        if (index1 != -1) {
                            console.log("inside")
                            var liveprice = this.state.perparray[index1].markprice;
                            console.log(liveprice, 'liveprice')
                            this.setState({ liveprice: liveprice, tradeprice: liveprice })

                        }
                    }
                }
            })
            .catch()
    }

    onDeleteBot = e => {
        e.preventDefault();
        const newCategory = {
            buyorsell: this.state.buyorsell,
            pairname: this.state.pair
        };
        console.log(newCategory, "newCategory");
        axios
            .post(url + "api/spotbot-delete", newCategory)
            .then(res => {
                if (res.status) {
                    toast(res.data.message, {
                        position: toast.POSITION.TOP_CENTER,
                    })
                }
            }).catch();

    }



    render() {


        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />

                    <div id="page-content-wrapper">
                        <TradeBot />
                    </div>
                </div >
            </div >
        );
    }

}


export default Tradingbot;