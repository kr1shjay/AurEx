// import package
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";
import clsx from 'classnames'

// import action
import { newTradeBot } from '../../../actions/tradingBot'

// import lib
import { toastAlert } from '../../../lib/toastAlert'
import isEmpty from '../../../lib/isEmpty';
import validation from './validation';

const initialFormValue = {
    'pairId': '',
    'side': '',
    'startPrice': '',
    'endPrice': '',
    'startQuantity': '',
    'endQuantity': '',
    'count': ''
}

class NewBot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pairList: [],
            formValue: initialFormValue,
            priceLoader: false,
            loader: false,
            errors: {}
        };
    }

    componentDidMount() {
        const { pairList } = this.props;
        if (pairList && pairList.length > 0) {
            this.setState({ pairList })
        }
    }

    componentWillReceiveProps(nextProps) {
        const { pairList } = nextProps;
        const { priceLoader } = this.state;

        if (pairList && pairList.length > 0) {
            this.setState({ pairList })
        }

        if (priceLoader) {
            this.setState({ priceLoader: false })
        }
    }

    handleChange = e => {
        e.preventDefault();
        let { name, value } = e.target;
        let formData = { ...this.state.formValue, ...{ [name]: value } };
        this.setState({ formValue: formData });
    }

    handleSubmit = async e => {
        e.preventDefault();

        const { formValue } = this.state;
        this.setState({ loader: true })

        try {
            let reqData = {
                'pairId': formValue.pairId,
                'side': formValue.side,
                'startPrice': formValue.startPrice,
                'endPrice': formValue.endPrice,
                'startQuantity': formValue.startQuantity,
                'endQuantity': formValue.endQuantity,
                'count': formValue.count
            }

            const validateError = await validation(reqData)
            if (!isEmpty(validateError)) {
                this.setState({ "errors": validateError })
                return
            }

            const { status, loading, message, error } = await newTradeBot(reqData);
            this.setState({ loader: loading })
            if (status == 'success') {
                toastAlert('error', message, 'newBot')
            } else {
                if (!isEmpty(error)) {
                    this.setState({ errors: error })
                } else {
                    toastAlert('error', message, 'newBot')
                }
            }
        } catch (err) { }
    };

    render() {

        const { pairId, side, startPrice, endPrice, startQuantity, endQuantity, count } = this.state.formValue
        const { errors, pairList, loader, priceLoader } = this.state;
        const { refetchPair } = this.props;

        let isMarkPrice = false, markPrice = 0;
        if (!isEmpty(pairId)) {
            let pairData = pairList.find(el => el._id == pairId);
            if (pairData) {
                isMarkPrice = true
                markPrice = pairData.markPrice
            }
        }
        return (
            <form
                noValidate
                onSubmit={this.handleSubmit}
            >
                <h3 className="mt-2 text-secondary">Trading bot</h3>
                <div className="row mt-2">
                    <div className="col-md-3">
                        <label htmlFor="copyright_text">Pair</label>
                    </div>
                    <div className="col-md-6">
                        <Form.Control
                            as="select"
                            custom
                            name={'pairId'}
                            value={pairId}
                            onChange={this.handleChange}
                        >
                            <option value={''}>{"Select Pair"}</option>
                            {
                                pairList && pairList.length > 0 && pairList.map((item, key) => {
                                    return (
                                        <option key={key} value={item._id}>{item.firstCurrencySymbol + item.secondCurrencySymbol}</option>
                                    )
                                })
                            }
                        </Form.Control>
                    </div>
                </div>


                <div className="row mt-2">
                    <div className="col-md-3">
                        <label htmlFor="copyright_text">Live Price</label>
                    </div>
                    <div className="col-md-4">
                        {
                            !isMarkPrice && "0.00000000"
                        }
                        {
                            isMarkPrice && markPrice
                        }
                    </div>
                    {
                        isMarkPrice && <div className="col-md-3">
                            <button
                                onClick={() => {
                                    this.setState({ priceLoader: true })
                                    refetchPair();
                                }}
                                type="button"
                                className="btn btn-primary"
                                disabled={priceLoader}
                            >
                                {priceLoader && <i class="fas fa-spinner fa-spin"></i>}
                                Refresh
                            </button>
                        </div>
                    }

                </div>

                <div className="row mt-2">
                    <div className="col-md-3">
                        <label htmlFor="copyright_text">Side</label>
                    </div>
                    <div className="col-md-6">
                        <Form.Control
                            as="select"
                            custom
                            name={'side'}
                            value={side}
                            onChange={this.handleChange}
                        >
                            <option value={''}>{"Select Side"}</option>
                            <option value={'buy'}>{"Buy"}</option>
                            <option value={'sell'}>{"Sell"}</option>
                        </Form.Control>
                    </div>
                </div>

                <div className="row mt-2">
                    <div className="col-md-3">
                        <label htmlFor="startPrice">Price range start </label>
                    </div>
                    <div className="col-md-6">
                        <input
                            name="startPrice"
                            type="number"
                            min="0"
                            value={startPrice}
                            onChange={this.handleChange}
                            error={errors.startPrice}
                            className={clsx("form-control", {
                                invalid: errors.startPrice
                            })} />
                        <span className="text-danger">{errors.startPrice}</span>
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-md-3">
                        <label htmlFor="endPrice">Price range End</label>
                    </div>
                    <div className="col-md-6">
                        <input
                            name="endPrice"
                            type="number"
                            min="0"
                            value={endPrice}
                            onChange={this.handleChange}
                            error={errors.endPrice}
                            className={clsx("form-control", {
                                invalid: errors.endPrice
                            })} />
                        <span className="text-danger">{errors.endPrice}</span>
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-md-3">
                        <label htmlFor="startQuantity">Quantity range start</label>
                    </div>
                    <div className="col-md-6">
                        <input
                            name="startQuantity"
                            type="number"
                            min="0"
                            value={startQuantity}
                            onChange={this.handleChange}
                            error={errors.startQuantity}
                            className={clsx("form-control", {
                                invalid: errors.startQuantity
                            })} />
                        <span className="text-danger">{errors.startQuantity}</span>
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-md-3">
                        <label htmlFor="endQuantity">Quantity range end</label>
                    </div>
                    <div className="col-md-6">
                        <input
                            name="endQuantity"
                            type="number"
                            min="0"
                            value={endQuantity}
                            onChange={this.handleChange}
                            error={errors.endQuantity}
                            className={clsx("form-control", {
                                invalid: errors.endQuantity
                            })} />
                        <span className="text-danger">{errors.endQuantity}</span>
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-md-3">
                        <label htmlFor="count">Order count</label>
                    </div>
                    <div className="col-md-6">
                        <input
                            name="count"
                            type="number"
                            min="0"
                            value={count}
                            onChange={this.handleChange}
                            error={errors.count}
                            className={clsx("form-control", {
                                invalid: errors.count
                            })} />
                        <span className="text-danger">{errors.count}</span>
                    </div>
                </div>
                <div className="row mt-2">
                    <button
                        type="submit"
                        className="btn btn-primary">
                        {loader && <i class="fas fa-spinner fa-spin"></i>}
                        Place Spot Order
                    </button>
                </div>
            </form>
        )
    }
}

NewBot.propTypes = {
    pairList: PropTypes.array.isRequired,
    refetchPair: PropTypes.func.isRequired
};

NewBot.defaultProps = {
    pairList: [],
};

export default NewBot;