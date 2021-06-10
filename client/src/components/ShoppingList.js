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
  Chip,
  Collapsible,
  CollapsibleItem,
} from "react-materialize";
import { fraction } from "mathjs";
import { useSelector, useDispatch } from "react-redux";
import * as ActionCreators from "../state/actions";
import { bindActionCreators } from "redux";
import NewFridgeItem from "./NewFridgeItem";
import RecipeFilter from "./RecipeFilter";

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

  const [recipes, setRecipes] = useState(userData.recipes);
  const [shoppingList, setShoppingList] = useState(userData.shoppingList);
  const [itemKey, setItemKey] = useState("");
  const [fridge, setFridge] = useState(userData.fridge);
  const [modal, setModal] = useState(false);
  const [categories, setCatgories] = useState(userData.categories);
  const [selectedRecipes, setSelectedRecipes] = useState([])

  useEffect(() => {
    const { isAuthenticated, userId } = auth;
    // if (isAuthenticated && userId) {
    //   getUserShoppingList(userId);
    //   setFridge(newFridge);
    //   setShoppingList(newList);
    //   setCatgories(newCategories);
    //   compareWithFridge();
    // }
    return () => {
      console.log("reset itemKey");
      setItemKey("");
    };
  }, []);

  useEffect(() => {
    setShoppingListData(shoppingList);
  }, [shoppingList]);

  useEffect(() => {
    setFridgeData(fridge);
  }, [fridge]);

  useEffect(
    (modal) => {
      if (itemKey !== "") {
        setModal(!modal);
      }
    },
    [itemKey]
  );

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
    setItemKey(event.target.dataset.index);
    setModal(!modal);
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
  const compareWithFridge = (ingredient) => {
    if (fridge.length > 0) {
      for (let i = 0; i <= fridge.length - 1; i++) {
        if (fridge[i].name === ingredient.name) {
          if (fridge[i].quantity >= ingredient.quantity) {
            return true;
          }
        }
      }
    }
    return false;
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
    if (typeof quantity === "number" && !Number.isInteger(quantity)) {
      console.log(quantity);
      let wholeNum = Math.trunc(quantity);
      let decimalPart = quantity % 1;
      return `${wholeNum}  ${fraction(decimalPart).toFraction()}`;
    }
    return quantity;
  };
  const highlightIngredients = (recipe) => {
    let ingredientArray = []
    recipe.ingredients.forEach(ingredient => {
      ingredientArray.push(ingredient.name)
    })
    setSelectedRecipes(ingredientArray)
    console.log(selectedRecipes)
  }

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
      <RecipeFilter setSelectedRecipes={setSelectedRecipes} recipes={recipes} />
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
                      className={`row transparent shopping-list-item ${
                        compareWithFridge(ingredient) ? "disabled" : ""
                      } ${selectedRecipes.includes(ingredient.name) ? "highlighted" : ""}
                    `}
                      data-name={ingredient.name}
                      data-quantity={ingredient.quantity}
                      data-category={ingredient.category}
                      key={i}
                    >
                      <div className="shopping-list-check">
                        {compareWithFridge(ingredient) ? (
                          <Icon onClick={() => setItemKey(i)}>check_box</Icon>
                        ) : (
                          <Icon onClick={() => setItemKey(i)}>
                            check_box_outline_blank
                          </Icon>
                        )}
                      </div>
                      <Col s={6} className="shopping-list-item-name">
                        {ingredient.name}
                      </Col>
                      <div className="col s3 shopping-list-button">
                        <small>
                          {convertQuantity(ingredient.quantity)}{" "}
                          {unitAbbreviation(ingredient.unit)}
                        </small>
                      </div>
                      <button
                        className={`col s1 btn-flat shopping-list-button ${
                          compareWithFridge(ingredient) ? "" : "red-text"
                        }`}
                        onClick={removeFrmList}
                      >
                        <i
                          className="material-icons tiny"
                          data-name={ingredient.name}
                          data-index={i}
                        >
                          highlight_off
                        </i>
                      </button>
                    </CollectionItem>
                  </>
                ) : null;
              })}
            </>
          ))
        )}
        <NewFridgeItem
          modal={modal}
          setModal={setModal}
          itemKey={itemKey}
          setItemKey={setItemKey}
          fridge={fridge}
          setFridge={setFridge}
        />
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
