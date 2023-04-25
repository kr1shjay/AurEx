import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addasset } from "../../actions/assetactions";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import $ from "jquery";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import keys from "../../actions/config";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
const url = keys.baseUrl;
class AssetAddModal extends React.Component {
  constructor() {
    super();
    this.state = {
      email_assigned: false,
      first_currency: "",
      pair: "",
      single_min_limit: "",
      single_max_limit: "",
      full_min_limit: "",
      full_max_limit: "",
      trade_fee: "",
      second_currency: "",
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
    // console.log(this.state,'statessssssssss');
    this.handleChange1 = this.handleChange1.bind(this);
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
    if (nextProps.errors) {
      $("#add-perpetual-modal")
        .find(".text-danger")
        .show();
      this.setState({
        errors: nextProps.errors
      });
    }
    // console.log(nextProps);
    if (
      nextProps.auth !== undefined &&
      nextProps.auth.perpetual !== undefined &&
      nextProps.auth.perpetual.data !== undefined &&
      nextProps.auth.perpetual.data.message !== undefined
    ) {
      $("#add-perpetual-modal").modal("hide");
      toast(nextProps.auth.perpetual.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
      nextProps.auth.perpetual = undefined;
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
        // console.log(currencyarray,'currencyarray');
        this.setState({ first_currency1: currencyarray, email_assigned: true });
      })
      .catch();
    //  console.log(this.props,'authget1');
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
  handleChange = selectedOption => {
    this.setState({ first_currency: selectedOption.value });
    //  console.log(`Option selected:`, selectedOption );
  };
  handleChange1 = selectedOption => {
    this.setState({ second_currency: selectedOption.value });
    //console.log(`Option selected:`, selectedOption );
  };
  statusChange = selectedOption => {
    this.setState({ status: selectedOption });
    // console.log(`Option selected:`, selectedOption );
  };

  onAssetAdd = e => {
    e.preventDefault();
    const newcontract = {
      pair: this.state.first_currency + this.state.second_currency,
      second_currency: this.state.second_currency,
      first_currency: this.state.first_currency,
      single_min_limit: this.state.single_min_limit,
      single_max_limit: this.state.single_max_limit,
      full_min_limit: this.state.full_min_limit,
      full_max_limit: this.state.full_max_limit,
      trade_fee: this.state.trade_fee,
      statusoption: this.state.status.statusoption
    };
    // console.log(newcontract);
    this.props.addasset(newcontract);
  };

  render() {
    const { errors } = this.state;
    const { selectedOption } = this.state.first_currency;
    const { selectedOption1 } = this.state.second_currency;
    const options1 = [
      { value: "USD", label: "USD" },
      { value: "INR", label: "INR" }
    ];

    return (
      <div>
        <div className="modal fade" id="add-perpetual-modal" data-reset="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Asset Exchange</h4>
                <button type="button" className="close" data-dismiss="modal">
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <form noValidate onSubmit={this.onAssetAdd} id="add-perpetual">
                  <div className="row mt-2">
                    <div className="col-md-9">
                      <input
                        onChange={this.onChange}
                        value={this.state.tickerroot}
                        id="tickerroot"
                        type="text"
                        error={errors.tickerroot}
                        className="d-none"
                      />
                    </div>
                  </div>

                  <div className="row mt-2">
                    <div className="col-md-3">
                      <label htmlFor="first_currency">First currency</label>
                    </div>
                    <div className="col-md-9">
                      <Select
                        value={selectedOption}
                        onChange={this.handleChange}
                        options={this.state.first_currency1}
                        styles={this.styles} className="border_blue_select basic-multi-select"
                      />
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
                      <Select
                        value={selectedOption1}
                        onChange={this.handleChange1}
                        options={this.state.first_currency1}
                      />
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
                  form="add-perpetual"
                  type="submit"
                  className="btn btn-primary"
                >
                  Add Contract
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AssetAddModal.propTypes = {
  addasset: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { addasset })(
  withRouter(AssetAddModal)
);
