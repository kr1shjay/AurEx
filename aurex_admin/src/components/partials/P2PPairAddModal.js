import React from 'react'
import classnames from "classnames";
import { Modal, Form } from "react-bootstrap";
import Select from 'react-select';

//import action
import { addPair } from '../../actions/p2pAction'

//import lib
import { toastAlert } from '../../lib/toastAlert';

const initialFormValue = {
    "firstCoinId": '',
    "secondCoinId": '',
    "feePct": '',
    "markPrice": '',
    "fetchMarkPrice": 'local',
    "markupPercentage": '',
    "payment": []
}

class PairAddModal extends React.Component {
    constructor() {
        super();
        this.state = {
            formValue: initialFormValue,
            errors: {},
            loader: false
        };

        this.paymentOption = [
            { 'label': "Bank", 'value': 'bank' },
            // { 'label': "UPI", 'value': 'upi' },
        ]

        this.handlePayment = this.handlePayment.bind(this);
    }

    handleChange = e => {
        e.preventDefault();
        let { name, value } = e.target;
        let formData = { ...this.state.formValue, [name]: value };
        this.setState({ formValue: formData });
    };

    handlePayment(selectedOption) {
        if (selectedOption && selectedOption.length > 0) {
            let formData = { ...this.state.formValue, 'payment': selectedOption.map((el) => { return el.value }) };
            this.setState({ formValue: formData });
        } else {
            let formData = { ...this.state.formValue, 'payment': [] };
            this.setState({ formValue: formData });
        }
    };

    handleClose = () => {
        const { onHide } = this.props;
        onHide();
        this.setState({ 'formValue': initialFormValue, errors: {} });
    }

    handleSubmit = async e => {
        e.preventDefault();
        try {
            const { formValue } = this.state;
            const { fetchData } = this.props;
            let reqData = formValue;
            reqData['payment'] = JSON.stringify(reqData.payment)
            this.setState({ 'loader': true })
            let { status, loading, error, message } = await addPair(reqData);
            this.setState({ 'loader': loading })
            if (status == 'success') {
                toastAlert('success', message, 'addP2p');
                this.handleClose()
                this.props.fetchData()

            } else {
                if (error) {
                    this.setState({ errors: error })
                    let formData = { ...this.state.formValue, 'payment': [] };
                    this.setState({ formValue: formData });
                    return
                }
                toastAlert('error', message, 'addP2p');
            }
        }
        catch (err) { }
    }

    render() {
        const { errors, loader } = this.state;
        const {
            firstCoinId,
            secondCoinId,
            feePct,
            markPrice,
            fetchMarkPrice,
            markupPercentage,
            payment
        } = this.state.formValue
        const { isShow, currencyOptions } = this.props;
        console.log(payment, 'paymentpaymentpayment')
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
                        <h4 className="modal-title">Add P2P Pair</h4>
                    </Modal.Header>
                    <Modal.Body>

                        <form noValidate id="add-spot">

                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="identifier">Base Currency </label>
                                </div>
                                <div className="col-md-9">
                                    <Form.Control
                                        as="select"
                                        custom
                                        name={'firstCoinId'}
                                        value={firstCoinId}
                                        onChange={this.handleChange}
                                    >
                                        <option value={''} disabled={true}>{"Select Base Currency"}</option>
                                        {
                                            currencyOptions && currencyOptions.length > 0 && currencyOptions.map((item, key) => {
                                                return (
                                                    <option key={key} value={item._id}>{item.coin}</option>
                                                )
                                            })
                                        }
                                    </Form.Control>
                                    <span className="text-danger">{errors.firstCoinId}</span>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="identifier">Quote Currency </label>
                                </div>
                                <div className="col-md-9">
                                    <Form.Control
                                        as="select"
                                        custom
                                        name={'secondCoinId'}
                                        value={secondCoinId}
                                        onChange={this.handleChange}
                                    >
                                        <option value={''} disabled={true}>{"Select Quote Currency"}</option>
                                        {
                                            currencyOptions && currencyOptions.length > 0 && currencyOptions.map((item, key) => {
                                                return (
                                                    <option key={key} value={item._id}>{item.coin}</option>
                                                )
                                            })
                                        }
                                    </Form.Control>
                                    <span className="text-danger">{errors.secondCoinId}</span>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="taker_fees">Fee(%)</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        onChange={this.handleChange}
                                        value={feePct}
                                        name="feePct"
                                        error={errors.feePct}
                                        type="text"
                                        className={classnames("form-control", {
                                            invalid: errors.feePct
                                        })}
                                    />
                                    <span className="text-danger">{errors.feePct}</span>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="taker_fees">Payment</label>
                                </div>
                                <div className="col-md-9">
                                    <Select
                                        value={this.paymentOption && this.paymentOption.length > 0 ? this.paymentOption.filter((el) => {
                                            if (payment.includes(el.value)) {
                                                return el;
                                            }
                                        }) : []}
                                        isMulti
                                        name="colors"
                                        options={this.paymentOption}
                                        onChange={this.handlePayment}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                    <span className="text-danger">{errors.payment}</span>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="maxQuantity">Mark Price</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        onChange={this.handleChange}
                                        value={markPrice}
                                        name="markPrice"
                                        error={errors.markPrice}
                                        type="text"
                                        className={classnames("form-control", {
                                            invalid: errors.markPrice
                                        })}
                                    />
                                    <span className="text-danger">{errors.markPrice}</span>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="autobot">Fetch Mark Price</label>
                                </div>
                                <div className="col-md-9">
                                    <Form.Control
                                        as="select"
                                        custom
                                        name={'fetchMarkPrice'}
                                        value={fetchMarkPrice}
                                        onChange={this.handleChange}
                                    >
                                        <option value='local'>Local</option>
                                        <option value='binance'>Binance</option>
                                    </Form.Control>
                                    <span className="text-danger">{errors.fetchMarkPrice}</span>
                                </div>
                            </div>

                            {
                                ['binance'].includes(fetchMarkPrice) &&
                                <div className="row mt-2">
                                    <div className="col-md-3">
                                        <label>Markup(%)</label>
                                    </div>
                                    <div className="col-md-9">

                                        <input
                                            onChange={this.handleChange}
                                            value={markupPercentage}
                                            error={errors.markupPercentage}
                                            name="markupPercentage"
                                            type="text"
                                            className={classnames("form-control", {
                                                invalid: errors.markupPercentage
                                            })}
                                        />
                                        <span className="text-danger">{errors.markupPercentage}</span>
                                    </div>
                                </div>
                            }

                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={this.handleClose}
                            disabled={loader}
                        >
                            Close
                        </button>
                        <button
                            onClick={this.handleSubmit}
                            className="btn btn-primary"
                            disabled={loader}
                        >
                            {loader && <i class="fas fa-spinner fa-spin"></i>}
                            Submit
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}



export default PairAddModal;
