import React, { Component, Fragment } from "react";
import moment from 'moment'
import ReactDatatable from '@ashvin27/react-datatable';

//import component
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import UserAddModal from "../partials/UserAddModal";
import UserUpdateModal from "../partials/UserUpdateModal";
import UserAssetModal from "../partials/UserAssetModal";
import ReferralModal from "../partials/ReferralHistoryModal";
import KycModal from "../partials/KycHistoryModal";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//impport action
import { getUser, UpdateUser, Disable2FA } from "../../actions/userActions";

// import lib
import isEmpty from "../../lib/isEmpty";
import { momentFormat } from "../../lib/dateTimeHelper";
import { toastAlert } from '../../lib/toastAlert'
class Users extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                key: "createdAt",
                text: "Created date",
                className: "date",
                align: "left",
                sortable: true,
                width: 100,
                cell: record => {
                    return (
                        <Fragment>
                            {/* <p>{moment(record.createdAt).format('MMMM,Do YYYY, hh:mm A')}</p> */}
                            {<p>{momentFormat(record.createdAt, 'YYYY-DD-MM HH:mm')}</p>}
                        </Fragment>
                    )
                }
            },
            {
                key: "userId",
                text: "User Id",
                className: "email",
                align: "left",
                sortable: true
            },
            {
                key: "email",
                text: "Email",
                className: "email",
                align: "left",
                sortable: true
            },
            {
                key: "emailStatus",
                text: "Email Status",
                className: "email",
                align: "left",
                sortable: true
            },
            {
                // key: "phoneNo",
                text: "Phone No",
                className: "email",
                align: "left",
                sortable: true,
                width: 150,
                cell: record => {
                    if (record.phoneStatus == 'verified') {
                        return `${record.phoneCode}-${record.phoneNo}`
                    }
                    return '-'
                }
            },
            {
                key: "google2Fa",
                text: "Google TwoFA",
                className: "email",
                align: "left",
                sortable: true,
                width: 150,
                cell: record => {
                    if (record.google2Fa && !isEmpty(record.google2Fa.secret)) {
                        return (
                            <>
                                <lable>Enable</lable> <button
                                    className='btn btn-danger btn-xs ml-2'
                                    onClick={() => this.Disable2fa(record._id)}
                                >
                                   Disable <i class="fa fa-ban" aria-hidden="true"></i>
                                    {/* Disable 2FA   */}
                                </button>
                            </>
                        )
                    }
                    return 'Disabled'
                }
            },
            {
                key: "asset",
                text: "Assets",
                className: "email",
                align: "left",
                sortable: true,
                cell: record => {
                    return (
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                                this.setState({
                                    assetModal: true,
                                    assetRecord: record.wallet.assets
                                })
                            }}
                            style={{ marginRight: '5px' }}>
                            {/* <i className="fa fa-wallet"></i> */}
                            <i className="fa fa-eye"></i>

                        </button>
                    )
                }
            },
            {
                key: "asset",
                text: "Referral",
                className: "email",
                align: "left",
                sortable: true,
                cell: record => {
                    return (
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                                this.setState({
                                    referalModal: true,
                                    userId: record
                                })
                            }}
                            style={{ marginRight: '5px' }}>
                            {/* <i className="fa fa-wallet"></i> */}
                            <i className="fa fa-edit"></i>

                        </button>
                    )
                }
            },
            {
                key: "kyc",
                text: "Kyc",
                className: "email",
                align: "left",
                sortable: true,
                cell: record => {
                    return (
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                                this.setState({
                                    kycModal: true,
                                    userId: record
                                })
                            }}
                            style={{ marginRight: '5px' }}>
                            {/* <i className="fa fa-wallet"></i> */}
                            <i className="fa fa-eye"></i>

                        </button>
                    )
                }
            },
            {
                key: "status",
                text: "Status",
                className: "status",
                align: "left",
                sortable: true,
            },
            {
                key: "status",
                text: "Action",
                className: "status",
                align: "left",
                sortable: true,
                cell: record => {
                    return (
                        <>

                            <button className={record.status === 'verified' ? 'btn btn-danger btn-sm' : 'btn btn-success btn-sm'}
                                onClick={() => this.LockedUser(record._id)}
                            > {record.status === 'verified' ? <i class="fa fa-lock " aria-hidden="true" ></i> : <i class="fa fa-check" aria-hidden="true"></i>}
                            </button>


                        </>
                    )

                }
            },
            {
                key: "action",
                text: "PassBook",
                className: "subject",
                align: "left",
                sortable: true,
                cell: (record) => {
                  console.log("aaaaaaaaaaaaaaaa1111111111",record.userId)
                  if(record.userId != 'undefined'){
                    return (
                   
                      
                        <span>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => this.props.history.push("/passbookHistory/"+record.userId)}
                            style={{ marginRight: "5px" }}
                          >
                            View
                          </button>
                        </span>
                    
              
        
                  );
                  }
                  
                 
                },
                
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
            show_length_menu: false,
            show_filter: true,
            show_pagination: true,
            show_info: true,
        };

        this.state = {
            records: [],
            loader: false,
            page: 1,
            limit: 10,
            count: 0,
            assetModal: false,
            referalModal: false,
            kycModal: false,
            assetRecord: [],
            userId: ''
        };

        this.getUserList = this.getUserList.bind(this);
        this.handlePagination = this.handlePagination.bind(this)
        this.handleAssetForm = this.handleAssetForm.bind(this);
        this.handleReferalForm = this.handleReferalForm.bind(this);
        this.LockedUser = this.LockedUser.bind(this);
        this.Disable2fa = this.Disable2fa.bind(this);
        this.handleKycForm = this.handleKycForm.bind(this);

    }

    componentDidMount() {
        const { page, limit } = this.state;
        let reqData = {
            page,
            limit
        }
        this.getUserList(reqData)
    };

    async LockedUser(value) {
        let Data = {
            id: value
        }
        const { status, message } = await UpdateUser(Data)
        if (status) {
            this.getUserList()
            toastAlert('success', message, 'activeUser')
        }
    }



    async getUserList(reqData) {
        try {
            this.setState({ 'loader': true })
            const { status, loading, result } = await getUser(reqData);
            this.setState({ 'loader': loading })
            if (status == 'success') {
                this.setState({ "count": result.count, 'records': result.data })
            }
        } catch (err) { }
    }
    handlePagination(index) {
        const { page, limit } = this.state;

        let reqData = {
            page: index.page_number,
            limit: index.page_size,
            search: index.filter_value
        }
        this.getUserList(reqData);

        this.setState({ page: index.page_number, limit: index.page_size, search: index.filter_value })

    }

    handleAssetForm() {
        this.setState({
            assetModal: false,
            assetRecord: []
        })
    }

    handleReferalForm() {
        this.setState({
            referalModal: false,
        })
    }

    handleKycForm() {
        this.setState({
            kycModal: false,
        })
    }
    async Disable2fa(item) {
        let respData = {
            id: item
        }

        let { status, message } = await Disable2FA(respData)
        if (status) {
            this.getUserList()
            toastAlert('success', message, '2FA Disable')
        }
    }
    render() {
        const { assetModal, kycModal, count, assetRecord, loader, records, page, limit, referalModal, userId } = this.state


        return (
            <div>
                <Navbar />
                <UserAssetModal
                    isShow={assetModal}
                    onHide={this.handleAssetForm}
                    record={assetRecord}
                />
                <ReferralModal
                    isShow={referalModal}
                    onHide={this.handleReferalForm}
                    record={userId}
                />
                <KycModal
                    isShow={kycModal}
                    onHide={this.handleKycForm}
                    record={userId}
                />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <UserAddModal />
                    <UserUpdateModal record={this.state.currentRecord} />

                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <h3 className="mt-2 text-secondary">Users Management</h3>
                            <ReactDatatable className="table table-bordered table-striped user_management_table"
                                responsive={true}
                                config={this.config}
                                loading={loader}
                                records={records}
                                total_record={count}
                                dynamic={true}
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



export default (Users);
