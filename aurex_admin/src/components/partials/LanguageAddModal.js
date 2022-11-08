import React from "react";
import classnames from "classnames";
import { Modal, Form } from "react-bootstrap";
import Checkbox from 'rc-checkbox';

// import action
import { addLanguage } from '../../actions/languageAction';

// import lib
import { toastAlert } from '../../lib/toastAlert';

const initialFormValue = {
    'name': '',
    'code': '',
    'isPrimary': false
}

class LanguageAddModal extends React.Component {
    constructor() {
        super();
        this.state = {
            formValue: initialFormValue,
            errors: {},
        };
    }

    handleChange = (e) => {
        e.preventDefault();
        let { name, value } = e.target;
        let formData = { ...this.state.formValue, ...{ [name]: value } };
        this.setState({ formValue: formData });
    }

    handleCheckBox = (e) => {
        const { name, checked } = e.target
        let formData = { ...this.state.formValue, ...{ [name]: checked } }
        this.setState({ formValue: formData });
    }

    handleClose = () => {
        const { onHide } = this.props;
        onHide();
        this.setState({ 'formValue': initialFormValue, 'errors': {} });
    }

    handleSubmit = async e => {
        e.preventDefault();
        try {
            const { fetchData } = this.props;
            const { formValue } = this.state;
            let reqData = formValue;
            const { status, loading, message, error } = await addLanguage(reqData);
            if (status == 'success') {
                fetchData();
                toastAlert('success', message, 'addLanguage')
                this.handleClose()
            } else {
                if (error) {
                    this.setState({ errors: error })
                }
                toastAlert('error', message, 'addLanguage')
            }
        } catch (err) { }
    }


    render() {
        const { errors } = this.state;
        const { name, code, isPrimary } = this.state.formValue
        const { isShow } = this.props;

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
                        <h4 className="modal-title">Add Language</h4>
                    </Modal.Header>
                    <Modal.Body>
                        <form noValidate                        >

                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="currencyName">Name</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        type="text"
                                        name="name"
                                        value={name}
                                        onChange={this.handleChange}
                                        error={errors.name}
                                        className={classnames("form-control", {
                                            invalid: errors.name,
                                        })}
                                    />
                                    <span className="text-danger">{errors.name}</span>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="currencyName">Code</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        type="text"
                                        name="code"
                                        value={code}
                                        onChange={this.handleChange}
                                        error={errors.code}
                                        className={classnames("form-control", {
                                            invalid: errors.code,
                                        })}
                                    />
                                    <span className="text-danger">{errors.code}</span>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="currencyName">Primary</label>
                                </div>
                                <div className="col-md-9">
                                    <Checkbox
                                        name="isPrimary"
                                        onChange={this.handleCheckBox}
                                        checked={isPrimary}
                                    />
                                    <span className="text-danger">{errors.isPrimary}</span>
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
        );
    }
}

export default LanguageAddModal;
