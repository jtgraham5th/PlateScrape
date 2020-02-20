import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import "./style.css";
import {
  Button,
  Row,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter
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
import {
  getUserShoppingList,
  setShoppingList,
  setFridgeData
} from "../actions/authActions";

library.add(faSortAlphaUp);

var axios = require("axios");

class ShoppingList extends Component {
  state = {
    recipes: [],
    shoppingList: [],
    fridge: [],
    modal1: false,
    modal2: false
  };

  componentDidMount() {
    if (this.props.auth.user.isAuthenticated) {
      this.props.getShoppingList(this.props.auth.user.id);
      this.setState({
        fridge: this.props.userData.fridge,
        shoppingList: this.props.userData.shoppingList
      });
    } else {
      this.props.setShoppingList([]);
    }
  }
  componentDidUpdate(props) {
    console.log(props);
    if (
      this.state.shoppingList.length !== this.props.userData.shoppingList.length
    ) {
      this.setState({ shoppingList: this.props.userData.shoppingList });
    }
  }
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
    this.props.setShoppingList(this.state.shoppingList);

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
    this.props.setShoppingList(this.state.shoppingList);

    console.log(this.state.shoppingList);
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
  addToFridge = event => {
    let newIngredientName = event.target.name;
    let newIngredientAmount = parseFloat(event.target.dataset.amount) || 0;
    let newIngredientUnit = event.target.dataset.unit;
    console.log(newIngredientUnit);
    /* check to see if ingredient already exisit in the groceryList*/
    if (!this.props.userData.fridge.some(e => e.name === newIngredientName)) {
      let fridge = this.props.userData.fridge;
      console.log(fridge);
      let newIngredient = {
        name: newIngredientName,
        amountNeeded: newIngredientAmount,
        amountStored: newIngredientAmount,
        unit: newIngredientUnit,
        edit: false
      };
      fridge.push(newIngredient);
      if (this.props.auth.isAuthenticated) {
        axios
        .post("/api/fridgeItem", {
          newIngredient: newIngredient,
          userId: this.props.auth.user.id
        })
          .then(response => {
            console.log(response);
          })
          .catch(err => {
            console.log(err);
            alert("Failed to create: " + err.message);
          });
      }
      this.props.setFridgeData(fridge);
    } else {
      // let fridge = this.state.fridge;
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
      this.props.setFridgeData(this.state.fridge);
    }
    this.getClasses(newIngredientName, newIngredientAmount);
    console.log(this.state.fridge);
    this.toggleModal(2);
    //   });
  };

  removeFrmList = event => {
    const removeIndex = event.target.dataset.index;
    let updatedList = this.state.shoppingList;
    console.log(updatedList);
    updatedList.splice(removeIndex, 1);
    console.log(updatedList);
    this.setState({
      shoppingList: updatedList
    });
    this.props.setShoppingList(this.state.shoppingList);
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
      <div className="col-md-4 rounded bg-light yellow lighten-4 mr-4">
        <Row className="text-center brown border border-bottom border-dark">
          <h1
            className="w-100"
            style={{
              fontFamily: "monospace"
            }}
          >
            Shopping List
          </h1>
        </Row>
        <Row className="d-flex align-items-center border-bottom border-dark pb-2 pt-2">
          <FontAwesomeIcon
            icon={faSortAlphaUp}
            size="sm"
            color="black"
            className="col-md-4"
            onClick={this.alphaSort}
          />
          <FontAwesomeIcon
            icon={faSortAmountUp}
            size="sm"
            color="black"
            className="col-md-4"
            onClick={this.decreaseSort}
          />
          <FontAwesomeIcon
            icon={faSortAmountDownAlt}
            size="sm"
            color="black"
            className="col-md-4"
            onClick={this.increaseSort}
          />
        </Row>
        {this.props.userData.shoppingList.map((ingredient, i) => (
          <div
            data-name={ingredient.name}
            data-amount={ingredient.amount}
            key={i}
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
                className="teal darken-4 white-text"
                style={{fontFamily: "monospace"}}
              >
                Item added to Fridge
              </ModalHeader>
              <ModalBody>
                Would you also like to remove this item from your shopping list?
              </ModalBody>
              <ModalFooter className="d-flex justify-content-center">
                <Button color="secondary" onClick={this.removeFrmList} id={i} className="mr-4">
                  Yes
                </Button>
                <Button color="secondary" onClick={() => this.toggleModal(2)}>
                  No
                </Button>
              </ModalFooter>
            </Modal>
          </div>
        ))}
      </div>
    );
  }
}
ShoppingList.propTypes = {
  auth: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired,
  setShoppingList: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  userData: state.userData
});
export default connect(mapStateToProps, {
  getUserShoppingList,
  setShoppingList,
  setFridgeData
})(ShoppingList);
