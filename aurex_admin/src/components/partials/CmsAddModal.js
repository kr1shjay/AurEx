import React from 'react'
import classnames from "classnames";
import { Modal, Form } from "react-bootstrap";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addCms } from "../../actions/cmsActions";
import { withRouter } from "react-router-dom";
import { toast } from 'react-toastify';
import $ from 'jquery';
import { Editor } from '@tinymce/tinymce-react';

import 'react-toastify/dist/ReactToastify.css';

const initialFormValue = {
    'identifier': '',
    'subject': '',
    'content': ''
}

class CmsAddModal extends React.Component {
    constructor() {
        super();
        this.state = {
            formValue: initialFormValue,
            errors: {},
        };
        this.handleEditorChange = this.handleEditorChange.bind(this);
    }

    handleChange = (e) => {
        e.preventDefault();
        let { name, value } = e.target;
        let formData = { ...this.state.formValue, ...{ [name]: value } };
        this.setState({ formValue: formData });
    }

    handleEditorChange(content, editor) {
        this.setState({ content });
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onCmsAdd = e => {
        e.preventDefault();
        const newCms = {
            subject: this.state.subject,
            content: this.state.content,
            identifier: this.state.identifier,
        };
        console.log(newCms);
        this.props.addCms(newCms);
    };


    render() {
        const { errors } = this.state;
        return (
            <div>
                <Modal
                    show={isShow}
                    onHide={this.handleClose}
                    aria-labelledby="contained-modal-title-vcenter"
                    size="md"
                    centered
                // scrollable={true}
                >
                    <Modal.Header closeButton>
                        <h4 className="modal-title">Add Cms</h4>
                    </Modal.Header>
                    <Modal.Body>
                        <form noValidate onSubmit={this.onCmsAdd} id="add-cms">
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="subject">Subject Name</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        onChange={this.onChange}
                                        value={this.state.subject}
                                        id="subject"
                                        type="text"
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
                                        onChange={this.onChange}
                                        value={this.state.identifier}
                                        error={errors.identifier}
                                        id="identifier"
                                        type="text"
                                        className={classnames("form-control", {
                                            invalid: errors.identifier
                                        })}
                                    />
                                    <span className="text-danger">{errors.identifier}</span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="content">Content</label>
                                </div>
                                <div className="col-md-9">
                                    <Editor apiKey='5vk89nvvi2zckrb2lp2ctyyolewhq1v3pzdiwb7at68h40a5'
                                        initialValue="<p>This is the initial content of the editor</p>"
                                        value={this.state.content} onEditorChange={this.handleEditorChange}
                                        init={{
                                            height: 500,
                                            menubar: false,
                                            plugins: [
                                                'advlist autolink lists link image charmap print preview anchor',
                                                'searchreplace visualblocks code fullscreen',
                                                'insertdatetime media table paste code help wordcount'
                                            ],
                                            toolbar:
                                                'undo redo code | formatselect | bold italic backcolor | \
                                               alignleft aligncenter alignright alignjustify | \
                                               bullist numlist outdent indent | removeformat | help'
                                        }}
                                    />
                                    <span className="text-danger">{errors.content}</span>
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
                            type="submit"
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

export default CmsAddModal;
