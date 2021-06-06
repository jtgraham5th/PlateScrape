import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import "./style.css";
import { connect } from "react-redux";
import { Row, Col, Select, Icon } from "react-materialize";
import { setDataLoading } from "../state/actions";

class MealSelect extends Component {
  state = {
    value: "",
    shoppingList: [],
    newItem: "",
    newAmount: 0,
  };

  componentDidMount() {
    // console.log(this.props);
  }
  componentDidUpdate(prevProps) {}

  handleSelect = (event) => {
    let newValue = event.target.value;
    this.setState({ value: newValue });
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
  render(props) {
    const {recipes} = this.props.userData
    const {value} = this.state
    return (
      <Col s={3} className="meal-select">
        {recipes[value] ? (
          <h6 className="meal-select-choice">{recipes[value].name}<br/><em></em></h6>
        ) : null}
        <Select
          id="Day1-Meal1"
          multiple={false}
          onChange={this.handleSelect}
          options={{
            classes: "meal-plan-select",
            dropdownOptions: {
              alignment: "left",
              autoTrigger: true,
              closeOnClick: true,
              constrainWidth: true,
              coverTrigger: false,
              hover: false,
              inDuration: 150,
              onCloseEnd: null,
              onCloseStart: null,
              onOpenEnd: null,
              onOpenStart: null,
              outDuration: 250,
            },
          }}
          value={this.state.value}
        >
          <option disabled value="">
            Choose your Meal
          </option>
          {recipes.map((recipe, i) => (
            <option value={i} className="meal-select-dropdown-option">{recipe.name}</option>
          ))}
        </Select>
      </Col>
    );
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  userData: state.userData,
});
export default connect(mapStateToProps, {
  setDataLoading,
})(MealSelect);
