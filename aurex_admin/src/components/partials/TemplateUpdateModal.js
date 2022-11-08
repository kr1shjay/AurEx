import React from 'react'
import classnames from "classnames";
import { Modal, Form } from "react-bootstrap";
import { CKEditor } from 'ckeditor4-react';

// import action
import { editEmailTemplate } from '../../actions/emailTemplateAction';
// import lib
import { toastAlert } from '../../lib/toastAlert';


const initialFormValue = {
    'subject': '',
    'identifier': '',
    'content': '',
    'langCode': '',
    'status': 'active'
}


class TemplateUpdateModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            formValue: initialFormValue,
            errors: {},
        };
        this.handleEditorChange = this.handleEditorChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { record } = nextProps;
        if (record) {
            this.setState({ formValue: record })
        }
    }

    handleChange = e => {
        e.preventDefault();
        let { name, value } = e.target;
        let formData = { ...this.state.formValue, ...{ [name]: value } };
        this.setState({ formValue: formData });
    }

    handleEditorChange(e) {
        let formData = { ...this.state.formValue, ...{ 'content': e.editor.getData() } };
        this.setState({ formValue: formData });
    }

    handleClose = () => {
        const { onHide } = this.props;
        onHide();
        this.setState({ 'formValue': initialFormValue, errors: {} });
    }

    handleSubmit = async e => {
        e.preventDefault();
        try {
            const { fetchData } = this.props;
            const { formValue } = this.state;
            let reqData = {
                'id': formValue._id,
                'subject': formValue.subject,
                'identifier': formValue.identifier,
                'content': formValue.content,
                // 'langCode': formValue.langCode,
                // 'status': formValue.status
            };

            const { status, loading, message, error } = await editEmailTemplate(reqData);
            if (status == 'success') {
                fetchData();
                toastAlert('success', message, 'addTemplate');
                this.handleClose()
            } else {
                if (error) {
                    this.setState({ errors: error })
                }
                toastAlert('error', message, 'addTemplate');
            }
        } catch (err) { }
    }

    render() {
        const { errors } = this.state;
        const { subject, identifier, langCode, content, status } = this.state.formValue
        const { isShow, languageOption } = this.props;

        return (
            <div>
                <Modal
                    show={isShow}
                    onHide={this.handleClose}
                    aria-labelledby="contained-modal-title-vcenter"
                    size="lg"
                    centered
                    scrollable={true}
                >
                    <Modal.Header closeButton>
                        <h4 className="modal-title">Edit Templates</h4>
                    </Modal.Header>
                    <Modal.Body>
                        <form noValidate>
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="name">Subject</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        type="text"
                                        name="subject"
                                        value={subject}
                                        onChange={this.handleChange}
                                        error={errors.subject}
                                        className={classnames("form-control", {
                                            invalid: errors.subject
                                        })} />
                                    <span className="text-danger">{errors.subject}</span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="identifier">Identifier</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        type="text"
                                        name="identifier"
                                        value={identifier}
                                        onChange={this.handleChange}
                                        error={errors.identifier}
                                        className={classnames("form-control", {
                                            invalid: errors.identifier
                                        })}
                                    />
                                    <span className="text-danger">{errors.identifier}</span>
                                </div>
                            </div>

                            {/*<div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="identifier">Language Code</label>
                                </div>
                                <div className="col-md-9">
                                    <Form.Control
                                        as="select"
                                        custom
                                        name={'langCode'}
                                        value={langCode}
                                        onChange={this.handleChange}
                                    >
                                        <option value={''}>{"Select Language"}</option>
                                        {
                                            languageOption && languageOption.length > 0 && languageOption.map((item, key) => {
                                                return (
                                                    <option key={key} value={item.code}>{item.name}</option>
                                                )
                                            })
                                        }
                                    </Form.Control>
                                    <span className="text-danger">{errors.langCode}</span>
                                </div>
                            </div>*/}

                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="content">Content</label>
                                </div>
                                <div className="col-md-9">
                                    <span className="text-danger">{errors.content}</span>
                                    
                                    <CKEditor
                                        config={{
                                            // extraAllowedContent: 'div(*)',
                                            allowedContent: true,
                                            height: 500,
                                        }}
                                        initData={content}
                                        onChange={this.handleEditorChange}
                                    />
                                </div>
                            </div>

                            {/*<div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="content">Status</label>
                                </div>

                                <div className="col-md-9">
                                    <Form.Control
                                        as="select"
                                        custom
                                        name={'status'}
                                        value={status}
                                        onChange={this.handleChange}
                                    >
                                        <option value={'active'}>Active</option>
                                        <option value={'deactive'}>Deactive</option>
                                    </Form.Control>
                                </div>
                            </div>*/}

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
                        >
                            Submit
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>

        )
    }
}

export default TemplateUpdateModal
