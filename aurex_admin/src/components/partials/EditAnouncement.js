import React from 'react'
import classnames from "classnames";
import { Modal } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from 'react-router-dom';

// import action
import { editanouncement } from '../../actions/anouncementAction';

// import lib
import { toastAlert } from '../../lib/toastAlert'
import isEmpty from '../../lib/isEmpty';
import fileObjectUrl from '../../lib/fileObjectUrl'

const initialFormValue = {
    _id: '',
    content: "",
    endDateTime: "",
    image: "",
}


class AnouncementUpdateModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            formValue: initialFormValue,
            currencyOption: [],
            fiatCurOption: [],
            tokenOption: [],
            errors: {},
        };
        this.handleAvalCoin = this.handleAvalCoin.bind(this);
        this.handleLaunchCoin = this.handleLaunchCoin.bind(this);
        this.handleToken = this.handleToken.bind(this);
        this.handleEditorChange = this.handleEditorChange.bind(this);
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
            borderColor: '#59615f',
            borderRadius: 8,
            borderStyle: 'solid',
            borderWidth: '1px'

        }),
        control: (provided, state) => ({
            ...provided,
            height: '52px',
            borderRadius: 8,
            backgroundColor: "#1a1b1c",
            border: 'none'

        }),
        indicatorsContainer: (provided, state) => ({
            ...provided,
            height: '52px',
            position: 'absolute',
            right: 0,
            top: 0,
            color: '#fff'
        }),
        singleValue: (provided, state) => ({
            ...provided,
            color: "#fff"
        })
    };

    componentWillReceiveProps(nextProps) {
        const { record, imageUrl } = nextProps;
        if (!isEmpty(record)) {
            let formData = {
                '_id': record._id,
                'content': record.content,
                'endDateTime': record.endDateTime,
                'image': isEmpty(record.image) ? "" : imageUrl + record.image
            }
            this.setState({ 'formValue': formData })
        }
    }

    handleChange = e => {
        e.preventDefault();
        let { name, value } = e.target;
        let formData = { ...this.state.formValue, [name]: value };
        this.setState({ formValue: formData });
    }

    handleEditorChange(e) {
        let formData = { ...this.state.formValue, ...{ 'content': e.editor.getData() } };
        this.setState({ formValue: formData });
    }

    handleFile = (e) => {
        e.preventDefault();
        const { name, files } = e.target;
        let formData = { ...this.state.formValue, ...{ [name]: files[0] } };
        this.setState({ createObjectUrl: true, formValue: formData });
    };

    handleAvalCoin(selectedOption) {
        if (selectedOption && selectedOption.length > 0) {
            let formData = {
                ...this.state.formValue,
                'availableCoin': selectedOption.map((el) => { return el.value; })
            };
            this.setState({ formValue: formData });
        } else {
            let formData = {
                ...this.state.formValue,
                'availableCoin': []
            };
            this.setState({ formValue: formData });
        }
    };

    handleLaunchCoin(option) {
        if (option) {
            let formData = {
                ...this.state.formValue,
                'launchCoin': option.value
            };
            this.setState({ formValue: formData });
        } else {
            let formData = {
                ...this.state.formValue,
                'launchCoin': ''
            };
            this.setState({ formValue: formData });
        }
    }

    handleToken(option) {
        if (option) {
            let formData = {
                ...this.state.formValue,
                'currencyId': option.value
            };
            this.setState({ formValue: formData });
        } else {
            let formData = {
                ...this.state.formValue,
                'currencyId': ''
            };
            this.setState({ formValue: formData });
        }
    }


    handleClose = () => {
        const { onHide } = this.props;
        onHide();
        this.setState({ 'formValue': initialFormValue, errors: {} });
    }


    handleSubmit = async e => {
        e.preventDefault();
        const { formValue } = this.state;
        const { fetchData } = this.props;

        const formData = new FormData();
        formData.append('_id', formValue._id)
        formData.append("content", formValue.content);
        formData.append("endDateTime", formValue.endDateTime);
        formData.append("image", formValue.image);
        try {
            const { status, loading, message, error } = await editanouncement(formData);
            if (status == 'success') {
                toastAlert('success', message, 'editanouncement')
                let reqData = {
                    page: 1,
                    limit: 10
                }
                fetchData(reqData)
                this.handleClose()


            } else {
                if (error) {
                    this.setState({ 'errors': error })
                    return
                }
                toastAlert('error', message, 'editanouncement')
            }
        } catch (err) {
        }
    };
    filterPassedTime(time) {
        const currentDate = new Date();
        const selectedDate = new Date(time);
        return currentDate.getTime() < selectedDate.getTime()
    };
    handleDateChange(date) {
        const formData = { ...this.state.formValue, ...{ endDateTime: date } };
        this.setState({ formValue: formData });
        this.setState({ errors: "" });
    }
    render() {
        const { content, endDateTime, image } = this.state.formValue
        const { currencyOption, fiatCurOption, tokenOption, errors } = this.state;

        const { isShow } = this.props;

        return (
            <Modal
                show={isShow}
                onHide={this.handleClose}
                aria-labelledby="contained-modal-title-vcenter"
                size="lg"
                centered
                scrollable={true}
            >
                <Modal.Header closeButton>
                    <h4 className="modal-title">Edit Launchpad Details</h4>
                </Modal.Header>
                <Modal.Body>
                    <form noValidate >





                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="price">Launch Price</label>
                            </div>
                            <div className="col-md-9">
                                <input
                                    name="content"
                                    type="text"
                                    onChange={this.handleChange}
                                    value={content}
                                    error={errors.content}
                                    className={classnames("form-control", {
                                        invalid: errors.content
                                    })}
                                />
                                <span className="text-danger">{errors.content}</span>
                            </div>


                        </div>

                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="password2">End Date</label>
                            </div>
                            <div className="col-md-9">
                                <DatePicker
                                    selected={new Date(endDateTime).getTime()}
                                    onChange={(date) => this.handleDateChange(date)}
                                    minDate={new Date()}
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                    }}
                                />
                                <span className="text-danger">{errors.endTimeStamp}</span>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="password2">select Banner</label>
                            </div>
                            <div className="col-md-9">
                                <label class="custom-file-upload">
                                    <input
                                        name="image"
                                        type="file"
                                        onChange={this.handleFile}
                                        accept="image/x-png,image/gif,image/jpeg, image/png"
                                        aria-describedby="fileHelp"
                                    />
                                    Choose File
                                </label>

                                <img
                                    className="img-fluid proofThumb"
                                    src={fileObjectUrl(image)}
                                />
                                <div>
                                    <span className="text-danger">{errors.image}</span>
                                </div>
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
        )
    }
}

export default AnouncementUpdateModal;