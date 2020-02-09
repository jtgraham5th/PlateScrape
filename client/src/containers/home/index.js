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
  InputGroupAddon,
  Card,
  CardHeader,
  CardBody,
  CardLink,
  CardText,
  Row,
  Col,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  Container,
  TabContent,
  TabPane,
  CardImg,
  CardTitle,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  InputGroup,
  UncontrolledCollapse
} from "reactstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSortAlphaUp,
  faSortAmountUp,
  faSortAmountDownAlt
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

library.add(faSortAlphaUp);

var axios = require("axios");

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
    collapse: 0,
    cards: [],
    modal1: false,
    modal2: false
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
            }).bind(this);
          },
          err => console.log(err)
        );
    }
    axios.get("/api/getFridge").then(response => {
      console.log(response);
      this.setState({
        fridge: response.data.data
      });
    });
  }
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };
  addRecipe = async event => {
    const url = event.target.dataset.url;
    this.setState({ recipelink: url }, () => {
      this.handleFormSubmit(event);
      console.log(this.state.recipelink);
    });
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
            console.log(this.state.recipes);
            this.addToList(response.data);
          }
        }.bind(this)
      );
    }
  };
  addToList = data => {
    data.map((ingredient, i) => {
      console.log(ingredient);
      /* check to see if ingredient already exisit in the groceryList*/
      if (
        !this.state.groceryList.some(
          e => e.name === ingredient.name.toLowerCase()
        )
      ) {
        console.log("included");
        let groceryList = this.state.groceryList;
        let newIngredient = {
          name: ingredient.name.toLowerCase(),
          amount: this.convertToDecimal(ingredient.amount, ingredient.unit),
          unit: "oz",
          className: "row border-bottom border-primary d-flex bg-transparent pl-3 font-italic"
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
      this.getClasses(ingredient.name, ingredient.amount);
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
      //Converts TABLESPOONS to OUNCES
    } else if (unit === "tbsp" || unit === "tablespoons") {
      result = +parseFloat(result / 2).toFixed(2);
      console.log(result, "tbsp to oz");
    } else if (!unit) {
      result = parseFloat(amount);
    } else if (!amount) {
      result = 0;
    }
    console.log(result);
    return result;
  };
  addToFridge = event => {
    console.log(this.props);
    let newIngredientName = event.target.name;
    let newIngredientAmount = parseFloat(event.target.dataset.amount) || 0;
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
      axios
        .post("/api/fridgeItem", newIngredient)
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          console.log(err);
          alert("Failed to create: " + err.message);
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
    this.getClasses(newIngredientName, newIngredientAmount);
    console.log(this.state.fridge);
    this.toggleModal(2);
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
  toggleIngredients = event => {
    let e = event.target.dataset.event;
    this.setState({
      collapse: this.state.collapse === Number(e) ? 0 : Number(e)
    });
  };
  handleInput = event => {
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
    // this.getClasses(ingredientName,newValue)
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
    let ingredientAmount = 0;
    this.state.groceryList.map(el =>
      el.name === ingredientName ? (ingredientAmount = el.amount) : el
    );
    console.log(ingredientAmount);
    this.getClasses(ingredientName, ingredientAmount);
  };
  handleNewFridgeItem = event => {
    console.log(event.target);
    console.log(event);
    let newValue = event.target.value;
    this.setState({
      newItem: newValue
    });
  };
  handleNewFridgeAmount = event => {
    console.log(event.target);
    console.log(event);
    let newValue = event.target.value;
    if (isNaN(newValue)) {
      alert("Please enter a numeric value");
      newValue = "";
    } else {
      this.setState({
        newAmount: newValue
      });
    }
  };
  addNewFridgeItem = event => {
    event.preventDefault();
    let newIngredientName = this.state.newItem;
    let newIngredientAmount = this.state.newAmount;
    let newIngredientUnit = 0;
    console.log(newIngredientUnit);
    /* check to see if ingredient already exisit in the Fridge*/
    if (!this.state.fridge.some(e => e.name === newIngredientName)) {
      console.log("included");
      let fridge = this.state.fridge;
      let newIngredient = {
        name: newIngredientName,
        amountNeeded: 0,
        amountStored: parseFloat(newIngredientAmount),
        unit: "oz",
        edit: false
      };
      fridge.push(newIngredient);
      this.setState({
        fridge
      });
      axios
        .post("/api/fridgeItem", newIngredient)
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          console.log(err);
          alert("Failed to create: " + err.message);
        });
    } else {
      alert("This item already exist in your fridge");
      this.setState({
        newItem: ""
      });
    }
    this.getClasses(newIngredientName, newIngredientAmount);
  };
  pinterestLogin = () => {
    axios.get("/api/pinterest").then(response => console.log(response));
  };
  displayPins = event => {
    event.preventDefault();
    let boardID = event.target.id;
    let boarddata = [];
    console.log(event.target.id);
    this.setState({ togglePins: true });
    axios
      .get(
        `https://api.pinterest.com/v1/boards/${boardID}/pins/?access_token=${this.state.accessToken}&fields=id%2Clink%2Cnote%2Curl%2Cattribution%2Cimage%2Cmetadata%2Coriginal_link`
      )
      .then(
        function(response) {
          boarddata = response.data.data;
          console.log(response.data.data);
          this.showPins(boarddata);
        }.bind(this)
      );
    if (this.state.activeTab !== event.target.key) {
      this.setState({ activeTab: event.target.key });
    }
  };
  showPins = boarddata => {
    this.setState({
      boardPins: []
    });
    let boardPins = this.state.boardPins;
    const requests = boarddata.map((pin, index) => {
      const newPin = {
        id: pin.id,
        image: pin.image.original.url,
        name: !pin.metadata.link ? "Untitled" : pin.metadata.link.title,
        description: !pin.metadata.link
          ? "No Description"
          : pin.metadata.link.description,
        ogLink: pin.original_link
      };
      boardPins.push(newPin);
    });
    Promise.all(requests).then(() => {
      this.setState({
        boardPins
      });
      console.log(this.state.boardPins);
    });
  };
  alphaSort = event => {
    let alphaSort = this.state.groceryList.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase()
        ? 1
        : b.name.toLowerCase() > a.name.toLowerCase()
        ? -1
        : 0
    );
    console.log(alphaSort);
    this.setState({
      groceryList: alphaSort
    });
    console.log(this.state.groceryList);
  };
  increaseSort = event => {
    let increaseSort = this.state.groceryList.sort((a, b) =>
      a.amount > b.amount ? 1 : b.amount > a.amount ? -1 : 0
    );
    console.log(increaseSort);
    this.setState({
      groceryList: increaseSort
    });
    console.log(this.state.groceryList);
  };
  decreaseSort = event => {
    let decreaseSort = this.state.groceryList.sort((a, b) =>
      b.amount > a.amount ? 1 : a.amount > b.amount ? -1 : 0
    );
    console.log(decreaseSort);
    this.setState({
      groceryList: decreaseSort
    });
    console.log(this.state.groceryList);
  };
  toggleModal = num => {
    console.log(num, "NUM");
    if (num === 1) {
      this.setState({
        modal1: !this.state.modal1
      });
    } else if (num === 2) {
      this.setState({
        modal2: !this.state.modal2
      });
    }
  };
  removeFrmList = event => {
    const removeIndex = event.target.dataset.index;
    let updatedList = this.state.groceryList;
    console.log(updatedList);
    updatedList.splice(removeIndex, 1);
    console.log(updatedList);
    this.setState({
      groceryList: updatedList
    });
    if (this.state.modal2) {
      this.toggleModal(2);
    }
  };
  getClasses = (ingredient, amount) => {
    console.log("---getclasses---");
    let fridge = this.state.fridge;
    console.log(fridge.length, fridge);
    console.log(ingredient, amount);
    if (fridge.length > 0) {
      let classes = fridge.map((item, x) =>
        item.name === ingredient
          ? item.amountStored >= amount
            ? this.setState(prevState => ({
                groceryList: prevState.groceryList.map(el =>
                  el.name === ingredient
                    ? {
                        ...el,
                        className:
                          "bg-info font-italic text-secondary border border-dark d-flex"
                      }
                    : el
                )
              }))
            : this.setState(prevState => ({
                groceryList: prevState.groceryList.map(el =>
                  el.name === ingredient
                    ? {
                        ...el,
                        className: "d-flex pl-3 row exists border-bottom border-primary"
                      }
                    : el
                )
              }))
          : ""
      );
      console.log("---end of getclasses---");
      return classes;
    } else {
      return "border d-flex bg-dark";
    }
  };
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
  render() {
    const { user } = this.props.auth;
    return (
      <div className="bg-secondary">
        {this.state.userBoards.length > 1 ? (
          <Nav tabs className="mt-3">
            {this.state.userBoards.map((board, i) => (
              <NavItem>
                <NavLink
                  key={i}
                  id={board.id}
                  onClick={this.displayPins}
                  className={classnames(
                    {
                      active: this.state.activeTab === `${i}`
                    },
                    "bg-white border-dark"
                  )}
                >
                  {board.name}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        ) : (<div></div>
        )}
        {this.state.togglePins ? (
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId={this.state.activeTab}>
              <Row className="row-display bg-light" style={{ height: "200px" }}>
                {this.state.boardPins.map((pins, i) => (
                  <Col md="3" className="text-wrap h-100">
                    <Card key={i} className="h-100">
                      <Row noGutters={true} className="h-100">
                        <Col md="4" className="h-100">
                          <CardImg
                            src={pins.image}
                            alt={pins.name}
                            className="h-100"
                          />
                        </Col>
                        <Col md="8" className="h-100">
                          <CardBody className="p-2 d-flex flex-column h-100">
                            <CardTitle className="h6">{pins.name}</CardTitle>
                            <small>{pins.description}</small>
                            <Button
                              id={pins.id}
                              data-url={pins.ogLink}
                              onClick={this.addRecipe}
                              className="align-self-center mt-2"
                              color="danger"
                            >
                              Add Ingredients
                            </Button>
                            <Modal
                              isOpen={this.state.modal1}
                              toggle={() => this.toggleModal(1)}
                            >
                              <ModalHeader
                                toggle={() => this.toggleModal(1)}
                                className="bg-secondary"
                              >
                                Uh...
                              </ModalHeader>
                              <ModalBody>
                                We are currently unable to scrape this recipe.
                                Try another!
                              </ModalBody>
                              <ModalFooter>
                                <Button
                                  color="secondary"
                                  onClick={() => this.toggleModal(1)}
                                >
                                  close
                                </Button>
                              </ModalFooter>
                            </Modal>
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
        )}        <Container>
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
          <div className="row mb-0">
            <div className="col-md-3" id="accordion">
              {this.state.recipes.map((recipe, i) => (
                <div key={i} className="">
                  <button
                    class="small teal lighten-5 rounded w-100"
                    id={`toggler${i}`}
                  >
                    {recipe.URL}
                  </button>
                  <UncontrolledCollapse toggler={`#toggler${i}`}>
                    <div class="card-body white">
                      {recipe.ingredients.map((ingredient, e) => (
                        <h6 key={e}>
                          {ingredient.amount} {ingredient.unit}{" "}
                          {ingredient.name}
                        </h6>
                      ))}
                    </div>
                  </UncontrolledCollapse>
                </div>
              ))}
            </div>
            <div className="col-md-4 rounded bg-light yellow lighten-4 mr-4">
              <Row className="text-center brown border border-bottom border-dark">
                <h1
                className="w-100"
                style={{
                  fontFamily: "monospace"
                }}>Shopping List</h1>
              </Row>
              <Row className="d-flex align-items-center border-bottom border-dark pb-2 pt-2">
                <FontAwesomeIcon
                  icon={faSortAlphaUp}
                  size="1.5x"
                  color="black"
                  className="col-md-4"
                  onClick={this.alphaSort}
                />
                <FontAwesomeIcon
                  icon={faSortAmountUp}
                  size="1.5x"
                  color="black"
                  className="col-md-4"
                  onClick={this.decreaseSort}
                />
                <FontAwesomeIcon
                  icon={faSortAmountDownAlt}
                  size="1.5x"
                  color="black"
                  className="col-md-4"
                  onClick={this.increaseSort}
                />
              </Row>
              {this.state.groceryList.map((ingredient, i) => (
                <div
                  data-name={ingredient.name}
                  data-amount={ingredient.amount}
                  id={i}
                  className={ingredient.className}
                >
                  {ingredient.name}
                  <em className="ml-auto pr-2 ">
                    {ingredient.amount} {ingredient.unit}{" "}
                  </em>

                  <button
                    className="tiny material-icons bg-transparent border-0"
                    name={ingredient.name}
                    data-amount={ingredient.amount}
                    data-unit={ingredient.unit}
                    onClick={this.addToFridge}
                  >
                    add
                  </button>
                  <button
                    className="tiny material-icons bg-transparent border-0"
                    name={ingredient.name}
                    data-index={i}
                    onClick={this.removeFrmList}
                  >
                    close
                  </button>
                  <Modal
                    isOpen={this.state.modal2}
                    toggle={() => this.toggleModal(2)}
                  >
                    <ModalHeader
                      toggle={() => this.toggleModal(2)}
                      className="bg-secondary"
                    >
                      Item added to Fridge
                    </ModalHeader>
                    <ModalBody>
                      Would you also like to remove this item from your shopping
                      list?
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="secondary"
                        onClick={this.removeFrmList}
                        id={i}
                      >
                        Yes
                      </Button>
                      <Button
                        color="secondary"
                        onClick={() => this.toggleModal(2)}
                      >
                        No
                      </Button>
                    </ModalFooter>
                  </Modal>
                </div>
              ))}
            </div>
            <div className="col-md-4 border rounded bg-light">
              <h1
              style={{
                fontFamily: "monospace"
              }}>Fridge</h1>
              <form onSubmit={this.addNewFridgeItem} className="d-flex mb-2">
                <input
                  label="Add new item"
                  type="text"
                  className="w-75"
                  placeholder="What do you already have?"
                  onChange={this.handleNewFridgeItem}
                ></input>
                <input
                  label="Add new item value"
                  type="text"
                  className="w-25"
                  placeholder="Amount"
                  onChange={this.handleNewFridgeAmount}
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
Home.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps, { logoutUser })(Home);
