import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
var axios = require("axios");

class Home extends Component {
  state = {
    recipes: [],
    groceryList: [],
    fridge: [],
    newItem: "",
    recipelink: ""
  };

    componentDidMount() {
        let params = new URLSearchParams(window.location.href)
        let code = params.get("code")
        console.log(code)

        // let userAuthCode = window.location.search
        // if (userAuthCode === "/") {
        //     console.log("User hasn't been authenticated")
        // } else {
        //     console.log(userAuthCode)
        // }
        }

    // loadBooks = () => {
    //   API.getBooks()
    //     .then(res =>
    //       this.setState({ books: res.data, title: "", author: "", synopsis: "" })
    //     )
    //     .catch(err => console.log(err));
    // };

    // deleteBook = id => {
    //   API.deleteBook(id)
    //     .then(res => this.loadBooks())
    //     .catch(err => console.log(err));
    // };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    const url = encodeURIComponent(this.state.recipelink);
    console.log(url);
    if (this.state.recipelink) {
      axios.get(`/api/recipes/${url}`).then(
        function(response) {
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
          console.log(this.state.recipes);
          this.addToList(response.data);
          //   console.log(recipeData);
          //   this.setState({
          //     ingredients: recipeData
          // const ingredients = [...state.ingredients, recipeData];
          // console.log(ingredients);
          // return ingredients;
          //   });
        }.bind(this)
      );
    }
  };

  addToList = data => {
    data.map((ingredient, i) => {
      console.log(ingredient);
      /* check to see if ingredient already exisit in the groceryList*/
      if (!this.state.groceryList.some(e => e.name === ingredient.name)) {
        console.log("included");
        let groceryList = this.state.groceryList;
        let newIngredient = {
          name: ingredient.name,
          amount: this.convertToDecimal(ingredient.amount, ingredient.unit),
          unit: "oz"
        };
        groceryList.push(newIngredient);
        this.setState({
          groceryList
        });
      } else {
        let groceryList = this.state.groceryList;
        let key = ingredient.name;
        this.setState(prevState => ({
          groceryList: prevState.groceryList.map(el =>
            el.name === key
              ? { ...el, amount: el.amount + parseFloat(ingredient.amount) }
              : el
          )
        }));
      }
      console.log(this.state.groceryList);
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
      //Convertst TABLESPOONS to OUNCES
    } else if (unit === "tbsp" || unit === "tablespoons") {
      result = +parseFloat(result / 2).toFixed(2);
      console.log(result, "tbsp to oz");
    }
    return result;
  };

  addToFridge = event => {
    console.log(this.props);
    let newIngredientName = event.target.name;
    let newIngredientAmount = parseFloat(event.target.dataset.amount);
    let newIngredientUnit = event.target.dataset.unit;
    console.log(newIngredientUnit);
    // this.state.fridge.map((ingredient, i) => {
    //     console.log(ingredient);
    /* check to see if ingredient already exisit in the groceryList*/
    if (!this.state.fridge.some(e => e.name === newIngredientName)) {
      console.log("included");
      let fridge = this.state.fridge;
      let newIngredient = {
        name: newIngredientName,
        amountNeeded: newIngredientAmount,
        amountStored: newIngredientAmount,
        unit: newIngredientUnit,
        edit: false
      };
      fridge.push(newIngredient);
      this.setState({
        fridge
      });
    } else {
      let fridge = this.state.fridge;
      this.setState(prevState => ({
        fridge: prevState.fridge.map(el =>
          el.name === newIngredientName
            ? {
                ...el,
                amountNeeded: el.amountNeeded + parseFloat(newIngredientAmount)
              }
            : el
        )
      }));
    }
    console.log(this.state.fridge);
    //   });
  };

  toggleFridgeEdit = event => {
    let ingredientName = event.target.dataset.name;
    console.log(event.target.dataset.name);
    this.setState(prevState => ({
      fridge: prevState.fridge.map(el =>
        el.name === ingredientName ? { ...el, edit: !el.edit } : el
      )
    }));
    console.log(this.state.fridge);
  };

  handleInput = event => {
    console.log(event.target);
    console.log(event);
    let newValue = event.target.value;
    let ingredientName = event.target.name;
    if (isNaN(newValue)) {
      alert("Please enter a numeric value");
      newValue = "";
    } else {
      this.setState(prevState => ({
        fridge: prevState.fridge.map(el =>
          el.name === ingredientName ? { ...el, amountStored: newValue } : el
        )
      }));
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    let ingredientName = event.target.name;
    console.log(ingredientName);
    this.setState(prevState => ({
      fridge: prevState.fridge.map(el =>
        el.name === ingredientName ? { ...el, edit: !el.edit } : el
      )
    }));
  };

  handleNewFridgeItem = event => {
    console.log(event.target);
    console.log(event);
    let newValue = event.target.value;
    // let ingredientName = event.target.name;
    this.setState({
      newItem: newValue
    });
  };

  addNewFridgeItem = event => {
    event.preventDefault();
    let newIngredientName = this.state.newItem;
    let newIngredientAmount = 0;
    let newIngredientUnit = 0;
    console.log(newIngredientUnit);
    /* check to see if ingredient already exisit in the Fridge*/
    if (!this.state.fridge.some(e => e.name === newIngredientName)) {
      console.log("included");
      let fridge = this.state.fridge;
      let newIngredient = {
        name: newIngredientName,
        amountNeeded: newIngredientAmount,
        amountStored: newIngredientAmount,
        unit: "oz",
        edit: false
      };
      fridge.push(newIngredient);
      this.setState({
        fridge
      });
    } else {
      alert("This item already exist in your fridge");
      this.setState({
        newItem: ""
      });
    }
  };
  pinterestLogin= () => {
    axios
      .get("/api/pinterest"
      )
      .then(response => console.log(response));
  };

  render() {
    return (
      <div>
        <a href="https://api.pinterest.com/oauth/?response_type=code&redirect_uri=https://serene-plateau-07976.herokuapp.com/&client_id=5073939286663940267&scope=read_public,write_public&state=8675309">Login to Pinterest</a>
        <Form>
          <FormGroup>
            <Label for="exampleText">Enter link to Recipe article</Label>
            <Input
              type="textarea"
              name="recipelink"
              id="exampleText"
              onChange={this.handleInputChange}
            />
          </FormGroup>
          <Button onClick={this.handleFormSubmit}>Submit</Button>
        </Form>
        <div className="row">
          <div className="col-md-3">
            {this.state.recipes.map((recipe, i) => (
              <div key={i} className="rounded border">
                <small>{recipe.URL}</small>
                {recipe.ingredients.map((ingredient, e) => (
                  <h6 key={e}>
                    {ingredient.amount} {ingredient.unit} {ingredient.name}
                  </h6>
                ))}
              </div>
            ))}
          </div>
          <div className="col-md-4 border rounded ">
            <h1>Shopping List</h1>
            {this.state.groceryList.map((ingredient, i) => (
              <div className="border d-flex justify-content-between">
                {ingredient.amount} {ingredient.unit} {ingredient.name}
                <button
                  className="btn-primary"
                  name={ingredient.name}
                  data-amount={ingredient.amount}
                  data-unit={ingredient.unit}
                  onClick={this.addToFridge}
                >
                  Add
                </button>
              </div>
            ))}
          </div>
          <div className="col-md-4 border rounded">
            <h1>Fridge</h1>
            <form onSubmit={this.addNewFridgeItem} className="d-flex mb-2">
              <input
                label="Add new item"
                type="text"
                className="w-100"
                placeholder="What do you already have?"
                onChange={this.handleNewFridgeItem}
              ></input>
              <button type="submit" className="btn-success">
                Add
              </button>
            </form>
            <div className="row">
              <div className="col-md-6 border h6 p-0">Ingredient Name</div>
              <div className="col-md-3 border h6 p-0">Needed</div>
              <div className="col-md-3 border h6 p-0">Have</div>
            </div>
            {this.state.fridge.map((ingredient, i) => (
              <div className="row">
                <div className="col-md-6 border">{ingredient.name}</div>
                <small className="col-md-3 border p-0">
                  {ingredient.amountNeeded} {ingredient.unit}
                </small>
                {!ingredient.edit ? (
                  <small
                    className="col-md-3 border p-0"
                    data-name={ingredient.name}
                    onClick={this.toggleFridgeEdit}
                  >
                    {ingredient.amountStored} {ingredient.unit}
                  </small>
                ) : (
                  <small
                    className="col-md-3 border p-0"
                    data-name={ingredient.name}
                  >
                    <form name={ingredient.name} onSubmit={this.handleSubmit}>
                      <input
                        type="text"
                        className="w-100"
                        name={ingredient.name}
                        placeholder={ingredient.amountStored}
                        onChange={this.handleInput}
                      ></input>
                    </form>
                  </small>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
