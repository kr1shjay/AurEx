import React, { Component, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDatatable from '@ashvin27/react-datatable';
import { faPlus } from "@fortawesome/free-solid-svg-icons";

//import components
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import PriceCNVUpdateModal from "../partials/priceCNVupdateModal";

//import actions
import { priceCNVlist } from '../../actions/priceCNVAction'



class priceConversion extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                key: "baseSymbol",
                text: "Base Symbol",
                className: "baseSymbol",
                align: "left",
                sortable: true,
                width: 200
            },
            {
                key: "convertSymbol",
                text: "Convert Symbol ",
                className: "convertSymbol",
                align: "left",
                sortable: true,
                width: 200
            },
            {
                key: "convertPrice",
                text: "Convert Price",
                className: "convertPrice",
                align: "left",
                sortable: true,
                width: 200
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
                                data-target="#update-spot-modal"
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
            show_length_menu: false,
            show_filter: true,
            show_pagination: true,
            show_info: true,
        };

        this.state = {
            records: [],
            editFormModal: false,
            editRecord: {},
            loader: false,
            page: 1,
            limit: 10,
            count: 0,
        };

        this.getPriceCNVList = this.getPriceCNVList.bind(this);
        this.handleCloseEditForm = this.handleCloseEditForm.bind(this);
        this.handlePagination = this.handlePagination.bind(this);

        

    }

    componentDidMount() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit
        }
        
        this.getPriceCNVList(reqData);
    };

    handleCloseEditForm() {
        this.setState({ editFormModal: false })
    }

    handlePagination(index) {
        let reqData = {
            page: index.page_number,
            limit: index.page_size,
            search: index.filter_value
        }

        this.getPriceCNVList(reqData);
        this.setState({ page: index.page_number, limit: index.page_size, search: index.filter_value })
    }

   
    async getPriceCNVList(reqData) {

        try {
            this.setState({ 'loader': true })

            const { status, loading, result } = await priceCNVlist(reqData);
            this.setState({ 'loader': loading })
            if (status == 'success') {
                this.setState({ "count": result.count, 'records': result.data })
            }
        } catch (err) { }

    }


    editRecord(record) {

        this.setState({
            editFormModal: true,
            editRecord: record
        })
    }


    render() {
        const {  editRecord, editFormModal ,count} = this.state;

        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                  
                    <PriceCNVUpdateModal
                        isShow={editFormModal}
                        onHide={this.handleCloseEditForm}
                        fetchData={this.getPriceCNVList}
                        record={editRecord}
                    />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <h3 className="mt-2 text-secondary"> Price Conversion</h3>
                            <ReactDatatable className="table table-bordered table-striped"
                                config={this.config}
                                records={this.state.records}
                                columns={this.columns}
                                dynamic={true}
                                total_record={count}
                                onChange={this.handlePagination}
                            />
                        </div>
                    </div>

                </div>
            </div>
        );
    }

}



export default priceConversion;
