import React, { Component } from "react";
import { renderToStaticMarkup } from "react-dom/server";
// import { Link } from "react-router-dom";
// import "./style.css";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import {
  Col,
  Button,
  Collapsible,
  CollapsibleItem,
  Icon,
  Preloader,
  Card,
  CardTitle,
} from "react-materialize";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getUserFridgeData,
  setRecipes,
  setShoppingList,
  getUserShoppingList,
  getSuggestedRecipes,
  setDataLoading,
  dataLoaded,
} from "../actions";
import axios from "axios";

// var axios = require("axios");

class RecipeList extends Component {
  state = {
    suggestedRecipes: [],
    recipes: [],
    groceryList: [],
    fridge: [],
    shoppingList: [],
    toggleModal: false,
  };

  async componentDidMount() {
    await this.props.getSuggestedRecipes();

    // this.setState({
    //   suggestedRecipes: this.props.userData.suggestedRecipes,
    //   recipes: this.props.userData.recipes,
    // });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userData.recipes !== this.props.userData.recipes) {
      this.setState({ recipes: this.props.userData.recipes });
    }
  }
  renderTooltip(recipe) {
    return recipe.ingredients.map((ingredient, e) => (
        <small className="left-align">
          {ingredient.amount} {ingredient.unit} {ingredient.name}
        </small>
    ));
  }
  saveNewShoppingListItem = (newIngredient) => {
    if (this.props.auth.isAuthenticated) {
      axios
        .post("/api/shoppingListItem", {
          newIngredient: newIngredient,
          userId: this.props.auth.userId,
        })
        .then((response) => {
          this.props.getUserShoppingList(this.props.auth.userId);
        })
        .catch((err) => {
          console.log(err);
          alert("Failed to create: " + err.message);
        });
    } else {
      this.props.setShoppingList(this.state.shoppingList);
    }
  };
  convertToDecimal = (amount, unit) => {
    console.log(unit, "---------");
    let result = amount;
    if (amount.includes("/")) {
      let split = amount.split("/");
      result = parseInt(split[0], 10) / parseInt(split[1], 10);
      console.log(result, "amount as a decimal");
    }
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
      result = parseFloat(amount);
    } else if (!amount) {
      result = 0;
    } else if (isNaN(amount)) {
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
          amount: this.convertToDecimal(ingredient.amount, ingredient.unit),
          unit: "oz",
          enoughInFridge: false,
          // "row border-bottom border-primary d-flex bg-transparent pl-3 font-italic"
        };
        shoppingList.push(newIngredient);
        this.setState({
          shoppingList,
        });
        this.saveNewShoppingListItem(newIngredient);
      } else {
        let key = ingredient.name;
        this.setState((prevState) => ({
          shoppingList: prevState.shoppingList.map((el) =>
            el.name === key
              ? { ...el, amount: el.amount + parseFloat(ingredient.amount) }
              : el
          ),
        }));
        // this.updateShoppingListItem(ingredient.name, ingredient.amount);
      }
      console.log(this.state.shoppingList);
    });
  };
  addRecipe = (recipe) => {
    const { title, thumbnail, href } = recipe;
    const url = encodeURIComponent(href);
    this.props.setDataLoading();
    axios.get(`/api/recipes/${url}`).then(
      function(response) {
        if (response.data.ingredients.length < 1) {
          this.toggleModal();
        } else {
          console.log(response.data);
          this.props.dataLoaded();
          let recipes = this.state.recipes;
          let newRecipe = {
            URL: href,
            name: title,
            ingredients: response.data.ingredients,
            image: thumbnail,
          };
          recipes.push(newRecipe);
          this.setState({
            recipes,
          });
          this.props.setRecipes(this.state.recipes);

          console.log(this.state.recipes);
          this.addToList(response.data.ingredients);
        }
      }.bind(this)
    );
  };
  toggleModal = () => {
    this.setState({ toggleModal: !this.state.toggleModal });
    this.props.dataLoaded();
  };
  render() {
    return (
      <>
        {!this.props.userData.loading ? (
          this.props.userData.suggestedRecipes < 1 ? (
            <Col
              s={12}
              id="recipe-list"
              className="section justify-content-center"
            >
              <h6>No Results Found</h6>
            </Col>
          ) : (
            <Col s={12} id="recipe-list" className="section horizontal-scroll">
              {this.props.userData.suggestedRecipes.map((recipe, i) => (
                <div key={i} className="card horizontal">
                  <div className="card-image">
                    <img alt={recipe.title} src={recipe.thumbnail} />
                  </div>
                  <div className="card-stacked">
                    <div className="card-content valign-wrapper">
                      <a href={recipe.href}>{recipe.title}</a>
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
        <Collapsible accordion id="my-recipes" className="col s12">
          <CollapsibleItem
            icon={<Icon>arrow_drop_down</Icon>}
            id="collapsible-item"
            header="My Recipes"
            node="div"
          >
            <Col s={12} className="section" id="recipe-button-container">
              {this.props.userData.recipes.map((recipe, i) => (
                <Card
                  closeIcon={<Icon>close</Icon>}
                  header={
                    <CardTitle image={recipe.image} reveal waves="light" />
                  }
                  reveal={<ul>{recipe.ingredients.map((ingredient, e) => (
                    <li className="left-align small">
                      {ingredient.amount} {ingredient.unit} {ingredient.name}
                    </li>
                ))}</ul>}
                  
                  title={recipe.name}
                  className="recipe-button"
                >
                  <div
                    className="btn add-recipe-btn"
                    onClick={() => this.addToList(recipe.ingredient)}
                    data-url={recipe.href}
                  >
                    Add Recipe
                  </div>
                </Card>
              ))}
            </Col>
          </CollapsibleItem>
        </Collapsible>
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
  getUserFridgeData,
  setRecipes,
  setShoppingList,
  getUserShoppingList,
  getSuggestedRecipes,
  setDataLoading,
  dataLoaded,
})(RecipeList);
