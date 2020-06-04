import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import "./style.css";
import { Button, Row, Col } from "react-materialize";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getUserFridgeData,
  getUserShoppingList,
  setShoppingList,
  setRecipes,
  searchRecipes,
  setDataLoading
} from "../actions";

class RecipeForm extends Component {
  state = {
    recipes: [],
    shoppingList: [],
    fridge: [],
    searchQuery: "",
  };

  componentDidMount() {
    this.setState({
      fridge: this.props.userData.fridge,
      shoppingList: this.props.userData.shoppingList,
    });
  }
  componentDidUpdate(prevProps) {
    if (
      this.state.shoppingList.length !== this.props.userData.shoppingList.length
    ) {
      this.setState({
        fridge: this.props.userData.fridge,
        shoppingList: this.props.userData.shoppingList,
      });
    }
    if (prevProps.userData.recipes !== this.props.userData.recipes) {
      this.setState({ recipes: this.props.userData.recipes });
    }
  }
  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  // updateShoppingListItem = (name, amount) => {
  //   if (this.props.auth.isAuthenticated) {
  //     axios
  //       .put("/api/updateShoppingListItem", {
  //         name: name,
  //         amount: amount,
  //         userId: this.props.auth.userId,
  //       })
  //       .then((response) => {
  //         this.props.getUserShoppingList(this.props.auth.userId);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         alert("Failed to create: " + err.message);
  //       });
  //   } else {
  //     this.props.setShoppingList(this.state.shoppingList);
  //   }
  // };

  handleFormSubmit = () => {
    this.props.setDataLoading()
    this.props.searchRecipes(this.state.searchQuery);
  };

  render(props) {
    return (
      <>
        <Col s={12} className="submit-recipe-button valign-wrapper">
          <Button
            type="submit"
            className="col s2 p-0"
            onClick={this.handleFormSubmit}
          >
            Search
          </Button>
          <input
            name="searchQuery"
            className="col s10 ml-2"
            placeholder="Search for a recipe"
            type="text"
            id="recipe-form-input"
            onChange={this.handleInputChange}
          />
        </Col>
      </>
    );
  }
}

RecipeForm.propTypes = {
  auth: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  userData: state.userData,
});
export default connect(mapStateToProps, {
  getUserFridgeData,
  getUserShoppingList,
  setShoppingList,
  setRecipes,
  searchRecipes,
  setDataLoading
})(RecipeForm);
