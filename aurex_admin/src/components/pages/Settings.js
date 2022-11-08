import React, { Component, Fragment } from "react";
import Navbar from "../partials/Navbar";
import classnames from "classnames";
import Sidebar from "../partials/Sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons/faList";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import { updateSettings } from "../../actions/userActions";
import axios from "axios";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer} from "react-toastify";
import keys from "../../actions/config";
import { withRouter } from "react-router-dom";
import Select from 'react-select';
const url = keys.baseUrl;
const options = [ {'value':"Enable", 'label':"Enable"},{'value':"Disable", 'label':"Disable"}];
class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id : "",
            contact_person: "",
            email: "",
            sitename: "",
            site_description: "",
            phone_number : "",
            mobile_number : "",
            address : "",
            google_analytics : "",
            social_link1 : "",
            social_link2 : "",
            social_link3 : "",
            social_link4 : "",
            social_link5 : "",
            reg_code : "",
            company_info_link:"",
            license_info_link:"",
            copyright_text : "",
            sitelogo : "",
            sitelogourl: "",
            errors: {}
        };
    }

    componentDidMount() {
        this.getData()
    };

     componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
        if (nextProps.auth !== undefined
            && nextProps.auth.updatesettings !== undefined
            && nextProps.auth.updatesettings.data !== undefined
            && nextProps.auth.updatesettings.data.message !== undefined) {
            toast(nextProps.auth.updatesettings.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            nextProps.auth.updatesettings = undefined;
            this.getData();
            this.setState({errors : {}})
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };
    handleChange = (event) => {
        this.setState({
            sitelogourl: URL.createObjectURL(event.target.files[0]),
            sitelogo: event.target.files[0]
        })
    }

    handleselectChange = selectedOption => {
    this.setState({forcedliq : selectedOption });
  //  console.log(`Option selected:`, selectedOption );
     };

    getData() {
        axios
            .post(url+"api/settings-get")
            .then(res => {
                this.setState(res.data);
                console.log(res.data,'reszxcvbn');
                this.setState({_id:res.data._id});
                this.setState({forcedliq:{"value":res.data.forcedliq,"label":res.data.forcedliq}});
                if(this.state.sitelogo == ""){
                    this.setState({sitelogourl : keys.baseUrl+"uploads/No_image_available.png"})
                }else{
                    this.setState({sitelogourl : keys.baseUrl+this.state.sitelogo})
                }
            })
            .catch()
    }

    onSettingsUpdate = e => {
        e.preventDefault();
        const data = new FormData();
        data.append('contact_person',this.state.contact_person);
        data.append('email',this.state.email);
        data.append('sitename',this.state.sitename);
        data.append('site_description',this.state.site_description);
        data.append('phone_number',this.state.phone_number);
        data.append('mobile_number',this.state.mobile_number);
        data.append('address',this.state.address);
        data.append('google_analytics',this.state.google_analytics);
        data.append('social_link1',this.state.social_link1);
        data.append('social_link2',this.state.social_link2);
        data.append('social_link3',this.state.social_link3);
        data.append('social_link4',this.state.social_link4);
        data.append('social_link5',this.state.social_link5);
        data.append('reg_code',this.state.reg_code);
        data.append('company_info_link',this.state.company_info_link);
        data.append('license_info_link',this.state.license_info_link);
        data.append('copyright_text',this.state.copyright_text);
        data.append('file', this.state.sitelogo);
        data.append('_id', this.state._id);
        data.append('forcedliq', this.state.forcedliq.value);
        this.props.updateSettings(data);
    };

    render() {
        const { errors } = this.state;
        return (
            <div>
                <Navbar/>
                <div className="d-flex" id="wrapper">
                    <Sidebar/>
                    
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            
                            <h3 className="mt-2 text-secondary">Settings</h3>
                            <form noValidate onSubmit={this.onSettingsUpdate} id="update-settings">
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="name">Contact Person</label>
                                        </div>
                                        <div className="col-md-6">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.contact_person}
                                                id="contact_person"
                                                type="text"
                                                error={errors.contact_person}
                                                className={classnames("form-control", {
                                                    invalid: errors.contact_person
                                                })}/>
                                            <span className="text-danger">{errors.contact_person}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="email">Email</label>
                                        </div>
                                        <div className="col-md-6">
                                             <input
                                                onChange={this.onChange}
                                                value={this.state.email}
                                                id="email"
                                                type="text"
                                                error={errors.email}
                                                className={classnames("form-control", {
                                                    invalid: errors.email
                                                })}/>
                                            <span className="text-danger">{errors.email}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="sitename">Site Name</label>
                                        </div>
                                        <div className="col-md-6">
                                             <input
                                                onChange={this.onChange}
                                                value={this.state.sitename}
                                                id="sitename"
                                                type="text"
                                                error={errors.sitename}
                                                className={classnames("form-control", {
                                                    invalid: errors.sitename
                                                })}/>
                                            <span className="text-danger">{errors.sitename}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="sitedescription">Site Description</label>
                                        </div>
                                        <div className="col-md-6">
                                             <textarea
                                                onChange={this.onChange}
                                                value={this.state.site_description}
                                                id="site_description"
                                                type="text"
                                                error={errors.site_description}
                                                className={classnames("form-control", {
                                                    invalid: errors.site_description
                                                })}/>
                                            <span className="text-danger">{errors.site_description}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="address">Address</label>
                                        </div>
                                        <div className="col-md-6">
                                             <textarea
                                                onChange={this.onChange}
                                                value={this.state.address}
                                                id="address"
                                                type="text"
                                                error={errors.address}
                                                className={classnames("form-control", {
                                                    invalid: errors.address
                                                })}/>
                                            <span className="text-danger">{errors.address}</span>
                                        </div>
                                    </div>

                                     <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="reg_code">Register Code</label>
                                        </div>
                                        <div className="col-md-6">
                                             <input
                                                onChange={this.onChange}
                                                value={this.state.reg_code}
                                                id="reg_code"
                                                type="text"
                                                error={errors.reg_code}
                                                className={classnames("form-control", {
                                                    invalid: errors.reg_code
                                                })}/>
                                            <span className="text-danger">{errors.reg_code}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="phone_number">Phone Number</label>
                                        </div>
                                        <div className="col-md-6">
                                             <input
                                                onChange={this.onChange}
                                                value={this.state.phone_number}
                                                id="phone_number"
                                                type="text"
                                                error={errors.phone_number}
                                                className={classnames("form-control", {
                                                    invalid: errors.phone_number
                                                })}/>
                                            <span className="text-danger">{errors.phone_number}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="mobile_number">Mobile Number</label>
                                        </div>
                                        <div className="col-md-6">
                                             <input
                                                onChange={this.onChange}
                                                value={this.state.mobile_number}
                                                id="mobile_number"
                                                type="text"
                                                error={errors.mobile_number}
                                                className={classnames("form-control", {
                                                    invalid: errors.mobile_number
                                                })}/>
                                            <span className="text-danger">{errors.mobile_number}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="company_info_link">Company infromation link</label>
                                        </div>
                                        <div className="col-md-6">
                                             <input
                                                onChange={this.onChange}
                                                value={this.state.company_info_link}
                                                id="company_info_link"
                                                type="text"
                                                error={errors.company_info_link}
                                                className={classnames("form-control", {
                                                    invalid: errors.company_info_link
                                                })}/>
                                            <span className="text-danger">{errors.company_info_link}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="license_info_link">wallet license information link</label>
                                        </div>
                                        <div className="col-md-6">
                                             <input
                                                onChange={this.onChange}
                                                value={this.state.license_info_link}
                                                id="license_info_link"
                                                type="text"
                                                error={errors.license_info_link}
                                                className={classnames("form-control", {
                                                    invalid: errors.license_info_link
                                                })}/>
                                            <span className="text-danger">{errors.license_info_link}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="social_link1">Twitter URL</label>
                                        </div>
                                        <div className="col-md-6">
                                             <input
                                                onChange={this.onChange}
                                                value={this.state.social_link1}
                                                id="social_link1"
                                                type="text"
                                                error={errors.social_link1}
                                                className={classnames("form-control", {
                                                    invalid: errors.social_link1
                                                })}/>
                                            <span className="text-danger">{errors.social_link1}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="social_link1">Medium URL</label>
                                        </div>
                                        <div className="col-md-6">
                                             <input
                                                onChange={this.onChange}
                                                value={this.state.social_link2}
                                                id="social_link2"
                                                type="text"
                                                error={errors.social_link2}
                                                className={classnames("form-control", {
                                                    invalid: errors.social_link2
                                                })}/>
                                            <span className="text-danger">{errors.social_link2}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="social_link1">Telegram Link</label>
                                        </div>
                                        <div className="col-md-6">
                                             <input
                                                onChange={this.onChange}
                                                value={this.state.social_link3}
                                                id="social_link3"
                                                type="text"
                                                error={errors.social_link3}
                                                className={classnames("form-control", {
                                                    invalid: errors.social_link3
                                                })}/>
                                            <span className="text-danger">{errors.social_link3}</span>
                                        </div>
                                    </div>
                                     <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="social_link1">Facebook URL</label>
                                        </div>
                                        <div className="col-md-6">
                                             <input
                                                onChange={this.onChange}
                                                value={this.state.social_link4}
                                                id="social_link4"
                                                type="text"
                                                error={errors.social_link4}
                                                className={classnames("form-control", {
                                                    invalid: errors.social_link4
                                                })}/>
                                            <span className="text-danger">{errors.social_link4}</span>
                                        </div>
                                    </div>
                                     <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="social_link1">Linkedin URL</label>
                                        </div>
                                        <div className="col-md-6">
                                             <input
                                                onChange={this.onChange}
                                                value={this.state.social_link5}
                                                id="social_link5"
                                                type="text"
                                                error={errors.social_link5}
                                                className={classnames("form-control", {
                                                    invalid: errors.social_link5
                                                })}/>
                                            <span className="text-danger">{errors.social_link5}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="copyright_text">Copyrights Text</label>
                                        </div>
                                        <div className="col-md-6">
                                             <input
                                                onChange={this.onChange}
                                                value={this.state.copyright_text}
                                                id="copyright_text"
                                                type="text"
                                                error={errors.copyright_text}
                                                className={classnames("form-control", {
                                                    invalid: errors.copyright_text
                                                })}/>
                                            <span className="text-danger">{errors.copyright_text}</span>
                                        </div>
                                    </div>
                                     <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="copyright_text">Forced liquidation</label>
                                        </div>
                                        <div className="col-md-6">
                                              <Select
                                                value={this.state.forcedliq}
                                                onChange={this.handleselectChange}
                                                options={options}
                                            />
                                            <span className="text-danger">{errors.copyright_text}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                        <br/>
                                        <label htmlFor="profile">Site Logo</label>
                                        </div>
                                        <div className="col-md-6">
                                        <label class="custom-file-upload">
                                        <input type="file" onChange={this.handleChange}
                                        />
                                          Choose File
                                        </label>
                                        <img width="100px" src={this.state.sitelogourl} />
                                        
                                        </div>
                                    </div>
                                </form>
                                    <br />
                                <button
                                    form="update-settings"
                                    type="submit"
                                    className="btn btn-primary">
                                    Update Settings
                                </button>
                        </div>
                    </div>
                    <ToastContainer/>
                </div>
            </div>
        );
    }

}


Settings.propTypes = {
    updateSettings: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { updateSettings }
)(withRouter(Settings));

