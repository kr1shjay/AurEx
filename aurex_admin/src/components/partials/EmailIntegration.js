import React, { Component } from "react";
import { Card, Button } from "react-bootstrap";
import classnames from "classnames";

//import lib
import { toastAlert } from '../../lib/toastAlert';
import fileObjectUrl from '../../lib/fileObjectUrl'
import isEmpty from '../../lib/isEmpty'

//import config
import config from '../../config/index';

// import action
import { getMailIntegrate, updateMailIntegrate } from '../../actions/siteSettingActions';

const initialFormValue = {
    "fromemail": "",
    "host": "",
    "port": "",
    "secure": "",
    "user": "",
    "pass": "",
}

class MaliIntregate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formValue: initialFormValue,
            loader: false,
            errors: {}
        };
        this.handleMailSubmit = this.handleMailSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.secureClick = this.secureClick.bind(this)
    }
    componentDidMount() {
        this.fetchMailIntegration();
    };


    async fetchMailIntegration() {
        try {
            const { status, loading, result } = await getMailIntegrate();
            if (status == 'success') {
                const setValue = {
                    "fromemail": result.mailIntegrage.fromMail,
                    "host": result.mailIntegrage.nodemailer.host,
                    "port": result.mailIntegrage.nodemailer.port,
                    "secure": result.mailIntegrage.nodemailer.secure,
                    "user": result.mailIntegrage.nodemailer.auth.user,
                    "pass": result.mailIntegrage.nodemailer.auth.pass,
                }
                this.setState({ formValue: setValue })
            }
        } catch (err) { }
    }


    handleChange(e) {
        e.preventDefault();
        const { name, value } = e.target;
        let formData = { ...this.state.formValue, ...{ [name]: value } };
        this.setState({ formValue: formData });
        if (!isEmpty(value)) {
            this.setState({ errors: {} })
        }
    }


    async handleMailSubmit(e) {
        e.preventDefault()

        const {
            fromemail,
            host,
            port,
            secure,
            user,
            pass
        } = this.state.formValue;
        let reqData = {
            fromMail: fromemail,
            host: host,
            port: port,
            secure: secure,
            user: user,
            pass: pass,
            type:'mailIntegrage'
        }

        try {
            const { status, loading, result, message, errors } = await updateMailIntegrate(reqData);
            if (status == 'success') {
                toastAlert('success', message, 'sitesetting')
            } else {
                toastAlert('error', message, 'sitesetting')
            }
            if (errors) {
                this.setState({ errors: errors })
            }
        } catch (err) {
            console.log("error", err);
        }
    }

    async secureClick(e) {
        let { name, value } = e.target
        let formData = { ...this.state.formValue, ...{ 'secure': value } };
        this.setState({ formValue: formData });

    }
    render() {
        const { errors, createObjectUrl, formValue } = this.state;
        console.log(formValue, 'formValueformValueformValue')
        const {
            fromemail,
            host,
            port,
            secure,
            user,
            pass
        } = this.state.formValue;


        return (
            <Card>
                <Card.Header><b>Mail Integration</b></Card.Header>
                <Card.Body>
                    <div className='row mt-2'>
                        <div className='col md-12'>
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="currencyName">From Email</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        value={fromemail}
                                        onChange={this.handleChange}
                                        name="fromemail"
                                        class='form-control'
                                        error={errors && errors.fromemail}
                                        id="fromemail"
                                        type="text"
                                    />
                                    <span className="text-danger">{errors && errors.fromMail}</span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="currencyName">Host</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        value={host}
                                        onChange={this.handleChange}
                                        name="host"
                                        class='form-control'
                                        error={errors && errors.host}
                                        id="host"
                                        type="text"
                                    />
                                    <span className="text-danger">{errors && errors.host}</span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="currencyName">Port</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        value={port}
                                        onChange={this.handleChange}
                                        name="port"
                                        class='form-control'
                                        error={errors && errors.port}
                                        id="port"
                                        type="number"
                                    />
                                    <span className="text-danger">{errors && errors.port}</span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="currencyName">User</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        value={user}
                                        onChange={this.handleChange}
                                        name="user"
                                        class='form-control'
                                        error={errors && errors.user}
                                        id="user"
                                        type="text"
                                    />
                                    <span className="text-danger">{errors && errors.user}</span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="currencyName">Password</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        value={pass}
                                        onChange={this.handleChange}
                                        name="pass"
                                        class='form-control'
                                        error={errors && errors.pass}
                                        id="pass"
                                        type="text"
                                    />
                                    <span className="text-danger">{errors && errors.pass}</span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-3">

                                    <label htmlFor="currencyName" >secure</label>
                                </div>
                                <div className="col-md-9">
                                    <div class="form-check form-check-inline">
                                        <input
                                            default={secure.toString()}
                                            class="form-check-input"
                                            type="radio"
                                            name="inlineRadioOptions"
                                            value="true"
                                            onClick={this.secureClick}
                                            checked={secure.toString() == 'true'}
                                        />
                                        <label class="form-check-label" for="inlineRadio1"><b>True</b></label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input
                                            default={secure.toString()}
                                            class="form-check-input"
                                            type="radio"
                                            name="inlineRadioOptions"
                                            value="false"
                                            onClick={this.secureClick}
                                            checked={secure.toString() == 'false'}
                                        />
                                        <label class="form-check-label" for="inlineRadio2"><b>False</b></label>
                                    </div>
                                    <span className="text-danger">{errors && errors.secure}</span>
                                </div>
                            </div>
                        </div>
                    </div>




                </Card.Body>
                <Card.Footer>
                    <Button onClick={this.handleMailSubmit}>Submit</Button>
                </Card.Footer>
            </Card>
        )
    }
}

export default MaliIntregate;