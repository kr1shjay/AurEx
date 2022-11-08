import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import authLogo from "../../images/authLogo2.png"
import browser from 'browser-detect'


// import action
import { login ,getGeoInfoData} from "../../actions/admin";

// import lib
import { toastAlert } from '../../lib/toastAlert';


const initialFormValue = {
    'email': '',
    'password': '',
    'twoFACode': '',
    'isTerms': false
}



class Login extends Component {
    constructor() {
        super();
        this.state = {
            errors: {},
            showTwoFA: false,
            formvalue: initialFormValue,
            loginHistory: {}

        };
    }




    getGeoInfo = async () => {
        try {
            let { result } = await getGeoInfoData();
            console.log("🚀 ~ file: Login.js ~ line 44 ~ Login ~ getGeoInfo= ~ result", result)

            const browserResult = browser();
            this.setState({
                loginHistory:
                    ({
                        countryName: result.country_name,
                        countryCode: result.country_calling_code,
                        ipaddress: result.ip,
                        region: result.region,
                        broswername: browserResult.name,
                        ismobile: browserResult.mobile,
                        os: browserResult.os,
                    })
            })
        }
        catch (err) {
        }
    };

    componentDidMount() {
        // if (this.props.auth.isAuthenticated) {
        //     this.props.history.push("/dashboard");
        // }
    };

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.auth.isAuthenticated) {
    //         this.props.history.push("/dashboard");
    //     }

    //     if (nextProps.errors) {
    //         this.setState({
    //             errors: nextProps.errors
    //         });
    //     }
    // }

    // onChange = e => {
    //     this.setState({ [e.target.id]: e.target.value });
    // };



    onChange = e => {
       
        const { name, value } = e.target
       
        
       // this.setState({ [e.target.id]: e.target.value });
       
        if (name == 'twoFACode') {
            if (!(value == '' || (/^[0-9\b]+$/.test(value) && value.length <= 6))) {
                return
            }
        }
       // this.setState({...this.state.formvalue,...{[name]:value}})
       this.setState({ formvalue: { ...this.state.formvalue, ...{ [name]: value } }})
    };


    onSubmit = async e => {
        e.preventDefault();
        const { email, password, twoFACode, isTerms } = this.state.formvalue
        const { dispatch, history } = this.props;
        const reqData = {
            // email: this.state.email,
            // password: this.state.password
            // isTerms: isTerms,
            email: email,
            password: password,
            twoFACode: twoFACode,
            loginHistory: this.state.loginHistory

        };
        try {
            const { status, loading, message, error } = await login(reqData, dispatch);
            if (status == 'success') {
                history.push("/dashboard");
                toastAlert('success', message, 'login')
            } else {
                if (error) {
                    this.setState({ errors: error })
                }
                toastAlert('error', message, 'login')
            }
            if (status == 'TWO_FA') {
                this.setState({
                    showTwoFA: true
                })
                // setShowTowFA(true)
                toastAlert('success', message, 'login');
            }
        } catch (err) { }
    };

    componentDidMount() {
        this.getGeoInfo()
    }

    render() {
        const { errors, showTwoFA, twoFACode,formvalue,loginHistory } = this.state;
        console.log("🚀 ~ file: Login.js ~ line 109 ~ Login ~ render ~ formvalue", loginHistory)

        return (
            <div className="container">
                <div className="flex_center">
                <div className="row">
                    <div className="col-md-12 mx-auto">
                        <div className="card shadow-lg">
                        <div className="card-body p-3">
                            <center className="pt-3"><img src={authLogo} className="img-fluid" alt="" /></center>
                            <h2 className="text-center text-primary mt-3">Login</h2>
                            <form noValidate onSubmit={this.onSubmit} className="white">
                                <label htmlFor="email">Email</label>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.email}
                                    error={errors.email}
                                    id="email"
                                    type="email"
                                    name='email'
                                    className={classnames("form-control", {
                                        invalid: errors.email
                                    })}
                                />
                                <span className="text-danger">{errors.email}</span>
                                <br />
                                <label htmlFor="password">Password</label>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.password}
                                    error={errors.password}
                                    id="password"
                                    type="password"
                                    name='password'
                                    className={classnames("form-control", {
                                        invalid: errors.password
                                    })}
                                />
                                <span className="text-danger">{errors.password}</span>

                               
                                {
                                    this.state.showTwoFA && <div className="form-group">
                                         <label htmlFor="Enter 2FA Code">Enter 6 Digit 2FA Code</label>
                                        <input
                                            onChange={this.onChange}
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter 2FA Code"
                                            name="twoFACode"
                                            value={this.state.twoFACode}

                                        />
                                        {/* {validateError.twoFACode && <p className="error-message">{t(validateError.twoFACode)}</p>} */}
                                    </div>
                                }


                                <p className="text-center pb-0 mt-2">
                                    <button
                                        type="submit"
                                        className="btn btn-large btn-primary mt-2 px-5">
                                        Login
                                    </button>
                                </p>
                                <p className="grey-text text-darken-1 d-flex align-items-center justify-content-between block_mob">
                                    Don't have an account? <Link to="/forgot" className="pl-sm-2">Forgot Password?</Link>
                                </p>


                            </form>
                        </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}

export default connect(null, null)(Login);
