import React, { Component, Fragment } from "react";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons/faList";
import ReactDatatable from '@ashvin27/react-datatable';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import axios from "axios";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import SupportReplyModal from "../partials/SupportReplyModal";
import { toast, ToastContainer} from "react-toastify";
import keys from "../../actions/config";
const url = keys.baseUrl;
class tradehistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            records: [],
        };
        this.columns = [
            {
                key: "pairname",
                text: "Contracts",
                className: "pairname",
                align: "left",
                sortable: true,
                width:200,
            },{
                key: "name",
                text: "Name",
                className: "name",
                align: "left",
                sortable: true,
                width:200,
            },{
                key: "filledtype",
                text: "Filled Type",
                className: "filledtype",
                align: "left",
                sortable: true,
                width:200,
            },{
                key: "filledAmount",
                text: "quantity",
                className: "filledAmount",
                align: "left",
                sortable: true,
                width:200,
            },{
                key: "Price",
                text: "Price",
                className: "Price",
                align: "left",
                sortable: true,
                width:200,
            },{
                key: "orderValue",
                text: "Order Value",
                className: "orderValue",
                align: "left",
                sortable: true,
                width:200,
            },{
                key: "Remaining",
                text: "Remaining",
                className: "Remaining",
                align: "left",
                sortable: true,
                width:200,
            },{
                key: "orderType",
                text: "orderType",
                className: "orderType",
                align: "left",
                sortable: true,
                width:200,
            },{
                key: "_id",
                text: "#",
                className: "_id",
                align: "left",
                sortable: true,
                width:200,
            },{
                key: "date",
                text: "Date",
                className: "date",
                align: "left",
                sortable: true,
                width:200,
            },




        ];

        this.config = {
            page_size: 10,
            length_menu: [ 10, 20, 50 ],
            filename: "Order",
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
            show_length_menu: true,
            show_filter: true,
            show_pagination: true,
            show_info: true,
        };
}
      componentDidMount() {
        this.getData()
      };

      pageChange(pageData) {
         console.log("OnPageChange", pageData);
      }
      getData() {
          axios
          .post(url+"api/trade_history")
          .then(res => {
          this.setState({ records: res.data.data})
          })
          .catch()
      }

    render() {

            const {records} = this.state
        return (
            <div>
                <Navbar/>
                <div className="d-flex" id="wrapper">
                    <Sidebar/>
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <h3 className="mt-2 text-secondary">Trade History</h3>
                           <ReactDatatable className="table table-bordered table-striped user_management_table"
                                config={this.config}
                                records={this.state.records}
                                columns={this.columns}
                                onPageChange={this.pageChange.bind(this)}
                            />
                        </div>
                    </div>
                    <ToastContainer/>
                </div>
            </div>
        );
    }

}

tradehistory.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    records: state.records
});

export default connect(
    mapStateToProps
)(tradehistory);
