import React from 'react'
import classnames from "classnames";
import { Modal } from "react-bootstrap";
import { CKEditor } from 'ckeditor4-react';

// import action
import { updateCms } from '../../actions/cmsActions'

// import lib
import { toastAlert } from '../../lib/toastAlert'

const initialFormValue = {
    'id': '',
    'identifier': '',
    'title': '',
    'content': '',
    'image': ''
}

class CmsUpdateModal extends React.Component {
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
            this.setState({
                formValue: {
                    'id': record._id,
                    'identifier': record.identifier,
                    'title': record.title,
                    'content': record.content,
                    'image': record.image
                }
            })
        }
    }

    handleChange = (e) => {
        e.preventDefault();
        let { name, value } = e.target;
        let formData = { ...this.state.formValue, ...{ [name]: value } };
        this.setState({ formValue: formData });
    }


    handleEditorChange(e) {
        let formData = { ...this.state.formValue, ...{ 'content': e.editor.getData() } };
        this.setState({ formValue: formData });
    }

    handleFileChange = (event) => {
        let formData = { ...this.state.formValue, ...{ 'image': event.target.files[0] } };
        this.setState({ formValue: formData });
    }

    handleClose = () => {
        const { onHide } = this.props;
        onHide();
        this.setState({ 'formValue': initialFormValue, 'errors': {} });
    }

    handleSubmit = async e => {
        e.preventDefault();
        const { id, identifier, title, content, image } = this.state.formValue;
        const { fetchData } = this.props;

        const formData = new FormData();
        formData.append('id', id);
        formData.append('identifier', identifier);
        formData.append('title', title);
        formData.append('content', content);
        formData.append('image', image);
        // for (const key of Object.keys(image)) {
        //     formData.append('file', image[key])
        // }

        let reqData = {
            id,
            identifier,
            title,
            content
        }
        const { status, loading, message, Errors } = await updateCms(formData);
        if (status == 'success') {
            toastAlert('success', message, 'updateCms')
            fetchData();
            this.handleClose()
        } else {
            if (Errors) {
                this.setState({ errors: Errors })
            }
            toastAlert('error', message, 'updateCms')
        }
    };

    render() {
        const { identifier, title, content } = this.state.formValue
        const { errors } = this.state;
        const { isShow } = this.props;

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
                        <h4 className="modal-title">Update Cms</h4>
                    </Modal.Header>
                    <Modal.Body>
                        <form noValidate onSubmit={this.onCmsUpdate} id="update-cms">
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="name">Identifier</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        onChange={this.handleChange}
                                        value={identifier}
                                        name="identifier"
                                        type="text"
                                        error={errors.identifier}
                                        className={classnames("form-control", {
                                            invalid: errors.identifier
                                        })} readOnly />
                                    <span className="text-danger">{errors.identifier}</span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="identifier">Page Name</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        onChange={this.handleChange}
                                        value={title}
                                        error={errors.title}
                                        name="title"
                                        type="text"
                                        className={classnames("form-control", {
                                            invalid: errors.title
                                        })}
                                    />
                                    <span className="text-danger">{errors.title}</span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="content">Content</label>
                                </div>
                                <div className="col-md-9">
                                <span className="text-danger">{errors.content}</span>
                                    <CKEditor
                                        config={{
                                            extraAllowedContent: 'div(*)',
                                            allowedContent: true,
                                            height: 500,
                                        }}
                                        initData={content}
                                        onChange={this.handleEditorChange}
                                    />
                                </div>
                            </div>

                            { <div className="row mt-2">
                                <div className="col-md-3">
                                    <br />
                                    <label htmlFor="image">Image</label>
                                </div>
                                <div className="col-md-9">
                                <label class="custom-file-upload">
                                    <input type="file"  onChange={this.handleFileChange}
                                    />
                                Choose File
                                </label>

                                </div>
                            </div> }

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

export default CmsUpdateModal;
