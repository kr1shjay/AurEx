import React, { Component } from "react";
import { Card, Button } from "react-bootstrap";
import classnames from "classnames";

//import lib
import { toastAlert } from '../../lib/toastAlert';

// import action
import { updateSocialMedia } from '../../actions/siteSettingActions';

const initialFormValue = {
    "twitterLink": "",
    "fbLink": "",
    "linkedInLink": "",
    "telegramLink": "",
    "blogLink": "",
    "youtubeLink": "",
}

class SocialMedia extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formValue: initialFormValue,
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
                    twitterLink: records.twitterUrl,
                    fbLink: records.facebookLink,
                    linkedInLink: records.linkedinLink,
                    telegramLink: records.telegramLink,
                    blogLink: records.blogLink,
                    youtubeLink: records.youtubeLink,
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

        this.setState({ loader: true })
        try {
            const { status, loading, message, error } = await updateSocialMedia(this.state.formValue);
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
        const { errors } = this.state;
        const {
            twitterLink,
            fbLink,
            linkedInLink,
            telegramLink,
            blogLink,
            youtubeLink
        } = this.state.formValue;

        return (
            <Card>
                <Card.Header><p className="text-white"><b>Social Media</b></p></Card.Header>
                <Card.Body>
                    <div className="row mt-2">
                        <div className="col-md-3">
                            <label htmlFor="currencyName">Twitter Link</label>
                        </div>
                        <div className="col-md-9">
                            <input
                                value={twitterLink}
                                onChange={this.handleChange}
                                name="twitterLink"
                                error={errors.twitterLink}
                                id="twiter"
                                type="text"
                                className={classnames("form-control", {
                                    invalid: errors.twitterLink
                                })}
                            />
                            <span className="text-danger">{errors.twitterLink}</span>
                        </div>

                    </div>
                    <div className="row mt-2">
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
                    <div className="row mt-2">
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

                    <div className="row mt-2">
                        <div className="col-md-3">
                            <label htmlFor="currencyName">Telegram Link</label>
                        </div>
                        <div className="col-md-9">
                            <input
                                value={telegramLink}
                                onChange={this.handleChange}
                                name="telegramLink"
                                error={errors.telegramLink}
                                id="telegramLink"
                                type="text"
                                className={classnames("form-control", {
                                    invalid: errors.telegramLink
                                })}
                            />
                            <span className="text-danger">{errors.telegramLink}</span>
                        </div>
                    </div>

                    <div className="row mt-2">
                        <div className="col-md-3">
                            <label htmlFor="currencyName">Blog Link</label>
                        </div>
                        <div className="col-md-9">
                            <input
                                value={blogLink}
                                onChange={this.handleChange}
                                name="blogLink"
                                error={errors.blogLink}
                                id="blogLink"
                                type="text"
                                className={classnames("form-control", {
                                    invalid: errors.blogLink
                                })}
                            />
                            <span className="text-danger">{errors.blogLink}</span>
                        </div>
                    </div>

                    <div className="row mt-2">
                        <div className="col-md-3">
                            <label htmlFor="currencyName">Youtube Link</label>
                        </div>
                        <div className="col-md-9">
                            <input
                                value={youtubeLink}
                                onChange={this.handleChange}
                                name="youtubeLink"
                                error={errors.youtubeLink}
                                id="youtubeLink"
                                type="text"
                                className={classnames("form-control", {
                                    invalid: errors.youtubeLink
                                })}
                            />
                            <span className="text-danger">{errors.youtubeLink}</span>
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

export default SocialMedia;