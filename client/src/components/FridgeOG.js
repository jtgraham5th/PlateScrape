import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import "./style.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Col,
  Container,
  CollapsibleItem,
  Icon,
  Collection,
  CollectionItem,
  TextInput,
  Button,
} from "react-materialize";
import {
  getUserFridgeData,
  setFridgeData,
  removeFridgeItem,
  setShoppingList,
  searchRecipes,
  setDataLoading,
} from "../actions";

var axios = require("axios");

class Fridge extends Component {
  state = {
    fridge: [],
    shoppingList: [],
    newItem: "",
    newQuantity: 0,
  };

  componentDidMount() {
    const { isAuthenticated, userId } = this.props.auth;
    const { fridge, shoppingList } = this.props.userData;

    if (isAuthenticated && userId) {
      this.props.getUserFridgeData(userId);
      this.setState({
        fridge: fridge,
        shoppingList: shoppingList,
      });
    } else {
      this.props.setFridgeData([]);
    }
  }
  componentDidUpdate(prevProps) {
    const { fridge, shoppingList } = this.props.userData;

    if (prevProps.userData.shoppingList !== shoppingList) {
      this.setState({ shoppingList: shoppingList });
    }
    if (prevProps.userData.fridge !== fridge) {
      this.setState({ fridge: fridge });
    }
  }
  toggleFridgeEdit = async (event) => {
    let ingredientName = event.target.dataset.name;
    console.log(event.target.dataset.name);
    await this.setState((prevState) => ({
      fridge: prevState.fridge.map((el) =>
        el.name === ingredientName ? { ...el, edit: !el.edit } : el
      ),
    }));
    console.log(this.state.fridge.indexOf(ingredientName));
  };
  handleInput = (event) => {
    let newValue = event.target.value;
    let ingredientName = event.target.name;
    if (isNaN(newValue)) {
      alert("Please enter a numeric value");
      newValue = "";
    } else {
      this.setState((prevState) => ({
        fridge: prevState.fridge.map((el) =>
          el.name === ingredientName ? { ...el, quantityStored: newValue } : el
        ),
      }));
    }
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.toggleFridgeEdit(event);
    let ingredientName = event.target.name;
    console.log(ingredientName);
    let ingredientQuantity = 0;
    this.state.shoppingList.map((el) =>
      el.name === ingredientName ? (ingredientQuantity = el.quantity) : el
    );
    console.log(ingredientQuantity);
    // this.getClasses(ingredientName, ingredientAmount);
    this.props.setFridgeData(this.state.fridge);
  };
  handleNewFridgeItem = (event) => {
    let newValue = event.target.value;
    this.setState({
      newItem: newValue,
    });
  };
  handleNewFridgeQuantity = (event) => {
    let newValue = event.target.value;
    if (isNaN(newValue)) {
      alert("Please enter a numeric value");
      newValue = "";
    } else {
      this.setState({
        newQuantity: newValue,
      });
    }
  };
  userCreatedNewFridgeItem = (event) => {
    event.preventDefault();
    let newIngredientName = this.state.newItem;
    let newIngredientQuantity = this.state.newQuantity;
    // let newIngredientUnit = 0;

    /* check to see if ingredient already exisit in the Fridge*/
    if (!this.state.fridge.some((e) => e.name === newIngredientName)) {
      console.log("included");
      let fridge = this.state.fridge;
      let newIngredient = {
        name: newIngredientName,
        quantityNeeded: 0,
        quantityStored: parseFloat(newIngredientQuantity),
        unit: "oz",
        edit: false,
      };
      fridge.push(newIngredient);
      this.setState(
        {
          fridge,
        },
        () => this.props.setFridgeData(this.state.fridge)
      );

      this.saveNewFridgeItem(newIngredient);
    } else {
      alert("This item already exist in your fridge");
      this.setState({
        newItem: "",
      });
    }
    this.getClasses(newIngredientName, newIngredientQuantity);
  };
  saveNewFridgeItem = (newIngredient) => {
    const { isAuthenticated, userId } = this.props.auth;
    if (isAuthenticated) {
      axios
        .post("/api/fridgeItem", {
          newIngredient: newIngredient,
          userId: userId,
        })
        .then((response) => {
          this.props.getUserFridgeData(userId);
        })
        .catch((err) => {
          console.log(err);
          alert("Failed to create: " + err.message);
        });
    }
  };
  removeFrmFridge = (event) => {
    const { isAuthenticated, userId } = this.props.auth;
    const removeIndex = event.target.dataset.index;
    const item = event.target.dataset.name;
    let updatedList = this.state.fridge;
    updatedList.splice(removeIndex, 1);
    this.setState(
      {
        fridge: updatedList,
      },
      () => this.props.setFridgeData(updatedList)
    );

    if (isAuthenticated) {
      this.props.removeFridgeItem(item, userId);
    }
  };
  getClasses = (ingredient, quantity) => {
    console.log("---getclasses---");
    let fridge = this.props.userData.fridge;
    console.log(fridge.length, fridge);
    console.log(ingredient, quantity);
    if (fridge.length > 0) {
      fridge.map((item, x) =>
        item.name === ingredient
          ? item.quantityStored >= quantity
            ? this.setState(
                (prevState) => ({
                  shoppingList: prevState.shoppingList.map((el) =>
                    el.name === ingredient
                      ? {
                          ...el,
                          enoughInFridge: true,
                        }
                      : el
                  ),
                }),
                () => this.props.setShoppingList(this.state.shoppingList)
              )
            : this.setState((prevState) => ({
                shoppingList: prevState.shoppingList.map((el) =>
                  el.name === ingredient
                    ? {
                        ...el,
                        enoughInFridge: false,
                      }
                    : el
                ),
              }))
          : ""
      );
    }
  };
  searchRecipesfromFridge = (searchQuery) => {
    this.props.setDataLoading();
    this.props.searchRecipes(searchQuery);
  };
  render(props) {
    return (
      <Collection id="fridge-collection" className="vertical-scroll">
        <CollectionItem className="row collection-message">
          <div className="col s12 small" style={{ "lineHeight": "1rem" }}>
            Add items that you already have at home here and we'll compare them
            with what's in your shopping list so you won't have to worry about
            buying too much at the store!
          </div>
        </CollectionItem>
        <CollectionItem
          id="add-fridge-section"
          className="row s12 valign-wrapper"
        >
          <TextInput
            s={6}
            id="fridge-item-input"
            type="text"
            placeholder="What do you already have?"
            onChange={this.handleNewFridgeItem}
          />
          <TextInput
            s={3}
            id="fridge-quantity-input"
            type="text"
            placeholder="Quantity"
            onChange={this.handleNewFridgeQuantity}
          />
          <Button
            type="submit"
            className="col s2"
            onClick={this.userCreatedNewFridgeItem}
          >
            Add
          </Button>
        </CollectionItem>
        <Container className="fridge">
          <CollectionItem className="row fridge-item-header">
            <Col s={9}>Ingredient Name</Col>
            <Col s={1} className="">
              Needed
            </Col>
            <Col s={1} className="">
              Have
            </Col>
          </CollectionItem>
          {this.state.fridge.map((ingredient, i) => (
            <CollectionItem key={i} className="row fridge-item valign-wrapper">
              <Col s={9}>
                <a
                  href="#"
                  onClick={() => this.props.searchRecipes(ingredient.name)}
                >
                  {ingredient.name}{" "}
                </a>
              </Col>
              <small className="col s1 fridge-quantity-needed ">
                {ingredient.quantityNeeded} {ingredient.unit}
              </small>
              {!ingredient.edit ? (
                <small
                  className="col s1 center fridge-quantity-have"
                  data-name={ingredient.name}
                  onClick={this.toggleFridgeEdit}
                >
                  {ingredient.quantityStored} {ingredient.unit}
                </small>
              ) : (
                <small
                  className="col s1 center fridge-quantity-have"
                  data-name={ingredient.name}
                >
                  <form
                    name={ingredient.name}
                    data-name={ingredient.name}
                    onSubmit={this.handleSubmit}
                  >
                    <input
                      type="text"
                      className="w-100"
                      name={ingredient.name}
                      placeholder={ingredient.quantityStored}
                      onChange={this.handleInput}
                    ></input>
                  </form>
                </small>
              )}
              <button
                className="btn-flat col s1 center fridge-remove-item-button"
                onClick={this.removeFrmFridge}
              >
                <i
                  className="material-icons tiny"
                  data-index={i}
                  data-name={ingredient.name}
                >
                  clear
                </i>
              </button>
            </CollectionItem>
          ))}
        </Container>
      </Collection>
    );
  }
}
Fridge.propTypes = {
  auth: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired,
  setFridgeData: PropTypes.func.isRequired,
  removeFridgeItem: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  userData: state.userData,
});
export default connect(mapStateToProps, {
  getUserFridgeData,
  setFridgeData,
  removeFridgeItem,
  setShoppingList,
  searchRecipes,
  setDataLoading,
})(Fridge);
