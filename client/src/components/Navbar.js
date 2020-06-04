import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Modal } from "reactstrap";
import { Button, Navbar, Icon } from "react-materialize";
import Login from "./auth/Login";
import Logout from "./auth/Logout";
import Register from "./auth/Register";

class AppNavbar extends Component {
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
      <>
        <Button onClick={this.toggleModal}>Login</Button>
        <Button onClick={this.toggleModal}>Register</Button>
      </>
    );

    return (
      <>
        <Navbar
          alignLinks="right"
          brand={
            <Link to="/" className="brand-logo white-text brand-font">
              {/* <FontAwesomeIcon
              icon={["fas", "drumstick-bite"]}
              className="mr-3"
            /> */}
              <Icon small>shopping_cart</Icon>
              PlateScrape
            </Link>
          }
          className="teal darken-4 pr-4 pl-4"
          id="mobile-nav"
          menuIcon={<Icon>menu</Icon>}
          sidenav={
            <>
              <li>
                <nav class="teal darken-4 pr-4 pl-4 full-width" >
                  <a className="brand-logo white-text brand-font ">
                    <Icon small>shopping_cart</Icon>
                    PlateScrape
                  </a>
                </nav>
              </li>
              <li className="p-2">
                <button class="btn-large full-width" onClick={this.toggleModal}>Login</button>
              </li>
              <li className="p-2">
                <button class="btn-large full-width" onClick={this.toggleModal}>Register</button>
              </li>
            </>
          }
        >
          {isAuthenticated ? authLinks : guestLinks}
        </Navbar>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          {this.modalContent()}
        </Modal>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(AppNavbar);
