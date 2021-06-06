import React, { Component } from "react";
import { Button, Col, Icon } from "react-materialize";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { searchRecipes, setDataLoading } from "../state/actions";

class RecipeForm extends Component {
  state = {
    searchQuery: "",
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleFormSubmit = () => {
    this.props.setDataLoading();
    this.props.searchRecipes(this.state.searchQuery);
    this.setState({ searchQuery: "" });
  };

  render(props) {
    const { searchQuery } = this.state;
    return (
      <>
        <Col s={12} className="submit-recipe-button valign-wrapper">
          <Button
            type="submit"
            onClick={this.handleFormSubmit}
          >
            <Icon>search</Icon>
          </Button>
          <input
            name="searchQuery"
            className="col s10 ml-2"
            placeholder="Search for a recipe"
            type="text"
            value={searchQuery}
            id="recipe-form-input"
            onChange={this.handleInputChange}
          />
        </Col>
      </>
    );
  }
}

RecipeForm.propTypes = {
  userData: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  userData: state.userData,
});
export default connect(mapStateToProps, {
  searchRecipes,
  setDataLoading,
})(RecipeForm);
