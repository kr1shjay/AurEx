import React from "react";
import classnames from "classnames";
import { Modal, Form } from "react-bootstrap";
import Select from 'react-select';
// import lib
import { toastAlert } from '../../lib/toastAlert';
import fileObjectUrl from '../../lib/fileObjectUrl'
import isEmpty from '../../lib/isEmpty'
// import action
import { EditAdmin } from '../../actions/admin';
// import options from '../../lib/selectOption'
// import Routers from '../../lib/routes'
import nav from './Navbar';

// const Options = nav;

let initialValue = {
    adminId: '',
    email: '',
    name: '',
}


class EditAdminModal extends React.Component {
    constructor() {
        super()
        this.state = {
            formValue: initialValue,
            errors: {},
            selectedOption: null,
            restriction: [],
            Options: []

        }

    }


    styles = {
		option: (provided, state) => ({
		  ...provided,
		  color: "white",
		  backgroundColor: "#242827",
		}),
		valueContainer: (provided, state) => ({
		  ...provided,
		  height: '52px',
		  padding: '0 6px',
		  backgroundColor: "#1a1b1c",
		  borderColor: '#242827',
		borderRadius: 8,
		borderStyle: 'solid',
		borderWidth: '1px'
		 
		}),
		control: (provided, state) => ({
		  ...provided,
		  height: '52px',
		  borderRadius:8,
		  backgroundColor: "#1a1b1c",
		  border:'none'
		 
		}),
		indicatorsContainer: (provided, state) => ({
		  ...provided,
		  height: '52px',
		  position: 'absolute',
		  right: 0,
		  top: 0,
		  color:'#fff' 
		}),    
		singleValue: (provided, state) => ({
		  ...provided,
		  color: "#fff"
		})
	  };


    componentWillReceiveProps(nextprops) {
        const { record } = nextprops

        if (!isEmpty(record)) {
            this.setState({
                formValue: {
                    email: record.email,
                    name: record.name,
                    adminId: record._id,
                },
                restriction: record.restriction
            })
        }

    }

    componentDidMount() {
        let data = nav && nav.length > 0 && nav.map((item, i) => {
            return {
                label: item.name,
                value: item.path
            }
        })

        this.setState({ Options: data })
    }


    copyText = (e) => {
        e.preventDefault()
    }


    handleClose = () => {
        const { onHide } = this.props;
        onHide();
        this.setState({ 'formValue': initialValue, errors: {} });
    }


    handleSubmit = async (e) => {
        e.preventDefault()
        let { name, email, adminId, path } = this.state.formValue
        let { restriction } = this.state
        let respData = {
            name: name,
            email: email,
            adminId: adminId,
            restriction: restriction
            // role: role,
            // validErr: {}
        }

        let { status, error, message } = await EditAdmin(respData)
        if (status) {
            toastAlert('success', message, 'add admin')
            this.setState({ formValue: { ...this.state.formValue, ...initialValue } })
            const { onHide ,fetchData} = this.props;
            onHide()
            // fetchData()
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


    selectorChange = (selectedOption) => {

        if (selectedOption && selectedOption.length > 0) {
            this.setState({
                "restriction": selectedOption.map((el) => { return el.value; })
            })
        } else {
            this.setState({ "restriction": [] })
        }

    };


    render() {
        const { name, email, adminId, path } = this.state.formValue;
        const { errors, loader, restriction, Options } = this.state;
        const { isShow } = this.props;
        return (
            <div>
                <Modal
                    show={isShow}
                    onHide={this.handleClose}
                    aria-labelledby="contained-modal-title-vcenter"
                    size="lg"
                    centered
                >
                    <Modal.Header closeButton>
                        <h4 className="modal-title">Edit Admin</h4>
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
                                        value={name}
                                        onChange={this.handleChange}
                                        // error={errors.name}
                                        className={classnames("form-control", {
                                            // invalid: errors.name,
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
                                        // error={errors.email}
                                        className={classnames("form-control", {
                                            // invalid: errors.email,
                                        })}
                                    />
                                    <span className="text-danger">
                                        {errors.email}
                                    </span>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-3">
                                    <label>Restriction</label>
                                </div>
                                <div className="col-md-9">
                                    <Select
                                        value={restriction && restriction.length > 0 ? Options.filter((el) => {

                                            if (restriction.includes(el.value)) {
                                                return el;

                                            }
                                        }) : []}
                                        isMulti
                                        onChange={this.selectorChange}
                                        options={Options}
                                        styles={this.styles} className="border_blue_select basic-multi-select"
                                        classNamePrefix="select"
                                    />
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

export default EditAdminModal
