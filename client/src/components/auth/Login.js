import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser, getUserFridgeData } from "../../state/actions";
import { clearErrors } from "../../state/actions/errorActions";
import classnames from "classnames";
import {
  Button,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";
class Login extends Component {
  state = {
    email: "",
    password: "",
    errors: {},
    msg: null,
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps) {
    console.log(prevProps);
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === "LOGIN_FAIL") {
        this.setState({ msg: error.msg.msg });
        console.log(this.state.msg);
      } else {
        this.setState({ msg: null });
        console.log(this.state.msg);
      }
    }
    // If authenticated, close modal
    if (this.state.modal) {
      if (isAuthenticated) {
        this.toggle();
      }
    }
  }

  toggle = () => {
    // Clear errors
    this.props.clearErrors();
    this.setState({
      modal: !this.state.modal,
    });
  };

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  onSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password,
    };
    await this.props.loginUser(userData);
    this.props.toggle();
  };
  render() {
    const { errors } = this.state;
    return (
      <>
        <ModalHeader toggle={this.props.toggle}>Login</ModalHeader>
        <ModalBody>
          {this.state.msg ? (
            <Alert color="danger">{this.state.msg}</Alert>
          ) : null}
          <Form noValidate onSubmit={this.onSubmit}>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                onChange={this.onChange}
                value={this.state.email}
                error={errors.email}
                id="email"
                type="email"
                className={classnames("", {
                  invalid: errors.email || errors.emailnotfound,
                })}
              />

              <span className="red-text">
                {errors.email}
                {errors.emailnotfound}
              </span>
              <Label for="password">Password</Label>
              <Input
                onChange={this.onChange}
                value={this.state.password}
                error={errors.password}
                id="password"
                type="password"
                className={classnames("", {
                  invalid: errors.password || errors.passwordincorrect,
                })}
              />
              <span className="red-text">
                {errors.password}
                {errors.passwordincorrect}
              </span>
              <p className="grey-text text-darken-1">
                Don't have an account?
                <Link to="" onClick={this.props.changeModal}>
                  Register
                </Link>
              </p>

              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <Button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem",
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Login
                </Button>
              </div>
            </FormGroup>
          </Form>
        </ModalBody>
      </>
    );
  }
}
Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps, {
  loginUser,
  clearErrors,
  getUserFridgeData,
})(Login);
