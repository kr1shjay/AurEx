import React from "react";
import classnames from "classnames";
import { Modal, Form } from "react-bootstrap";
import Select from "react-select";

// import action
import { editStaking } from "../../actions/staking";

// import lib
import { toastAlert } from "../../lib/toastAlert";
import isEmpty from "../../lib/isEmpty";

const initialFormValue = {
  stakingId: "",
  currencyId: "",
  minimumAmount: "",
  maximumAmount: "",
  redemptionPeriod: "",
  type: [],
  flexibleAPY: "",
  periodList: [{ days: "", APY: "" }],
  status: "active",
};

class StakingUpdateModal extends React.Component {
  constructor() {
    super();
    this.state = {
      formValue: initialFormValue,
      errors: {},
      alert: false,
      loader: false,
      typeOption: [
        {
          label: "Fixed",
          value: "fixed",
        },
        {
          label: "Flexible",
          value: "flexible",
        },
      ],
    };

    this.handleSelect = this.handleSelect.bind(this);
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

  componentWillReceiveProps(nextProps) {
    const { record } = nextProps;
    if (!isEmpty(record)) {
      this.setState({ formValue: record });
    }
  }

  handleChange = (e) => {
    e.preventDefault();
    let { name, value } = e.target;
    let formData = { ...this.state.formValue, ...{ [name]: value } };
    this.setState({ formValue: formData });
  };

  handleSelect(selectedOption) {
    let formData = this.state.formValue;
    if (selectedOption && selectedOption.length > 0) {
      formData = {
        ...formData,
        ...{
          type: selectedOption.map((el) => {
            return el.value;
          }),
        },
      };
    } else {
      formData = {
        ...formData,
        ...{
          type:
            selectedOption &&
            selectedOption.map((el) => {
              return el.value;
            }),
        },
      };
    }
    this.setState({ formValue: formData });

  }

  // handle input change
  handleInputChange = (e, index) => {
    //alert(index);
    const { periodList } = this.state.formValue;
    const { name, value } = e.target;
    const list = [...periodList];
    // console.log(list, "listlistlistlist");
    if (list[index] && Object.keys(list[index]).includes(name)) {
      list[index][name] = value;
    } else {
      list[index] = {
        ...{
          days: "",
          APY: "",
        },
        [name]: value,
      };
    }
    //console.log(list, "listlistlistlist__after");
    let formData = { ...this.state.formValue, ...{ periodList: list } };
    this.setState({ formValue: formData });
  };

  // handle click event of the Remove button
  handleRemoveClick = (index) => {
    const { periodList } = this.state.formValue;
    const list = [...periodList];
    list.splice(index, 1);
    let formData = { ...this.state.formValue, ...{ periodList: list } };
    this.setState({ formValue: formData });
  };

  // handle click event of the Add button
  handleAddClick = () => {
    const { periodList } = this.state.formValue;
    const list = [...periodList];
    list.push({ days: "", APY: "" });
    let formData = { ...this.state.formValue, ...{ periodList: list } };
    this.setState({ formValue: formData });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { formValue } = this.state;
    const { fetchData } = this.props;

    let reqData = {
      stakingId: formValue._id,
      currencyId: formValue.currencyId,
      minimumAmount: formValue.minimumAmount,
      maximumAmount: formValue.maximumAmount,
      redemptionPeriod: formValue.redemptionPeriod,
      type: formValue.type,
      flexibleAPY: formValue.flexibleAPY,
      periodList: formValue.periodList,
      status: formValue.status,
    };

    try {
      this.setState({ loader: false });
      const { status, loading, message, error, result } = await editStaking(
        reqData
      );
      this.setState({ loader: loading });
      if (status == "success") {
        toastAlert("success", message, "addstaking");
        this.handleClose();
        fetchData();
      } else {
        if (error) {
          this.setState({ errors: error });
          this.setState({ alert: true });
        }
        toastAlert("error", message, "addstaking");
      }
    } catch (err) { }
  };

  handleClose = () => {
    const { onHide } = this.props;
    onHide();
    this.setState({ formValue: initialFormValue, errors: {} });
    this.setState({ alert: false });

  };

  render() {
    const { errors, typeOption, loader ,alert} = this.state;
    const {
      currencyId,
      minimumAmount,
      maximumAmount,
      redemptionPeriod,
      type,
      flexibleAPY,
      periodList,
      status,
    } = this.state.formValue;
    const { isShow, currencyOption } = this.props;

    return (
      <div>
        <Modal
          show={isShow}
          onHide={this.handleClose}
          aria-labelledby="contained-modal-title-vcenter"
          size="lg"
          centered
        // scrollable={true}
        >
          <Modal.Header closeButton>
            <h4 className="modal-title">Edit Staking</h4>
          </Modal.Header>
          <Modal.Body>
            <form noValidate onSubmit={this.handleSubmit} id="add-staking">
              <div className="row mt-2">
                <div className="col-md-3">
                  <label htmlFor="identifier">Staking Currency</label>
                </div>
                <div className="col-md-9">
                  <Form.Control
                    as="select"
                    custom
                    name={"currencyId"}
                    value={currencyId}
                    onChange={this.handleChange}
                  >
                    <option value={""}>{"Select currency"}</option>
                    {currencyOption &&
                      currencyOption.length > 0 &&
                      currencyOption.map((item, key) => {
                        return (
                          <option key={key} value={item._id}>
                            {item.currencySymbol}
                          </option>
                        );
                      })}
                  </Form.Control>
                  <span className="text-danger">{errors.currencyId}</span>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label htmlFor="minimum">Minimum Amount</label>
                </div>
                <div className="col-md-9">
                  <input
                    onChange={this.handleChange}
                    value={minimumAmount}
                    error={errors.minimumAmount}
                    name="minimumAmount"
                    type="text"
                    className={classnames("form-control", {
                      invalid: errors.minimumAmount,
                    })}
                  />
                  <span className="text-danger">{errors.minimumAmount}</span>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label htmlFor="minimum">Maximum Amount</label>
                </div>
                <div className="col-md-9">
                  <input
                    onChange={this.handleChange}
                    value={maximumAmount}
                    error={errors.maximumAmount}
                    name="maximumAmount"
                    type="text"
                    className={classnames("form-control", {
                      invalid: errors.maximumAmount,
                    })}
                  />
                  <span className="text-danger">{errors.maximumAmount}</span>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label htmlFor="minimum">Redemption Period (In Days)</label>
                </div>
                <div className="col-md-9">
                  <input
                    onChange={this.handleChange}
                    value={redemptionPeriod}
                    error={errors.redemptionPeriod}
                    name="redemptionPeriod"
                    type="text"
                    className={classnames("form-control", {
                      invalid: errors.redemptionPeriod,
                    })}
                  />
                  <span className="text-danger">{errors.redemptionPeriod}</span>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-3">
                  <label htmlFor="flexible">
                    <span>Type</span>
                  </label>
                </div>
                <div className="col-md-9">
                  <Select
                  styles={this.styles} className="border_blue_select basic-multi-select"

                    value={
                      typeOption && typeOption.length > 0
                        ? typeOption.filter((el) => {
                          if (!isEmpty(type) && type.includes(el.value)) {
                            return el;
                          }
                        })
                        : []
                    }
                    isMulti
                    name="colors"
                    options={typeOption}
                    onChange={this.handleSelect}
                  
                    classNamePrefix="select"
                  />
                  <span className="text-danger">{errors.type}</span>
                </div>
              </div>

              {!isEmpty(type) && type.includes("flexible") && (
                <div className="row mt-2">
                  <div className="col-md-3">
                    <label htmlFor="minimum">Flexible APY(%)</label>
                  </div>
                  <div className="col-md-9">
                    <input
                      onChange={this.handleChange}
                      value={flexibleAPY}
                      error={errors.flexibleAPY}
                      name="flexibleAPY"
                      type="text"
                      className={classnames("form-control", {
                        invalid: errors.flexibleAPY,
                      })}
                    />
                    <span className="text-danger">{errors.flexibleAPY}</span>
                  </div>
                </div>
              )}
              {!isEmpty(type) &&
                type.includes("fixed") &&
                periodList &&
                periodList.length > 0 &&
                periodList.map((item, key) => {
                  return (
                    <div className="row mt-2">
                      <div className="col-md-3">
                        <label htmlFor="minimum">Period {key + 1}</label>
                      </div>
                      <div className="box row col-md-9 align-items-center">
                        <div className="col-md-3">
                          <input
                            name="days"
                            placeholder="Enter Days"
                            value={item.days}
                            onChange={(e) => this.handleInputChange(e, key)}
                            className={classnames("form-control")}
                          />
                          {

                            isEmpty(item.days) && alert == true &&
                            <span className="text-danger">Required</span>
                          }

                          {
                            (item.days < 0) && alert == true && <>
                              <span className="text-danger">Invalid Value</span></>
                          }
                          {
                            (item.days && item.days == 0) && alert == true && <>
                              <span className="text-danger">Invalid Value</span></>
                          }
                        </div>
                        <div className="col-md-3">
                          <input
                            name="APY"
                            placeholder="Enter APY(%)"
                            value={item.APY}
                            onChange={(e) => this.handleInputChange(e, key)}
                            className={classnames("form-control")}
                          />
                          {

                            isEmpty(item.APY) && alert == true &&
                            <span className="text-danger">Required</span>
                          }

                          {
                            (item.APY < 0) && alert == true && <>
                              <span className="text-danger">Invalid Value</span></>
                          }
                          {
                            (item.APY && item.APY == 0) && alert == true && <>
                              <span className="text-danger">Invalid Value</span></>
                          }
                        </div>
                        <div className="btn-box col-md-3">
                          {
                            periodList.length !== 1 && <button className='btn btn-danger' onClick={() => this.handleRemoveClick(key)}><i class='fa fa-remove'></i></button>
                            // <button className="btn btn-primary" onClick={() => this.handleRemoveClick(key)}>Remove</button>
                          }

                        </div>
                        {
                          periodList.length - 1 === key && <button className='btn btn-success' onClick={this.handleAddClick} ><i class="fa fa-plus" aria-hidden="true"></i></button>
                          // <button type="button" className="btn btn-primary" onClick={this.handleAddClick}>Add</button>
                        }
                      </div>
                      {/* <span className="text-danger">{errors.periodList}</span> */}
                    </div>
                  );
                })}

              {!isEmpty(type) &&
                type.includes("fixed") &&
                periodList.length == 0 && (
                  <div className="row mt-2">
                    <div className="col-md-3">
                      <label htmlFor="minimum">Period 1</label>
                    </div>
                    <div className="box row col-md-9 align-items-center">
                      <div className="col-md-3">
                        <input
                          name="days"
                          placeholder="Enter Days"
                          value={periodList.days}
                          onChange={(e) => this.handleInputChange(e, 0)}
                          className={classnames("form-control")}
                        />
                        {

                          isEmpty(periodList.days) && alert == true &&
                          <span className="text-danger">Required</span>
                        }

                        {
                          (periodList.days < 0) && alert == true && <>
                            <span className="text-danger">Invalid Value</span></>
                        }
                        {
                          (periodList.days && periodList.days == 0) && alert == true && <>
                            <span className="text-danger">Invalid Value</span></>
                        }
                      </div>
                      <div className="col-md-3">
                        <input
                          name="APY"
                          placeholder="Enter APY(%)"
                          value={periodList.APY}
                          onChange={(e) => this.handleInputChange(e, 0)}
                          className={classnames("form-control")}
                        />
                      </div>
                      <div className="btn-box col-md-3">
                        {periodList.length !== 1 && (<button className='btn btn-danger' onClick={() => this.handleRemoveClick(0)}><i class='fa fa-remove'></i></button>

                        )}
                     <button className='btn btn-success' onClick={this.handleAddClick} ><i class="fa fa-plus" aria-hidden="true"></i></button>
                      </div>
                    </div>
                    <span className="text-danger">{errors.periodList}</span>
                  </div>
                )}

              <div className="row mt-2">
                <div className="col-md-3">
                  <label htmlFor="content">Status</label>
                </div>

                <div className="col-md-9">
                  <Form.Control
                    as="select"
                    custom
                    name={"status"}
                    value={status}
                    onChange={this.handleChange}
                  >
                    <option value={"active"}>Active</option>
                    <option value={"deactive"}>Deactive</option>
                  </Form.Control>
                  <span className="text-danger">{errors.status}</span>
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
              disabled={loader}
            >
              Submit
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default StakingUpdateModal;
