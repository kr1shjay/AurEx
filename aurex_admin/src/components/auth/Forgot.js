import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { forgotUser } from "../../actions/authActions";
import classnames from "classnames";
import authLogo from "../../images/authLogo2.png"


class Forgot extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            errors: {}
        };
    }

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }

        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();
        const userData = {
            email: this.state.email,
        };
        this.props.forgotUser(userData);
    };

    render() {
        const { errors } = this.state;
        return (
            <div className="container">
                 <div className="flex_center">
                <div className="row">
                    <div className="col-md-12 mx-auto card shadow-lg">
                        <div className="card-body px-1 py-3">
                        <img style={{
                            paddingLeft:"15%",

                        }} className="text-center text-primary mt-3" src={authLogo} />
                            <h2 className="text-center text-primary mt-3">Forgot Password</h2>
                            <form noValidate onSubmit={this.onSubmit} className="white">
                                <label htmlFor="email">Email</label>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.email}
                                    error={errors.email}
                                    id="email"
                                    type="email"
                                    className={classnames("form-control", {
                                        invalid: errors.email
                                    })}
                                />
                                <span className="text-danger">{errors.email}</span>
                                <p className="text-center pb-0 mt-2">
                                    <button
                                        type="submit"
                                        className="btn btn-large btn-primary mt-2 px-5">
                                        Forgot
                                    </button>
                                </p>
                                <p className="grey-text text-darken-1 d-flex align-items-center justify-content-between block_mob">
                                     <Link to="/login">Login</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}

Forgot.propTypes = {
    forgotUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});
export default connect(
    mapStateToProps,
    { forgotUser }
)(Forgot);
