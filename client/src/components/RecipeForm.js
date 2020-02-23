import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import "./style.css";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroupAddon,
  InputGroup
} from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getUserFridgeData,
  getUserShoppingList,
  setShoppingList,
  addRecipe
} from "../actions/authActions";

var axios = require("axios");

class RecipeForm extends Component {
  state = {
    recipes: [],
    shoppingList: [],
    fridge: [],
    recipelink: ""
  };

  componentDidMount() {
    this.setState({
      fridge: this.props.userData.fridge,
      shoppingList: this.props.userData.shoppingList
    });
  }
  componentDidUpdate(props) {
    console.log(props);
    if (
      this.state.shoppingList.length !== this.props.userData.shoppingList.length
    ) {
      this.setState({
        fridge: this.props.userData.fridge,
        shoppingList: this.props.userData.shoppingList
      });
    }
  }
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
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

  addToList = data => {
    data.map((ingredient, i) => {
      console.log(ingredient);
      /* check to see if ingredient already exisit in the shoppingList*/
      if (
        !this.state.shoppingList.some(
          e => e.name === ingredient.name.toLowerCase()
        )
      ) {
        console.log("included");
        let shoppingList = this.state.shoppingList;
        let newIngredient = {
          name: ingredient.name.toLowerCase(),
          amount: this.convertToDecimal(ingredient.amount, ingredient.unit),
          unit: "oz",
          enoughInFridge: false
            // "row border-bottom border-primary d-flex bg-transparent pl-3 font-italic"
        };
        shoppingList.push(newIngredient);
        this.setState({
          shoppingList
        });
        this.saveNewShoppingListItem(newIngredient);
      } else {
        let key = ingredient.name;
        this.setState(prevState => ({
          shoppingList: prevState.shoppingList.map(el =>
            el.name === key
              ? { ...el, amount: el.amount + parseFloat(ingredient.amount) }
              : el
          )
        }));
        this.updateShoppingListItem(ingredient.name,ingredient.amount)
      }
      console.log(this.state.shoppingList);
    });
  };
  updateShoppingListItem = (name, amount) => {
    if (this.props.auth.user.isAuthenticated) {
      axios
        .put("/api/updateShoppingListItem", {
          name: name,
          amount: amount,
          userId: this.props.auth.user.id
        })
        .then(response => {
          this.props.getUserShoppingList(this.props.auth.user.id);
        })
        .catch(err => {
          console.log(err);
          alert("Failed to create: " + err.message);
        });
    } else {
      this.props.setShoppingList(this.state.shoppingList);
    }
  };
  saveNewShoppingListItem = newIngredient => {
    if (this.props.auth.user.isAuthenticated) {
      axios
        .post("/api/shoppingListItem", {
          newIngredient: newIngredient,
          userId: this.props.auth.user.id
        })
        .then(response => {
          this.props.getUserShoppingList(this.props.auth.user.id);
        })
        .catch(err => {
          console.log(err);
          alert("Failed to create: " + err.message);
        });
    } else {
      this.props.setShoppingList(this.state.shoppingList);
    }
  };
  handleFormSubmit = event => {
    //event.preventDefault();
    const url = encodeURIComponent(this.state.recipelink);
    console.log(url);
    if (this.state.recipelink) {
      axios.get(`/api/recipes/${url}`).then(
        function(response) {
          if (response.data.length < 1) {
            this.toggleModal(1);
          } else {
            console.log(response.data);
            let recipes = this.state.recipes;
            console.log("NEW!");
            let newRecipe = {
              URL: this.state.recipelink,
              ingredients: response.data
            };
            recipes.push(newRecipe);
            this.setState({
              recipes
            });
            this.props.addRecipe(this.state.recipes);

            console.log(this.state.recipes);
            this.addToList(response.data);
          }
        }.bind(this)
      );
    }
  };

  render(props) {
    return (
      <Form>
        <FormGroup>
          <Label for="exampleText">Enter link to Recipe article</Label>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <Button onClick={this.handleFormSubmit}>Submit</Button>
            </InputGroupAddon>
            <Input
              type="input"
              name="recipelink"
              id="exampleText"
              onChange={this.handleInputChange}
            />{" "}
          </InputGroup>
        </FormGroup>
      </Form>
    );
  }
}
RecipeForm.propTypes = {
  auth: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  userData: state.userData
});
export default connect(mapStateToProps, {
  getUserFridgeData,
  getUserShoppingList,
  setShoppingList,
  addRecipe
})(RecipeForm);
