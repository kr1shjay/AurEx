// import package
import React from 'react'
import classnames from "classnames";

// import component
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";

// import action
import { getMessage, replyMsg } from "../../actions/supportAction";

// import lib
import { toastAlert } from '../../lib/toastAlert'
import isEmpty from '../../lib/isEmpty';
import config from '../../config';
import { momentFormat } from '../../lib/dateTimeHelper';
const initialFormValue = {
    "message": "",
}

class SupportReply extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            records: {},
            msgConversation: [],
            formValue: initialFormValue,
            errors: {},
            loader: false
        };
    }

    componentDidMount() {
        this.fetchTicktMessage()
    }

    async fetchTicktMessage() {
        try {
            let reqData = {
                ticketId: this.props.match.params.id
            }
            this.setState({ 'loader': true })
            const { status, loading, result, errors } = await getMessage(reqData);
            this.setState({ 'loader': loading })
            if (status == 'success') {
                this.setState({ 'records': result, "msgConversation": result.reply })
            }

        } catch (err) { }

    }

    handleChange = e => {
        e.preventDefault();
        let { name, value } = e.target;
        let formData = { ...this.state.formValue, ...{ [name]: value } };
        this.setState({ formValue: formData });
        this.setState({ errors: '' })
    };

    handleSubmit = async e => {
        e.preventDefault();
        const { formValue, records } = this.state
        console.log("handleSubmit admin replay", formValue, records )
        this.setState({ 'loader': true })

        let reqData = {
            'ticketId': records.tickerId,
            'receiverId': records.userId,
            'message': formValue.message
        }
        try {
            const { status, loading, message, error, result } = await replyMsg(reqData);
            this.setState({ 'loader': loading })
            if (status == 'success') {
                toastAlert('success', message, 'replyMsg')
                this.setState({ "formValue": initialFormValue, 'msgConversation': result.reply })
            } else {
                toastAlert('error', message, 'replyMsg')
            }
            if (error) {
                this.setState({ errors: error })
            }
        } catch (err) {
            this.setState({ 'loader': false })
        }
    };

    render() {
        const { errors, records, msgConversation, loader } = this.state;
        const { message } = this.state.formValue;

        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <h3 className="mt-2 text-secondary mb-4">Support Ticket</h3>

                            {/* <div className="row rounded-lg overflow-hidden shadow"> */}
                            {/* Chat Box*/}
                            <div className="px-4 py-5 chat-box bg-white">
                                {
                                    !isEmpty(records) && msgConversation && msgConversation.length > 0 && msgConversation.map((item, key) => {
                                        if (item.senderId == records.adminId) {
                                            return (
                                                <div className="media w-50 ml-auto mb-3">
                                                    <div className="media-body">
                                                        <div className="bg-light-dark rounded py-2 px-3 mb-2">
                                                            <p className="text-small mb-0">
                                                                {item.message}
                                                            </p>
                                                        </div>
                                                        <p className="small text-muted">{momentFormat(item.createdAt)}</p>
                                                    </div>
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div className="media w-50 mb-3">
                                                    <img src="https://bootstrapious.com/i/snippets/sn-chat/avatar.svg" alt="user" width={50} className="rounded-circle" />
                                                    <div className="media-body ml-3">
                                                        <div className="bg-light rounded py-2 px-3 mb-2">
                                                            <p className="text-small mb-0 text-muted">
                                                                {item.message}
                                                            </p>
                                                        </div>
                                                        <p className="small text-muted">{momentFormat(item.createdAt)}</p>
                                                    </div>
                                                    <div className="ticketDetails">
                                                        {
                                                            records && records.length > 0 && records.map(item => {
                                                                return console.log(item, '-------------item')
                                                            })
                                                        }
                                                        {!isEmpty(item.attachment) ?
                                                            <a href={`${config.API_URL}/images/support/${item.attachment}`} target="_blank" ><i class="fa fa-paperclip fa-2x" aria-hidden="true"></i></a>
                                                            : null
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        }
                                    })
                                }
                            </div>

                            {/* Typing area */}
                            <form className="">
                                <div className="input-group input-grp-dark">
                                    <textarea
                                        type="text"
                                        placeholder="Type a message"
                                        aria-describedby="button-addon2"
                                        className="form-control rounded-0 border-0 py-4 bg-input-dark"
                                        name="message"
                                       rows={3}
                                        value={message}
                                        onChange={this.handleChange}
                                    />
                                    <div className="input-group-append">
                                        <button
                                            onClick={this.handleSubmit}
                                            disabled={loader}
                                            className="btn btn-link"> <i className="fa fa-paper-plane" />
                                        </button>
                                    </div>
                                </div>
                                <span style={{ color: 'red' }}>{errors.message}</span>

                            </form>
                            <br />
                            {/* </div> */}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SupportReply;