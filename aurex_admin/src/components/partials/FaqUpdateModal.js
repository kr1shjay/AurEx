import React from 'react'
import classnames from "classnames";
import { Modal, Form } from "react-bootstrap";

// import action
import { faqUpdate } from '../../actions/faqActions';

// import lib
import { toastAlert } from '../../lib/toastAlert';

const initialFormValue = {
    'id': '',
    'categoryId': '',
    'question': '',
    'answer': '',
    'status': 'active'
}

class FaqUpdateModal extends React.Component {
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
            console.log("🚀 ~ file: FaqUpdateModal.js ~ line 31 ~ FaqUpdateModal ~ componentWillReceiveProps ~ record", record)
            this.setState({
                formValue: {
                    'id': record._id,
                    'categoryId': record.categoryId,
                    'question': record.question,
                    'answer': record.answer,
                    'status': record.status
                }
            })
        }
    }

    handleChange = e => {
        e.preventDefault();
        let { name, value } = e.target;
        let formData = { ...this.state.formValue, ...{ [name]: value } };
        this.setState({ formValue: formData });
        this.setState({errors:''})

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
            let reqData = formValue;
            const { status, loading, message, error } = await faqUpdate(reqData);
            if (status == 'success') {
                fetchData();
                toastAlert('success', message, 'updateFaq');
                this.handleClose()
            } else {
                if (error) {
                    this.setState({ errors: error })
                }
                toastAlert('error', message, 'updateFaq');
            }
        } catch (err) { }
    }


    render() {
        const { errors } = this.state;
        const { categoryId, question, answer, status } = this.state.formValue
        const { isShow, categoryOption } = this.props;

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
                        <h4 className="modal-title">Edit Faq</h4>
                    </Modal.Header>
                    <Modal.Body>
                        <form noValidate onSubmit={this.handleSubmit}>

                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="question">Category</label>
                                </div>

                                <div className="col-md-9">
                                    <Form.Control
                                        as="select"
                                        custom
                                        name={'categoryId'}
                                        value={categoryId}
                                        onChange={this.handleChange}
                                    >
                                        <option value={''}>{"Select Category"}</option>
                                        {
                                            categoryOption && categoryOption.length > 0 && categoryOption.map((item, key) => {
                                                return (
                                                    <option key={key} value={item._id}>{item.name}</option>
                                                )
                                            })
                                        }
                                    </Form.Control>
                                    <span className="text-danger">{errors.category}</span>
                                </div>
                            </div>


                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="question">Question</label>
                                </div>
                                <div className="col-md-9">
                                    <textarea
                                        onChange={this.handleChange}
                                        value={question}
                                        name="question"
                                        type="text"
                                        error={errors.question}
                                        className={classnames("form-control", {
                                            invalid: errors.question
                                        })} />
                                    <span className="text-danger">{errors.question}</span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="answer">Answer</label>
                                </div>
                                <div className="col-md-9">
                                    <textarea
                                        onChange={this.handleChange}
                                        value={answer}
                                        error={errors.answer}
                                        name="answer"
                                        type="text"
                                        className={classnames("form-control", {
                                            invalid: errors.answer
                                        })}
                                    />
                                    <span className="text-danger">{errors.answer}</span>
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
                                        <option value={'Inactive'}>Inactive</option>
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

export default FaqUpdateModal;
