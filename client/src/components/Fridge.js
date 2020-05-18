import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import "./style.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Col,
  Collapsible,
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
} from "../actions";

var axios = require("axios");

class Fridge extends Component {
  state = {
    fridge: [],
    shoppingList: [],
    newItem: "",
    newAmount: 0,
  };

  componentDidMount() {
    console.log(this.props);
    if (this.props.auth.isAuthenticated && this.props.auth.userId) {
      this.props.getUserFridgeData(this.props.auth.userId);
      this.setState({
        fridge: this.props.userData.fridge,
        shoppingList: this.props.userData.shoppingList,
      });
    } else {
      this.props.setFridgeData([]);
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.userData.shoppingList !== this.props.userData.shoppingList) {
      this.setState({ shoppingList: this.props.userData.shoppingList });
    }
    if (prevProps.userData.fridge !== this.props.userData.fridge) {
      this.setState({ fridge: this.props.userData.fridge });
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
          el.name === ingredientName ? { ...el, amountStored: newValue } : el
        ),
      }));
    }
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.toggleFridgeEdit(event);
    let ingredientName = event.target.name;
    console.log(ingredientName);
    let ingredientAmount = 0;
    this.state.shoppingList.map((el) =>
      el.name === ingredientName ? (ingredientAmount = el.amount) : el
    );
    console.log(ingredientAmount);
    // this.getClasses(ingredientName, ingredientAmount);
    this.props.setFridgeData(this.state.fridge);
  };
  handleNewFridgeItem = (event) => {
    let newValue = event.target.value;
    this.setState({
      newItem: newValue,
    });
  };
  handleNewFridgeAmount = (event) => {
    let newValue = event.target.value;
    if (isNaN(newValue)) {
      alert("Please enter a numeric value");
      newValue = "";
    } else {
      this.setState({
        newAmount: newValue,
      });
    }
  };
  userCreatedNewFridgeItem = (event) => {
    event.preventDefault();
    let newIngredientName = this.state.newItem;
    let newIngredientAmount = this.state.newAmount;
    // let newIngredientUnit = 0;
    /* check to see if ingredient already exisit in the Fridge*/
    if (!this.state.fridge.some((e) => e.name === newIngredientName)) {
      console.log("included");
      let fridge = this.state.fridge;
      let newIngredient = {
        name: newIngredientName,
        amountNeeded: 0,
        amountStored: parseFloat(newIngredientAmount),
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
    this.getClasses(newIngredientName, newIngredientAmount);
  };
  saveNewFridgeItem = (newIngredient) => {
    if (this.props.auth.isAuthenticated) {
      axios
        .post("/api/fridgeItem", {
          newIngredient: newIngredient,
          userId: this.props.auth.userId,
        })
        .then((response) => {
          this.props.getUserFridgeData(this.props.auth.userId);
        })
        .catch((err) => {
          console.log(err);
          alert("Failed to create: " + err.message);
        });
    }
  };
  removeFrmFridge = (event) => {
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

    if (this.props.auth.isAuthenticated) {
      this.props.removeFridgeItem(item, this.props.auth.userId);
    }
  };
  getClasses = (ingredient, amount) => {
    console.log("---getclasses---");
    let fridge = this.props.userData.fridge;
    console.log(fridge.length, fridge);
    console.log(ingredient, amount);
    if (fridge.length > 0) {
      let classes = fridge.map((item, x) =>
        item.name === ingredient
          ? item.amountStored >= amount
            ? this.setState(
                (prevState) => (
                  console.log("changing to TRUE"),
                  {
                    shoppingList: prevState.shoppingList.map((el) =>
                      el.name === ingredient
                        ? {
                            ...el,
                            enoughInFridge: true,
                          }
                        : el
                    ),
                  }
                ),
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
  render(props) {
    return (
      <Collapsible accordion className="final-component">
        <CollapsibleItem
          expanded
          icon={<Icon>arrow_drop_down</Icon>}
          id="collapsible-item"
          header="Fridge"
          node="div"
        >
          <Collection>
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
                id="fridge-amount-input"
                type="text"
                placeholder="Amount"
                onChange={this.handleNewFridgeAmount}
              />
              <Button
                type="submit"
                className="col s2"
                onClick={this.userCreatedNewFridgeItem}
              >
                Add
              </Button>
            </CollectionItem>
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
              <CollectionItem
                key={i}
                className="row fridge-item valign-wrapper"
              >
                <Col s={9}>{ingredient.name} </Col>
                <small className="col s1 fridge-amount-needed ">
                  {ingredient.amountNeeded} {ingredient.unit}
                </small>
                {!ingredient.edit ? (
                  <small
                    className="col s1 center fridge-amount-have"
                    data-name={ingredient.name}
                    onClick={this.toggleFridgeEdit}
                  >
                    {ingredient.amountStored} {ingredient.unit}
                  </small>
                ) : (
                  <small
                    className="col s1 center fridge-amount-have"
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
                        placeholder={ingredient.amountStored}
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
          </Collection>
        </CollapsibleItem>
      </Collapsible>
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
})(Fridge);
