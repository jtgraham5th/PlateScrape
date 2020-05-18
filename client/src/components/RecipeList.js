import React, { Component } from "react";
import { renderToStaticMarkup } from "react-dom/server";
// import { Link } from "react-router-dom";
// import "./style.css";
import {
  Row,
  Button,
  Collapsible,
  CollapsibleItem,
  Icon,
} from "react-materialize";
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
      recipes: this.props.userData.recipes,
    });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.userData.recipes !== this.props.userData.recipes) {
      this.setState({ recipes: this.props.userData.recipes });
    }
  }
  renderTooltip(recipe) {
    return recipe.ingredients.map((ingredient, e) => (
      <>
        <small className="left-align">
          {ingredient.amount} {ingredient.unit} {ingredient.name}
        </small>
        <br />
      </>
    ));
  }
  render(props) {
    return (
        <Collapsible accordion>
          <CollapsibleItem
            expanded
            icon={<Icon>arrow_drop_down</Icon>}
            header="Recipes"
            node="div"
            id="collapsible-item"
          >
            <Row className="section" id="recipe-button-containter">
              {this.state.recipes.map((recipe, i) => (
                <Button
                  className="col s4"
                  id="recipe-button"
                  key={i}
                  node="button"
                  tooltip={renderToStaticMarkup(this.renderTooltip(recipe))}
                  tooltipOptions={{
                    position: "bottom",
                  }}
                  waves="light"
                >
                  <small>{recipe.name}</small>
                </Button>
                //  <div key={i} className="">
                //     <button
                //       className="small teal lighten-5 rounded w-100"
                //       id={`toggler${i}`}
                //     >
                //       {recipe.URL}
                //     </button>
                //     <UncontrolledCollapse toggler={`#toggler${i}`}>
                //       <div className="card-body white">
                //         {recipe.ingredients.map((ingredient, e) => (
                //           <h6 key={e}>
                //             {ingredient.amount} {ingredient.unit}{" "}
                //             {ingredient.name}
                //           </h6>
                //         ))}
                //       </div>
                //     </UncontrolledCollapse>
                //   </div>
              ))}
            </Row>
          </CollapsibleItem>
        </Collapsible>
    );
  }
}
RecipeList.propTypes = {
  auth: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  userData: state.userData,
});
export default connect(mapStateToProps, {
  getUserFridgeData,
})(RecipeList);
