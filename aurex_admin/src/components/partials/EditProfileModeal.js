import React from "react";
import classnames from "classnames";
import { Modal, Form } from "react-bootstrap";

// import lib
import fileObjectUrl from '../../lib/fileObjectUrl'
import isEmpty from '../../lib/isEmpty'
import { editProfile } from "../../actions/admin";
import { toastAlert } from '../../lib/toastAlert'
class EditProfileModel extends React.Component {
    constructor() {
        super()
        this.state = {
            copied: false,
            name: ''
        }
        this.editAdminRecord = this.editAdminRecord.bind(this)

    }
    copyText = (e) => {
        e.preventDefault()
    }
    handleClose = () => {
        const { onHide } = this.props;
        onHide();
        // this.setState({ 'formValue': initialValue, errors: {} });
    }
    componentWillReceiveProps() {
        this.setState({
            name: this.props.recorddata.name
        })
    }
    handleChange = (e) => {
        const { name, value } = e.target;
         if (/[^a-zA-Z]/.test(value)) return
        this.setState({ ...this.state.name, ...{ [name]: value } })
    }
    editAdminRecord = async (e) => {
        e.preventDefault()
        let data = {
            name: this.state.name
        }
        let { status, message } = await editProfile(data)
        if (status) {
            toastAlert('success', message)
            const { onHide, fetchData } = this.props;
            onHide();
            fetchData()

        } else {
            toastAlert('error', message)
        }

    }
    render() {
        const { name } = this.state;
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
                        <h4 className="modal-title">Edit</h4>
                    </Modal.Header>
                    <Modal.Body>
                        <Form className="form-group">
                            <div className="row">
                                <div className="col-md-3">
                                <label>Name</label>
                                </div>
                                <div className="col-md-9">
                            <input type="text" name="name" class="form-control" value={name} onChange={this.handleChange} />
                                    
                                </div>
                            </div>
                           

                        </Form>
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
            <button className="btn btn-primary float-center ml-2 mr-2" onClick={this.editAdminRecord}>Edit</button>
          </Modal.Footer>
                    {/* <Modal.Footer>
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
                    </Modal.Footer> */}
                </Modal>
            </div >
        );
    }
}

export default EditProfileModel
