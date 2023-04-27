import React from 'react'
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { replyContact } from "../../actions/userActions";
import { withRouter } from "react-router-dom";
import { toast } from 'react-toastify';
import $ from 'jquery';
import { Editor } from '@tinymce/tinymce-react';
import 'react-toastify/dist/ReactToastify.css';



//lib
import { toastAlert } from '../../lib/toastAlert'

//action
import { AdminMsg } from '../../actions/contactusAction'
class ContactUpdateModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rlyMsg: '',
            validErr: {},
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }

    async handleSubmit(e) {

        e.preventDefault()

        let { rlyMsg } = this.state
        let { record } = this.props

        let Data = {
            rly: rlyMsg,
            id: record._id,
        }
        let { status, errors, message } = await AdminMsg(Data)
        if (status === true) {
            toastAlert('success', message)
            this.setState({ show: 'true' })
            this.props.onDelete()
            this.setState({ rlyMsg: '' })
            $('#update-contact-modal').modal('hide');
        } else {
            toastAlert('error', message)
        }
        if (errors) {
            this.setState({ validErr: errors })
        }
    }

    handleChange(e) {
        let { name, value } = e.target
        this.setState({ rlyMsg: value })
        if (value) {
            this.setState({ validErr: {} })
        }
    }
    handleClose(e) {
        e.preventDefault()
        window.location.reload()
        $('#update-contact-modal').modal('hide')
    }

    render() {
        let { rlyMsg, validErr, show } = this.state
        let { record } = this.props
        console.log("🚀 ~ file: ContactUpdateModal.js ~ line 74 ~ ContactUpdateModal ~ render ~ record", record)
        return (
            <div>
                <div className="modal fade" id="update-contact-modal">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Reply to contact</h4>
                                <button type="button" className="close" onClick={this.handleClose}>&times;</button>
                            </div>
                            <div className="modal-body">
                                <form noValidate onSubmit={this.onContactReplay} id="update-contact">
                                    <input
                                        onChange={this.onChange}
                                        value={record.id}
                                        id="contact-update-id"
                                        type="text"
                                        className="d-none" />
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Name</label>
                                        </div>
                                        <div className="col-md-9">
                                            {record.name}
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Email</label>
                                        </div>
                                        <div className="col-md-9">
                                            {record.email}
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Subject</label>
                                        </div>
                                        <div className="col-md-9" style={{ 'overflow-wrap': 'break-word' }}>
                                            {record.subject}
                                        </div>
                                    </div>

                                    <div className="row mt-2">
                                        <div className="col-md-3" >
                                            <label htmlFor="name">Message</label>
                                        </div>
                                        <div className="col-md-9" style={{ 'overflow-wrap': 'break-word' }}>
                                            {record.usrMsg}
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="reply">Reply</label>
                                        </div>
                                        <div className="col-md-9">
                                            <textarea className='form-control scroll_green_textarea'
                                                onChange={this.handleChange}
                                            >

                                            </textarea>
                                            <span style={{ color: 'red' }}>{validErr && validErr.rly}</span>
                                        </div>
                                    </div>

                                </form>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={this.handleClose}>Close</button>

                                <button
                                    form="update-contact"
                                    type="submit"
                                    onClick={this.handleSubmit}
                                    className="btn btn-primary"
                                // data-dismiss="modal"
                                >
                                    Reply
                                </button>



                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

ContactUpdateModal.propTypes = {
    replyContact: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { replyContact }
)(withRouter(ContactUpdateModal));
