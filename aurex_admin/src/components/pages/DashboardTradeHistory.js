import React, { Component, Fragment } from "react";
import ReactDatatable from '@ashvin27/react-datatable';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//import compoents
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";


class TradeHist extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                key: "firstCurrency",
                text: "Base Coin",
                className: "firstCurrencySymbol",
                align: "left",
                sortable: true,
                width: 200
            },
            {
                key: "secondCurrency",
                text: "Quote Coin",
                className: "secondCurrencySymbol",
                align: "left",
                sortable: true,
                width: 200
            },
         
            {
                key: "price",
                text: "Price",
                className: "status",
                align: "left",
                sortable: true,
                width: 200
            },

        ];

        this.config = {
            page_size: 10,
            length_menu: [10, 20, 50],
            filename: "Perpetual",
            no_data_text: 'No Contracts found!',
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
            show_length_menu:false,
            show_filter: false,
            show_pagination: false,
            show_info: false,
        };

   


    }




    render() {
        const { record } = this.props;

        return (
            <div>
                <div className="d-flex" id="wrapper">
                    <div id="page-content-wrapper">
                        <div className="container-fluid">

                            <h3 className="mt-2 text-secondary">Trade History</h3>

                            <ReactDatatable className="table table-bordered table-striped user_management_table"
                            config={this.config}
                            records={record}
                            columns={this.columns}
                            onChange={this.handlePagination}
                            />
                        </div>
                    </div>

                </div>
            </div>
        );
    }

}


export default TradeHist;
