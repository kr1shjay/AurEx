import React, { Component, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDatatable from '@ashvin27/react-datatable';
import { faPlus } from "@fortawesome/free-solid-svg-icons";

// import component
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import KycUpdate from "../partials/KycUpdate";

// import action
import { getAllUserKyc, changeUserType } from '../../actions/userKycAction';
import { toastAlert } from "../../lib/toastAlert";

class UserKyc extends Component {

    constructor(props) {
        super(props);
        this.columns = [
            {
                key: "email",
                text: "Email",
                className: "identifier",
                align: "left",
                sortable: true
            },
            {
                key: "identity",
                text: "Identity Document",
                className: "subject",
                align: "left",
                sortable: true,
                cell: record => {
                    if (record.idProof.status == 'new') {
                        return '-'
                    } else if (record.idProof.status == 'pending') {
                        return (
                            <>
                                {record.idProof.status}
                                <span>
                                    <button
                                        className="btn btn-primary btn-sm ml-2"
                                        onClick={() => this.editRecord(record, 'idProof')}
                                        style={{ marginRight: '5px' }}
                                    >
                                        View
                                    </button>
                                </span>
                            </>
                        )
                    } else {
                        return (
                            <>
                                {record.idProof.status}

                            </>
                        )
                    }
                }
            },
            {
                key: "identity",
                text: "Residential Document",
                className: "subject",
                align: "left",
                sortable: true,
                cell: record => {
                    if (record.addressProof.status == 'new') {
                        return '-'
                    } else if (record.addressProof.status == 'pending') {
                        return (
                            <>
                                {record.addressProof.status}
                                <span>
                                    <button
                                        className="btn btn-primary btn-sm ml-2"
                                        onClick={() => this.editRecord(record, 'addressProof')}
                                        style={{ marginRight: '5px' }}
                                    >
                                        View
                                    </button>
                                </span>
                            </>
                        )
                    } else {
                        return (
                            <>
                                {record.addressProof.status}

                            </>
                        )
                    }
                }
            },
            // {
            //     key: "type",
            //     text: "Verification Type",
            //     className: "subject",
            //     align: "left",
            //     sortable: true,
            //     cell: record => {
            //         console.log('record',record)

            //         if((record.addressProof.status == 'approved') && (record.idProof.status == 'approved')){
            //             return(
            //             <span>APPROVED</span>
            //             )
            //         }
            //         else if (['basic_processing', 'advanced_processing', 'pro_processing'].includes(record.type)) {
            //             return (
            //                 <span>
            //                     <button
            //                         className="btn btn-primary btn-sm"
            //                         onClick={() => this.handleVerifyType(record)}
            //                         style={{ marginRight: '5px' }}
            //                     >
            //                         Approve
            //                     </button>
            //                     ({record.type})
            //                 </span>
            //             )
            //         } else {
            //             return (
            //                 <>
            //                     {record.type}
            //                 </>
            //             )
            //         }
            //     }
            // }
        ];

        this.config = {
            page_size: 10,
            length_menu: [10, 20, 50],
            filename: "Emailtemplates",
            no_data_text: 'No Email Templates found!',
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
            docFormModal: false,
            docRecord: {},
            records: [],
            search: '',
            page: 1,
            limit: 10,
            count: 0,
            loader: false,
            languageOption: []
        };

        this.fetchKyc = this.fetchKyc.bind(this);
        this.refetch = this.refetch.bind(this);
        this.handleCloseDocForm = this.handleCloseDocForm.bind(this);
        this.handlePagination = this.handlePagination.bind(this)
    }

    componentDidMount() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit
        }
        this.fetchKyc(reqData)
    };

    async fetchKyc(reqData) {
        this.setState({ 'loader': true })
        try {
            const { status, loading, message, result } = await getAllUserKyc(reqData)
            console.log("🚀 ~ file: Kyc.js ~ line 186 ~ UserKyc ~ fetchKyc ~ result", result)
            this.setState({ 'loader': loading })
            if (status == 'success') {
                this.setState({ "count": result.count, 'records': result.data })
            }
        } catch (err) { }
    }

    async handleVerifyType(reqData) {
        this.setState({ 'loader': true })
        try {
            const { status, loading, message, result } = await changeUserType(reqData.userid)
            this.setState({ 'loader': loading })
            if (status == 'success') {
                toastAlert('success', message, 'kyc')
                this.refetch()
            } else {
                toastAlert('error', message, 'kyc')
            }
        } catch (err) { }
    }

    editRecord(record, formType) {
        console.log('record',record)
        console.log('formType', formType)
        if (formType == 'idProof') {
            let docRecord = {
                'userId': record.userId,
                'type': record.idProof.type,
                'proofNumber': record.idProof.proofNumber,
                'frontImage': record.idProof.frontImage,
                'backImage': record.idProof.backImage,
                'selfiImage': record.idProof.selfiImage,
                'panImage': record.idProof.panImage,
                'status': record.idProof.status,
                formType
            }

            this.setState({ docFormModal: true, docRecord })
        } else if (formType == 'addressProof') {
            let docRecord = {
                'userId': record.userId,
                'type': record.addressProof.type,
                'frontImage': record.addressProof.frontImage,
                'status': record.addressProof.status,
                formType
            }

            this.setState({ docFormModal: true, docRecord })
        }

    }

    handlePagination(index) {
        let reqData = {
            page: index.page_number,
            limit: index.page_size,
            search: index.filter_value
        }
        this.fetchKyc(reqData);
        this.setState({ page: index.page_number, limit: index.page_size, search: index.filter_value })
    }

    handleCloseDocForm() {
        this.setState({ docFormModal: false })
    }

    refetch() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit
        }
        this.fetchKyc(reqData)
    }

    render() {
        const { docFormModal, docRecord, loader, count } = this.state;

        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <KycUpdate
                        isShow={docFormModal}
                        onHide={this.handleCloseDocForm}
                        fetchData={this.refetch}
                        record={docRecord}
                    />
                    <div id="page-content-wrapper">
                        <div className="container-fluid user_asset_modal_table">
                            <h3 className="mt-2 text-secondary">KYC List</h3>
                            <ReactDatatable className="table table-bordered table-striped kyc_table"
                                config={this.config}
                                records={this.state.records}
                                columns={this.columns}
                                dynamic={true}
                                total_record={count}
                                loading={loader}
                                onChange={this.handlePagination}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default UserKyc;
