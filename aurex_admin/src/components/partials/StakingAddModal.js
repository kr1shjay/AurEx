import React from 'react'
import classnames from "classnames";
import { Modal, Form } from "react-bootstrap";
import Select from "react-select";

// import action
import { addStaking } from '../../actions/staking'

// import lib
import { toastAlert } from '../../lib/toastAlert';
import isEmpty from 'is-empty';

const initialFormValue = {
  'currencyId': '',
  'minimumAmount': '',
  'maximumAmount': '',
  'redemptionPeriod': '',
  'type': [],
  'flexibleAPY': '',
  'periodList': [{ 'days': "", 'APY': "" }]
}

class StakingAddModal extends React.Component {
  constructor() {
    super();
    this.state = {
      'formValue': initialFormValue,
      'errors': {},
      'loader': false,
      'alert': false,
      'typeOption': [
        {
          'label': 'Fixed',
          'value': 'fixed'
        },
        {
          'label': 'Flexible',
          'value': 'flexible'
        }
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
		  borderColor: '#242827',
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

  handleChange = e => {
    e.preventDefault();
    let { name, value } = e.target;
    let formData = { ...this.state.formValue, [name]: value };
    this.setState({ formValue: formData });
    if (value) {
      this.setState({ errors: {} })
    }
  }

  handleSelect(selectedOption) {
    let formData = this.state.formValue;
    if (selectedOption && selectedOption.length > 0) {
      formData = { ...formData, 'type': selectedOption.map((el) => { return el.value; }) };
    }
    else {
      formData = { ...formData, 'type': '' };
    }
    this.setState({ formValue: formData });
  };

  // handle input change
  handleInputChange = (e, index) => {
    const { periodList } = this.state.formValue;
    const { name, value } = e.target;
    const list = [...periodList];
    list[index][name] = value;
    let formData = { ...this.state.formValue, 'periodList': list };
    this.setState({ formValue: formData });
    if (value) {
      this.setState({ errors: {} })
    }
  };

  // handle click event of the Remove button
  handleRemoveClick = index => {
    const { periodList } = this.state.formValue;
    const list = [...periodList];
    list.splice(index, 1);
    let formData = { ...this.state.formValue, 'periodList': list };
    this.setState({ formValue: formData });
  };

  // handle click event of the Add button
  handleAddClick = () => {
    const { periodList } = this.state.formValue;
    const list = [...periodList];
    list.push({ days: "", APY: "" });
    let formData = { ...this.state.formValue, 'periodList': list };
    this.setState({ formValue: formData });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { formValue } = this.state;
    const { fetchData } = this.props;

    let reqData = {
      'currencyId': formValue.currencyId,
      'minimumAmount': formValue.minimumAmount,
      'maximumAmount': formValue.maximumAmount,
      'redemptionPeriod': formValue.redemptionPeriod,
      'type': formValue.type,
      'flexibleAPY': formValue.flexibleAPY,
      'periodList': formValue.periodList
    }

    try {
      this.setState({ "loader": false })
      const { status, loading, message, error, result } = await addStaking(reqData)
      this.setState({ "loader": loading })
      if (status == 'success') {
        toastAlert('success', message, 'addstaking');
        this.handleClose()
        fetchData()
      } else {
        if (error) {
          this.setState({ "errors": error })
          this.setState({ "alert": true })
        }
        toastAlert('error', message, 'addstaking');
      }
    } catch (err) { }
  }

  handleClose = () => {
    const { onHide } = this.props;
    onHide();
    this.setState({ 'formValue': initialFormValue, errors: {} });
    this.setState({ alert: false });
  }

  render() {
    const { errors, typeOption, loader, alert } = this.state;
    const { currencyId, minimumAmount, maximumAmount, redemptionPeriod, type, flexibleAPY, periodList } = this.state.formValue;
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
            <h4 className="modal-title">Add Staking</h4>
          </Modal.Header>
          <Modal.Body>
            <form
              noValidate
              onSubmit={this.handleSubmit}
              id="add-staking">

              <div className="row mt-2">
                <div className="col-md-3">
                  <label htmlFor="identifier">Staking Currency</label>
                </div>
                <div className="col-md-9">
                  <Form.Control
                    as="select"
                    custom
                    name={'currencyId'}
                    value={currencyId}
                    onChange={this.handleChange}
                  >
                    <option value={''}>{"Select currency"}</option>
                    {
                      currencyOption && currencyOption.length > 0 && currencyOption.map((item, key) => {
                        return (
                          <option key={key} value={item._id}>{item.coin}</option>
                        )
                      })
                    }
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
                    value={typeOption && typeOption.length > 0 ? typeOption.filter((el) => {
                      if (type.includes(el.value)) {
                        return el;
                      }
                    }) : []}
                    isMulti
                    name="colors"
                    options={typeOption}
                    onChange={this.handleSelect}
                    styles={this.styles} className="border_blue_select basic-multi-select"
                    classNamePrefix="select"
                  />
                  <span className="text-danger">{errors.type}</span>
                </div>
              </div>


              {
                type.includes('flexible') && <div className="row mt-2">
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
              }
              {
                type.includes('fixed') && periodList && periodList.length > 0 && periodList.map((item, key) => {
                  return (
                    <div className="row mt-2">

                      <div className="col-md-3">
                        <label htmlFor="minimum">Period {key + 1}</label>
                      </div>
                      {/* <span className="text-danger">{errors.periodList}</span> */}
                      <div className="box row col-md-9">
                        <div className="col-md-3">
                          <input
                            name="days"
                            type='number'
                            placeholder="Enter Days"
                            value={item.days}
                            onChange={e => this.handleInputChange(e, key)}
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
                          {/* {
                            !isEmpty(item.days) && item.days && item.days >= 1  && errors.periodListDay == 'invalid value'? null :
                              errors && errors.periodListDay == '' ? <span className="text-danger">{errors.periodListDay}</span> :
                                <span className="text-danger">{errors.periodListDay}</span>
                          } */}
                        </div>
                        <div className="col-md-3">
                          <input
                            name="APY"
                            type='number'
                            placeholder="Enter APY(%)"
                            value={item.APY}
                            onChange={e => this.handleInputChange(e, key)}
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
                          {/* {
                            !isEmpty(item.APY) && item.APY && item.APY >= 1 ? null :
                              !isEmpty(item.APY) && item.APY <= 1 ? <span className="text-danger">invalid value</span> :
                                <span className="text-danger">{errors.periodList}</span>
                          } */}
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
                    </div>
                  )
                })
              }



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

      </div >
    );
  }
}

export default StakingAddModal
