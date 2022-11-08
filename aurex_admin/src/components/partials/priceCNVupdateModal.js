import React from 'react'
import classnames from "classnames";
import { Modal, Form } from "react-bootstrap";

//import action
import { priceCNVUpdate } from '../../actions/priceCNVAction'

// import lib
import { toastAlert } from '../../lib/toastAlert';

const options = [{ 'value': "binance", 'label': "binance" }, { 'value': "off", 'label': "Off" }, {'value': "cryptocompare", 'label': "Cryptocompare"}];

const initialFormValue = {
    "priceCNVId": "", //Price Conversion Id
    "baseSymbol": "",
    "convertSymbol": "",
    "convertPrice": "",
    "fetchstatus":"off",
}

class PairAddModal extends React.Component {
    constructor() {
        super();
        this.state = {

            formValue: initialFormValue,
            errors: {}
        };

    }



    componentWillReceiveProps(nextProps) {

        const { record } = nextProps;
        if (record) {
            this.setState({
                formValue: {
                    'priceCNVId': record._id,
                    "baseSymbol": record.baseSymbol,
                    "convertSymbol": record.convertSymbol,
                    "convertPrice": record.convertPrice,
                    "fetchstatus": record.fetchstatus
                }
            })
        }
    }

    handleChange = e => {
        e.preventDefault();
        let {  id, value } = e.target;
      
        let formData = { ...this.state.formValue, ...{ [id]: value } };

        this.setState({ formValue: formData });
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
            let { status, error, message } = await priceCNVUpdate(reqData);
            if (status == 'success') {
                fetchData();
                toastAlert('success', message, 'editPerpetualPair');
                this.handleClose()
            } else {
                if (error) {
                    this.setState({ errors: error })
                }
                toastAlert('error', message, 'editPerpetualPair');
            }
        }
        catch (err) { }
    }



    render() {


        const { errors, } = this.state;

        const { convertPrice, baseSymbol, convertSymbol, fetchstatus } = this.state.formValue

        const { isShow, } = this.props;


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
                        <h4 className="modal-title">Update Price Conversion</h4>
                    </Modal.Header>
                    <Modal.Body>

                        <form noValidate id="add-spot">

                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="taker_fees">Base Symbol</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        onChange={this.handleChange}
                                        value={baseSymbol}
                                        name="baseSymbol"
                                        error={errors.baseSymbol}
                                        id="baseSymbol"
                                        type="text"
                                        disabled={true}
                                        className={classnames("form-control", {
                                            invalid: errors.baseSymbol
                                        })}
                                    />
                                </div>
                            </div>


                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="taker_fees"> Convert Symbol</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        onChange={this.handleChange}
                                        value={convertSymbol}
                                        name="convertSymbol"
                                        error={errors.convertSymbol}
                                        id="convertSymbol"
                                        type="text"
                                        disabled={true}
                                        className={classnames("form-control", {
                                            invalid: errors.convertSymbol
                                        })}
                                    />
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="convertPrice">Convert Price</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        onChange={this.handleChange}
                                        value={convertPrice}
                                        name="convertPrice"
                                        error={errors.convertPrice}
                                        id="convertPrice"
                                        type="text"
                                        className={classnames("form-control", {
                                            invalid: errors.convertPrice
                                        })}
                                    />
                                    <span className="text-danger">{errors.convertPrice}</span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="autobot">Binance Integration</label>
                                </div>
                                <div className="col-md-9">
                                    <Form.Control
                                        as="select"
                                        custom
                                        name={'fetchstatus'}
                                        id={'fetchstatus'}
                                        value={fetchstatus}
                                        onChange={this.handleChange}
                                    >
                                        <option value={''}>{"Fetch Status"}</option>
                                        {
                                            options && options.length > 0 && options.map((item, key) => {
                                                return (
                                                    <option key={key} value={item.value}>{item.label}</option>
                                                )
                                            })
                                        }
                                    </Form.Control>
                                    <span className="text-danger">{errors.fetchstatus}</span>
                                </div>
                            </div>

                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={this.handleClose}
                        >
                            Close
                        </button>
                        <button
                            onClick={this.handleSubmit}
                            className="btn btn-primary"
                        >
                            Update
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}


export default PairAddModal;
