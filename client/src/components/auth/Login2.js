import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { loginUser, getUserFridgeData } from "../../state/actions";
import { clearErrors } from "../../state/actions/errorActions";
import { Modal, Button, TextInput } from "react-materialize";

const Login = () => {
  // componentDidUpdate = (prevProps) => {
  //   console.log(prevProps);
  //   const { error, isAuthenticated } = this.props;
  //   if (error !== prevProps.error) {
  //     // Check for register error
  //     if (error.id === "LOGIN_FAIL") {
  //       this.setState({ msg: error.msg.msg });
  //       console.log(this.state.msg);
  //     } else {
  //       this.setState({ msg: null });
  //       console.log(this.state.msg);
  //     }
  //   }
  // If authenticated, close modal
  // if (this.state.modal) {
  //   if (isAuthenticated) {
  //     this.toggle();
  //   }
  // }
  // }

  // toggle = () => {
  //   // Clear errors
  //   this.props.clearErrors();
  //   this.setState({
  //     modal: !this.state.modal,
  //   });
  // };

  // onChange = (e) => {
  //   e.preventDefault()
  //   console.log(e.target, e.target.id, e.target.value)
  //   this.setState({ [e.target.id]: e.target.value });
  // };
  // onSubmit = async (e) => {
  //   e.preventDefault();
  //   const userData = {
  //     email: this.state.email,
  //     password: this.state.password,
  //   };
  //   await this.props.loginUser(userData);
  //   this.props.toggle();
  // };

  const [emailValue, setEmail] = React.useState("");
  const [passwordValue, setPassword] = React.useState("");

  const emailRef = React.useRef();
  const passwordRef = React.useRef();

  const onChangeHandler = (event) => {
    // setInputValue(event.target.value);
    console.log(emailRef.current.value);
  };
  const submit = async () => {
    setPassword(passwordRef.current.value);
    setEmail(emailRef.current.value);
  };
  // const { errors } = this.state;
  return (
    <>
      <Modal
        actions={[
          <Button flat modal="close" node="button" waves="green">
            Close
          </Button>,
        ]}
        header="Login"
        open={false}
        trigger={<Button node="button">Login</Button>}
      >
        {/* <ModalBody> */}
        {/* {this.state.msg ? (
            <div className="red white-text">{this.state.msg}</div>
          ) : null} */}
        {/* <Form noValidate onSubmit={this.onSubmit}>
        {/* <FormGroup> */}
        <label for="email">Email</label>
        <input
          s={10}
          ref={emailRef}
          label="email"
          id="email"
          type="email"
          onChange={onChangeHandler}
          // className={classnames("", {
          //   invalid: errors.email || errors.emailnotfound,
          // })}
        />
        {}
        {/* <span className="red-text">
                {errors.email}
                {errors.emailnotfound}
              </span> */}
        <label for="password">Password</label>
        <input
          ref={passwordRef}
          // error={errors.password}
          id="password"
          type="password"
          // className={classnames("", {
          //   invalid: errors.password || errors.passwordincorrect,
          // })}
        />
        {/* <span className="red-text">
                {errors.password}
                {errors.passwordincorrect}
              </span>
              <p className="grey-text text-darken-1">
                Don't have an account?
                <Link to="" onClick={this.props.changeModal}>
                  Register
                </Link>
              </p> */}

        {/* <div className="col s12" style={{ paddingLeft: "11.250px" }}> */}
          <button
            style={{
              width: "150px",
              borderRadius: "3px",
              letterSpacing: "1.5px",
              marginTop: "1rem",
            }}
            onClick={submit}
            type="submit"
            className="btn modal-close btn-large waves-effect waves-light hoverable blue accent-3"
          >
            Login
          </button>
        {/* </div> */}
        {/* </FormGroup>
          </Form> */}
        {/* </ModalBody> */}
      </Modal>
    </>
  );
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
