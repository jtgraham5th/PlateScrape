import React, { Component } from "react";
import { renderToStaticMarkup } from "react-dom/server";
// import { Link } from "react-router-dom";
// import "./style.css";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import { Col, Button, Preloader } from "react-materialize";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  setRecipes,
  setShoppingList,
  getUserShoppingList,
  getSuggestedRecipes,
  setDataLoading,
  addCategory,
  dataLoaded,
} from "../actions";
import axios from "axios";
import MyRecipes from "./MyRecipes";

class RecipeList extends Component {
  state = {
    recipes: [],
    shoppingList: [],
    toggleModal: false,
  };

  async componentDidMount() {
    await this.props.getSuggestedRecipes();
  }

  componentDidUpdate(prevProps) {
    const { recipes } = this.props.userData;
    if (prevProps.userData.recipes !== recipes) {
      this.setState({ recipes: recipes });
    }
  }
  renderTooltip(recipe) {
    return recipe.ingredients.map((ingredient, e) => (
      <small className="left-align">
        {ingredient.quantity} {ingredient.unit} {ingredient.name}
      </small>
    ));
  }
  saveNewShoppingListItem = (newIngredient) => {
    const { isAuthenticated, userId } = this.props.auth;

    if (isAuthenticated) {
      axios
        .post("/api/shoppingListItem", {
          newIngredient: newIngredient,
          userId: userId,
        })
        .then((response) => {
          this.props.getUserShoppingList(userId);
        })
        .catch((err) => {
          console.log(err);
          alert("Failed to create: " + err.message);
        });
    } else {
      this.props.setShoppingList(this.state.shoppingList);
    }
  };
  convertToDecimal = (quantity, unit) => {
    console.log(unit, "---------");
    let result = quantity;
    // if (quantity.includes("/")) {
    //   let split = quantity.split("/");
    //   result = parseInt(split[0], 10) / parseInt(split[1], 10);
    //   console.log(result, "quantity as a decimal");
    // }
    //Convert CUPS to OUNCES
    if (unit === "cup" || unit === "cups") {
      result = +parseFloat(result * 8).toFixed(2);
      console.log(result, "cups to oz");
      //Converts TSP to TABLESPOONS to OUNCES
    } else if (unit === "tsp" || unit === "teaspoons") {
      result = +parseFloat(result / 3 / 2).toFixed(2);
      console.log(result, "tsp to oz");
      //Converts TABLESPOONS to OUNCES
    } else if (unit === "tbsp" || unit === "tablespoons") {
      result = +parseFloat(result / 2).toFixed(2);
      console.log(result, "tbsp to oz");
    } else if (!unit) {
      result = parseFloat(quantity);
    } else if (!quantity) {
      result = 0;
    } else if (isNaN(quantity)) {
      result = 0;
    }
    console.log(result);
    return result;
  };
  addToList = (ingredients) => {
    ingredients.map((ingredient, i) => {
      console.log(ingredient);
      /* check to see if ingredient already exisit in the shoppingList*/
      if (
        !this.state.shoppingList.some(
          (e) => e.name === ingredient.name.toLowerCase()
        )
      ) {
        console.log("included");
        let shoppingList = this.state.shoppingList;
        let newIngredient = {
          name: ingredient.name.toLowerCase(),
          quantity: this.convertToDecimal(ingredient.quantity, ingredient.unit),
          unit: "oz",
          category: ingredient.category,
          enoughInFridge: false,
        };
        shoppingList.push(newIngredient);
        this.setState({
          shoppingList,
        });
        this.saveNewShoppingListItem(newIngredient);
        if (!this.props.userData.categories.includes(ingredient.category)) {
          this.props.addCategory(ingredient.category);
          console.log(this.props.userData.categories)
        } 
      } else {
        let key = ingredient.name;
        this.setState((prevState) => ({
          shoppingList: prevState.shoppingList.map((el) =>
            el.name === key
              ? {
                  ...el,
                  quantity: el.quantity + parseFloat(ingredient.quantity),
                }
              : el
          ),
        }));
        // this.updateShoppingListItem(ingredient.name, ingredient.amount);
      }
      console.log(this.state.shoppingList);
    });
  };
  addRecipe = (recipe) => {
    const { title, thumbnail, href, ingredients } = recipe;
    const url = encodeURIComponent(href);
    this.props.setDataLoading();
    axios.get(`/api/recipes/${url}`).then((response) => {
      // if (response.data.ingredients.length < 1) {
      // if (ingredients.length < 1) {
      //   this.toggleModal();
      // } else {
      console.log(response.data);
      this.props.dataLoaded();
      let recipes = this.state.recipes;
      let newRecipe = {
        URL: href,
        name: title,
        // ingredients: response.data.ingredients,
        ingredients: ingredients,
        image: thumbnail,
      };
      recipes.push(newRecipe);
      this.setState({
        recipes,
      });
      this.props.setRecipes(this.state.recipes);

      console.log(this.state.recipes);
      this.addToList(ingredients);
    });
  };
  toggleModal = () => {
    this.setState({ toggleModal: !this.state.toggleModal });
    this.props.dataLoaded();
  };
  render() {
    const { loading, suggestedRecipes, recipes } = this.props.userData;

    return (
      <>
        {!loading ? (
          suggestedRecipes < 1 ? (
            <Col
              s={12}
              id="recipe-list"
              className="section justify-content-center"
            >
              <h6>No Results Found</h6>
            </Col>
          ) : (
            <Col s={12} id="recipe-list" className="section horizontal-scroll">
              {suggestedRecipes.map((recipe, i) => (
                <div key={i} className="card horizontal">
                  <div className="card-image">
                    <img alt={recipe.title} src={recipe.thumbnail} />
                  </div>
                  <div className="card-stacked">
                    <div className="card-content valign-wrapper">
                      <a href={recipe.href} target="new">
                        {recipe.title}
                      </a>
                    </div>
                  </div>
                  <div className="card-action">
                    <div
                      className="btn add-recipe-btn"
                      onClick={() => this.addRecipe(recipe)}
                      data-url={recipe.href}
                    >
                      Add Recipe
                    </div>
                  </div>
                </div>
              ))}
            </Col>
          )
        ) : (
          <Preloader active color="green" flashing={false} size="big" />
        )}
        <MyRecipes recipes={recipes} addToList={this.addToList} />
        <Modal isOpen={this.state.toggleModal} toggle={this.toggleModal}>
          <ModalHeader
            toggle={this.toggleModal}
            className="teal darken-4 white-text"
            style={{ fontFamily: "monospace" }}
          >
            Sorry
          </ModalHeader>
          <ModalBody>No Recipe Data found from, Try another!</ModalBody>
          <ModalFooter className="d-flex justify-content-center">
            <Button color="secondary" onClick={this.toggleModal}>
              Ok
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
RecipeList.propTypes = {
  auth: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  userData: state.userData,
});
export default connect(mapStateToProps, {
  setRecipes,
  setShoppingList,
  getUserShoppingList,
  getSuggestedRecipes,
  setDataLoading,
  addCategory,
  dataLoaded,
})(RecipeList);
