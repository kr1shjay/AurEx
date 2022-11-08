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
import { toast, ToastContainer } from "react-toastify";
import keys from "../../actions/config";
import { closePosition } from '../../actions/derivativeAction'
const url = keys.baseUrl;
class Closedpositions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            records: [],
        };
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
    }
    componentDidMount() {
        this.getData()
    };

    getData() {
        let { result } = closePosition()
    }
    pageChange(pageData) {
        console.log("OnPageChange", pageData);
    }

    render() {

        const { records } = this.state
        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <h3 className="mt-2 text-secondary">Closed positions</h3>
                            {/* <table id="assetsTable" className="table table-striped rembordor">
                                                        <thead>
                                                            <tr className="wow flipInX" data-wow-delay=".5s;">
                                                                <th>Contracts</th>
                                                                <th>Name</th>
                                                                <th>Entry Price</th>
                                                                <th>Exit Price</th>
                                                                <th>Quantity</th>
                                                                <th>Profitnloss</th>
                                                                <th>Transaction ID</th>
                                                                <th>Time</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                       
                                                  {
                                                records.map((item,i)=>{
                                                 var quantity = item.quantity?item.quantity:0;
                                                  var name = item.userId.email.split('@')[0]?item.userId.email.split('@')[0]:0;    
                                                 var entry_price = item.entry_price?item.entry_price:0;
                                                 var exit_price = item.exit_price?item.exit_price:0;
                                                 var profitnloss = item.profitnloss?item.profitnloss:0;
                                                 var pairname = item.pairname?item.pairname:0;
                                                 var createdDate = item.createdDate?item.createdDate:0;
                                                 
                                                 var _id = item._id?item._id:0;
                                                 var classs = item.profitnloss>0?'greenText':'pinkText';
                                                 var filledAmount = item.filledAmount?item.filledAmount:0;
                                                 var Remaining = parseFloat(quantity) - parseFloat(filledAmount);
                                                    
                                                      return (<tr>
                                                        <td  className="text-center">{pairname}</td>
                                                        <td className="text-center">{name}</td>
                                                        <td className="text-center">{entry_price}</td>
                                                        <td className="text-center">{exit_price}</td>
                                                        <td className="text-center">{quantity}</td>
                                                        <td className={classs+" text-center"}>{profitnloss}</td>
                                                        
                                                        <td className="text-center">{_id}</td>
                                                        <td className="text-center">{createdDate}</td>
                                                        </tr>
                                                      ); 
                                                     
                                                    
                                                     
                                                     
                                                })
                                                }</tbody>
                                           
                                                    </table> */}
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

Closedpositions.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    records: state.records
});

export default connect(
    mapStateToProps
)(Closedpositions);
