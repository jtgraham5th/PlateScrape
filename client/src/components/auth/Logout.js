import React, { Component } from "react";
import { Button } from "reactstrap";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import PropTypes from "prop-types";

export class Logout extends Component {
  static propTypes = {
    logoutUser: PropTypes.func.isRequired
  };

  render() {
    return (
      <div>
        <Button onClick={this.props.logoutUser} href="">
          Logout
        </Button>
      </div>
    );
  }
}

export default connect(null, { logoutUser })(Logout);
