import React, { Component, Fragment } from "react";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import axios from "axios";
import keys from "../../actions/config";
import { TimeAgo } from "@n1ru4l/react-time-ago";
import moment from "moment";
import socketClient from "socket.io-client";

// import config
import config from '../../config'

// import action
import { getOrderReport, adminConversation, disputeResolve } from '../../actions/p2pAction';

// import lib
import isEmpty from "../../lib/isEmpty";
import { toastAlert } from '../../lib/toastAlert'
import { momentFormat } from "../../lib/dateTimeHelper";
const url = keys.baseUrl;

const initialFormValue = {
    'message': '',
    'attachment': ''
}

class P2pOrderView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formValue: initialFormValue,
            detail: {},
            chat: [],
            pageLoader: false,
            chats: {},
            loader: false,
            validErr: {}
        };

        this.chatsEndRef = React.createRef();
        this.socket = socketClient(config.API_URL);
        this.handleChange = this.handleChange.bind(this)
        this.handleFile = this.handleFile.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleResolve = this.handleResolve.bind(this)
    }

    componentDidMount() {
        this.fetchOrder();
        this.socket.on(`p2pAdminChat-${this.props.match.params.id}`, (data) => {
            this.setState(
                function (prevState) {
                    let newChat = [...prevState.chat, ...data.chat];
                    return {
                        chat: newChat,
                    };
                },
                function () {
                    this.scrollToBottom();
                }
            );
        });
    }

    async fetchOrder() {
        try {
            this.setState({ "pageLoader": true })
            const { status, loading, result } = await getOrderReport(this.props.match.params.orderId);
            this.setState({ "pageLoader": false })
            if (status == 'success') {
                this.scrollToBottom();
                this.setState({ "detail": result.detail, 'chat': result.chat })

            }
        } catch (err) { }
    }

    handleChange(e) {
        e.preventDefault();
        const { name, value } = e.target;
        let formData = { ...this.state.formValue, [name]: value };
        this.setState({ 'formValue': formData })
        this.setState({ validErr: '' })
    };

    handleFile(e) {
        e.preventDefault();
        const { name, files } = e.target;
        let formData = { ...this.state.formValue, [name]: files[0] };
        this.setState({ 'formValue': formData })
    };

    async handleSubmit(e) {
        e.preventDefault();
        const { detail, formValue } = this.state;
        try {
            let reqData = {
                orderId: detail._id,
                message: formValue.message,
                attachment: formValue.attachment,
            }

            const formData = new FormData();
            formData.append("orderId", reqData.orderId);
            formData.append("message", reqData.message);
            formData.append("attachment", reqData.attachment);

            const { status, message, result, errors } = await adminConversation(formData);
            if (status == 'success') {
                toastAlert("success", message, "conversation");
                this.setState({ "formValue": initialFormValue, 'chat': result.chat })
                this.scrollToBottom()
                if (formValue && formValue.attachment != '') {
                    this.fetchOrder()
                }
            } else {
                toastAlert("error", message, "conversation");
            }
            if (errors) {
                this.setState({ 'validErr': errors })
            }
        } catch (err) {
        }
    }

    scrollToBottom = () => {
        this.chatsEndRef.current.scrollIntoView({ behavior: "smooth" });
    };

    onSkipbutton() {
        this.props.history.goBack();
    }

    async handleResolve(side) {
        if (window.confirm()) {
            try {
                this.setState({ "loader": true })
                let reqData = {
                    orderId: this.props.match.params.orderId,
                    side
                }

                const { status, loading, message, result } = await disputeResolve(reqData);
                this.setState({ "loader": false })
                if (status == 'success') {
                    this.fetchOrder()
                    this.scrollToBottom();
                    toastAlert('success', message, 'resolve')
                    this.setState({ "detail": result.detail, 'chat': result.chat })
                } else {
                    toastAlert('error', message, 'resolve')
                }
            } catch (err) { }
        }
    }

    render() {
        const { chat, detail, pageLoader, formValue, loader, validErr } = this.state;
        return (
            <Fragment>
                {
                    pageLoader && <div className="loadingContent">
                        <div className="loading">
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                }

                {
                    !pageLoader && <div>
                        <Navbar />
                        <div className="d-flex" id="wrapper">
                            <Sidebar />
                            <div id="page-content-wrapper">
                                <div className="container-fluid">
                                    <h3 className="mt-2 mb-0 text-secondary">
                                        Trade Details
                                        <button
                                            onClick={() => this.onSkipbutton()}
                                            className="btn btn-outline-primary float-right mt-0 mr-0"
                                        >
                                            Back
                                        </button>
                                    </h3>
                                    <hr></hr>
                                    <div className="row mt-2 col-md-12">
                                        <div className="col-md-6">
                                            <div className="row mt-2">
                                                <div className="col-md-6">
                                                    <label htmlFor="name">Post By</label>
                                                </div>
                                                <div className="col-md-6">{detail == 'sell' ? detail.buyUniqueId : detail.sellUniqueId}</div>
                                            </div>

                                            <div className="row mt-2">
                                                <div className="col-md-6">
                                                    <label htmlFor="name">Trade By</label>
                                                </div>
                                                <div className="col-md-6">{detail == 'sell' ? detail.sellUniqueId : detail.buyUniqueId}</div>
                                            </div>

                                            <div className="row mt-2">
                                                <div className="col-md-6">
                                                    <label htmlFor="email">Post Type</label>
                                                </div>
                                                <div className="col-md-6">{detail.side}</div>
                                            </div>

                                            <div className="row mt-2">
                                                <div className="col-md-6">
                                                    <label htmlFor="email">Currency Pair</label>
                                                </div>
                                                <div className="col-md-6">
                                                    {detail.firstCoin} / {detail.secondCoin}
                                                </div>
                                            </div>

                                            <div className="row mt-2">
                                                <div className="col-md-6">
                                                    <label htmlFor="email">Pay Amount</label>
                                                </div>
                                                <div className="col-md-6">
                                                    {detail.payValue} {detail.secondCoin}
                                                </div>
                                            </div>

                                            <div className="row mt-2">
                                                <div className="col-md-6">
                                                    <label htmlFor="email">Receive Amount</label>
                                                </div>
                                                <div className="col-md-6">
                                                    {detail.receiveValue} {detail.firstCoin}
                                                </div>
                                            </div>

                                            <div className="row mt-2">
                                                <div className="col-md-6">
                                                    <label htmlFor="name">Order Id</label>
                                                </div>
                                                <div className="col-md-6">{detail.orderId}</div>
                                            </div>

                                            <div className="row mt-2">
                                                <div className="col-md-6">
                                                    <label htmlFor="email">Order Status</label>
                                                </div>
                                                <div className="col-md-6">{detail.status}</div>
                                            </div>

                                            <div className="row mt-2">
                                                <div className="col-md-6">
                                                    <label htmlFor="name">Created At</label>
                                                </div>
                                                <div className="col-md-6">
                                                    {/* {moment(detail.createdAt).format("DD-MM-YYYY k:mm:s")} */}
                                                    {momentFormat(detail.createdAt, "DD-MM-YYYY k:mm:s")}
                                                </div>
                                            </div>

                                            {
                                                ['closed', 'resolved'].includes(detail.disputeStatus) &&
                                                <div className="row mt-2">
                                                    <div className="col-md-6">
                                                        <label htmlFor="name">Disputed At</label>
                                                    </div>
                                                    <div className="col-md-6">
                                                        {momentFormat(detail.disputeDate, "DD-MM-YYYY k:mm:s")}
                                                        {/* {moment(detail.disputeDate).format("DD-MM-YYYY k:mm:s")} */}
                                                    </div>
                                                </div>
                                            }


                                            <div className="row mt-2">
                                                <div className="col-md-6">
                                                    <label htmlFor="email">Dispute Status</label>
                                                </div>
                                                <div className="col-md-6">
                                                    {detail.disputeStatus}
                                                </div>
                                            </div>

                                            {detail.disputeStatus === "open" ?
                                                <>
                                                    <div className="row mt-1">
                                                        <div className="col-md-6">
                                                            <button
                                                                title="View Message"
                                                                className="btn btn-primary btn-sm"
                                                                onClick={() => this.handleResolve('buy')}
                                                                style={{ marginRight: "5px" }}
                                                                disabled={loader}
                                                            >
                                                                {loader && <i className="fas fa-spinner fa-spin"></i>}
                                                                Resolve to Buyer
                                                            </button>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <button
                                                                title="View Message"
                                                                className="btn btn-primary btn-sm"
                                                                onClick={() => this.handleResolve('sell')}
                                                                style={{ marginRight: "5px" }}
                                                                disabled={loader}
                                                            >
                                                                {loader && <i class="fas fa-spinner fa-spin"></i>}
                                                                Resolve to Seller
                                                            </button>
                                                        </div>
                                                    </div>
                                                </> : null

                                            }
                                        </div>
                                        <div className="col-md-6">
                                            <div className="chat_box_dark">
                                                <div>
                                                    <div className="chat_message_section">
                                                        {
                                                            chat && chat.length > 0 && chat.map((item, i) => {

                                                                return (
                                                                    <div
                                                                        className={
                                                                            item.admin
                                                                                ? "message_section message_send"
                                                                                : "message_section messAge_recive"
                                                                        }
                                                                        key={i}
                                                                    >
                                                                        <div>
                                                                            <p>
                                                                                {item.message}
                                                                                {
                                                                                    !isEmpty(item.attachment) &&
                                                                                    <a href={config.API_URL + "/p2p/" + item.attachment} target="_blank" rel="noopener noreferrer">
                                                                                        &nbsp;&nbsp;
                                                                                        <i id='dispute_icon' className="fa fa-paperclip"></i>
                                                                                    </a>
                                                                                }
                                                                                {
                                                                                    // item.admin && <span>Admin</span>
                                                                                }

                                                                                {
                                                                                    !item.admin && item.senderId == detail.buyUserId ? <span>{detail.buyUniqueId}</span> : <span>{detail.sellUniqueId}</span>
                                                                                }

                                                                                <span className="text-right">
                                                                                    <TimeAgo date={new Date(item.createdAt)}>
                                                                                        {({ value }) => value}
                                                                                    </TimeAgo>
                                                                                </span>
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        <div ref={this.chatsEndRef} />
                                                    </div>
                                                    {detail.status === "dispute" && (
                                                        <div className="footer_chat">
                                                            <div className="form-group">
                                                                <div>
                                                                    <p style={{ color: 'red' }}>{validErr && validErr.message}</p>
                                                                    <input
                                                                        type="text"
                                                                        id="file_input"
                                                                        className="form-control"
                                                                        placeholder="write message..."
                                                                        name="message"
                                                                        value={formValue.message}
                                                                        onChange={this.handleChange}
                                                                    />




                                                                    {/* <div className="file-field">
                                                                        <a className="btn-floating mt-0">
                                                                            <label htmlFor="file-input">

                                                                                <i className="fa fa-paperclip fa-lg" aria-hidden="true"></i>
                                                                                <input
                                                                                    type="file"
                                                                                    className="hide"
                                                                                    name="attachment"
                                                                                    // onChange={handleFile}
                                                                                />
                                                                            </label>

                                                                        </a>
                                                                    </div>
                                                                    <i
                                                                        className="fas fa-paper-plane"
                                                                        // onClick={handleSubmit}
                                                                    ></i> */}




                                                                    <div className="file-field">
                                                                        <a className="btn-floating mt-0" href="/#">
                                                                            <label htmlFor="file-input">
                                                                                <i
                                                                                    className="fa fa-paperclip fa-lg"
                                                                                    aria-hidden="true"
                                                                                ></i>
                                                                            </label>
                                                                            <label class="custom-file-upload">
                                                                            <input
                                                                                type="file"
                                                                                className="hidden"
                                                                                name="attachment"
                                                                                id="file-input"
                                                                                onChange={this.handleFile}

                                                                            />
                                                                            Choose File
                                                                            </label>
                                                                        </a>
                                                                    </div>
                                                                    <i
                                                                        className="fa fa-paper-plane fa-lg"
                                                                        onClick={this.handleSubmit}
                                                                    ></i>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </Fragment>
        );
    }
}

export default P2pOrderView;
