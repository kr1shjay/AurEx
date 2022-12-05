import React from 'react'
import classnames from "classnames";
import { CKEditor } from 'ckeditor4-react';
import { Modal } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from 'react-router-dom';

// import action
import { addLaunchpad } from '../../actions/launchPad';

// import lib
import { toastAlert } from '../../lib/toastAlert'
import isEmpty from '../../lib/isEmpty';
import fileObjectUrl from '../../lib/fileObjectUrl'

const initialFormValue = {
    'currencyId': '',
    'availableCoin': [],
    'whitePaper': '',
    'launchPrice': '',
    'launchCoin': '',
    'minAmount': '',
    'discount': '',
    'availableSupply': '',
    'maxSupply': '',
    'industry': '',
    'website': '',
    'startTimeStamp': '',
    'endTimeStamp': '',
    'telegram': '',
    'twitter': '',
    'facebook': '',
    'youtube': '',
    'linkedIn': '',
    'content': '',
}

class LaunchpadAddModal extends React.Component {
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

    componentWillReceiveProps(nextProps) {
        const { currencyList } = nextProps;
        if (currencyList && currencyList.length > 0) {
            let option = []
            currencyList && currencyList.length > 0 && currencyList.map((item, key) => {
                if (item.type == 'crypto' || item.type == 'token') {
                    option.push({
                        'label': item.coin,
                        'value': item._id
                    })
                }
            })

            let fiatOption = []
            currencyList && currencyList.length > 0 && currencyList.map((item, key) => {
                if (item.type == 'fiat') {
                    fiatOption.push({
                        'label': item.coin,
                        'value': item._id
                    })
                }
            })

            let tokenOption = [];
            currencyList && currencyList.length > 0 && currencyList.map((item, key) => {
                if (item.type == 'token') {
                    tokenOption.push({
                        'label': item.coin,
                        'value': item._id
                    })
                }
            })

            this.setState({
                'currencyOption': option,
                'fiatCurOption': fiatOption,
                'tokenOption': tokenOption
            })
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
        formData.append("currencyId", formValue.currencyId);
        formData.append("availableCoin", formValue.availableCoin);
        formData.append("whitePaper", formValue.whitePaper);
        formData.append("launchPrice", formValue.launchPrice);
        formData.append("launchCoin", formValue.launchCoin);
        formData.append("discount", formValue.discount);
        formData.append("minAmount", formValue.minAmount);
        formData.append("availableSupply", formValue.availableSupply);
        formData.append("maxSupply", formValue.maxSupply);
        formData.append("industry", formValue.industry);
        formData.append("website", formValue.website);
        formData.append("startTimeStamp", formValue.startTimeStamp);
        formData.append("endTimeStamp", formValue.endTimeStamp);
        formData.append("telegram", formValue.telegram);
        formData.append("twitter", formValue.twitter);
        formData.append("facebook", formValue.facebook);
        formData.append("youtube", formValue.youtube);
        formData.append("linkedIn", formValue.linkedIn);
        formData.append("content", formValue.content);

        try {
            const { status, loading, message, error } = await addLaunchpad(formData);
            if (status == 'success') {
                toastAlert('success', message, 'addlaunchpad')
                this.handleClose()
                fetchData()
            } else {
                if (error) {
                    this.setState({ 'errors': error })
                    return
                }
                toastAlert('error', message, 'addlaunchpad')
            }
        } catch (err) {
        }
    };

    render() {
        const { currencyId, availableCoin, whitePaper, launchPrice, launchCoin, discount, minAmount, availableSupply, maxSupply, industry, website, startTimeStamp, endTimeStamp, telegram, twitter, facebook, youtube, linkedIn, content } = this.state.formValue;
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
                    <h4 className="modal-title">Add Launchpad Details</h4>
                </Modal.Header>
                <Modal.Body>
                    <form noValidate >


                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="tokenname">Token</label>
                            </div>
                            <div className="col-md-9">
                                <Select
                                    value={tokenOption && tokenOption.length > 0 ? tokenOption.filter((el) => {
                                        if (el.value == currencyId) {
                                            return el;
                                        }
                                    }) : []}
                                    options={tokenOption}
                                    onChange={this.handleToken}
                                    styles={this.styles} className="border_blue_select basic-multi-select"
                                />
                                <span className="text-danger">{errors.currencyId}</span>
                            </div>
                            <div className="col-md-12 text-right py-3">
                                <Link to={'/currency'} className="link_green_add">Add Currency</Link>
                            </div>
                          
                        </div>


                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="minimum">White Paper</label>
                            </div>
                            <div className="col-md-9">
                            <label class="custom-file-upload">
                                <input
                                    name="whitePaper"
                                    type="file"
                                    accept="image/x-pdf,image/doc,image/odt"
                                    onChange={this.handleFile}
                                    aria-describedby="fileHelp"
                                />
                            Choose File
                            </label>
                                <span className="text-danger">{errors.whitePaper}</span>
                                {whitePaper &&
                                    <a target="_blank" href={fileObjectUrl(whitePaper)}>view</a>
                                }
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="price">Launch Price</label>
                            </div>
                            <div className="col-md-9">
                                <input
                                    name="launchPrice"
                                    type="text"
                                    onChange={this.handleChange}
                                    value={launchPrice}
                                    error={errors.launchPrice}
                                    className={classnames("form-control", {
                                        invalid: errors.launchPrice
                                    })}
                                />
                                <span className="text-danger">{errors.launchPrice}</span>
                            </div>

                           
                        </div>

                        <div className="row mt-2">
                        <div className="col-md-3">
                                <label htmlFor="price">Launch Coin</label>
                            </div>
                            <div className="col-md-9">
                                <Select
                                    value={fiatCurOption && fiatCurOption.length > 0 ? fiatCurOption.filter((el) => {
                                        if (el.value == launchCoin) {
                                            return el;
                                        }
                                    }) : []}
                                    options={fiatCurOption}
                                    onChange={this.handleLaunchCoin}
                                    styles={this.styles} className="border_blue_select basic-multi-select"
                                />
                                <span className="text-danger">{errors.launchCoin}</span>
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="password2">Minimum Purchase Amount</label>
                            </div>
                            <div className="col-md-9">
                                <input
                                    name="minAmount"
                                    type="text"
                                    value={minAmount}
                                    onChange={this.handleChange}
                                    className={classnames("form-control", {
                                        invalid: errors.minAmount
                                    })}
                                />
                                <span className="text-danger">{errors.minAmount}</span>
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="password2">Discount(%)</label>
                            </div>
                            <div className="col-md-9">
                                <input
                                    name="discount"
                                    type="text"
                                    value={discount}
                                    onChange={this.handleChange}
                                    className={classnames("form-control", {
                                        invalid: errors.discount
                                    })}
                                />
                                <span className="text-danger">{errors.discount}</span>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="symbol">Available Currency</label>
                            </div>
                            <div className="col-md-9">
                                <Select
                                    name="availableCoin"
                                    value={currencyOption && currencyOption.length > 0 ? currencyOption.filter((el) => {
                                        if (availableCoin.includes(el.value)) {
                                            return el;
                                        }
                                    }) : []}
                                    isMulti
                                    options={currencyOption}
                                    onChange={this.handleAvalCoin}
                                    classNamePrefix="select"
                                    styles={this.styles} className="border_blue_select basic-multi-select"
                                />
                                <span className="text-danger">{errors.availableCoin}</span>
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="password2">Token Available to Sale</label>
                            </div>
                            <div className="col-md-9">
                                <input
                                    name="availableSupply"
                                    type="text"
                                    value={availableSupply}
                                    onChange={this.handleChange}
                                    className={classnames("form-control", {
                                        invalid: errors.availableSupply
                                    })}
                                />
                                <span className="text-danger">{errors.availableSupply}</span>
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="password2">Token Max Supply</label>
                            </div>
                            <div className="col-md-9">
                                <input
                                    name="maxSupply"
                                    type="text"
                                    value={maxSupply}
                                    onChange={this.handleChange}
                                    className={classnames("form-control", {
                                        invalid: errors.maxSupply
                                    })}
                                />
                                <span className="text-danger">{errors.maxSupply}</span>
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="password2">Industry</label>
                            </div>
                            <div className="col-md-9">
                                <input
                                    name="industry"
                                    type="text"
                                    value={industry}
                                    onChange={this.handleChange}
                                    className={classnames("form-control", {
                                        invalid: errors.industry
                                    })}
                                />
                                <span className="text-danger">{errors.industry}</span>
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="password2">Website</label>
                            </div>
                            <div className="col-md-9">
                                <input
                                    name="website"
                                    type="text"
                                    value={website}
                                    onChange={this.handleChange}
                                    className={classnames("form-control", {
                                        invalid: errors.website
                                    })}
                                />
                                <span className="text-danger">{errors.website}</span>
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="password2">Start Date</label>
                            </div>
                            <div className="col-md-9">
                                <DatePicker
                                    selected={startTimeStamp}
                                    onChange={(date) => {
                                        let newDate = new Date(date)
                                        newDate.setMilliseconds(0)
                                        let formData = {
                                            ...this.state.formValue,
                                            'startTimeStamp': newDate.getTime()
                                        };
                                        this.setState({ formValue: formData });
                                    }}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    minDate={new Date()}
                                />

                                <span className="text-danger">{errors.startTimeStamp}</span>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="password2">End Date</label>
                            </div>
                            <div className="col-md-9">
                                <DatePicker
                                    selected={endTimeStamp}
                                    onChange={(date) => {
                                        let newDate = new Date(date)
                                        newDate.setMilliseconds(0)
                                        let formData = {
                                            ...this.state.formValue,
                                            'endTimeStamp': newDate.getTime()
                                        };
                                        this.setState({ formValue: formData });
                                    }}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    minDate={new Date()}
                                />
                                <span className="text-danger">{errors.endTimeStamp}</span>
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="password2">Telegram Link</label>
                            </div>
                            <div className="col-md-9">
                                <input
                                    name="telegram"
                                    type="text"
                                    value={telegram}
                                    onChange={this.handleChange}
                                    className={classnames("form-control", {
                                        invalid: errors.telegram
                                    })}
                                />
                                <span className="text-danger">{errors.telegram}</span>
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="password2">Twitter Link</label>
                            </div>
                            <div className="col-md-9">
                                <input
                                    name="twitter"
                                    type="text"
                                    value={twitter}
                                    onChange={this.handleChange}
                                    className={classnames("form-control", {
                                        invalid: errors.twitter
                                    })}
                                />
                                <span className="text-danger">{errors.twitter}</span>
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="password2">Facebook Link</label>
                            </div>
                            <div className="col-md-9">
                                <input
                                    name="facebook"
                                    type="text"
                                    value={facebook}
                                    onChange={this.handleChange}
                                    className={classnames("form-control", {
                                        invalid: errors.facebook
                                    })}
                                />
                                <span className="text-danger">{errors.facebook}</span>
                            </div>
                        </div>


                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="password2">Youtube Link</label>
                            </div>
                            <div className="col-md-9">
                                <input
                                    name="youtube"
                                    type="text"
                                    value={youtube}
                                    onChange={this.handleChange}
                                    className={classnames("form-control", {
                                        invalid: errors.youtube
                                    })}
                                />
                                <span className="text-danger">{errors.youtube}</span>
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="password2">LinkedIn Link</label>
                            </div>
                            <div className="col-md-9">
                                <input
                                    name="linkedIn"
                                    type="text"
                                    value={linkedIn}
                                    onChange={this.handleChange}
                                    className={classnames("form-control", {
                                        invalid: errors.linkedIn
                                    })}
                                />
                                <span className="text-danger">{errors.linkedIn}</span>
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-3">
                                <label htmlFor="content">Content</label>
                            </div>
                            <div className="col-md-9">
                                <CKEditor
                                    config={{
                                        extraAllowedContent: 'div(*)',
                                        allowedContent: true,
                                        height: 500,
                                    }}
                                    initData={content}
                                    onChange={this.handleEditorChange}
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
                        className="btn btn-primary"
                    >
                        Submit
                    </button>
                </Modal.Footer>



            </Modal>
        )
    }
}

export default LaunchpadAddModal;





