import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import "./style.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Select,
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
import MealSelect from "./MealSelect";

var axios = require("axios");

class MealPlanner extends Component {
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
      fridge.map((item, x) =>
        item.name === ingredient
          ? item.amountStored >= amount
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
      <Collection className="vertical-scroll">
        <CollectionItem>
          <Row>
            <Col s={3} className="meal-planner-row-heading">
              Day One
            </Col>
            <MealSelect />
            <MealSelect />
            <MealSelect />
          </Row>
        </CollectionItem>
        <CollectionItem>
          <Row>
            <Col s={3} className="meal-planner-row-heading">
              Day Two
            </Col>
            <MealSelect />
            <MealSelect />
            <MealSelect />
          </Row>
        </CollectionItem>
        <CollectionItem>
          <Row>
            <Col s={3} className="meal-planner-row-heading">
              Day Three
            </Col>
            <MealSelect />
            <MealSelect />
            <MealSelect />
          </Row>
        </CollectionItem>
        <CollectionItem>
          <Row>
            <Col s={3} className="meal-planner-row-heading">
              Day Four
            </Col>
            <MealSelect />
            <MealSelect />
            <MealSelect />
          </Row>
        </CollectionItem>
        <CollectionItem>
          <Row>
            <Col s={3} className="meal-planner-row-heading">
              Day Five
            </Col>
            <MealSelect />
            <MealSelect />
            <MealSelect />
          </Row>
        </CollectionItem>
        <CollectionItem>
          <Row>
            <Col s={3} className="meal-planner-row-heading">
              Day Six
            </Col>
            <MealSelect />
            <MealSelect />
            <MealSelect />
          </Row>
        </CollectionItem>
        <CollectionItem>
          <Row>
            <Col s={3} className="meal-planner-row-heading">
              Day Seven
            </Col>
            <MealSelect />
            <MealSelect />
            <MealSelect />
          </Row>
        </CollectionItem>
      </Collection>
    );
  }
}
// Fridge.propTypes = {
//   auth: PropTypes.object.isRequired,
//   userData: PropTypes.object.isRequired,
//   setFridgeData: PropTypes.func.isRequired,
//   removeFridgeItem: PropTypes.func.isRequired,
// };
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
})(MealPlanner);
