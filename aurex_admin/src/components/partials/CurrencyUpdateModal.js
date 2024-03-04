import React from "react";
import classnames from "classnames";
import { Modal, Form } from "react-bootstrap";

// import action
import { updateCurrency } from "../../actions/currency";

// import lib
import { toastAlert } from "../../lib/toastAlert";
import fileObjectUrl from "../../lib/fileObjectUrl";
import isEmpty from "../../lib/isEmpty";

const initialFormValue = {
  currencyId: "",
  name: "",
  preference:"",
  coin: "",
  symbol: "",
  type: "crypto",
  withdrawFee: 0,
  minimumWithdraw: 0,
  fundLimit: 0,
  fundFee: 0,
  fundInterval: 0,
  decimal: 0,
  depositType: "coin_payment",
  image: "",
  bankName: "",
  accountNo: "",
  holderName: "",
  bankcode: "",
  country: "",
  tokenType: "",
  depositStatus: "Off",
  withdrawStatus: "Off",
  minABI: "",
  contractAddress: "",
  // contractDecimal: "",
  status: "active",
  depositminlimit: 0,
  isPrimary: false,
};

class CurrencyUpdateModal extends React.Component {
  constructor() {
    super();
    this.state = {
      loader: false,
      formValue: initialFormValue,
      errors: {},
      count:''
    };
  }

  componentWillReceiveProps(nextProps) {
    const { record, imageUrl } = nextProps;
    if (record) {
      console.log("recordrecord",record);
      let formData = {
        currencyId: record._id,
        preference:record.preference,
        name: record.name,
        coin: record.coin,
        symbol: record.symbol,
        image: isEmpty(record.image) ? "" : imageUrl + record.image,
        type: record.type,
        withdrawFee: record.withdrawFee,
        minimumWithdraw: record.minimumWithdraw,
        fundLimit: record.fundLimit,
        fundFee: record.fundFee,
        fundInterval: record.fundInterval,
        status: record.status,
        depositType: record.depositType,
        depositminlimit: record.depositminlimit,
        isPrimary: false,
        decimal: record.decimal,
        depositStatus: record.depositStatus,
        withdrawStatus: record.withdrawStatus,
      };
      if (record.type == "fiat") {
        formData["bankName"] = record.bankDetails.bankName;
        formData["accountNo"] = record.bankDetails.accountNo;
        formData["holderName"] = record.bankDetails.holderName;
        formData["bankcode"] = record.bankDetails.bankcode;
        formData["country"] = record.bankDetails.country;
      } else if (record.type == "token") {
        formData["minABI"] = record.minABI;
        formData["contractAddress"] = record.contractAddress;
        // formData["contractDecimal"] = record.contractDecimal;
        formData["tokenType"] = record.tokenType;
      }
      this.setState({ formValue: formData,count:nextProps.count });
    }
  }

  handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    
    console.log("value",value,'valuevaluevalue',this.state.count,this.state.formValue?.preference);
    if (name == 'preference') {
      if (this.state.count < value && value != '') {
        return false
      }
    }

    let formData = { ...this.state.formValue, ...{ [name]: value } };
    this.setState({ formValue: formData });
  };

  handleClose = () => {
    const { onHide } = this.props;
    onHide();
    this.setState({ formValue: initialFormValue, errors: {} });
  };

  handleFile = (e) => {
    e.preventDefault();
    const { name, files } = e.target;
    let formData = { ...this.state.formValue, ...{ [name]: files[0] } };
    this.setState({ formValue: formData });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { formValue } = this.state;
    const { fetchData } = this.props;

    if (formValue && formValue.image) {
      if (formValue.image.size > 20000) {
        this.setState({
          errors: { image: "Image size should be less than  20 Kb" },
        });
        toastAlert(
          "error",
          "Image size should be less than  20 Kb",
          "currencyUpdateModal"
        );
        return false;
      }
    }

    try {
      const formData = new FormData();
      formData.append("currencyId", formValue.currencyId);
      formData.append("type", formValue.type);
      formData.append("name", formValue.name);
      formData.append("preference", formValue.preference);
      formData.append("coin", formValue.coin);
      formData.append("symbol", formValue.symbol);
      formData.append("contractAddress", formValue.contractAddress);
      formData.append("minABI", formValue.minABI);
      // formData.append("contractDecimal", formValue.contractDecimal);
      formData.append("decimal", formValue.decimal);
      formData.append("tokenType", formValue.tokenType);
      formData.append("withdrawFee", formValue.withdrawFee);
      formData.append("minimumWithdraw", formValue.minimumWithdraw);
      formData.append("fundLimit", formValue.fundLimit);
      formData.append("fundFee", formValue.fundFee);
      formData.append("fundInterval", formValue.fundInterval);
      formData.append("bankName", formValue.bankName);
      formData.append("accountNo", formValue.accountNo);
      formData.append("holderName", formValue.holderName);
      formData.append("bankcode", formValue.bankcode);
      formData.append("country", formValue.country);
      formData.append("image", formValue.image);
      formData.append("depositType", formValue.depositType);
      formData.append("depositminlimit", formValue.depositminlimit);
      formData.append("status", formValue.status);
      formData.append("depositStatus", formValue.depositStatus);
      formData.append("withdrawStatus", formValue.withdrawStatus);

      this.setState({ loader: true });

      const { status, loading, message, error } = await updateCurrency(
        formData
      );
      this.setState({ loader: loading });
      if (status == "success") {
        this.handleClose();
        fetchData();
        toastAlert("success", message, "currencyUpdateModal");
      } else if (status == "failed") {
        if (error) {
          this.setState({ errors: error });
        } else {
          toastAlert("error", message, "currencyUpdateModal");
        }
      }
    } catch (err) {}
  };

  render() {
    const {
      type,
      name,
      coin,
      symbol,
      decimal,
      tokenType,
      contractAddress,
      // contractDecimal,
      minABI,
      withdrawFee,
      minimumWithdraw,
      fundLimit,
      fundFee,
      fundInterval,
      bankName,
      accountNo,
      holderName,
      bankcode,
      country,
      image,
      depositType,
      depositminlimit,
      status,
      depositStatus,
      withdrawStatus,
      preference
    } = this.state.formValue;
    console.log(
      "🚀 ~ file: CurrencyUpdateModal.js ~ line 199 ~ CurrencyUpdateModal ~ render ~ type",
      type
    );
    const { errors, loader } = this.state;

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
            <h4 className="modal-title">Update Currency</h4>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="row mt-2">
                <div className="col-md-3">
                  <label>Currency Type</label>
                </div>
                <div className="col-md-9">
                  <Form.Control
                    name="type"
                    value={type}
                    onChange={this.handleChange}
                    as="select"
                    custom
                  >
                    <option value={"crypto"}>Crypto</option>
                    <option value={"token"}>Token</option>
                    <option value={"fiat"}>Fiat</option>
                  </Form.Control>

                  <span className="text-danger">{errors.type}</span>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label>Preference</label>
                </div>
                <div className="col-md-9">
                  <input
                    name="preference"
                    type="text"
                    value={preference}
                    id="preference"
                    onChange={this.handleChange}
                    error={errors.preference}
                    className={classnames("form-control", {
                      invalid: errors.preference,
                    })}
                  />
                  <span className="text-danger">{errors.preference}</span>
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
                  <span className="text-danger">{errors.coin}</span>
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
                  <span className="text-danger">{errors.symbol}</span>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label>Decimal</label>
                </div>
                <div className="col-md-9">
                  <input
                    name="decimal"
                    type="number"
                    value={decimal}
                    onChange={this.handleChange}
                    error={errors.decimal}
                    className={classnames("form-control", {
                      invalid: errors.decimal,
                    })}
                  />
                  <span className="text-danger">{errors.decimal}</span>
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
                    as="select"
                    custom
                  >
                    <option value={"Off"}>Off</option>
                    <option value={"On"}>On</option>
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
                    as="select"
                    custom
                  >
                    <option value={"Off"}>Off</option>
                    <option value={"On"}>On</option>
                  </Form.Control>

                  <span className="text-danger">{errors.withdrawStatus}</span>
                </div>
              </div>

              {type == "token" && (
                <div className="row mt-2">
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
                      disabled
                    />
                    <span className="text-danger">
                      {errors.contractAddress}
                    </span>
                  </div>
                </div>
              )}

              {type == "token" && (
                <div className="row mt-2">
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
              )}

              {/* {type == "token" && (
                <div className="row mt-2">
                  <div className="col-md-3">
                    <label>Contract Decimal</label>
                  </div>
                  <div className="col-md-9">
                    <input
                      name="contractDecimal"
                      type="number"
                      value={contractDecimal}
                      onChange={this.handleChange}
                      error={errors.contractDecimal}
                      className={classnames("form-control", {
                        invalid: errors.contractDecimal,
                      })}
                    />
                    <span className="text-danger">
                      {errors.contractDecimal}
                    </span>
                  </div>
                </div>
              )} */}

              {type == "token" && (
                <div className="row mt-2">
                  <div className="col-md-3">
                    <label>Token Type</label>
                  </div>
                  <div className="col-md-9">
                    <Form.Control
                      name="tokenType"
                      value={tokenType}
                      onChange={this.handleChange}
                      as="select"
                      custom
                    >
                      <option value={" "}>Select Type</option>
                      <option value={"erc20"}>ERC20</option>
                      <option value={"bep20"}>BEP20</option>
                      {/* <option value={"trc20"}>TRC20</option> */}
                    </Form.Control>
                    <span className="text-danger">{errors.tokenType}</span>
                  </div>
                </div>
              )}

              {type == "fiat" && (
                <div className="row mt-2">
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
                    <span className="text-danger">{errors.bankName}</span>
                  </div>
                </div>
              )}

              {type == "fiat" && (
                <div className="row mt-2">
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
                    <span className="text-danger">{errors.accountNo}</span>
                  </div>
                </div>
              )}

              {type == "fiat" && (
                <div className="row mt-2">
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
                    <span className="text-danger">{errors.holderName}</span>
                  </div>
                </div>
              )}

              {type == "fiat" && (
                <div className="row mt-2">
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
                    <span className="text-danger">{errors.bankcode}</span>
                  </div>
                </div>
              )}

              {type == "fiat" && (
                <div className="row mt-2">
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
                    <span className="text-danger">{errors.country}</span>
                  </div>
                </div>
              )}

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

              {/*<div className="row mt-2">
                <div className="col-md-3">
                  <label htmlFor="minimum">Fund Limit</label>
                </div>
                <div className="col-md-9">
                  <input
                    name="fundLimit"
                    type="text"
                    value={fundLimit}
                    onChange={this.handleChange}
                    error={errors.fundLimit}
                    className={classnames("form-control", {
                      invalid: errors.fundLimit,
                    })}
                  />
                  <span className="text-danger">{errors.fundLimit}</span>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label htmlFor="minimum">Fund Interval(Hrs)</label>
                </div>
                <div className="col-md-9">
                  <input
                    name="fundInterval"
                    type="text"
                    value={fundInterval}
                    onChange={this.handleChange}
                    error={errors.fundInterval}
                    className={classnames("form-control", {
                      invalid: errors.fundInterval,
                    })}
                  />
                  <span className="text-danger">{errors.fundInterval}</span>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label htmlFor="minimum">Fund Fee(%)</label>
                </div>
                <div className="col-md-9">
                  <input
                    name="fundFee"
                    type="text"
                    value={fundFee}
                    onChange={this.handleChange}
                    error={errors.fundFee}
                    className={classnames("form-control", {
                      invalid: errors.fundFee,
                    })}
                  />
                  <span className="text-danger">{errors.fundFee}</span>
                </div>
              </div>*/}

              <div className="row mt-2">
                <div className="col-md-3">
                  <label>Deposit Type</label>
                </div>
                <div className="col-md-9">
                  <Form.Control
                    name="depositType"
                    value={depositType}
                    onChange={this.handleChange}
                    as="select"
                    custom
                  >
                    <option value={"local"}>Local</option>
                    {
                      type != "token" &&
                      <>
                        {/* <option value={"binance"}>Binance</option> */}
                        <option value={"coin_payment"}>Coinpayment</option>
                      </>
                    }
                  </Form.Control>
                  <span className="text-danger">{errors.depositType}</span>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label>Minimum Deposit</label>
                </div>
                <div className="col-md-9">
                  <input
                    name="depositminlimit"
                    type="number"
                    value={depositminlimit}
                    onChange={this.handleChange}
                    error={errors.depositminlimit}
                    className={classnames("form-control", {
                      invalid: errors.depositminlimit,
                    })}
                  />
                  <span className="text-danger">{errors.depositminlimit}</span>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label>Status</label>
                </div>
                <div className="col-md-9">
                  <Form.Control
                    name="status"
                    value={status}
                    onChange={this.handleChange}
                    as="select"
                    custom
                  >
                    <option value={"active"}>Active</option>
                    <option value={"Inactive"}>Inactive</option>
                  </Form.Control>

                  <span className="text-danger">{errors.type}</span>
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
                    accept="image/x-png,image/gif,image/jpeg"
                    aria-describedby="fileHelp"
                  />
                  Choose File
                  </label>
                  <span className="text-danger">{errors.image}</span>
                  <img
                    className="img-fluid proofThumb"
                    src={fileObjectUrl(image)}
                  />
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
            <button onClick={this.handleSubmit} className="btn btn-primary">
              {loader && <i class="fas fa-spinner fa-spin"></i>}Update currency
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default CurrencyUpdateModal;
