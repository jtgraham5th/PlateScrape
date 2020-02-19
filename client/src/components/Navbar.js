import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PinterestBtn from "./PinterestButton";
import Login from "./auth/Login";
import Logout from "./auth/Logout";
import Register from "./auth/Register";

class Navbar extends Component {
  state = {
    isOpen: false
  };

  static propTypes = {
    auth: PropTypes.object.isRequired
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;
    console.log(isAuthenticated);
    console.log(this.props);

    const authLinks = (
      <ul id="nav-mobile" className="right">
        <li>
          <PinterestBtn />
        </li>
        <li>
          <Logout />
        </li>
      </ul>
    );
    const guestLinks = (
      <ul id="nav-mobile" className="right">
        <li>
          <PinterestBtn />
        </li>
        <li>
          <Login />
        </li>
        <li>
          <Register />
        </li>
      </ul>
    );

    return (
      <div className="navbar-fixed">
        <nav className="z-depth-0">
          <div className="nav-wrapper teal darken-4 pr-4 pl-4">
            <Link
              to="/"
              style={{
                fontFamily: "monospace"
              }}
              className="s5 brand-logo white-text"
            >
              <FontAwesomeIcon
                icon={["fas", "drumstick-bite"]}
                className="mr-3"
              />
              PlateScrape
            </Link>
            {isAuthenticated ? authLinks : guestLinks}
          </div>
        </nav>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, null)(Navbar);
