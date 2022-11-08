import React, { Component, Fragment } from "react";
import Navbar from "../partials/Navbar";
import classnames from "classnames";
import Sidebar from "../partials/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons/faList";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updatedynamic,getTableDataDynamic } from "../../actions/userActions";

import axios from "axios";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import keys from "../../actions/config";
import { withRouter } from "react-router-dom";


const url = keys.baseUrl;
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstlevel:"",
      minamount:"",
      signup_bonus:"",
      deposit_bonus:"",
      promo_bonus:"",
      errors: {}
    };
  }


  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
    if (
      nextProps.auth !== undefined &&
      nextProps.auth.profile !== undefined &&
      nextProps.auth.profile.data !== undefined &&
      nextProps.auth.profile.data.message !== undefined
    ) {
      toast(nextProps.auth.profile.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
      nextProps.auth.profile = undefined;
    }
  }

  getData() {
    var dynobj = {}
		dynobj.find = {};
		dynobj.find._id = '5e3a64247d5ce648848bfc6c';
		dynobj.table = {};
		dynobj.table.name = 'FeeTable';
		dynobj.return = {};
		dynobj.return.name = 'Feedata';
    this.props.getTableDataDynamic(dynobj);
    }

  handleChange = event => {
    this.setState({
      profileurl: URL.createObjectURL(event.target.files[0]),
      profile: event.target.files[0]
    });
    //   const data = new FormData()
    //   data.append('file', this.state.profile)
    //   axios.post(url+"api/profileupload", data, { // receive two parameter endpoint url ,form data
    //   })
    //   .then(res => { // then print response status
    //     console.log(res.statusText)
    //   })
  };

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };


componentWillReceiveProps(nextProps) {
  
  if (nextProps.errors) {
    this.setState({
    errors: nextProps.errors
    });
  }
  else
  {
    this.setState({
    errors: {}
    });
  }
  console.log(nextProps,'nextProps');
  if(typeof nextProps.auth!='undefined'){
    if(typeof nextProps.auth.updatesettings!='undefined'){
      if(typeof nextProps.auth.updatesettings.data!='undefined'){

        if(typeof nextProps.auth.updatesettings.data.Feedata!='undefined'){
          if(typeof nextProps.auth.updatesettings.data.Feedata.firstlevel!='undefined'){
            var Feedata = nextProps.auth.updatesettings.data.Feedata;

            this.setState({
              firstlevel:Feedata.firstlevel,
              minamount:Feedata.minamount,
              signup_bonus:Feedata.signup_bonus,
              deposit_bonus:Feedata.deposit_bonus,
              promo_bonus:Feedata.promo_bonus,
            });
          }
        }

      }
    }
  }
}






  updateFeeSetting = e => {
    e.preventDefault();
    var dynobj = {}
    dynobj.update={}
    dynobj.update.firstlevel=this.state.firstlevel
    dynobj.update.minamount=this.state.minamount
    dynobj.update.signup_bonus=this.state.signup_bonus
    dynobj.update.deposit_bonus=this.state.deposit_bonus
    dynobj.update.promo_bonus=this.state.promo_bonus
    dynobj.table = {};
		dynobj.table.name = 'FeeTable';
		dynobj.return = {};
		dynobj.return.name = 'FeeTabledata';
    this.props.updatedynamic(dynobj);
    // axios.post(url+"api/profileupload", data, { // receive two parameter endpoint url ,form data
    // })
    // .then(res => { // then print response status
    //     console.log(res.statusText)
    // })
  };

  render() {
    const { errors } = this.state;
    return (
      <div>
        <Navbar />
        <div className="d-flex" id="wrapper">
          <Sidebar />
          <div id="page-content-wrapper">
            <div className="container-fluid">
              
              <h3 className="mt-2 text-secondary">Fee Settings</h3>
              <form
                noValidate
                onSubmit={this.updateFeeSetting}
                id="update-profile"
              >
                <div className="row mt-2">
                  <div className="col-md-3">
                    <label htmlFor="name">Referral Commission (%)</label>
                  </div>
                  <div className="col-md-6">
                    <input
                      onChange={this.onChange}
                      value={this.state.firstlevel}
                      id="firstlevel"
                      type="text"
                      error={errors.name}
                      className={classnames("form-control", {
                        invalid: errors.name
                      })}
                    />
                    <span className="text-danger">{errors.name}</span>
                  </div>
                </div>

                <div className="row mt-2">
                  <div className="col-md-3">
                    <label htmlFor="name">Minimum deposit value</label>
                  </div>
                  <div className="col-md-6">
                    <input
                      onChange={this.onChange}
                      value={this.state.minamount}
                      id="minamount"
                      type="text"
                      error={errors.name}
                      className={classnames("form-control", {
                        invalid: errors.name
                      })}
                    />
                    <span className="text-danger">{errors.name}</span>
                  </div>
                </div>

                 <div className="row mt-2">
                  <div className="col-md-3">
                    <label htmlFor="signup_bonus">Signup Bonus</label>
                  </div>
                  <div className="col-md-6">
                    <input
                      onChange={this.onChange}
                      value={this.state.signup_bonus}
                      id="signup_bonus"
                      type="text"
                      error={errors.signup_bonus}
                      className={classnames("form-control", {
                        invalid: errors.signup_bonus
                      })}
                    />
                    <span className="text-danger">{errors.signup_bonus}</span>
                  </div>
                </div>

                  <div className="row mt-2">
                  <div className="col-md-3">
                    <label htmlFor="deposit_bonus">Deposit Bonus(%)</label>
                  </div>
                  <div className="col-md-6">
                    <input
                      onChange={this.onChange}
                      value={this.state.deposit_bonus}
                      id="deposit_bonus"
                      type="text"
                      error={errors.deposit_bonus}
                      className={classnames("form-control", {
                        invalid: errors.deposit_bonus
                      })}
                    />
                    <span className="text-danger">{errors.deposit_bonus}</span>
                  </div>
                </div>

                 <div className="row mt-2">
                  <div className="col-md-3">
                    <label htmlFor="promo_bonus">Socialmedia promo Bonus</label>
                  </div>
                  <div className="col-md-6">
                    <input
                      onChange={this.onChange}
                      value={this.state.promo_bonus}
                      id="promo_bonus"
                      type="text"
                      error={errors.promo_bonus}
                      className={classnames("form-control", {
                        invalid: errors.promo_bonus
                      })}
                    />
                    <span className="text-danger">{errors.promo_bonus}</span>
                  </div>
                </div>
               
              
              </form>
              <br />
              <button
                form="update-profile"
                type="submit"
                className="btn btn-primary"
              >
              Update Fee
              </button>
            </div>
          </div>
          <ToastContainer />
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  getTableDataDynamic:PropTypes.func.isRequired,
  updatedynamic: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { updatedynamic,getTableDataDynamic })(withRouter(Profile));
