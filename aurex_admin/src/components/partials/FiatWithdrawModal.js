// import package
import React, { Component, Fragment } from "react";
import { Modal, Button } from 'react-bootstrap';

// import action
import { approveFiatWithdraw, rejectFiatWithdraw } from '../../actions/walletAction';

// import lib
import { toastAlert } from '../../lib/toastAlert';

class FiatWithdrawModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loader: false
        };
    }


    rejectSubmit = async () => {
        const { record, fetchData } = this.props;
        this.setState({ 'loader': true })
        try {
            const { status, loading, message } = await rejectFiatWithdraw(record._id);
            this.setState({ 'loader': loading })
            if (status == 'success') {
                fetchData();
                this.handleClose();
                toastAlert('success', message, 'coinwithdraw')
            } else {
                toastAlert('error', message, 'coinwithdraw')
            }
        } catch (err) { }
    }

    confirmSubmit = async () => {
        const { record, fetchData } = this.props;
        this.setState({ 'loader': true })
        try {
            const { status, loading, message } = await approveFiatWithdraw(record._id);
            this.setState({ 'loader': loading })
            if (status == 'success') {
                fetchData();
                this.handleClose();
                toastAlert('success', message, 'coinwithdraw')
            } else {
                toastAlert('error', message, 'coinwithdraw')
            }
        } catch (err) { }
    }

    handleClose = () => {
        const { onHide } = this.props;
        onHide();
    }

    render() {
        const { isShow, record, loader } = this.props;

        return (
            <Modal
                show={isShow}
                onHide={this.handleClose}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="popUpSpace">
                        {
                            record.status == "completed" && <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="answer">Transaction ID</label>
                                </div>
                                <div className="col-md-9">
                                    <span className="word_brak">{record._id}</span>
                                </div>
                            </div>
                        }

                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="answer">Bank Name</label>
                            </div>
                            <div className="col-md-9">
                                {record.bankDetail && record.bankDetail.bankName}
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="answer">Account Number</label>
                            </div>
                            <div className="col-md-9">
                                {record.bankDetail && record.bankDetail.accountNo}
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="answer">IBAN Code</label>
                            </div>
                            <div className="col-md-9">
                                {record.bankDetail && record.bankDetail.bankcode}
                            </div>
                        </div>


                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="answer">Country</label>
                            </div>
                            <div className="col-md-9">
                                {record.bankDetail && record.bankDetail.country}
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="answer">City</label>
                            </div>
                            <div className="col-md-9">
                                {record.bankDetail && record.bankDetail.city}
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="answer">Transfer Currency</label>
                            </div>
                            <div className="col-md-9">
                                {record.coin}
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="answer">Transfer Amount</label>
                            </div>
                            <div className="col-md-9">
                                {record.actualAmount}
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="answer">Commission Fee(%)</label>
                            </div>
                            <div className="col-md-9">
                                {record.commissionFee}
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="answer">Total Amount</label>
                            </div>
                            <div className="col-md-9">
                                {record.amount}
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="answer">Status</label>
                            </div>
                            <div className="col-md-9">
                                {record.status}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                {
                    record.status == 'pending' && <Modal.Footer>
                        <Button
                            variant="danger btnDefaultNewBlue"
                            onClick={this.rejectSubmit}
                            disabled={loader}
                        >
                            Reject
      					</Button>
                        <Button
                            onClick={this.confirmSubmit}
                            variant="success btnDefaultNew"
                            disabled={loader}
                        >
                            Confirm
      					</Button>
                    </Modal.Footer>
                }

            </Modal>
        )
    }
}

export default FiatWithdrawModal;