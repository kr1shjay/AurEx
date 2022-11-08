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
    "name": "",
    "mailType": "",
    "api": "",
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
        this.HandleClick = this.HandleClick.bind(this)
    }
    componentDidMount() {
        this.fetchMailIntegration();
    };


    async fetchMailIntegration() {
        try {
            const { status, loading, result } = await getMailIntegrate();
            if (status == 'success') {
                const setValue = {
                    "fromemail": result.sendinBlue.email,
                    "name": result.sendinBlue.name,
                    "api": result.sendinBlue.apiKey,
                    "mailType": result.sendinBlue.mailType
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
            name,
            api,
            mailType

        } = this.state.formValue;
        let reqData = {
            fromMail: fromemail,
            name: name,
            api: api,
            type: 'sendinBlue',
            mailType: mailType,
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

    async HandleClick(e) {
        let { name, value } = e.target
        let formData = { ...this.state.formValue, ...{ 'mailType': value } };
        this.setState({ formValue: formData });

    }
    render() {
        const { errors, createObjectUrl, formValue } = this.state;
        console.log(formValue, 'formvalue')
        const {
            fromemail,
            name,
            api,
            mailType
        } = this.state.formValue;


        return (
            <Card>
                <Card.Header><p className="text-white"><b>Send In Blue</b></p></Card.Header>
                <Card.Body>
                    <div className='row mt-2'>
                        <div className='col md-12'>
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="currencyName">user Name</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        value={name}
                                        onChange={this.handleChange}
                                        name="name"
                                        class='form-control'
                                        error={errors && errors.name}
                                        id="fromemail"
                                        type="text"
                                    />
                                    <span className="text-danger">{errors && errors.mail}</span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="currencyName">Email</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        value={fromemail}
                                        onChange={this.handleChange}
                                        name="fromemail"
                                        class='form-control'
                                        error={errors && errors.email}
                                        id="host"
                                        type="text"
                                    />
                                    <span className="text-danger">{errors && errors.name}</span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="currencyName">Api</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        value={api}
                                        onChange={this.handleChange}
                                        name="api"
                                        class='form-control'
                                        error={errors && errors.api}
                                        id="port"
                                        type="text"
                                    />
                                    <span className="text-danger">{errors && errors.api}</span>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-3">

                                    <label htmlFor="currencyName" >Mail Type</label>
                                </div>
                                <div className="col-md-9">
                                    <div class="form-check form-check-inline">
                                        <input
                                            default={mailType}
                                            class="form-check-input"
                                            type="radio"
                                            name="mailType"
                                            value="nodeMailer"
                                            onClick={this.HandleClick}
                                            checked={mailType == 'nodeMailer'}
                                        />
                                        <label class="form-check-label" for="inlineRadio1"><b>NodeMailer</b></label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input
                                            default={mailType}
                                            class="form-check-input"
                                            type="radio"
                                            name="mailType"
                                            value="sendinBlue"
                                            onClick={this.HandleClick}
                                            checked={mailType == 'sendinBlue'}
                                        />
                                        <label class="form-check-label" for="inlineRadio2"><b>sendinBlue</b></label>
                                    </div>
                                    {/* <span className="text-danger">{errors && errors.secure}</span> */}
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