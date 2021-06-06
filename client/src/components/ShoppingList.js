import React, { useState, useEffect } from "react";
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
import { fraction } from "mathjs";
import { useSelector, useDispatch } from "react-redux";
import * as ActionCreators from "../state/actions";
import { bindActionCreators } from "redux";

var axios = require("axios");

const ShoppingList = () => {
  const userData = useSelector((state) => state.userData);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const {
    getUserShoppingList,
    setShoppingListData,
    removeShoppingListItem,
    setFridgeData,
  } = bindActionCreators(ActionCreators, dispatch);

  const [shoppingList, setShoppingList] = useState(userData.shoppingList);
  const [itemKey, setItemKey] = useState("");
  const [fridge, setFridge] = useState(userData.fridge);
  const [modal, setModal] = useState(false);
  const [categories, setCatgories] = useState(userData.categories);
  console.log(categories);
  
  useEffect(() => {
    const { isAuthenticated, userId } = auth;
    const {
      fridge: newFridge,
      shoppingList: newList,
      categories: newCategories,
    } = userData;
    console.log(newList);
    if (isAuthenticated && userId) {
      getUserShoppingList(userId);
      setFridge(newFridge);
      setShoppingList(newList);
      setCatgories(newCategories);
      compareWithFridge();
      console.log("");
      // addCategories();
    }
    // return (prevProps) => {
    //   console.log(prevProps)
    //   const { fridge, shoppingList } = userData;
    // if (prevProps.userData.shoppingList !== shoppingList) {
    //   setShoppingList(shoppingList);
    //   compareWithFridge();
    // }
    // if (prevProps.userData.fridge !== fridge) {
    //   setFridge(fridge);
    //   compareWithFridge();
    // }
    // };
  });
  useEffect(() => {
    setShoppingListData(shoppingList);
  }, [shoppingList]);

  useEffect(() => {
    setFridgeData(fridge);
  }, [fridge]);

  useEffect((modal) => {
    if (itemKey !== "") {
      setModal(!modal);
    }
  }, [itemKey]);

  const alphaSort = (event) => {
    let sortedList = shoppingList.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase()
        ? 1
        : b.name.toLowerCase() > a.name.toLowerCase()
        ? -1
        : 0
    );
    console.log(sortedList);
    setShoppingList(sortedList);
  };
  const increaseSort = (event) => {
    let sortedList = shoppingList.sort((a, b) =>
      a.quantity > b.quantity ? 1 : b.quantity > a.quantity ? -1 : 0
    );
    setShoppingList(sortedList);
  };
  const decreaseSort = (event) => {
    let sortedList = shoppingList.sort((a, b) =>
      b.quantity > a.quantity ? 1 : a.quantity > b.quantity ? -1 : 0
    );
    setShoppingList(sortedList);
  };
  const addToFridge = (event) => {
    const newFridge = userData.fridge;
    const { isAuthenticated, userId } = auth;
    let newIngredientName = event.target.dataset.name;
    let newIngredientQuantity = parseFloat(event.target.dataset.quantity) || 0;
    let newIngredientUnit = event.target.dataset.unit;
    console.log(newIngredientName, event.target);
    /* check to see if ingredient already exisit in the groceryList*/
    if (!newFridge.some((e) => e.name === newIngredientName)) {
      let newIngredient = {
        name: newIngredientName,
        quantityNeeded: newIngredientQuantity,
        quantityStored: newIngredientQuantity,
        unit: newIngredientUnit,
        edit: false,
      };
      newFridge.push(newIngredient);
      setFridge(newFridge);
      setItemKey(event.target.dataset.index);
      compareWithFridge();

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
      console.log("before:", fridge);

      setFridge((prevState) => {
        prevState.map((el) =>
          el.name === newIngredientName
            ? {
                ...el,
                quantityNeeded:
                  el.quantityNeeded + parseFloat(newIngredientQuantity),
              }
            : el
        );
      });
    }
  };

  const removeFrmList = (event) => {
    const { isAuthenticated, userId } = auth;
    const removeIndex = event.target.dataset.index;
    const item = event.target.dataset.name;
    let updatedList = shoppingList;
    updatedList.splice(removeIndex, 1);
    setShoppingList(updatedList);

    if (isAuthenticated) {
      removeShoppingListItem(item, userId);
    }
    compareWithFridge();
    setModal(!modal);
  };

  const compareWithFridge = () => {
    const newFridge = userData.fridge;
    const newShoppingList = userData.shoppingList;

    newShoppingList.map((shopItem, x) =>
      newFridge.map((fridgeItem, y) =>
        fridgeItem.name === shopItem.name
          ? fridgeItem.quantityStored >= shopItem.quantity
            ? setShoppingList((prevState) =>
                prevState.map((el) =>
                  el.name === shopItem.name
                    ? {
                        ...el,
                        enoughInFridge: true,
                      }
                    : el
                )
              )
            : setShoppingList((prevState) =>
                prevState.map((el) =>
                  el.name === shopItem.name
                    ? {
                        ...el,
                        enoughInFridge: false,
                      }
                    : el
                )
              )
          : ""
      )
    );
  };
  const checkFridge = (ingredient) => {
    return ingredient.enoughInFridge ? "disabled" : "";
  };
  const unitAbbreviation = (unit) => {
    switch (unit) {
      case "teaspoon":
        return "tsp";
      case "tablespoon":
        return "Tbs";
      case "pound":
        return "lbs";
      default:
        return unit;
    }
  };
  const convertQuantity = (quantity) => {
    if (quantity < 1) {
      return fraction(quantity).toFraction();
    }
    if (typeof quantity === "number" && !Number.isInteger(quantity)){
      console.log(quantity)
      let wholeNum = Math.trunc(quantity)
      let decimalPart = quantity % 1
      return `${wholeNum}  ${fraction(decimalPart).toFraction()}`
    }
    return quantity;
  };
  console.log(categories);
  return (
    <Row className="justify-content-center p-4 main-content">
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

      <Collection className="vertical-scroll" style={{ width: "100%" }}>
        {shoppingList.length < 1 ? (
          <CollectionItem className="section center-align border">
            <h5>Select a recipe to display the Ingredients</h5>
          </CollectionItem>
        ) : (
          categories.map((category, i) => (
            <>
              <CollectionItem className="list-category">
                <em>{category}</em>
              </CollectionItem>
              {shoppingList.map((ingredient, i) => {
                return ingredient.category === category ? (
                  <>
                    <CollectionItem
                      className={`row transparent shopping-list-item ${checkFridge(
                        ingredient
                      )}
                    `}
                      data-name={ingredient.name}
                      data-quantity={ingredient.quantity}
                      data-category={ingredient.category}
                      key={i}
                    >
                      <Col s={6} className="shopping-list-item-name">
                        {ingredient.name}
                      </Col>
                      <div className="col s3 shopping-list-button">
                        <small>{convertQuantity(ingredient.quantity)}{" "}
                        {unitAbbreviation(ingredient.unit)}</small>
                      </div>
                      <button
                        className={`col s1 btn-flat shopping-list-button ${
                          ingredient.enoughInFridge ? "disabled" : ""
                        }`}
                        onClick={addToFridge}
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
                        onClick={removeFrmList}
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
                    {itemKey === i ? (
                      <Modal isOpen={modal} toggle={() => setModal(!modal)}>
                        <ModalHeader
                          toggle={() => setModal(!modal)}
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
                            onClick={removeFrmList}
                            data-index={i}
                            className="mr-4"
                          >
                            Yes
                          </Button>
                          <Button
                            color="secondary"
                            onClick={() => setModal(!modal)}
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
            onClick={decreaseSort}
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
    </Row>
  );
};
export default ShoppingList;
