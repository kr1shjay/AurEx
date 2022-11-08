import React from "react";
import classnames from "classnames";
import { Modal, Form } from "react-bootstrap";

// import lib
import { toastAlert } from '../../lib/toastAlert';
import fileObjectUrl from '../../lib/fileObjectUrl'
import isEmpty from '../../lib/isEmpty'
// import action
import { addCurrency } from '../../actions/currency';
import { creatAdmin } from '../../actions/admin';




let initialValue = {
    name: '',
    email: '',
    password: '',
    role: ''
}


class AdminAddModal extends React.Component {
    constructor() {
        super()
        this.state = {
            formValue: initialValue,
            password: '',
            copied: false,
            errors: {}
        }

    }




    copyText = (e) => {
        e.preventDefault()
    }


    handleClose = () => {
        const { onHide } = this.props;
        onHide();
        this.setState({ 'formValue': initialValue, errors: {} });
        this.setState({ errors: {} })
    }


    handleSubmit = async (e) => {
        e.preventDefault()
        let { name, email, role, password } = this.state.formValue
        let respData = {
            name: name,
            email: email,
            password: password,
            role: role,
            validErr: {}
        }

        let { status, error, message } = await creatAdmin(respData)
        if (status == 'success') {
            toastAlert('success', message, 'add admin')
            this.setState({ formValue: { ...this.state.formValue, ...initialValue } })
            const { onHide, fetchData } = this.props
            onHide()
            fetchData()
        } else {
            toastAlert('error', message, 'add admin')
        }

        if (error) {
            this.setState({ errors: error })
        }


    }

    handleChange = (e) => {
        e.preventDefault()
        let { name, value } = e.target
        this.setState({ formValue: { ...this.state.formValue, ...{ [name]: value } } })
        if (!isEmpty(value)) {
            this.setState({ errors: {} })
        }
    }


    render() {
        const { name, email, role, password } = this.state.formValue;
        const { errors, loader } = this.state;

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
                        <h4 className="modal-title">Add Admin</h4>
                    </Modal.Header>
                    <Modal.Body>

                        <form noValidate            >
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label>Name:</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        name="name"
                                        type="text"
                                        value={this.state.name}
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
                                    <label>Email</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        name="email"
                                        type="text"
                                        value={email}
                                        onChange={this.handleChange}
                                        error={errors.email}
                                        className={classnames("form-control", {
                                            invalid: errors.email,
                                        })}
                                    />
                                    <span className="text-danger">
                                        {errors.email}
                                    </span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label>Password</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        name="password"
                                        type="text"
                                        value={password}
                                        onChange={this.handleChange}
                                        error={errors.password}
                                        className={classnames("form-control", {
                                            invalid: errors.password,
                                        })}
                                    />
                                    <span className="text-danger">
                                        {errors.password}
                                    </span>
                                </div>
                            </div>










                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label>Role</label>
                                </div>
                                <div className="col-md-9">
                                    <Form.Control
                                        name="role"
                                        value={role}
                                        onChange={this.handleChange}
                                        as="select" custom
                                    >
                                        <option value={''}>Select role...</option>
                                        <option value={'admin'}>Admin</option>

                                    </Form.Control>
                                    <span className="text-danger">
                                        {errors.role}
                                    </span>
                                </div>
                            </div>


                        </form>

                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-dismiss="modal"
                            onClick={this.handleClose}
                        >
                            Close
                        </button>
                        <button
                            onClick={this.handleSubmit}
                            className="btn btn-primary"
                        >
                            {loader && <i class="fas fa-spinner fa-spin"></i>}submit
                        </button>
                    </Modal.Footer>
                </Modal>
            </div >
        );
    }
}

export default AdminAddModal
