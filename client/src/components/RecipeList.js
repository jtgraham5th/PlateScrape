import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import "./style.css";
import {
  UncontrolledCollapse
} from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getUserFridgeData } from "../actions";

// var axios = require("axios");

class RecipeList extends Component {
  state = {
    recipes: [],
    groceryList: [],
    fridge: [],
  };

  componentDidMount() {
    this.setState({
      recipes: this.props.userData.recipes
    })
  };
  componentDidUpdate(prevProps) {
    console.log(prevProps);
    if (prevProps.userData.recipes !== this.props.userData.recipes) {
      this.setState({ recipes: this.props.userData.recipes });
    } 
  }
  render(props) {
    return (
            <div className="col-md-3" id="accordion">
              {this.state.recipes.map((recipe, i) => (
                <div key={i} className="">
                  <button
                    className="small teal lighten-5 rounded w-100"
                    id={`toggler${i}`}
                  >
                    {recipe.URL}
                  </button>
                  <UncontrolledCollapse toggler={`#toggler${i}`}>
                    <div className="card-body white">
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
    );
  }
}
RecipeList.propTypes = {
  auth: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  userData: state.userData
});
export default connect(mapStateToProps, {
  getUserFridgeData
})(RecipeList);
