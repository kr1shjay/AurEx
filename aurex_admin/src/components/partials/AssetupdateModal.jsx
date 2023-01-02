import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateasset } from "../../actions/assetactions";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import $ from "jquery";
import { Editor } from "@tinymce/tinymce-react";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import axios from "axios";
import keys from "../../actions/config";
const url = keys.baseUrl;
class AssetUpdateModal extends React.Component {
  constructor(props) {
    super(props);
    $("#update-perpetual-modal")
      .find(".text-danger")
      .hide();
    // console.log(this.props,'props records');
    console.log(this.props.record,'fsdfnskdfsdjkf');
    // console.log(this.props.record.ticker_root,'fsdfnskdfsdjkf');
    this.state = {
      id: this.props.record._id,
      pair: this.props.record.pair,
      single_min_limit: this.props.record.Single_min_limit,
      single_max_limit: this.props.record.single_max_limit,
      full_min_limit: this.props.record.full_min_limit,
      full_max_limit: this.props.record.full_max_limit,
      trade_fee: this.props.record.trade_fee,

      first_currency: {
        label: this.props.record.first_currency,
        value: this.props.record.first_currency
      },
      second_currency: {
        label: this.props.record.second_currency,
        value: this.props.record.second_currency
      },
      statusoption: [
        {
          label: "Activated",
          value: "Activated"
        },
        {
          label: "DeActivated",
          value: "DeActivated"
        }
      ],
      status: {
        label: "DeActivated",
        value: "DeActivated"
      },
      errors: {}
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChange1 = this.handleChange1.bind(this);
    this.statusChange = this.statusChange.bind(this);
  }

  styles = {
		option: (provided, state) => ({
		  ...provided,
		  color: "white",
		  backgroundColor: "#242827",
		}),
		valueContainer: (provided, state) => ({
		  ...provided,
		  height: '52px',
		  padding: '0 6px',
		  backgroundColor: "#1a1b1c",
		  borderColor: '#59615f',
		borderRadius: 8,
		borderStyle: 'solid',
		borderWidth: '1px'
		 
		}),
		control: (provided, state) => ({
		  ...provided,
		  height: '52px',
		  borderRadius:8,
		  backgroundColor: "#1a1b1c",
		  border:'none'
		 
		}),
		indicatorsContainer: (provided, state) => ({
		  ...provided,
		  height: '52px',
		  position: 'absolute',
		  right: 0,
		  top: 0,
		  color:'#fff' 
		}),    
		singleValue: (provided, state) => ({
		  ...provided,
		  color: "#fff"
		})
	  };
  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.record) {
      this.setState({
        id: nextProps.record._id,
        email_assigned: false,
        pair: nextProps.record.pair,
        single_min_limit: nextProps.record.single_min_limit,
        single_max_limit: nextProps.record.single_max_limit,
        full_min_limit: nextProps.record.full_min_limit,
        full_max_limit: nextProps.record.full_max_limit,
        trade_fee: nextProps.record.trade_fee,

        first_currency: {
          label: nextProps.record.first_currency,
          value: nextProps.record.first_currency
        },
        second_currency: {
          label: nextProps.record.second_currency,
          value: nextProps.record.second_currency
        },
        selectedOption: nextProps.record.first_currency,
        selectedOption1: nextProps.record.second_currency
      });
    }
    if (nextProps.errors) {
      $("#update-perpetual-modal")
        .find(".text-danger")
        .show();
      this.setState({
        errors: nextProps.errors
      });
    }
    console.log(nextProps);
    if (
      nextProps.auth !== undefined &&
      nextProps.auth.updateperpetual !== undefined &&
      nextProps.auth.updateperpetual.data !== undefined &&
      nextProps.auth.updateperpetual.data.message !== undefined &&
      nextProps.auth.updateperpetual.data.success
    ) {
      $("#update-perpetual-modal").modal("hide");
      toast(nextProps.auth.updateperpetual.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
      nextProps.auth.updateperpetual = "";
    }
  }
  getData() {
    axios
      .get(url + "api/asset-data-first")
      .then(res => {
        console.log(res.data, "datassss");
        var currencyarray = [];
        res.data.map((item, i) => {
          const name = item.currencySymbol;
          const value = item.currencySymbol;
          const obj = { value: name, label: value };
          currencyarray.push(obj);
        });
        console.log(currencyarray, "currencyarray");
        this.setState({ first_currency1: currencyarray, email_assigned: true });
      })
      .catch();
    //console.log(this.props,'authget1');
  }
  onChange = e => {
    $("#update-perpetual-modal")
      .find(".text-danger")
      .show();
    this.setState({ [e.target.id]: e.target.value });
  };
  handleChange = selectedOption => {
    this.setState({ first_currency: selectedOption });
    //console.log(`Option selected:`, selectedOption );
  };
  handleChange1 = selectedOption => {
    this.setState({ second_currency: selectedOption });
    // console.log(`Option selected:`, selectedOption );
  };
  statusChange = selectedOption => {
    this.setState({ status: selectedOption });
    // console.log(`Option selected:`, selectedOption );
  };

  onAssetUpdate = e => {
    e.preventDefault();
    $("#update-perpetual-modal")
      .find(".text-danger")
      .show();
    const newcontract = {
      _id: this.state.id,
      first_currency: this.state.first_currency.value,
      pair: this.state.first_currency.value + this.state.second_currency.value,
      single_min_limit: this.state.single_min_limit,
      single_max_limit: this.state.single_max_limit,
      full_min_limit: this.state.full_min_limit,
      full_max_limit: this.state.full_max_limit,
      trade_fee: this.state.trade_fee,
      statusoption: this.state.status.statusoption,
      second_currency        : this.state.second_currency.value,
      first_currency         : this.state.first_currency.value,
    };

    this.props.updateasset(newcontract);
  };

  render() {
    const { errors, selectedOption, selectedOption1 } = this.state;
    /* const { selectedOption } = this.state.first_currency;
         const { selectedOption1 } = this.state.second_currency;*/
    const options1 = [
      { value: "USD", label: "USD" },
      { value: "INR", label: "INR" }
    ];

    return (
      <div>
        <div className="modal fade" id="update-perpetual-modal">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  Updatesss {this.state.pair} Asset
                </h4>
                <button type="button" className="close" data-dismiss="modal">
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <form
                  noValidate
                  onSubmit={this.onAssetUpdate}
                  id="update-perpetual"
                >
                  <input
                    onChange={this.onChange}
                    value={this.state.id}
                    id="perpetual-update-id"
                    type="text"
                    className="d-none"
                  />
                  <input
                    onChange={this.onChange}
                    value={this.state.hidden}
                    id="hiiden"
                    type="text"
                    className="d-none"
                  />
                  <div className="row mt-2">
                    <div className="col-md-3">
                      <label htmlFor="pair">Pair name</label>
                    </div>
                    <div className="col-md-9">
                      <input
                        onChange={this.onChange}
                        value={this.state.pair}
                        id="pair"
                        type="text"
                        error={errors.tickerroot}
                        className={classnames("form-control", {
                          invalid: errors.tickerroot
                        })}
                        readOnly
                      />
                      <span className="text-danger">{errors.pair}</span>
                    </div>
                  </div>

                  <div className="row mt-2">
                    <div className="col-md-3">
                      <label htmlFor="first_currency">First currency</label>
                    </div>
                    <div className="col-md-9">
                      {this.state.first_currency ? (
                        <Select
                          value={this.state.first_currency}
                          defaultValue={{
                            label: this.state.first_currency.label,
                            value: this.state.first_currency.label
                          }}
                          onChange={this.handleChange}
                          options={this.state.first_currency1}
                          styles={this.styles} className="border_blue_select basic-multi-select"
                        />
                      ) : (
                        ""
                      )}
                      <span className="text-danger">
                        {errors.first_currency}
                      </span>
                    </div>
                  </div>

                  <div className="row mt-2">
                    <div className="col-md-3">
                      <label htmlFor="second_currency">Second currency</label>
                    </div>
                    <div className="col-md-9">
                      {this.state.second_currency ? (
                        <Select
                          value={this.state.second_currency}
                          defaultValue={{
                            label: this.state.second_currency.label,
                            value: this.state.second_currency.label
                          }}
                          onChange={this.handleChange1}
                          options={options1}
                        />
                      ) : (
                        ""
                      )}
                      <span className="text-danger">
                        {errors.second_currency}
                      </span>
                    </div>
                  </div>

                  <div className="row mt-2">
                    <div className="col-md-3">
                      <label htmlFor="single_min_limit">
                        Single Minimum limit
                      </label>
                    </div>
                    <div className="col-md-9">
                      <input
                        onChange={this.onChange}
                        value={this.state.single_min_limit}
                        error={errors.single_min_limit}
                        id="single_min_limit"
                        type="text"
                        className={classnames("form-control", {
                          invalid: errors.single_min_limit
                        })}
                      />
                      <span className="text-danger">
                        {errors.single_min_limit}
                      </span>
                    </div>
                  </div>

                  <div className="row mt-2">
                    <div className="col-md-3">
                      <label htmlFor="single_max_limit">
                        Single Maximum Limit
                      </label>
                    </div>
                    <div className="col-md-9">
                      <input
                        onChange={this.onChange}
                        value={this.state.single_max_limit}
                        error={errors.single_max_limit}
                        id="single_max_limit"
                        type="text"
                        className={classnames("form-control", {
                          invalid: errors.single_max_limit
                        })}
                      />
                      <span className="text-danger">
                        {errors.single_max_limit}
                      </span>
                    </div>
                  </div>

                  <div className="row mt-2">
                    <div className="col-md-3">
                      <label htmlFor="full_min_limit">
                        24 Hrs Minimum Limit
                      </label>
                    </div>
                    <div className="col-md-9">
                      <input
                        onChange={this.onChange}
                        value={this.state.full_min_limit}
                        error={errors.full_min_limit}
                        id="full_min_limit"
                        type="text"
                        className={classnames("form-control", {
                          invalid: errors.full_min_limit
                        })}
                      />
                      <span className="text-danger">
                        {errors.full_min_limit}
                      </span>
                    </div>
                  </div>

                  <div className="row mt-2">
                    <div className="col-md-3">
                      <label htmlFor="full_max_limit">
                        24 Hrs Maximum Limit
                      </label>
                    </div>
                    <div className="col-md-9">
                      <input
                        onChange={this.onChange}
                        value={this.state.full_max_limit}
                        error={errors.full_max_limit}
                        id="full_max_limit"
                        type="text"
                        className={classnames("form-control", {
                          invalid: errors.full_max_limit
                        })}
                      />
                      <span className="text-danger">
                        {errors.full_max_limit}
                      </span>
                    </div>
                  </div>

                  <div className="row mt-2">
                    <div className="col-md-3">
                      <label htmlFor="trade_fee">Trading fees</label>
                    </div>
                    <div className="col-md-9">
                      <input
                        onChange={this.onChange}
                        value={this.state.trade_fee}
                        error={errors.trade_fee}
                        id="trade_fee"
                        type="text"
                        className={classnames("form-control", {
                          invalid: errors.trade_fee
                        })}
                      />
                      <span className="text-danger">{errors.trade_fee}</span>
                    </div>
                  </div>

                  <div className="row mt-2">
                    <div className="col-md-3">
                      <label htmlFor="status">statusoption</label>
                    </div>
                    <div className="col-md-9">
                      {this.state.statusoption ? (
                        <Select
                          value={this.state.status}
                          defaultValue={{
                            label: this.state.statusoption.label,
                            value: this.state.statusoption.label
                          }}
                          onChange={this.statusChange}
                          options={this.state.statusoption}
                        />
                      ) : (
                        ""
                      )}
                      <span className="text-danger">{errors.statusoption}</span>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button
                  form="update-perpetual"
                  type="submit"
                  className="btn btn-primary"
                >
                  Update Asset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AssetUpdateModal.propTypes = {
  updateasset: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { updateasset })(
  withRouter(AssetUpdateModal)
);
