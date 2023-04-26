import React, { Component } from "react";
import { Card, Button } from "react-bootstrap";
import classnames from "classnames";

//import lib
import { toastAlert } from '../../lib/toastAlert';
import fileObjectUrl from '../../lib/fileObjectUrl'

//import config
import config from '../../config/index';

// import action
import { updateSiteDetails } from '../../actions/siteSettingActions';

const initialFormValue = {
    "twiterLink": "",
    "fbLink": "",
    "linkedInLink": "",
    "telegramlink":"",
    "youtubelink":"",
    "discordlink":"",
    "redditlink":"",
    "mediumlink":"",
    "emailLogo": "",
    "siteName": "",
    "address": "",
    "address1": "",
    "address2": "",
    "contactNo": "",
    "supportMail": "",
}

class SiteDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formValue: initialFormValue,
            createObjectUrl: false,
            errors: {},
            loader: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { records } = nextProps;
        if (records) {
            this.setState({
                formValue: {
                    twiterLink: records.twitterUrl,
                    fbLink: records.facebookLink,
                    linkedInLink: records.linkedinLink,
                    emailLogo: records.emailLogo,
                    siteName: records.siteName,
                    address: records.address,
                    address1: records.address1,
                    address2: records.address2,
                    contactNo: records.contactNo,
                    supportMail: records.supportMail,
                }
            })
        }
    }

    handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let formData = { ...this.state.formValue, ...{ [name]: value } };
        this.setState({ formValue: formData });
    };

    handleFile = (e) => {
        e.preventDefault();
        const { name, files } = e.target;
        let formData = { ...this.state.formValue, ...{ [name]: files[0] } };
        this.setState({ createObjectUrl: true, formValue: formData });
    };

    async handleSubmit(e) {
        const { fetchSiteSetting } = this.props

        const { twiterLink,
            linkedInLink,
            fbLink,
            telegramlink,
            youtubelink,
            discordlink,
            redditlink,
            mediumlink,
            emailLogo,
            address,
            address1,
            address2,
            supportMail,
            siteName,
            contactNo
        } = this.state.formValue;

        if (emailLogo) {
            if (emailLogo.size > 20000) {
                this.setState({ errors: { emailLogo: "Image size should be less than  20 Kb" } })
                toastAlert('error', "Image size should be less than  20 Kb", 'currencyAddModal')
                return false
            }
        }
        const formData = new FormData();
        formData.append("twiterLink", twiterLink);
        formData.append("linkedInLink", linkedInLink);
        formData.append("fbLink", fbLink);
        formData.append("telegramLink", telegramlink);
        formData.append("youtubelink", youtubelink);
        formData.append("discordlink", discordlink);
        formData.append("redditlink", redditlink);
        formData.append("mediumlink", mediumlink);
        formData.append("address", address);
        formData.append("address1", address1);
        formData.append("address2", address2);
        formData.append("supportMail", supportMail);
        formData.append("siteName", siteName);
        formData.append("contactNo", contactNo);
        formData.append("emailLogo", emailLogo);
        this.setState({ loader: true })
        try {
            const { status, loading, message, error } = await updateSiteDetails(formData);
            this.setState({ loader: loading, createObjectUrl: false })
            if (status == 'success') {
                toastAlert('success', message, 'siteSettings')
                this.setState({ errors: {} })
                fetchSiteSetting();
            } else if (status == 'failed') {
                if (error) {
                    this.setState({ errors: error })
                } else {
                    toastAlert('error', message, 'siteSettings')
                }
            }
        } catch (err) {
        }
    }
    render() {
        const { errors, createObjectUrl } = this.state;

        const { twiterLink,
            fbLink,
            linkedInLink,
            telegramlink,
            youtubelink,
            discordlink,
            redditlink,
            mediumlink,
            emailLogo,
            siteName,
            address,
            address1,
            address2,
            contactNo,
            supportMail
        } = this.state.formValue;

        return (
            <Card>
                <Card.Header><p className="text-white"><b>Site Details</b></p></Card.Header>
                <Card.Body>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-3">
                            <label htmlFor="currencyName">Twitter Link</label>
                        </div>
                        <div className="col-md-9">
                            <input

                                value={twiterLink}
                                onChange={this.handleChange}
                                name="twiterLink"
                                error={errors.twiterLink}
                                id="twiter"
                                type="text"
                                className={classnames("form-control", {
                                    invalid: errors.twiterLink
                                })}
                            />
                            <span className="text-danger">{errors.twiterLink}</span>
                        </div>

                    </div>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-3">
                            <label htmlFor="currencyName">FaceBook Link</label>
                        </div>
                        <div className="col-md-9">
                            <input

                                value={fbLink}
                                name="fbLink"
                                onChange={this.handleChange}
                                error={errors.fbLink}
                                id="fbLink"
                                type="text"
                                className={classnames("form-control", {
                                    invalid: errors.fbLink
                                })}
                            />
                            <span className="text-danger">{errors.fbLink}</span>
                        </div>

                    </div>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-3">
                            <label htmlFor="currencyName">LinkedIn Link</label>
                        </div>
                        <div className="col-md-9">
                            <input

                                value={linkedInLink}
                                onChange={this.handleChange}
                                name="linkedInLink"
                                error={errors.linkedInLink}
                                id="linkedInLink"
                                type="text"
                                className={classnames("form-control", {
                                    invalid: errors.linkedInLink
                                })}
                            />
                            <span className="text-danger">{errors.linkedInLink}</span>
                        </div>

                    </div>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-3">
                            <label htmlFor="currencyName">Telegram Link</label>
                        </div>
                        <div className="col-md-9">
                            <input

                                value={twiterLink}
                                onChange={this.handleChange}
                                name="twiterLink"
                                error={errors.twiterLink}
                                id="twiter"
                                type="text"
                                className={classnames("form-control", {
                                    invalid: errors.twiterLink
                                })}
                            />
                            <span className="text-danger">{errors.twiterLink}</span>
                        </div>

                    </div>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-3">
                            <label htmlFor="currencyName">Youtube Link</label>
                        </div>
                        <div className="col-md-9">
                            <input

                                value={twiterLink}
                                onChange={this.handleChange}
                                name="twiterLink"
                                error={errors.twiterLink}
                                id="twiter"
                                type="text"
                                className={classnames("form-control", {
                                    invalid: errors.twiterLink
                                })}
                            />
                            <span className="text-danger">{errors.twiterLink}</span>
                        </div>

                    </div>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-3">
                            <label htmlFor="currencyName">Discord Link</label>
                        </div>
                        <div className="col-md-9">
                            <input

                                value={twiterLink}
                                onChange={this.handleChange}
                                name="twiterLink"
                                error={errors.twiterLink}
                                id="twiter"
                                type="text"
                                className={classnames("form-control", {
                                    invalid: errors.twiterLink
                                })}
                            />
                            <span className="text-danger">{errors.twiterLink}</span>
                        </div>

                    </div>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-3">
                            <label htmlFor="currencyName">Reddit Link</label>
                        </div>
                        <div className="col-md-9">
                            <input

                                value={twiterLink}
                                onChange={this.handleChange}
                                name="twiterLink"
                                error={errors.twiterLink}
                                id="twiter"
                                type="text"
                                className={classnames("form-control", {
                                    invalid: errors.twiterLink
                                })}
                            />
                            <span className="text-danger">{errors.twiterLink}</span>
                        </div>

                    </div>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-3">
                            <label htmlFor="currencyName">Medium Link</label>
                        </div>
                        <div className="col-md-9">
                            <input

                                value={twiterLink}
                                onChange={this.handleChange}
                                name="twiterLink"
                                error={errors.twiterLink}
                                id="twiter"
                                type="text"
                                className={classnames("form-control", {
                                    invalid: errors.twiterLink
                                })}
                            />
                            <span className="text-danger">{errors.twiterLink}</span>
                        </div>

                    </div>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-3">
                            <label htmlFor="currencyName"> Site Name</label>
                        </div>
                        <div className="col-md-9">
                            <input

                                value={siteName}
                                onChange={this.handleChange}
                                name="siteName"
                                error={errors.siteName}
                                id="siteName"
                                type="text"
                                className={classnames("form-control", {
                                    invalid: errors.siteName
                                })}
                            />
                            <span className="text-danger">{errors.siteName}</span>
                        </div>

                    </div>

                    <div className="row mt-2 align-items-center">
                        <div className="col-md-3">
                            <label htmlFor="currencyName">Address</label>
                        </div>
                        <div className="col-md-9">
                            <input

                                value={address}
                                onChange={this.handleChange}
                                name="address"
                                error={errors.address}
                                id="address"
                                type="text"
                                className={classnames("form-control", {
                                    invalid: errors.address
                                })}
                            />
                            <span className="text-danger">{errors.address}</span>
                        </div>

                    </div>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-3">
                            <label htmlFor="currencyName">Address 1</label>
                        </div>
                        <div className="col-md-9">
                            <input

                                value={address1}
                                onChange={this.handleChange}
                                name="address1"
                                error={errors.address1}
                                id="address1"
                                type="text"
                                className={classnames("form-control", {
                                    invalid: errors.address
                                })}
                            />
                            <span className="text-danger">{errors.address1}</span>
                        </div>

                    </div>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-3">
                            <label htmlFor="currencyName">Address 2</label>
                        </div>
                        <div className="col-md-9">
                            <input

                                value={address2}
                                onChange={this.handleChange}
                                name="address2"
                                error={errors.address2}
                                id="address2"
                                type="text"
                                className={classnames("form-control", {
                                    invalid: errors.address2
                                })}
                            />
                            <span className="text-danger">{errors.address2}</span>
                        </div>

                    </div>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-3">
                            <label htmlFor="currencyName">Contact No</label>
                        </div>
                        <div className="col-md-9">
                            <input

                                value={contactNo}
                                onChange={this.handleChange}
                                name="contactNo"
                                error={errors.contactNo}
                                id="contactNo"
                                type="text"
                                className={classnames("form-control", {
                                    invalid: errors.contactNo
                                })}
                            />
                            <span className="text-danger">{errors.contactNo}</span>
                        </div>

                    </div>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-3">
                            <label htmlFor="currencyName">Support Email</label>
                        </div>
                        <div className="col-md-9">
                            <input

                                value={supportMail}
                                onChange={this.handleChange}
                                name="supportMail"
                                error={errors.supportMail}
                                id="supportMail"
                                type="email"
                                className={classnames("form-control", {
                                    invalid: errors.supportMail
                                })}
                            />
                            <span className="text-danger">{errors.supportMail}</span>
                        </div>

                    </div>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-3">
                            <label htmlFor="currencyName">Site Logo</label>
                        </div>
                        <div className="col-md-9">
                            <label class="custom-file-upload">
                                <input

                                    name="emailLogo"
                                    onChange={this.handleFile}
                                    id="emailLogo"
                                    type="file"
                                    error={errors.emailLogo}
                                    className={classnames("form-control", {
                                        invalid: errors.emailLogo
                                    })}
                                />
                                Choose File
                            </label>

                            <span className="text-danger">{errors.emailLogo}</span>
                            <img
                                className="img-fluid proofThumb"
                                src={createObjectUrl == true ? fileObjectUrl(emailLogo) : `${config.API_URL}/settings/${emailLogo}`}
                            />
                        </div>

                    </div>
                </Card.Body>
                <Card.Footer>
                    <Button onClick={this.handleSubmit}>Submit</Button>
                </Card.Footer>
            </Card>
        )
    }
}

export default SiteDetails;