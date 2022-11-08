import React from 'react'
import classnames from "classnames";
import { Modal, Card } from "react-bootstrap";
import { Link } from 'react-router-dom'

// import action
import { approveUserKyc, rejectUserKyc } from '../../actions/userKycAction';
// import lib
import { toastAlert } from '../../lib/toastAlert';


const initialFormValue = {
    'formType': '',
    'type': '',
    'frontImage': '',
    'backImage': '',
    'selfiImage': '',
    'panImage': '',
    'proofNumber': '',
    'reason': ''
}

class KycUpdate extends React.Component {
    constructor(props) {
        super();
        this.state = {
            formValue: initialFormValue,
            errors: {},
        };
    }

    componentWillReceiveProps(nextProps) {
        const { record } = nextProps;
        if (record) {
            this.setState({ formValue: record })
        }
    }

    handleChange = e => {
        e.preventDefault();
        let { name, value } = e.target;
        let formData = { ...this.state.formValue, ...{ [name]: value } };
        this.setState({ formValue: formData });
    }

    handleClose = () => {
        const { onHide } = this.props;
        onHide();
        this.setState({ 'formValue': initialFormValue, errors: {} });
    }

    handleApprove = async e => {
        e.preventDefault();
        try {
            const { fetchData } = this.props;
            const { formValue } = this.state;

            let reqData = {
                'userId': formValue.userId,
                'formType': formValue.formType,
            };

            const { status, loading, message, error } = await approveUserKyc(reqData);
            if (status == 'success') {
                fetchData();
                toastAlert('success', message, 'addTemplate');
                this.handleClose()
            } else {
                toastAlert('error', message, 'addTemplate');
            }
        } catch (err) { }
    }

    handleReject = async e => {
        e.preventDefault();
        try {
            const { fetchData } = this.props;
            const { formValue } = this.state;

            let reqData = {
                'userId': formValue.userId,
                'formType': formValue.formType,
                'reason': formValue.reason,
            };

            const { status, loading, message, error } = await rejectUserKyc(reqData);
            if (status == 'success') {
                fetchData();
                toastAlert('success', message, 'kycform');
                this.handleClose()
            } else {
                if (error) {
                    this.setState({ errors: error })
                }
                toastAlert('error', message, 'kycform');
            }
        } catch (err) { }
    }

    render() {
        const { errors } = this.state;
        const { formType, type, reason, frontImage, backImage, selfiImage, panImage, proofNumber } = this.state.formValue
        const { isShow } = this.props;
        return (
            <div>
                <Modal
                    show={isShow}
                    onHide={this.handleClose}
                    aria-labelledby="contained-modal-title-vcenter"
                    size="lg"
                    centered
                    scrollable={true}
                >
                    <Modal.Header closeButton>
                        {
                            formType == 'idProof' && <h4 className="modal-title">Identity Document</h4>
                        }
                        {
                            formType == 'addressProof' && <h4 className="modal-title">Residential Document</h4>
                        }

                    </Modal.Header>
                    <Modal.Body>
                        <form noValidate>
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="name">Type</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        type="text"
                                        name="type"
                                        value={type}
                                        className={classnames("form-control")}
                                    />
                                </div>
                            </div>

                            {
                                formType == 'idProof' && <div className="row mt-2">
                                    <div className="col-md-3">
                                        <label htmlFor="name">Proof Number</label>
                                    </div>
                                    <div className="col-md-9">
                                        <input
                                            type="text"
                                            name="proofNumber"
                                            value={proofNumber}
                                            className={classnames("form-control")}
                                        />
                                    </div>
                                </div>
                            }


                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="name">Front Image</label>
                                </div>
                                <div className="col-md-9">
                                {/* <img src={frontImage} width="100%" height="250" /> */}

                                    <a href={frontImage} target="_blank" className='file_a'><i class="fa fa-picture-o" aria-hidden="true"></i>View</a>
                                </div>
                            </div>

                            {
                                formType == 'idProof' && type != 'passport' && <div className="row mt-2">
                                    <div className="col-md-3">
                                        <label htmlFor="name">Back Image</label>
                                    </div>
                                    <div className="col-md-9">
                                    {/* <img src={backImage} width="100%" height="250" /> */}

                                        <a href={backImage} target="_blank" className='file_a'><i class="fa fa-picture-o" aria-hidden="true"></i>View</a>
                                    </div>
                                </div>
                            }

                            {
                                formType == 'idProof' && 
                                <>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Selfi Image</label>
                                        </div>
                                        <div className="col-md-9">
                                        {/* <img src={selfiImage} width="100%" height="250" /> */}
                                        <a href={selfiImage} target="_blank" className='file_a'><i class="fa fa-picture-o" aria-hidden="true"></i>View</a>
                                            {/* <a href={selfiImage} target="_blank">View</a> */}
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Pan Image</label>
                                        </div>
                                        <div className="col-md-9">
                                        {panImage != null &&
                                            <a href={panImage} target="_blank" className='file_a'><i class="fa fa-picture-o" aria-hidden="true"></i>View</a>
                                        }
                                        {panImage == null  &&
                                            <label htmlFor="name">-</label>
                                        }
                                        </div>
                                        
                                    </div>
                                 </>
                            }


                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="name">Reason</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        type="text"
                                        name="reason"
                                        value={reason}
                                        onChange={this.handleChange}
                                        error={errors.reason}
                                        className={classnames("form-control", {
                                            invalid: errors.reason
                                        })}
                                    />
                                    <span className="text-danger">{errors.reason}</span>
                                </div>
                            </div>


                        </form>

                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={this.handleApprove}
                        >
                            Approve
                        </button>
                        <button
                            type="button"
                            onClick={this.handleReject}
                            className="btn btn-primary"
                        >
                            Reject
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>

        )
    }
}

export default KycUpdate
