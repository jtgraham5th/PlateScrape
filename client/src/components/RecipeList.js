import React, { Component } from "react";
import { renderToStaticMarkup } from "react-dom/server";
// import { Link } from "react-router-dom";
// import "./style.css";
import {
  Row,
  Button,
  Collapsible,
  CollapsibleItem,
  Icon,
} from "react-materialize";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getUserFridgeData, setRecipes, setShoppingList, getUserShoppingList } from "../actions";
import axios from "axios";

// var axios = require("axios");

class RecipeList extends Component {
  state = {
    suggestedRecipes: [],
    recipes: [],
    groceryList: [],
    fridge: [],
    shoppingList: [],
  };

  componentDidMount() {
    axios
      .get("api/tastyAPI")
      .then((response) => this.setState({ suggestedRecipes: response.data }));

    this.setState({
      recipes: this.props.userData.recipes,
    });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.userData.recipes !== this.props.userData.recipes) {
      this.setState({ recipes: this.props.userData.recipes });
    }
  }
  renderTooltip(recipe) {
    return recipe.ingredients.map((ingredient, e) => (
      <>
        <small className="left-align">
          {ingredient.amount} {ingredient.unit} {ingredient.name}
        </small>
        <br />
      </>
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
  addRecipe =(event) => {
    const url = encodeURIComponent(event.target.dataset.url)
    axios.get(`/api/recipes/${url}`).then(
        function(response) {
          if (response.data.ingredients.length < 1) {
          } else {
            console.log(response.data);
            let recipes = this.state.recipes;
            let newRecipe = {
              URL: this.state.recipelink,
              name: response.data.name,
              ingredients: response.data.ingredients,
              image: response.data.image
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
  }
  render(props) {
    return (
      <Collapsible accordion>
        <CollapsibleItem
          expanded
          icon={<Icon>arrow_drop_down</Icon>}
          header="Recipes"
          node="div"
          id="collapsible-item"
        >
          <Row className="section horizontal-scroll">
            {this.state.suggestedRecipes.map((recipe, i) => (
              <div key={i} className="col s12 m7">
              <div className="card horizontal">
                <div className="card-image">
                  <img alt={recipe.title} src={recipe.thumbnail} />
                </div>
                <div className="card-stacked">
                  <div className="card-content valign-wrapper">
                    {recipe.title}
                  </div>
                  <a href={recipe.href}>View recipe</a>
                  <div className="card-action">
                    <div className="btn add-recipe-btn" onClick={this.addRecipe} data-url={recipe.href}>Add Recipe</div>
                  </div>
                </div>
              </div>
            </div>
            ))}
          </Row>
          <Row className="section" id="recipe-button-containter">
            {this.state.recipes.map((recipe, i) => (
              <Button
                className="col s4"
                id="recipe-button"
                key={i}
                node="button"
                tooltip={renderToStaticMarkup(this.renderTooltip(recipe))}
                tooltipOptions={{
                  position: "bottom",
                }}
                waves="light"
              >
                <small>{recipe.name}</small>
              </Button>
              //  <div key={i} className="">
              //     <button
              //       className="small teal lighten-5 rounded w-100"
              //       id={`toggler${i}`}
              //     >
              //       {recipe.URL}
              //     </button>
              //     <UncontrolledCollapse toggler={`#toggler${i}`}>
              //       <div className="card-body white">
              //         {recipe.ingredients.map((ingredient, e) => (
              //           <h6 key={e}>
              //             {ingredient.amount} {ingredient.unit}{" "}
              //             {ingredient.name}
              //           </h6>
              //         ))}
              //       </div>
              //     </UncontrolledCollapse>
              //   </div>
            ))}
          </Row>
        </CollapsibleItem>
      </Collapsible>
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
  getUserFridgeData, setRecipes, setShoppingList, getUserShoppingList
})(RecipeList);
