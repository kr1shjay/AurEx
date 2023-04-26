import React from 'react';
import { Modal } from 'react-bootstrap';
import { deleteanouncement } from '../../actions/anouncementAction'
import { toastAlert } from '../../lib/toastAlert'


const ConfirmModal = (props) => {
    // props
    const handleDelete = async (e) => {
        e.preventDefault();
        // if(!window.confirm('Are you sure want to cancel the order ?')){
        //     return
        // }
        try {
            let data = { _id: props.record }
            let { status, loading, message } = await deleteanouncement(data);
            if (status == "success") {
                toastAlert("success", message, "cancelOrder");
                let reqData = {
                    page: 1,
                    limit: 10
                }
                props.fetchData(reqData)
                props.onHide()
            } else {
                toastAlert("error", message, "cancelOrder");
            }
        } catch (err) { }
    };
    return (
        <Modal
            show={props.isShow}

            backdrop="static"
            size="md"
            centered
        >
            <Modal.Header>
                <Modal.Title>
                    <h4 className="modal-title mt-0">
                        Delete Anouncement
                    </h4>
                </Modal.Title>
                <button type="button" class="close" onClick={() => props.onHide()}><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>

            </Modal.Header>
            <Modal.Body>
                <div className="modedl_subscribe_content">


                    <p className='text-white mt-3 f-14'>
                        Are you sure you want to delete the Anouncement?</p>

                    <div className="d-flex justify-content-between mt-4 pb-4">

                        <button type="button" class="btn btn-danger w-100 mt-3 mr-3" onClick={() => props.onHide()}>Cancel</button>
                        <button onClick={(e) => handleDelete(e)}
                            type="button"
                            class="btn btn-primary w-100 mt-3"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ConfirmModal;