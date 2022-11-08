// import package
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"

// import action
import { replyMessage, closeTicket } from '../../actions/supportAction';

// import lib
import validation from './validation';
import isEmpty from '../../lib/isEmpty';
import { toastAlert } from '../../lib/toastAlert';
import { useTranslation } from 'react-i18next';

const initialFormValue = {
    'message': '',
    'attachment': ''
}
let file;
const ReplyConversation = (props) => {

    // props
    const { ticketId, receiverId, replyChatFun, closeTicketFun } = props;
    const { t, i18n } = useTranslation();

    // state
    const [formValue, setFormValue] = useState(initialFormValue);
    const [validateError, setValidateError] = useState({});

    const { message, attachment } = formValue;

    // function
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let formData = { ...formValue, [name]: value }
        setFormValue(formData)
        // setValidateError(validation(formData, 'replyMsg'))
        if (value) {
            setValidateError({})
        }
    }

    const handleSubmit = async () => {
        let reqData = {
            message,
            'receiverId': receiverId,
            'ticketId': ticketId,
            'attachment': file
        }
        let formData = new FormData()
        formData.append("message", reqData.message);
        formData.append("receiverId", reqData.receiverId);
        formData.append("ticketId", reqData.ticketId);
        formData.append("attachment", reqData.attachment);

        try {
            const { status, loading, error, result } = await replyMessage(formData);
            if (status == 'success') {
                setFormValue(initialFormValue)
                replyChatFun(result)
                file = ''
                // setValidateError(validation(initialFormValue, 'replyMsg'))
            }
            if (error) {
                setValidateError(error)
            }
        } catch (err) { }
    }

    const handleCloseTicket = async (e) => {
        e.preventDefault()
        let reqData = {
            'ticketId': ticketId
        }
        try {
            const { status, loading, error, message, result } = await closeTicket(reqData);
            if (status == 'success') {
                toastAlert('success', message, 'supportTicket');
                setTimeout(() => {
                    closeTicketFun(result.status)
                }, 1000)

            }
        } catch (err) { }
    }

    const handleFile = (e) => {
        e.preventDefault();
        const { name, files } = e.target;
        let formData = { ...formValue, [name]: files[0] }
        setFormValue(formData)
        if (files) {
            setValidateError({})
            file = files[0]
        }
    };

    useEffect(() => {
        // setValidateError(validation(formValue, 'replyMsg'))
    }, [])

    return (
        <div className="messageTypeBox contact_form">
            <div className="row">
                <div className="col-md-12">
                    <div className="form-group">
                        <label className="d-block">{t('RLY_TO_ADMIN')}</label>
                        <textarea
                            rows="2"
                            className="form-control"
                            onChange={handleChange}
                            name="message"
                            value={message}
                        />
                        <span style={{ color: 'red' }}>{validateError && validateError.message}</span>

                        <div className="file-field support_attach">

                            <a className="btn-floating mt-0" href="/#"  >
                                <label htmlFor="file-input" style={{ 'marginTop': '-10px' }} >
                                    <i
                                        className="fa fa-paperclip fa-lg"
                                        aria-hidden="true"
                                    ></i>
                                </label>
                                <input
                                    type="file"
                                    className="hidden"
                                    name="attachment"
                                    id="file-input"
                                    onChange={handleFile}
                                />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="col-md-12">
                    <p className="submitChat">
                        <button
                            type="button"
                            class="btn btn-outline text-uppercase py-2"
                            // disabled={!isEmpty(validateError)}
                            onClick={handleSubmit}
                        >
                            {t('REPLAY')}
                        </button>
                        <Link onClick={handleCloseTicket} className="ml-0 ml-sm-3">{t('CLOSE_THE_TICKET')}</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ReplyConversation;