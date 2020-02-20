import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import "./style.css";
import { Button } from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getUserFridgeData, setFridgeData, removeFridgeItem } from "../actions/authActions";

var axios = require("axios");

class Fridge extends Component {
  state = {
    fridge: [],
    shoppingList: [],
    newItem: "",
    newAmount: 0
  };

  componentDidMount() {
    if (this.props.auth.user.isAuthenticated) {
      this.props.getUserFridgeData(this.props.auth.user.id);
      this.setState({
        fridge: this.props.userData.fridge,
        shoppingList: this.props.userData.shoppingList
      });
    } else {
      this.props.setFridgeData([]);
    }
  }
  componentDidUpdate(props) {
    console.log(props);
    if (this.state.fridge.length !== this.props.userData.fridge.length) {
      this.setState({
        fridge: this.props.userData.fridge
      });
    }
  }
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
    let ingredientAmount = 0;
    this.state.shoppingList.map(el =>
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
  userCreatedNewFridgeItem = event => {
    event.preventDefault();
    let newIngredientName = this.state.newItem;
    let newIngredientAmount = this.state.newAmount;
    // let newIngredientUnit = 0;
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
      this.saveNewFridgeItem(newIngredient);
    } else {
      alert("This item already exist in your fridge");
      this.setState({
        newItem: ""
      });
    }
    this.getClasses(newIngredientName, newIngredientAmount);
  };
  saveNewFridgeItem = newIngredient => {
    if (this.props.auth.isAuthenticated) {
      axios
        .post("/api/fridgeItem", {
          newIngredient: newIngredient,
          userId: this.props.auth.user.id
        })
        .then(response => {
          console.log(response);
          console.log(this.props.auth.user.id);
          this.props.getUserFridgeData(this.props.auth.user.id);
        })
        .catch(err => {
          console.log(err);
          alert("Failed to create: " + err.message);
        });
    }
  };
  alphaSort = event => {
    let alphaSort = this.state.shoppingList.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase()
        ? 1
        : b.name.toLowerCase() > a.name.toLowerCase()
        ? -1
        : 0
    );
    console.log(alphaSort);
    this.setState({
      shoppingList: alphaSort
    });
    console.log(this.state.shoppingList);
  };
  increaseSort = event => {
    let increaseSort = this.state.shoppingList.sort((a, b) =>
      a.amount > b.amount ? 1 : b.amount > a.amount ? -1 : 0
    );
    console.log(increaseSort);
    this.setState({
      shoppingList: increaseSort
    });
    console.log(this.state.shoppingList);
  };
  decreaseSort = event => {
    let decreaseSort = this.state.shoppingList.sort((a, b) =>
      b.amount > a.amount ? 1 : a.amount > b.amount ? -1 : 0
    );
    console.log(decreaseSort);
    this.setState({
      shoppingList: decreaseSort
    });
    console.log(this.state.shoppingList);
  };
  removeFrmFridge = event => {
    const removeIndex = event.target.dataset.index;
    const item = event.target.dataset.name;
    let updatedList = this.state.shoppingList;
    console.log(updatedList);
    updatedList.splice(removeIndex, 1);
    console.log(updatedList);
    this.setState({
      shoppingList: updatedList
    });
    if (this.state.modal2) {
      this.toggleModal(2);
    }
    if (this.props.auth.isAuthenticated) {
      this.props.removeFridgeItem(item, this.props.auth.user.id)
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
                shoppingList: prevState.shoppingList.map(el =>
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
                shoppingList: prevState.shoppingList.map(el =>
                  el.name === ingredient
                    ? {
                        ...el,
                        className:
                          "d-flex pl-3 row exists border-bottom border-primary"
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
  render(props) {
    return (
      <div className="col-md-4 border rounded bg-light">
        <h1
          style={{
            fontFamily: "monospace"
          }}
        >
          Fridge
        </h1>
        <form onSubmit={this.userCreatedNewFridgeItem} className="d-flex mb-2">
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
          <Button type="submit" className="btn-success">
            Add
          </Button>
        </form>
        <div className="row">
          <div className="col-md-6 border h6 p-0">Ingredient Name</div>
          <div className="col-md-3 border h6 p-0">Needed</div>
          <div className="col-md-3 border h6 p-0">Have</div>
        </div>
        {this.props.userData.fridge.map((ingredient, i) => (
          <div key={i} className="row">
            <div className="col-md-5 border">{ingredient.name}</div>
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
            <button
              className="col-md-1 border p-0 tiny material-icons text-red"
              onClick={this.removeFrmFridge}
              data-name={ingredient.name}
            >
              clear
            </button>
          </div>
        ))}
      </div>
    );
  }
}
Fridge.propTypes = {
  auth: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired,
  setFridgeData: PropTypes.func.isRequired,
  removeFridgeItem: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  userData: state.userData
});
export default connect(mapStateToProps, {
  getUserFridgeData,
  setFridgeData,
  removeFridgeItem
})(Fridge);
