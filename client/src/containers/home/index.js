import React, { Component } from "react";
import axios from "axios";
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
import { logoutUser, loginUser, getAuthToken, storeAuthToken, loadUser } from "../../actions";

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

  async componentDidMount() {
    // Load User Data
    if (this.props.auth.isAuthenticated && localStorage.getItem("jwtToken")) {
      await this.props.loadUser(localStorage.getItem("jwtToken"));

      // -- GET AUTHORIZATION CODE --
      let params = new URLSearchParams(window.location.href);
      let pinterestAuthCode = params.get("code");
      const { isAuthenticated, pinterestToken } = this.props.auth;
      console.log({ pinterestAuthCode, isAuthenticated, pinterestToken });

      //if user is logged in and does NOT have a pinterest auth Token
      if (isAuthenticated && !pinterestToken && pinterestAuthCode) {
        console.log("user has no pinterest token");
        await this.props.getAuthToken(pinterestAuthCode);
      }

      //if user is logged in and does have a pinterest auth Token
      if (isAuthenticated && pinterestToken) {
        console.log("user already has a pinterest Token");
      }
    }
  }  

  componentDidUpdate(props) {
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
  storeAuthToken,
  loadUser,
  getAuthToken
})(Home);
