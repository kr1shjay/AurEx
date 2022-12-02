import React, { Component } from "react";
import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions";
import { Link } from "react-router-dom";
import keys from "../../actions/config";
import {faList} from "@fortawesome/free-solid-svg-icons/faList";
import adminLogo from "../../images/adminLogo2.png"
// import Logo from "../../Logo-small.png"
const url = keys.baseUrl;
class Navbar extends Component {

    onLogoutClick = (e) => {
        e.preventDefault();
        this.props.logoutUser();
        window.location.reload();

    };

    render() {
        const { user } = this.props.auth;
        console.log(this.props);
        return (
            <div className="container-fluid p-0">

                <nav className="navbar navbar-expand-lg navbar-dark bg-dark adminNav">

                    <a className="navbar-brand" href="/dashboard" > 
                        <img src={adminLogo} className="img-fluid" alt="" />
                    </a>
                    {/* <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <FontAwesomeIcon icon={faList}/>
                    </button> */}
                    <ul className="navbar-nav navbar_mobile_menu">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="settings"
                                   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Settings
                                </a>
                                <div className="dropdown-menu settings_head_menu" aria-labelledby="settings" id='nav_links'>
                                     <Link to="/profile">
                                       Profile
                                     </Link>
                                    <Link to="/changepassword">
                                       Reset Password
                                     </Link>
                                     <Link to="/site-setting">
                                       Settings
                                     </Link>
                                     <Link to="/login-history">
                                       Login History
                                     </Link>
                                     <Link to="/security">
                                       Google 2FA
                                     </Link>

                                     <a className="nav-link" href="/login"  onClick={this.onLogoutClick}>Logout ({user.name}) <FontAwesomeIcon icon={faSignOutAlt} /> </a>

                                

                                </div>
                            </li>
                           
                        </ul>

                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                     
                    </div>
                </nav>
            </div>
        );
    }
}

Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(Navbar);
