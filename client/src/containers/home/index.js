import React, { Component } from "react";
// import { Link } from "react-router-dom";
import "./style.css";
import { Container } from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Fridge from "../../components/Fridge";
import ShoppingList from "../../components/ShoppingList";
import RecipeList from "../../components/RecipeList";
import RecipeForm from "../../components/RecipeForm";
import Pins from "../../components/Pins";
import {
  logoutUser,
  loginUser,
  storeAuthCode,
  loadUser
} from "../../actions";

class Home extends Component {
  state = {
    recipes: [],
    groceryList: [],
    fridge: [],
    newItem: "",
    newAmount: 0,
    recipelink: "",
    userBoards: [],
    togglePins: false,
    boardPins: [],
    accessToken: "",
    activeTab: 1,
    cards: [],
    modal1: false,
    modal2: false,
  };

  componentDidMount() {
    if (this.props.auth.isAuthenticated && localStorage.getItem("jwtToken")) {
      this.props.loadUser(localStorage.getItem("jwtToken"));
    }
  }

  componentDidUpdate(props) {
    //check if user is already logged in and get user data
    console.log("component did update");
    console.log(localStorage.getItem("jwtToken"));
    if (this.props.auth.isAuthenticated && localStorage.getItem("jwtToken")) {
      console.log(localStorage.getItem("jwtToken"));
      // this.props.storeAuthCode(
      //   localStorage.getItem("jwtToken"),
      //   this.props.auth.userId
      // );
    }
  }

  render(props) {
    return (
      <>
        <Pins />
        <Container>
          <RecipeForm />
          <div className="row mb-0">
            <RecipeList />
            <ShoppingList />
            <Fridge />
          </div>
        </Container>
      </>
    );
  }
}
Home.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  userData: state.userData,
});
export default connect(mapStateToProps, {
  logoutUser,
  loginUser,
  storeAuthCode,
  loadUser
})(Home);
