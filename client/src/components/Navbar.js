import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PinterestBtn from "./PinterestButton";
import { Button, Modal } from "reactstrap";
import Login from "./auth/Login";
import Logout from "./auth/Logout";
import Register from "./auth/Register";

class Navbar extends Component {
  state = {
    modal: false,
    modalContent: null,
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };
  changeModal = (e) => {
    let modalName = e.target.textContent;
    this.setState({
      modalContent: modalName,
    });
  };

  toggleModal = (e) => {
    let modalName = e.target.textContent;
    if (this.state.ModalContent === modalName) {
      this.setState({
        modalContent: "",
      });
    } else {
      this.setState({
        modalContent: modalName,
      });
    }
    if (!this.state.toggle) {
      this.toggle();
    }
  };
  modalContent = () => {
    switch (this.state.modalContent) {
      case "Login":
        return <Login toggle={this.toggle} changeModal={this.changeModal} />;
      case "Register":
        return <Register toggle={this.toggle} changeModal={this.changeModal} />;
      default:
        return <div></div>;
    }
  };
  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <ul id="nav-mobile" className="right">
        <li>
          <Logout />
        </li>
      </ul>
    );
    const guestLinks = (
      <ul id="nav-mobile" className="right">
        
        <li>
          <Button onClick={this.toggleModal}>Login</Button>
        </li>
        <li>
          <Button onClick={this.toggleModal}>Register</Button>
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
                fontFamily: "monospace",
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
        (
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          {this.modalContent()}
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(Navbar);
