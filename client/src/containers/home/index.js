import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import classnames from "classnames";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardHeader,
  CardBody,
  CardLink,
  CardText,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  Container,
  TabContent,
  TabPane,
  CardImg,
  CardTitle
} from "reactstrap";
var axios = require("axios");

class Home extends Component {
  state = {
    recipes: [],
    groceryList: [],
    fridge: [],
    newItem: "",
    recipelink: "",
    userBoards: [],
    togglePins: false,
    boardPins: [],
    accessToken: "",
    activeTab: 1
  };

  componentDidMount() {
    let params = new URLSearchParams(window.location.href);
    let userAuthCode = params.get("code");
    let accessToken =
      "Aj5cBG-EFZy8RRy1skpJ0zVYY_QkFeSnWQ45H_lGakDl-YDIqwJUgDAAAAMgRmtif9EgrmUAAAAA";
    this.setState({ accessToken: accessToken });
    console.log(accessToken);
    console.log(userAuthCode);

    axios
      .post(
        `https://api.pinterest.com/v1/oauth/token?grant_type=authorization_code&client_id=5073939286663940267&client_secret=f88681c57f7d8613522b1f09272c106f1fb1366e1464c80a8718442a19e8d743&code=${userAuthCode}`
      )
      .then(function(response) {
        accessToken = response.data.access_token;
      });
    if (accessToken.length > 1) {
      console.log("yes");
      axios
        .get(
          `https://api.pinterest.com/v1/me/boards/?access_token=${accessToken}&fields=id%2Cname%2Curl%2Cimage%2Cdescription`
        )
        .then(
          function(response) {
            this.setState({
              userBoards: response.data.data
            });
            console.log(this.state.userBoards).catch(err => console.log(err));
          }.bind(this)
        );
    }
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
  addRecipe = url => {
    this.setState({ recipelink: url });
    this.handleFormSubmit();
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
  pinterestLogin = () => {
    axios.get("/api/pinterest").then(response => console.log(response));
  };
  displayPins = event => {
    event.preventDefault();
    let boardID = event.target.id;
    console.log(event.target.id);
    this.setState({ togglePins: true });
    axios
      .get(
        `https://api.pinterest.com/v1/boards/${boardID}/pins/?access_token=${this.state.accessToken}&fields=id%2Clink%2Cnote%2Curl%2Cattribution%2Cimage%2Cmetadata%2Coriginal_link`
      )
      .then(
        function(response) {
          this.setState({
            boardPins: response.data.data
          });
          console.log(this.state.boardPins).catch(err => console.log(err));
        }.bind(this)
      );
    if (this.state.activeTab !== event.target.key) {
      this.setState({ activeTab: event.target.key });
    }
  };

  render() {
    return (
      <div>
        <Row
          noGutters={true}
          style={{ backgroundColor: "#333", borderColor: "#333" }}
          className="text-white"
        >
          <h3>Your Boards</h3>
        </Row>
        {this.state.userBoards.length > 1 ? (
          <Nav tabs className="mt-3">
            {this.state.userBoards.map((board, i) => (
              <NavItem>
                <NavLink
                  key={i}
                  id={board.id}
                  onClick={this.displayPins}
                  className={classnames({
                    active: this.state.activeTab === `${i}`
                  })}
                >
                  {board.name}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        ) : (
          <a href="https://api.pinterest.com/oauth/?response_type=code&redirect_uri=https://serene-plateau-07976.herokuapp.com/&client_id=5073939286663940267&scope=read_public,write_public&state=8675309">
            Login to Pinterest
          </a>
        )}
        {this.state.togglePins ? (
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId={this.state.activeTab}>
              <Row className="row-display">
                {this.state.boardPins.map((pins, i) => (
                  <Col>
                    <Card key={i}>
                      <Row noGutters={true}>
                        <Col md="4">
                          <CardImg
                            src={pins.image.original.url}
                            // alt={pins.metadata.link.title}
                            className="w-100"
                          />
                        </Col>
                        <Col md="8">
                          <CardBody>
                            <CardTitle>{pins.metadata.link}</CardTitle>
                            <CardText>
                              {/* {pins.metadata.link.description} */}
                            </CardText>
                            <Button
                              id={pins.id}
                              data-url={pins.original_link}
                              onClick={this.addRecipe}
                              color="danger"
                            >
                              Add Ingredients
                            </Button>
                          </CardBody>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>
            </TabPane>
          </TabContent>
        ) : (
          ""
        )}

        <Container>
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
        </Container>
      </div>
    );
  }
}

export default Home;
