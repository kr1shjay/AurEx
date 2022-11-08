import React from 'react'
import classnames from "classnames";
import { Modal } from "react-bootstrap";

//import action
import { categoryAdd } from '../../actions/supportAction';

//import lib
import { toastAlert } from '../../lib/toastAlert';


const initialFormValue = {
    "categoryName":"",
}

class categoryAddModal extends React.Component {
    constructor() {
        super();
        this.state = {
            formValue: initialFormValue,
            currencyList: [],
            errors: {}
        };
    }

    handleChange = e => {
        e.preventDefault();
        let { name, id, value } = e.target;
              let formData = { ...this.state.formValue, ...{ [id]: value } };
        this.setState({ formValue: formData });
    };

    handleClose = () => {
        const { onHide } = this.props;
        onHide();
        this.setState({ 'formValue': initialFormValue, errors: {} });
    }

    handleSubmit = async e => {
        e.preventDefault();
        try {
            const { formValue } = this.state;
            const { fetchData } = this.props;
            let reqData = formValue;
            let { status, loading, error, message } = await categoryAdd(reqData);
            if (status == 'success') {
                fetchData();
                toastAlert('success', message, 'addTemplate');
                this.handleClose()
            } else {
                if (error) {
                    this.setState({ errors: error })
                }
                toastAlert('error', message, 'addSpotPair');
            }
        }
        catch (err) { }
    }

    render() {
        const { errors } = this.state;
        const { categoryName } = this.state.formValue
        const { isShow, } = this.props;

        return (
            <div>
                <Modal
                    show={isShow}
                    onHide={this.handleClose}
                    aria-labelledby="contained-modal-title-vcenter"
                    scrollable={true} centered
                >
                    <Modal.Header closeButton>
                        <h4 className="modal-title">Add Category </h4>
                    </Modal.Header>
                    <Modal.Body>
                        <form noValidate id="add-spot">
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label htmlFor="taker_fees">Category Name</label>
                                </div>
                                <div className="col-md-9">
                                    <input
                                        onChange={this.handleChange}
                                        value={categoryName}
                                        name="categoryName"
                                        error={errors.categoryName}
                                        id="categoryName"
                                        type="text"
                                        className={classnames("form-control", {
                                            invalid: errors.categoryName
                                        })}
                                    />
                                    <span className="text-danger">{errors.categoryName}</span>
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

export default categoryAddModal;