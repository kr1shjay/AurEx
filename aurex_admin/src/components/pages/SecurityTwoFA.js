import React from 'react'
import Navbar from '../partials/Navbar'
import Sidebar from '../partials/Sidebar'
import { TwoFAAction, disabled2faCode, updateTwoFA } from '../../actions/securityTwoFA.Action'
import isEmpty from 'is-empty'
import { toastAlert } from '../../lib/toastAlert';
import Checkbox from 'rc-checkbox';
import { Container, Button } from 'react-bootstrap'
import { CopyToClipboard } from 'react-copy-to-clipboard';

const initialFormValue = {
    code: '',
    Password: ''
}

class google2Fa extends React.Component {
    constructor() {
        super()
        this.state = {
            secretData: '',
            CheckValue: false,
            loader: '',
            validateError: {},
            formValue: initialFormValue
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleCheckBox = this.handleCheckBox.bind(this);
        this.enableTwoFa = this.enableTwoFa.bind(this)
        this.disableTwoFa = this.disableTwoFa.bind(this);
    }
    async fetchTwoFA() {
        try {
            let { status, result } = await TwoFAAction();
            if (result) {
                this.setState({
                    secretData: result
                })
            }
        }
        catch (err) {

        }

    }

    componentDidMount() {
        this.fetchTwoFA();
    }

    handleChange = (e) => {
        e.preventDefault();

        const { name, value } = e.target;

        this.setState({ formValue: { ...this.state.formValue, ...{ [name]: value } } })
        if (!isEmpty(value)) {
            this.setState({ validateError: {} })
        }

    }
    handleCheckBox = (e) => {
        const { name, checked } = e.target
        this.setState({
            CheckValue: checked
        })

    }
    enableTwoFa = async (e) => {
        let { secretData, CheckValue } = this.state
        const { code, Password } = this.state.formValue
        e.preventDefault();
        this.setState({
            loader: true
        })

        let reqData = {
            "secret": secretData.secret,
            "uri": secretData.uri,
            "code": code,
            "Password": Password,
            "CheckValue": CheckValue,
        }
        try {
            let { status, message, result, loading, error } = await updateTwoFA(reqData)
            if (status == 'success') {
                this.setState({
                    loader: loading,
                    code: '',
                    Password: '',
                    secretData: result
                })
                toastAlert('success', message, 'twoFA')


            } else {
                toastAlert('error', message, 'twoFA')
            }
            if (error) {
                this.setState({
                    validateError: error
                })
            }

        }
        catch (err) {

        }
    }


    disableTwoFa = async (e) => {
        let { secretData, CheckValue } = this.state
        const { code, Password } = this.state.formValue
        e.preventDefault()

        this.setState({
            loader: true
        })
        let reqData = {
            "secret": secretData.secret,
            "uri": secretData.uri,
            "code": code,
            "Password": Password

        }



        try {
            const { status, loading, error, message, result } = await disabled2faCode(reqData);
            if (status == 'success') {
                this.setState({
                    code: '',
                    Password: '',
                    secretData: result
                })
                toastAlert('success', message, 'twofa')
            } else {
                toastAlert('error', message, 'twofa')
            }

            if (!isEmpty(error)) {
                this.setState({
                    validateError: error
                })
            }
        } catch (err) { }
    }

    render() {
        let { secretData, code, Password, CheckValue, validateError, formValue } = this.state;
        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
        
                                <div xs={12} sm={12} md={6} lg={6}>
                                    <div className="twoFAForm">
                                        <div className="row mt-2">
                                            <div className="col-md-12">
                                                <h3 className="mt-2 text-secondary">Google Authenticate</h3>

                                                <Container>
                                                <form className="contact_form mb-0">
                                                <div class="row mt-2">
                                                <div class="col-md-3">
                                                <label for="name">Scan the QR Code</label>
                                                </div>
                                                <div class="col-md-6">
                                                <div className="qrScanCode">
                                                            <img
                                                                src={secretData && secretData.imageUrl}
                                                                alt="" className="img-fluid" />
                                                        </div>
                                                </div>
                                                </div>

                                                <div class="row mt-2">
                                                <div class="col-md-3">
                                                <label for="name">Your 32 Digit Security Code</label>
                                                </div>
                                                <div class="col-md-6">

                                                <div class="input-group input_grp_width disabledGroup">
                                                <input
                                                                        type="text"
                                                                        class="form-control"
                                                                        value={secretData && secretData.secret}
                                                                        disabled
                                                                    />
                                                    <div class="input-group-append">
                                                        <span class="input-group-text" id="basic-addon2"><CopyToClipboard
                                                                            text={secretData && secretData.secret}
                                                                            onCopy={() => { toastAlert("success", "Copied!", 'twoFa') }}
                                                                        >
                                                                            <a href="#" className="btn btnType1 py-0 my-0 px-2">
                                                                                <i class="fa fa-copy"></i>
                                                                            </a>
                                                                        </CopyToClipboard></span>
                                                    </div>
                                                    </div>

                            
                                                </div>
                                                </div>

                                                <div class="row mt-2">
                                                <div class="col-md-3">
                                                <label for="name">Enter 6 Digit 2FA Code</label>
                                                </div>
                                                <div class="col-md-6">
                                                <input type="text" className="form-control"
                                                                    name="code"
                                                                    value={code}
                                                                    onChange={this.handleChange}
                                                                />
                                                                {validateError.code && <p className="error-message" style={{ color: 'red' }}>{validateError.code}</p>}
                                                </div>
                                                </div>

                                                <div class="row mt-2">
                                                <div class="col-md-3">
                                                <label for="name">Enter your Password</label>
                                                </div>
                                                <div class="col-md-6">
                                                <input type="password" className="form-control"
                                                                    name="Password"
                                                                    value={Password}
                                                                    onChange={this.handleChange}

                                                                />
                                                                {validateError.Password && <p className="error-message" style={{ color: 'red' }}>{validateError.Password}</p>}

                                                </div>
                                                </div>
                                                <div class="row mt-2">
                                                    <div className='col-md-6'>
                                                    <div className="form-check">
                                                                {secretData && secretData.twoFaStatus == "disabled" && <div> <Checkbox
                                                                    name="CheckValue"
                                                                    onChange={this.handleCheckBox}
                                                                    checked={CheckValue}
                                                                    hidden={true}
                                                                /> <label className="form-check-label" for="flexCheckDefault">  I have backup the code</label>


                                                                </div>}
                                                            </div>
                                                    </div>
                                                </div>
                                                <div className='row mt-2'>
                                                    <div className='col-12'>
                                                    <div className="form-group mb-0" style={{ width: '100px', marginTop: '20px' }}>

{
    secretData && secretData.twoFaStatus == "disabled" &&
    <Button variant="primary" size="sm"

        className="btn btn-primary py-2 w-100"
        type="button"
        onClick={this.enableTwoFa}
    >
        Enable


    </Button>
}
{
    secretData && secretData.twoFaStatus == "enabled" && <Button variant="primary" size="sm"
        className="btn btn-primary py-2 w-100"
        type="button"
        onClick={this.disableTwoFa}
    >
        Disable

    </Button>
}

</div>
                                                    </div>
                                                </div>
                                                </form>

                                                   
                                                 

                                                </Container>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                          
                        </div>
                    </div>


                </div>
            </div >
        );
    }

}

export default google2Fa