import React from "react";
import classnames from "classnames";
import { Modal, Form } from "react-bootstrap";

// import action
import { faqCategoryEdit } from '../../actions/faqActions';

// import lib
import { toastAlert } from '../../lib/toastAlert';

const initialFormValue = {
    'id': '',
    'name': '',
    'status': 'active'
}

class EditFaqCategoryModal extends React.Component {
    constructor() {
        super();
        this.state = {
            formValue: initialFormValue,
            errors: {},
        };
    }

    componentWillReceiveProps(nextProps) {
        const { record } = nextProps;
        if (record) {
            this.setState({
                formValue: {
                    'id': record._id,
                    'name': record.name,
                    'status': record.status
                }
            })
        }
    }

    handleChange = (e) => {
        e.preventDefault();
        let { name, value } = e.target;
        let formData = { ...this.state.formValue, ...{ [name]: value } };
        this.setState({ formValue: formData });
        this.setState({ errors:'' })
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
            const { status, loading, message, error } = await faqCategoryEdit(reqData);
            if (status == 'success') {
                fetchData();
                toastAlert('success', message, 'addFaqCategory')
                this.handleClose()
            } else {
                if (error) {
                    this.setState({ errors: error })
                }
                toastAlert('error', message, 'addFaqCategory')
            }
        } catch (err) { }
    }

    render() {
        const { errors } = this.state;
        const { name, status } = this.state.formValue
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
                        <h4 className="modal-title">Edit Faq Category</h4>
                    </Modal.Header>
                    <Modal.Body>
                        <form noValidate onSubmit={this.handleSubmit} id="add-faq">
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="question">Category Name</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        onChange={this.handleChange}
                                        value={name}
                                        name="name"
                                        type="text"
                                        error={errors.name}
                                        className={classnames("form-control", {
                                            invalid: errors.name
                                        })} />
                                    <span className="text-danger">{errors.name}</span>
                                </div>
                            </div>

                            <div className="row mt-2">

                                <div className="col-md-3">
                                    <label htmlFor="name">Status</label>
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
                                    {/* <span className="text-danger">{errors.name}</span> */}
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

export default EditFaqCategoryModal;
