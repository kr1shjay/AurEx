import React from "react";
import classnames from "classnames";
import { Modal, Form } from "react-bootstrap";

// import lib
import { toastAlert } from '../../lib/toastAlert';
import fileObjectUrl from '../../lib/fileObjectUrl'
import Select from 'react-select';

// import action
import { addCurrency } from '../../actions/currency';
import isEmpty from "../../lib/isEmpty";

const initialFormValue = {
  'name': '',
  'coin': '',
  'symbol': '',
  'type': 'crypto',
  'withdrawFee': 0,
  'minimumWithdraw': 0,
  'depositType': 'local',
  'image': '',
  'bankName': '',
  'accountNo': '',
  'holderName': '',
  'bankcode': '',
  'country': '',
  'tokenType': '',
  'depositStatus': 'Off',
  'withdrawStatus': 'Off',
  'minABI': '',
  'contractAddress': '',
  'decimals': 0,
  'isPrimary': false,
  'payment': [],
 'upiInputValue':0

}

class CurrencyAddModal extends React.Component {
  constructor() {
    super();
    this.state = {
      loader: false,
      formValue: initialFormValue,
      errors: {},
      //upi: false,
      //bank:false
    };
    this.paymentOption = [
      { 'label': 'BankTransaction', 'value': 'bank' },
      { 'label': 'UPI', 'value': 'upi' }
    ]
    this.handlePayment = this.handlePayment.bind(this);
  }

  handlePayment(selectedOption) {
    if (selectedOption && selectedOption.length > 0) {
      let formData = { ...this.state.formValue, 'payment': selectedOption.map((el) => { return el.value; }) };

   
      this.setState({ formValue: formData });
    } else {
      let formData = { ...this.state.formValue, 'payment': [] };
      this.setState({ formValue: formData });
    }
  };
  handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let formData = { ...this.state.formValue, ...{ [name]: value } };
    this.setState({ formValue: formData });
  };

  handleClose = () => {
    const { onHide } = this.props;
    onHide();
    this.setState({ 'formValue': initialFormValue, errors: {} });
  }


  handleFile = (e) => {
    e.preventDefault();
    const { name, files } = e.target;
    let formData = { ...this.state.formValue, ...{ [name]: files[0] } };
    this.setState({ formValue: formData });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const {
      type,
      name,
      coin,
      symbol,
      depositType,
      contractAddress,
      minABI,
      decimals,
      tokenType,
      withdrawFee,
      minimumWithdraw,
      bankName,
      accountNo,
      holderName,
      bankcode,
      country,
      image,
      payment,
      upiInputValue,
      depositStatus,
      withdrawStatus

    } = this.state.formValue;
    const { fetchData } = this.props;

    if (image) {
      if (image.size > 20000) {
        this.setState({ errors: { image: "Image size should be less than  20 Kb" } })
        toastAlert('error', "Image size should be less than  20 Kb", 'currencyAddModal')
        return false
      }
    }

    const formData = new FormData();
    formData.append("type", type);
    formData.append("name", name);
    formData.append("coin", coin);
    formData.append("symbol", symbol);
    formData.append("depositType", depositType);
    formData.append("contractAddress", contractAddress);
    formData.append("minABI", minABI);
    formData.append("decimals", decimals);
    formData.append("tokenType", tokenType);
    formData.append("withdrawFee", withdrawFee);
    formData.append("minimumWithdraw", minimumWithdraw);
    formData.append("payment", payment)
    formData.append("bankName", bankName);
    formData.append("accountNo", accountNo);
    formData.append("holderName", holderName);
    formData.append("bankcode", bankcode);
    formData.append("country", country);
    formData.append("image", image);
    formData.append("upiInputValue",upiInputValue)
    formData.append("depositStatus",depositStatus)
    formData.append("withdrawStatus",withdrawStatus)
    this.setState({ loader: true })
    try {
      const { status, loading, message, error } = await addCurrency(formData);
      this.setState({ loader: loading })
      if (status == 'success') {
        this.handleClose()
        fetchData()
        toastAlert('success', message, 'currencyAddModal')
      } else if (status == 'failed') {
        if (error) {
          this.setState({ errors: error })
        } else {
          toastAlert('error', message, 'currencyAddModal')
        }
      }
    } catch (err) {
    }
  };

  render() {
    const {
      type,
      name,
      coin,
      symbol,
      decimals,
      depositType,
      tokenType,
      contractAddress,
      minABI,
      withdrawFee,
      minimumWithdraw,
      bankName,
      accountNo,
      holderName,
      bankcode,
      country,
      image,
      payment,
      upiInputValue,
      depositStatus,
      withdrawStatus
      

    } = this.state.formValue;
    const { errors, loader, upi } = this.state;

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
            <h4 className="modal-title">Add Currency</h4>
          </Modal.Header>
          <Modal.Body>

            <form noValidate            >
              <div className="row mt-2">
                <div className="col-md-3">
                  <label>Currency Type</label>
                </div>
                <div className="col-md-9">

                  <Form.Control
                    name="type"
                    value={type}
                    onChange={this.handleChange}
                    as="select" custom
                  >
                    <option value={'crypto'}>Crypto</option>
                    <option value={'token'}>Token</option>
                    <option value={"fiat"}>Fiat</option>
                  </Form.Control>

                  <span className="text-danger">{errors.type}</span>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label>Currency Name</label>
                </div>
                <div className="col-md-9">
                  <input
                    name="name"
                    type="text"
                    value={name}
                    onChange={this.handleChange}
                    error={errors.name}
                    className={classnames("form-control", {
                      invalid: errors.name,
                    })}
                  />
                  <span className="text-danger">{errors.name}</span>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-3">
                  <label>Coin</label>
                </div>
                <div className="col-md-9">
                  <input
                    name="coin"
                    type="text"
                    value={coin}
                    onChange={this.handleChange}
                    error={errors.coin}
                    className={classnames("form-control", {
                      invalid: errors.coin,
                    })}
                  />
                  <span className="text-danger">
                    {errors.coin}
                  </span>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label>Symbol</label>
                </div>
                <div className="col-md-9">
                  <input
                    name="symbol"
                    type="text"
                    value={symbol}
                    onChange={this.handleChange}
                    error={errors.symbol}
                    className={classnames("form-control", {
                      invalid: errors.symbol,
                    })}
                  />
                  <span className="text-danger">
                    {errors.symbol}
                  </span>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label>Deposit Status</label>
                </div>
                <div className="col-md-9">

                  <Form.Control
                    name="depositStatus"
                    value={depositStatus}
                    onChange={this.handleChange}
                    as="select" custom
                  >
                    <option value={'Off'}>Off</option>
                    <option value={'On'}>On</option>
                  </Form.Control>

                  <span className="text-danger">{errors.depositStatus}</span>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label>Withdraw Status</label>
                </div>
                <div className="col-md-9">

                  <Form.Control
                    name="withdrawStatus"
                    value={withdrawStatus}
                    onChange={this.handleChange}
                    as="select" custom
                  >
                    <option value={'Off'}>Off</option>
                    <option value={'On'}>On</option>
                  </Form.Control>

                  <span className="text-danger">{errors.withdrawStatus}</span>
                </div>
              </div>


              {
                type == 'token' && <div className="row mt-2">
                  <div className="col-md-3">
                    <label>Contract Address</label>
                  </div>
                  <div className="col-md-9">
                    <input
                      name="contractAddress"
                      type="text"
                      onChange={this.handleChange}
                      value={contractAddress}
                      error={errors.contractAddress}
                      className={classnames("form-control", {
                        invalid: errors.contractAddress,
                      })}
                    />
                    <span className="text-danger">
                      {errors.contractAddress}
                    </span>
                  </div>
                </div>
              }

              {
                type == 'token' && <div className="row mt-2">
                  <div className="col-md-3">
                    <label>Min ABI</label>
                  </div>
                  <div className="col-md-9">
                    <textarea
                      name="minABI"
                      type="text"
                      value={minABI}
                      onChange={this.handleChange}
                      error={errors.minABI}
                      className={classnames("form-control", {
                        invalid: errors.minABI,
                      })}
                    />
                    <span className="text-danger">{errors.minABI}</span>
                  </div>
                </div>
              }

              {
                type == 'token' && <div className="row mt-2">
                  <div className="col-md-3">
                    <label>Decimals</label>
                  </div>
                  <div className="col-md-9">
                    <input
                      name="decimals"
                      type="number"
                      value={decimals}
                      onChange={this.handleChange}
                      error={errors.decimals}
                      className={classnames("form-control", {
                        invalid: errors.decimals,
                      })}
                    />
                    <span className="text-danger">
                      {errors.decimals}
                    </span>
                  </div>
                </div>
              }

              {
                type == 'token' && <div className="row mt-2">
                  <div className="col-md-3">
                    <label>Token Type</label>
                  </div>
                  <div className="col-md-9">
                    <Form.Control
                      name="tokenType"
                      value={tokenType}
                      onChange={this.handleChange}
                      as="select" custom
                    >
                      <option value={' '}>Select Type</option>
                      <option value={'erc20'}>ERC20</option>
                      <option value={'bep20'}>BEP20</option>
                      <option value={'trc20'}>TRC20</option>
                    </Form.Control>
                    <span className="text-danger">
                      {errors.tokenType}
                    </span>
                  </div>
                </div>
              }
              {
                type == 'fiat' && <div className="row mt-2">
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
              }
              {
                ( type == 'fiat' && (!isEmpty(payment)) && payment.includes('upi')) ? <div className="row">
                  <div className="col-md-3">
                    <label>UPI</label>
                  </div>
                  <div className="col-md-9">
                    <input 
                    type='text' 
                    className="form-control" 
                    name="upiInputValue"
                   value={upiInputValue}
                    onChange={this.handleChange}
                    />
                     <span  className="text-danger">{errors.upiInputValue}</span>
                  </div>
                 

                </div>
                  : ''

              }

              {
                type == 'fiat' && (!isEmpty(payment)) && payment.includes('bank') && <div className="row mt-2">
                  <div className="col-md-3">
                    <label>Bank Name</label>
                  </div>
                  <div className="col-md-9">
                    <input
                      name="bankName"
                      type="text"
                      value={bankName}
                      onChange={this.handleChange}
                      error={errors.bankName}
                      className={classnames("form-control", {
                        invalid: errors.bankName,
                      })}
                    />
                    <span className="text-danger">
                      {errors.bankName}
                    </span>
                  </div>
                </div>
              }

              {
                type == 'fiat' && (!isEmpty(payment))&& payment.includes('bank') && <div className="row mt-2">
                  <div className="col-md-3">
                    <label>Account No.</label>
                  </div>
                  <div className="col-md-9">
                    <input
                      name="accountNo"
                      type="text"
                      value={accountNo}
                      onChange={this.handleChange}
                      error={errors.accountNo}
                      className={classnames("form-control", {
                        invalid: errors.accountNo,
                      })}
                    />
                    <span className="text-danger">
                      {errors.accountNo}
                    </span>
                  </div>
                </div>
              }

              {
                type == 'fiat' && (!isEmpty(payment))&& payment.includes('bank') && <div className="row mt-2">
                  <div className="col-md-3">
                    <label>Holder Name</label>
                  </div>
                  <div className="col-md-9">
                    <input
                      name="holderName"
                      type="text"
                      value={holderName}
                      onChange={this.handleChange}
                      error={errors.holderName}
                      className={classnames("form-control", {
                        invalid: errors.holderName,
                      })}
                    />
                    <span className="text-danger">
                      {errors.holderName}
                    </span>
                  </div>
                </div>
              }

              {
                type == 'fiat' && (!isEmpty(payment))&& payment.includes('bank') && <div className="row mt-2">
                  <div className="col-md-3">
                    <label>IBAN Code</label>
                  </div>
                  <div className="col-md-9">
                    <input
                      name="bankcode"
                      type="text"
                      value={bankcode}
                      onChange={this.handleChange}
                      error={errors.bankcode}
                      className={classnames("form-control", {
                        invalid: errors.bankcode,
                      })}
                    />
                    <span className="text-danger">
                      {errors.bankcode}
                    </span>
                  </div>
                </div>
              }

              {
                type == 'fiat' && (!isEmpty(payment))&& payment.includes('bank') && <div className="row mt-2">
                  <div className="col-md-3">
                    <label>Country</label>
                  </div>
                  <div className="col-md-9">
                    <input
                      name="country"
                      type="text"
                      value={country}
                      onChange={this.handleChange}
                      error={errors.country}
                      className={classnames("form-control", {
                        invalid: errors.country,
                      })}
                    />
                    <span className="text-danger">
                      {errors.country}
                    </span>
                  </div>
                </div>
              }


              <div className="row mt-2">
                <div className="col-md-3">
                  <label htmlFor="fee">Withdrawal Fee(%)</label>
                </div>
                <div className="col-md-9">
                  <input
                    name="withdrawFee"
                    type="text"
                    value={withdrawFee}
                    onChange={this.handleChange}
                    error={errors.withdrawFee}
                    className={classnames("form-control", {
                      invalid: errors.withdrawFee,
                    })}
                  />
                  <span className="text-danger">{errors.withdrawFee}</span>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label htmlFor="minimum">Minimum Withdrawal</label>
                </div>
                <div className="col-md-9">
                  <input
                    name="minimumWithdraw"
                    type="text"
                    value={minimumWithdraw}
                    onChange={this.handleChange}
                    error={errors.minimumWithdraw}
                    className={classnames("form-control", {
                      invalid: errors.minimumWithdraw,
                    })}
                  />
                  <span className="text-danger">{errors.minimumWithdraw}</span>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label>Deposit Type</label>
                </div>
                <div className="col-md-9">
                  <Form.Control
                    name="depositType"
                    value={depositType}
                    onChange={this.handleChange}
                    as="select" custom
                  >
                    <option value={'local'}>Local</option>
                    {/* <option value={'binance'}>Binance</option> */}
                    <option value={'coin_payment'}>Coin Payment</option>

                  </Form.Control>
                  <span className="text-danger">
                    {errors.depositType}
                  </span>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label htmlFor="minimum">Currency icon</label>
                </div>
                <div className="col-md-9">

                <label class="custom-file-upload">
                <input
                    name="image"
                    type="file"
                    onChange={this.handleFile}
                    accept="image/x-png,image/gif,image/jpeg, image/png"
                    aria-describedby="fileHelp"
                  />
                Choose File
            </label>

                 
                
                  <img
                    className="img-fluid proofThumb"
                    src={fileObjectUrl(image)}
                  />
                  <div>
                  <span className="text-danger">{errors.image}</span>
                  </div>
                </div>
              </div>

            </form>

          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
              onClick={this.handleClose}
            >
              Close
            </button>
            <button
              onClick={this.handleSubmit}
              className="btn btn-primary"
            >
              {loader && <i class="fas fa-spinner fa-spin mr-2"></i>}Add currency
            </button>
          </Modal.Footer>
        </Modal>
      </div >
    );
  }
}

export default CurrencyAddModal
