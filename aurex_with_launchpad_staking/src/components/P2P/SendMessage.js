// import package
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

// import action
import { usrConversation } from '../../actions/p2pAction'

// import lib
import { toastAlert } from '../../lib/toastAlert'
import isEmpty from '../../lib/isEmpty';

const initialFormValue = {
    'message': '',
    'attachment': ''
}

const SendMessage = (props) => {
    // props
    const { detail } = props;
    const dispatch = useDispatch();

    // state
    const [formValue, setFormValue] = useState(initialFormValue)

    // redux
    const { userId } = useSelector(state => state.auth);

    const { message, attachment } = formValue;

    // function
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let formData = { ...formValue, [name]: value };
        setFormValue(formData);
    };

    const handleFile = (e) => {
        e.preventDefault();
        const { name, files } = e.target;
        let formData = { ...formValue, [name]: files[0] };
        setFormValue(formData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let reqData = {
                orderId: detail._id,
                message: formValue.message,
                attachment: formValue.attachment,
            }
            if (!(reqData.attachment && reqData.attachment.name )&& isEmpty(reqData.message)) {
                toastAlert("error", ' Please Enter message', "chatMsg");
                return
            }

            if (userId == detail.sellUserId) {
                reqData['receiverId'] = detail.buyUserId;
            } else if (userId == detail.buyUserId) {
                reqData['receiverId'] = detail.sellUserId;
            }

            const formData = new FormData();
            formData.append("orderId", reqData.orderId);
            formData.append("receiverId", reqData.receiverId);
            formData.append("message", reqData.message);
            formData.append("attachment", reqData.attachment);

            const { status, message } = await usrConversation(formData, dispatch);
            if (status == 'success') {
                toastAlert("success", message, "conversation");
                setFormValue(initialFormValue)
            } else {
                toastAlert("error", message, "conversation");
            }

        } catch (err) {

        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                className="form-control"
                placeholder="write message..."
                name="message"
                value={message}
                onChange={handleChange}
            />
            <div className="chat_file_msg">
                <div className="file-field">
                    <a className="btn-floating mt-0">
                        <label htmlFor="file-input">

                            <i className="fa fa-paperclip fa-lg" aria-hidden="true"></i>
                            <input
                                type="file"
                                className="hide"
                                name="attachment"
                                onChange={handleFile}
                            />
                        </label>

                    </a>
                </div>
                <i
                    className="fas fa-paper-plane"
                    onClick={handleSubmit}
                ></i>
            </div>
        </form>
    )
}

export default SendMessage;