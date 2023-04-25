// import package
import React, { Component, Fragment } from "react";
import { Modal, Button } from 'react-bootstrap';
import classnames from "classnames";

// import action
import { approveFiatDeposit } from '../../actions/walletAction';

// import lib
import { toastAlert } from '../../lib/toastAlert';

const initialFormValue = {
    'amount': '',
}

class FiatDepositModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formValue: initialFormValue,
            errors: {},
            loader: false
        };
    }

    handleChange = e => {
        e.preventDefault();
        let { name, value } = e.target;
        let formData = { ...this.state.formValue, ...{ [name]: value } };
        this.setState({ formValue: formData });

        const { errors } = this.state;
        if (errors) {
            this.setState({ errors: {} })
        }
    }

    handleSubmit = async e => {
        e.preventDefault();
        try {
            const { record, fetchData } = this.props;
            const { formValue } = this.state;
            let reqData = {
                'transactionId': record._id,
                'amount': record.amount
            };

            const { status, loading, message, error } = await approveFiatDeposit(reqData);
            if (status == 'success') {
                fetchData();
                toastAlert('success', message, 'fiatDeposit');
                this.handleClose()
            } else {
                if (error) {
                    this.setState({ errors: error })
                }
                toastAlert('error', message, 'fiatDeposit');
            }
        } catch (err) { }
    }

    handleClose = () => {
        const { onHide } = this.props;
        onHide();
    }

    render() {
        const { isShow, record, loader } = this.props;
        const { amount } = this.state.formValue;
        const { errors } = this.state;

        return (
            <Modal
                show={isShow}
                onHide={this.handleClose}
                size="lg"
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
                                <label htmlFor="answer">Deposit Amount</label>
                            </div>
                            <div className="col-md-9">
                                {record.amount}
                            </div>
                        </div>

                        {
                            record.status != 'pending' && <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="answer">Deposited Amount</label>
                                </div>
                                <div className="col-md-9">
                                    {record.actualAmount}
                                </div>
                            </div>
                        }


                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="answer">Document</label>
                            </div>
                            <div className="col-md-9">
                                <img src={record.image} width="500" height="500" className="img-fluid" />
                            </div>
                        </div>


                        {
                            record.status == 'pending' && <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="answer">Amount</label>
                                </div>
                                <div className="col-md-9">
                                    <>
                                        <input
                                            type="text"
                                            name="amount"
                                            value={record.amount}
                                            onChange={this.handleChange}
                                            error={errors.amount}
                                            className={classnames("form-control", {
                                                invalid: errors.amount
                                            })}
                                        />
                                        <span className="text-danger">{errors.amount}</span>
                                    </>

                                </div>
                            </div>
                        }

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
                            onClick={this.handleSubmit}
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

export default FiatDepositModal;