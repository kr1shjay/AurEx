import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { CKEditor } from 'ckeditor4-react';
import Select from 'react-select';

// import component
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";

// import action
import { allSubscribed, sendNews } from "../../actions/newsLetterAction";

// import lib
import { toastAlert } from '../../lib/toastAlert'
import isEmpty from '../../lib/isEmpty'

const initialFormValue = {
    'subscribedId': [],
    'message': ''
}

class Newsletter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formValue: initialFormValue,
            subscribed: [],
            errors: {},
            loader: false
        };

        this.handleEditorChange = this.handleEditorChange.bind(this);
        this.fetchSubscribed = this.fetchSubscribed.bind(this);
        this.handleSubscriber = this.handleSubscriber.bind(this);
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
    componentDidMount() {
        this.fetchSubscribed()
    };
    
    async fetchSubscribed() {
        try {
            const { status, result } = await allSubscribed()
            if (status == 'success') {
                let subscribed = [];
                result.map((item, i) => {
                    subscribed.push({ 'label': item.email, 'value': item._id });
                });
                this.setState({ subscribed })
            }
        } catch (err) {
        }
    }

    handleSubscriber(selectedOption) {
        
        let formData = this.state.formValue;
        if (selectedOption && selectedOption.length > 0) {
            formData['subscribedId'] = selectedOption.map((el) => { return el.value; })
        } else {
            formData['subscribedId'] = []
        }
        this.setState({ formValue: formData })
        if (!isEmpty(selectedOption)) {
            this.setState({ errors: {} })
        }
    }

    handleEditorChange(e) {
        let formData = { ...this.state.formValue, 'message': e.editor.getData() };
        this.setState({ formValue: formData });
        if (!isEmpty(e)) {
            this.setState({ errors: {} })
        }
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
     }

    handleSubmit = async e => {
        e.preventDefault();
        const { subscribedId, message } = this.state.formValue
        let reqData = {
            'subscribedId': subscribedId,
            'message': message
        }
        try {
            this.setState({ "loader": true })
            const { status, loading, message, errors } = await sendNews(reqData);
            this.setState({ "loader": loading })
            if (status == 'success') {
                this.setState({ formValue: initialFormValue });
                toastAlert('success', message, 'newsLetter');
                await this.sleep(3000)
                window.location.reload()
            } else {
                if (!isEmpty(errors)) {
                    this.setState({ errors: errors })
                }
                toastAlert('error', message, 'newsLetter');
            }
        } catch (err) {
        }
    }

    render() {
        const { subscribed, errors, loader } = this.state;
        const { subscribedId, message } = this.state.formValue
        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <h3 className="mt-2 text-secondary">Newletter Details</h3>
                            <form noValidate onSubmit={this.handleSubmit} id="send-email">

                                <div className="row mt-2">
                                    <div className="col-md-3">
                                        <label htmlFor="email">Email</label>
                                    </div>
                                    <div className="col-md-9">
                                        <Select
                                            value={subscribed && subscribed.length > 0 ? subscribed.filter((el) => {
                                                if (subscribedId.includes(el.value)) {
                                                    return el;
                                                }
                                            }) : []}
                                            isMulti
                                            name="subscribedId"
                                            options={subscribed}
                                            onChange={this.handleSubscriber}
                                            styles={this.styles} className="border_blue_select basic-multi-select"
                                            classNamePrefix="select"
                                        />
                                        <span className="text-danger">{errors.email}</span>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-3">
                                        <label htmlFor="content">Message</label>
                                    </div>
                                    <div className="col-md-9">
                                    <span className="text-danger">{errors.message}</span>
                                        <CKEditor
                                            config={{
                                                extraAllowedContent: 'div(*)',
                                                allowedContent: true,
                                                height: 500,
                                            }}
                                            initData={message}
                                            onChange={this.handleEditorChange}
                                        />
                                    </div>
                                </div>
                            </form>
                            <br />
                            <div className="modal-footer">
                                {/* <button type="button" className="btn btn-secondary">Close</button> */}
                                <button
                                    form="send-email"
                                    type="submit"
                                    className="btn btn-primary"
                                    onClick={this.handleSubmit}>
                                    {loader && <i className="fas fa-spinner fa-spin"></i>}
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

Newsletter.propTypes = {
    newsletteremail: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default Newsletter;
