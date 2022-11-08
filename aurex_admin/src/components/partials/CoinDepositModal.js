// import package
import React, { Component, Fragment } from "react";
import { Modal, Button } from 'react-bootstrap';

class CoinDepositModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loader: false
        };
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

                    <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="answer">Transaction Id</label>
                            </div>
                            <div className="col-md-9">
                            <span className="word_brak">{record.txid}</span>
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="answer">To Address</label>
                            </div>
                            <div className="col-md-9">
                            <span className="word_brak">{record.toAddress}</span>
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
                                <label htmlFor="answer">Deposit Amount</label>
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
            </Modal>
        )
    }
}

export default CoinDepositModal;