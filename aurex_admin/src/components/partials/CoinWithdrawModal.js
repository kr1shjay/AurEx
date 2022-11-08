// import package
import React, { Component, Fragment } from "react";
import { Modal, Button } from 'react-bootstrap';

// import action
import { approveCoinWithdraw, rejectCoinWithdraw } from '../../actions/walletAction';

// import lib
import { toastAlert } from '../../lib/toastAlert';

class CoinWithdrawModal extends Component {
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
            const { status, loading, message } = await rejectCoinWithdraw(record._id);
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
            const { status, loading, message } = await approveCoinWithdraw(record._id);
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
                                <span className="word_brak">{record.txid}</span>
                                </div>
                            </div>
                        }

                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="answer">To address</label>
                            </div>
                            <div className="col-md-9">
                            <span className="word_brak">{record.toAddress}</span>
                            </div>
                        </div>


                        {
                            record.coin == 'XRP' && <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="answer">Tag id/Memo</label>
                                </div>
                                <div className="col-md-9">
                                    {record.destTag}
                                </div>
                            </div>
                        }

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

export default CoinWithdrawModal;