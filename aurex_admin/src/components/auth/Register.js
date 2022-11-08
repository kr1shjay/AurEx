import React, { Component } from "react";
import { Link, withRouter  } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";

class Register extends Component {

    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            password2: "",
            errors: {}
        };
    }

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }
    }

    componentWillReceiveProps(nextProps) {
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
        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2
        };
        this.props.registerUser(newUser, this.props.history);
    };

    render() {
        const { errors } = this.state;
        return (
          <div className="container">
              <div className="row mt-5">
                  <div className="col-md-12 mx-auto mt-5">
                  <div className="card shadow-lg">
                      <div className="card-body p-1">
                      <img style={{
                          paddingLeft:"15%",

                      }} className="text-center text-primary mt-3" src="http://13.233.19.81:5000/Logo-small.png" />
                          <h2 className="text-center text-primary mt-3">Register</h2>
                            <p className="grey-text text-darken-1 d-flex align-items-center justify-content-between block_mob">
                                Already have an account? <Link to="/login">Log in</Link>
                            </p>
                        </div>
                        </div>
                        <form noValidate onSubmit={this.onSubmit} className="white">
                        <label htmlFor="name">Name</label>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.name}
                                    id="name"
                                    type="text"
                                    error={errors.name}
                                    className={classnames("form-control", {
                                        invalid: errors.name
                                    })}
                                />
                                <span className="text-danger">{errors.name}</span>
                                <br/>
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
                                <br/>
                                <label htmlFor="password">Password</label>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.password}
                                    error={errors.password}
                                    id="password"
                                    type="password"
                                    className={classnames("form-control", {
                                        invalid: errors.password
                                    })}
                                />
                                <span className="text-danger">{errors.password}</span>
                                <br/>
                                <label htmlFor="password2">Confirm Password</label>
                              <input
                                    onChange={this.onChange}
                                    value={this.state.password2}
                                    id="password2"
                                    type="password"
                                    className={classnames("form-control", {
                                        invalid: errors.password2
                                    })}
                                />
                                <span className="text-danger">{errors.password2}</span>

                                <p className="text-center pb-0 mt-2">
                                    <button
                                        type="submit"
                                        className="btn btn-large btn-primary mt-2 px-5">
                                        Sign up
                                    </button>
                                </p>

                        </form>
                    </div>
                    </div>
                </div>

        );
    }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { registerUser }
)(withRouter(Register));
