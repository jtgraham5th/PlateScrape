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
    categories: [],
  };

  componentDidMount() {
    const { isAuthenticated, userId } = this.props.auth;
    const { fridge, shoppingList } = this.props.userData;
    console.log(this.props)
    if (isAuthenticated && userId) {
      this.props.getUserShoppingList(userId);
      this.setState(
        {
          fridge: fridge,
          shoppingList: shoppingList,
        },
        this.compareWithFridge(),
        this.addCategories()
      );
    } else {
      this.setState(
        {
          shoppingList: shoppingList,
        })
    }
  }
  componentDidUpdate(prevProps) {
    const { fridge, shoppingList } = this.props.userData;
    if (prevProps.userData.shoppingList !== shoppingList) {
      this.setState({ shoppingList: shoppingList }, this.compareWithFridge());
    }
    if (prevProps.userData.fridge !== fridge) {
      this.setState({ fridge: fridge }, this.compareWithFridge());
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
      a.quantity > b.quantity ? 1 : b.quantity > a.quantity ? -1 : 0
    );
    console.log(increaseSort);
    this.setState({
      shoppingList: increaseSort,
    });

    console.log(this.state.shoppingList);
  };
  decreaseSort = (event) => {
    let decreaseSort = this.state.shoppingList.sort((a, b) =>
      b.quantity > a.quantity ? 1 : a.quantity > b.quantity ? -1 : 0
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
    const { fridge, shoppingList } = this.props.userData;
    const { isAuthenticated, userId } = this.props.auth;

    let newIngredientName = event.target.dataset.name;
    let newIngredientQuantity = parseFloat(event.target.dataset.quantity) || 0;
    let newIngredientUnit = event.target.dataset.unit;
    console.log(newIngredientName, event.target);
    /* check to see if ingredient already exisit in the groceryList*/
    if (!fridge.some((e) => e.name === newIngredientName)) {
      // let fridge = fridge;
      console.log(fridge);
      let newIngredient = {
        name: newIngredientName,
        quantityNeeded: newIngredientQuantity,
        quantityStored: newIngredientQuantity,
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
      if (isAuthenticated) {
        axios
          .post("/api/fridgeItem", {
            newIngredient: newIngredient,
            userId: userId,
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
                  quantityNeeded:
                    el.quantityNeeded + parseFloat(newIngredientQuantity),
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
    const { isAuthenticated, userId } = this.props.auth;
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
    if (isAuthenticated) {
      this.props.removeShoppingListItem(item, userId);
    }
    this.compareWithFridge();
  };
  compareWithFridge = () => {
    const { fridge, shoppingList } = this.props.userData;

    shoppingList.map((shopItem, x) => {
      fridge.map((fridgeItem, y) =>
        fridgeItem.name === shopItem.name
          ? fridgeItem.quantityStored >= shopItem.quantity
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
    const { fridge, shoppingList, categories } = this.props.userData;

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

        <Collection className="vertical-scroll" style={{width: "100%"}}>
          {shoppingList.length < 1 ? (
            <CollectionItem className="section center-align border">
              <h5>Select a recipe to display the Ingredients</h5>
            </CollectionItem>
          ) : (
            categories.map((category, i) => (
              <>
                <CollectionItem className="list-category">
                  <em >{category}</em>
                </CollectionItem>
                {shoppingList.map((ingredient, i) => {
                  return ingredient.category === category ? (
                    <>
                      <CollectionItem
                        className={`row transparent shopping-list-item ${this.checkFridge(
                          ingredient
                        )}
                    `}
                        data-name={ingredient.name}
                        data-quantity={ingredient.quantity}
                        data-category={ingredient.category}
                        key={i}
                      >
                        <Col s={8} className="shopping-list-item-name">
                          {ingredient.name}
                        </Col>
                        <small className="col s1 shopping-list-button">
                          {ingredient.quantity} {ingredient.unit}
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
                            data-quantity={ingredient.quantity}
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
                      </CollectionItem>
                      {this.state.itemKey === i ? (
                        <Modal
                          isOpen={this.state.modal}
                          toggle={this.toggleModal}
                        >
                          <ModalHeader
                            toggle={this.toggleModal}
                            className="teal darken-4 white-text"
                            style={{ fontFamily: "monospace" }}
                          >
                            Item added to Fridge
                          </ModalHeader>
                          <ModalBody>
                            Would you also like to remove this item from your
                            shopping list?
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
                            <Button
                              color="secondary"
                              onClick={this.toggleModal}
                            >
                              No
                            </Button>
                          </ModalFooter>
                        </Modal>
                      ) : null}
                    </>
                  ) : null;
                })}
              </>
            ))
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
