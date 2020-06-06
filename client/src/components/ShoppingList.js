import React, { Component } from "react";
// import { Link } from "react-router-dom";
import "../containers/home/style.css";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import {
  Row,
  Col,
  Icon,
  Collection,
  CollectionItem,
  Button,
} from "react-materialize";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getUserShoppingList,
  setShoppingList,
  removeShoppingListItem,
  setFridgeData,
} from "../actions";

var axios = require("axios");

class ShoppingList extends Component {
  state = {
    recipes: [],
    shoppingList: [],
    itemKey: 0,
    fridge: [],
    modal: false,
  };

  componentDidMount() {
    if (this.props.auth.isAuthenticated && this.props.auth.userId) {
      this.props.getUserShoppingList(this.props.auth.userId);
      this.setState(
        {
          fridge: this.props.userData.fridge,
          shoppingList: this.props.userData.shoppingList,
        },
        this.compareWithFridge()
      );
    } else {
      this.props.setShoppingList([]);
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.userData.shoppingList !== this.props.userData.shoppingList) {
      this.setState(
        { shoppingList: this.props.userData.shoppingList },
        this.compareWithFridge()
      );
    }
    if (prevProps.userData.fridge !== this.props.userData.fridge) {
      this.setState(
        { fridge: this.props.userData.fridge },
        this.compareWithFridge()
      );
    }
  }
  alphaSort = (event) => {
    let alphaSort = this.state.shoppingList.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase()
        ? 1
        : b.name.toLowerCase() > a.name.toLowerCase()
        ? -1
        : 0
    );
    console.log(alphaSort);
    this.setState({
      shoppingList: alphaSort,
    });
    console.log(this.state.shoppingList);
  };
  increaseSort = (event) => {
    let increaseSort = this.state.shoppingList.sort((a, b) =>
      a.amount > b.amount ? 1 : b.amount > a.amount ? -1 : 0
    );
    console.log(increaseSort);
    this.setState({
      shoppingList: increaseSort,
    });

    console.log(this.state.shoppingList);
  };
  decreaseSort = (event) => {
    let decreaseSort = this.state.shoppingList.sort((a, b) =>
      b.amount > a.amount ? 1 : a.amount > b.amount ? -1 : 0
    );
    console.log(decreaseSort);
    this.setState({
      shoppingList: decreaseSort,
    });

    console.log(this.state.shoppingList);
  };
  toggleModal = (event) => {
    this.setState({
      modal: !this.state.modal,
    });
  };
  addToFridge = (event) => {
    let newIngredientName = event.target.dataset.name;
    let newIngredientAmount = parseFloat(event.target.dataset.amount) || 0;
    let newIngredientUnit = event.target.dataset.unit;
    console.log(newIngredientName, event.target);
    /* check to see if ingredient already exisit in the groceryList*/
    if (!this.props.userData.fridge.some((e) => e.name === newIngredientName)) {
      let fridge = this.props.userData.fridge;
      console.log(fridge);
      let newIngredient = {
        name: newIngredientName,
        amountNeeded: newIngredientAmount,
        amountStored: newIngredientAmount,
        unit: newIngredientUnit,
        edit: false,
      };
      fridge.push(newIngredient);

      this.setState(
        { fridge: fridge, itemKey: event.target.dataset.index },
        () => {
          console.log(this.state.itemKey);
          this.props.setFridgeData(fridge);
          this.compareWithFridge();
          this.toggleModal();
        }
      );
      if (this.props.auth.isAuthenticated) {
        axios
          .post("/api/fridgeItem", {
            newIngredient: newIngredient,
            userId: this.props.auth.userId,
          })
          .then((response) => {
            console.log(response);
          })
          .catch((err) => {
            console.log(err);
            alert("Failed to create: " + err.message);
          });
      }
    } else {
      console.log("before:", this.state.fridge);

      this.setState(
        (prevState) => ({
          fridge: prevState.fridge.map((el) =>
            el.name === newIngredientName
              ? {
                  ...el,
                  amountNeeded:
                    el.amountNeeded + parseFloat(newIngredientAmount),
                }
              : el
          ),
        }),
        () => this.props.setFridgeData(this.state.fridge)
      );
      console.log("after:", this.state.fridge);
    }
    console.log(this.state.fridge);
  };

  removeFrmList = (event) => {
    const removeIndex = event.target.dataset.index;
    const item = event.target.dataset.name;
    let updatedList = this.state.shoppingList;
    updatedList.splice(removeIndex, 1);
    this.setState(
      {
        shoppingList: updatedList,
      },
      () => {
        this.props.setShoppingList(updatedList);
      }
    );
    if (this.props.auth.isAuthenticated) {
      this.props.removeShoppingListItem(item, this.props.auth.userId);
    }
    this.compareWithFridge();
  };
  compareWithFridge = () => {
    this.props.userData.shoppingList.map((shopItem, x) => {
      this.props.userData.fridge.map((fridgeItem, y) =>
        fridgeItem.name === shopItem.name
          ? fridgeItem.amountStored >= shopItem.amount
            ? this.setState(
                (prevState) => ({
                  shoppingList: prevState.shoppingList.map((el) =>
                    el.name === shopItem.name
                      ? {
                          ...el,
                          enoughInFridge: true,
                        }
                      : el
                  ),
                }),
                () => this.props.setShoppingList(this.state.shoppingList)
              )
            : this.setState(
                (prevState) => ({
                  shoppingList: prevState.shoppingList.map((el) =>
                    el.name === shopItem.name
                      ? {
                          ...el,
                          enoughInFridge: false,
                        }
                      : el
                  ),
                }),
                () => this.props.setShoppingList(this.state.shoppingList)
              )
          : ""
      );
    });
  };
  checkFridge = (ingredient) => {
    return ingredient.enoughInFridge ? "disabled" : "";
  };

  render(props) {
    return (
      <>
        {/* <Row className="teal darken-4 white-text valign-wrapper">
          <Col s={8}>
            <h5>Shopping List</h5>
          </Col>
          <Button
            flat
            className="col s1 shopping-list-sort-buttons"
            onClick={this.alphaSort}
            icon={<Icon tiny>sort_by_alpha</Icon>}
          />
          <Button
            flat
            className="col s1 shopping-list-sort-buttons"
            onClick={this.increaseSort}
            icon={<Icon tiny>vertical_align_top</Icon>}
          />
          <Button
            flat
            className="col s1 shopping-list-sort-buttons"
            onClick={this.decreaseSort}
            icon={
              <Icon tiny center>
                vertical_align_bottom
              </Icon>
            }
          />
        </Row> */}

        <Collection className="vertical-scroll list">
          {this.props.userData.shoppingList.length > 1 ? (
            this.props.userData.shoppingList.map((ingredient, i) => (
              <CollectionItem
                className={`row transparent shopping-list-item ${this.checkFridge(
                  ingredient
                )}
                `}
                data-name={ingredient.name}
                data-amount={ingredient.amount}
                key={i}
              >
                <Col s={8} className="shopping-list-item-name">
                  {ingredient.name}{" "}
                </Col>
                <small className="col s1 shopping-list-button">
                  {ingredient.amount} {ingredient.unit}
                </small>
                <button
                  className={`col s1 btn-flat shopping-list-button ${
                    ingredient.enoughInFridge ? "disabled" : ""
                  }`}
                  onClick={this.addToFridge}
                >
                  <i
                    className="material-icons tiny"
                    data-name={ingredient.name}
                    data-amount={ingredient.amount}
                    data-unit={ingredient.unit}
                    data-index={i}
                  >
                    add
                  </i>
                </button>
                <button
                  className={`col s1 btn-flat shopping-list-button ${
                    ingredient.enoughInFridge ? "red-text" : ""
                  }`}
                  onClick={this.removeFrmList}
                >
                  <i
                    className="material-icons tiny"
                    data-name={ingredient.name}
                    data-index={i}
                  >
                    close
                  </i>
                </button>
                {this.state.itemKey === i ? (
                  <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader
                      toggle={this.toggleModal}
                      className="teal darken-4 white-text"
                      style={{ fontFamily: "monospace" }}
                    >
                      Item added to Fridge
                    </ModalHeader>
                    <ModalBody>
                      Would you also like to remove this item from your shopping
                      list?
                    </ModalBody>
                    <ModalFooter className="d-flex justify-content-center">
                      <Button
                        color="secondary"
                        onClick={this.removeFrmList}
                        data-index={i}
                        className="mr-4"
                      >
                        Yes
                      </Button>
                      <Button color="secondary" onClick={this.toggleModal}>
                        No
                      </Button>
                    </ModalFooter>
                  </Modal>
                ) : null}
              </CollectionItem>
            ))
          ) : (
            <>
              <CollectionItem className="section center-align border">
                <h5>Select a recipe to display the Ingredients</h5>
              </CollectionItem>
            </>
          )}

          <CollectionItem className="white-text">
            <Button
              large
              className="col s4"
              // onClick={this.alphaSort}
              icon={<Icon tiny>local_printshop</Icon>}
            >
              {" "}
              Print{" "}
            </Button>
            <Button
              large
              className="col s4"
              // onClick={this.increaseSort}
              icon={<Icon tiny>send</Icon>}
            >
              Send
            </Button>
            <Button
              large
              className="col s4"
              onClick={this.decreaseSort}
              icon={
                <Icon tiny center>
                  share
                </Icon>
              }
            >
              Share
            </Button>
          </CollectionItem>
        </Collection>
      </>
    );
  }
}
ShoppingList.propTypes = {
  auth: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired,
  setShoppingList: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  userData: state.userData,
});
export default connect(mapStateToProps, {
  getUserShoppingList,
  setShoppingList,
  removeShoppingListItem,
  setFridgeData,
})(ShoppingList);
