import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import "./style.css";
import {
  Row,
  Col,
  Container,
  Collection,
  CollectionItem,
  TextInput,
  Button,
} from "react-materialize";
import { useSelector, useDispatch } from "react-redux";
import * as ActionCreators from "../state/actions";
import { bindActionCreators } from "redux";
import RecipeFilter from "./RecipeFilter";

const Fridge = () => {
  const userData = useSelector((state) => state.userData);
  // const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const {
    setFridgeData,
  } = bindActionCreators(ActionCreators, dispatch);

  const [recipes, setRecipes] = useState(userData.recipes);
  const [fridge, setFridge] = useState(userData.fridge);
  // const [shoppingList, setShoppingList] = useState(userData.shoppingList);
  const [newItem, setNewItem] = useState("");
  const [newQuantity, setNewQuantity] = useState(0);
  const [selectedRecipes, setSelectedRecipes] = useState([]);

  useEffect(() => {
    setFridgeData(fridge);
  }, [fridge]);

  const toggleFridgeEdit = async (event) => {
    // let ingredientName = event.target.dataset.name;
    // console.log(event.target.dataset.name);
    // await this.setState((prevState) => ({
    //   fridge: prevState.fridge.map((el) =>
    //     el.name === ingredientName ? { ...el, edit: !el.edit } : el
    //   ),
    // }));
    // console.log(this.state.fridge.indexOf(ingredientName));
  };

  const handleInput = (event) => {
    // let newValue = event.target.value;
    // let ingredientName = event.target.name;
    // if (isNaN(newValue)) {
    //   alert("Please enter a numeric value");
    //   newValue = "";
    // } else {
    //   this.setState((prevState) => ({
    //     fridge: prevState.fridge.map((el) =>
    //       el.name === ingredientName ? { ...el, quantityStored: newValue } : el
    //     ),
    //   }));
    // }
  };
  const handleSubmit = (event) => {
    // event.preventDefault();
    // toggleFridgeEdit(event);
    // let ingredientName = event.target.name;
    // console.log(ingredientName);
    // let ingredientQuantity = 0;
    // shoppingList.map((el) =>
    //   el.name === ingredientName ? (ingredientQuantity = el.quantity) : el
    // );
    // console.log(ingredientQuantity);
    // // this.getClasses(ingredientName, ingredientAmount);
    // this.props.setFridgeData(fridge);
  };
  const handleNewFridgeItem = (event) => {
    setNewItem(event.target.value);
  };
  const handleNewFridgeQuantity = (event) => {
    let newValue = event.target.value;
    if (isNaN(newValue)) {
      alert("Please enter a numeric value");
      newValue = "";
    } else {
      setNewQuantity(newValue);
    }
  };
  const userCreatedNewFridgeItem = (event) => {
    // event.preventDefault();
    // /* check to see if ingredient already exisit in the Fridge*/
    // if (!fridge.some((e) => e.name === newItem)) {
    //   console.log("included");
    //   let fridge = fridge;
    //   let newIngredient = {
    //     name: newIngredientName,
    //     quantity: parseFloat(newQuantity),
    //     unit: "oz",
    //   };
    //   fridge.push(newIngredient);
    //   this.setState(
    //     {
    //       fridge,
    //     },
    //     () => this.props.setFridgeData(fridge)
    //   );
    //   this.saveNewFridgeItem(newIngredient);
    // } else {
    //   alert("This item already exist in your fridge");
    //   this.setState({
    //     newItem: "",
    //   });
    // }
    // // this.getClasses(newIngredientName, newIngredientQuantity);
  };
  // const saveNewFridgeItem = (newIngredient) => {
  //   // const { isAuthenticated, userId } = this.props.auth;
  //   // if (isAuthenticated) {
  //   //   axios
  //   //     .post("/api/fridgeItem", {
  //   //       newIngredient: newIngredient,
  //   //       userId: userId,
  //   //     })
  //   //     .then((response) => {
  //   //       this.props.getUserFridgeData(userId);
  //   //     })
  //   //     .catch((err) => {
  //   //       console.log(err);
  //   //       alert("Failed to create: " + err.message);
  //   //     });
  //   // }
  // };
  const removeFrmFridge = (event) => {
    // const { isAuthenticated, userId } = this.props.auth;
    // const removeIndex = event.target.dataset.index;
    // const item = event.target.dataset.name;
    // let updatedList = fridge;
    // updatedList.splice(removeIndex, 1);
    // this.setState(
    //   {
    //     fridge: updatedList,
    //   },
    //   () => this.props.setFridgeData(updatedList)
    // );
    // if (isAuthenticated) {
    //   this.props.removeFridgeItem(item, userId);
    // }
  };
  // const getClasses = (ingredient, quantity) => {
  //   // console.log("---getclasses---");
  //   // let fridge = this.props.userData.fridge;
  //   // console.log(fridge.length, fridge);
  //   // console.log(ingredient, quantity);
  //   // if (fridge.length > 0) {
  //   //   fridge.map((item, x) =>
  //   //     item.name === ingredient
  //   //       ? item.quantityStored >= quantity
  //   //         ? this.setState(
  //   //             (prevState) => ({
  //   //               shoppingList: prevState.shoppingList.map((el) =>
  //   //                 el.name === ingredient
  //   //                   ? {
  //   //                       ...el,
  //   //                       enoughInFridge: true,
  //   //                     }
  //   //                   : el
  //   //               ),
  //   //             }),
  //   //             () => this.props.setShoppingListData(shoppingList)
  //   //           )
  //   //         : this.setState((prevState) => ({
  //   //             shoppingList: prevState.shoppingList.map((el) =>
  //   //               el.name === ingredient
  //   //                 ? {
  //   //                     ...el,
  //   //                     enoughInFridge: false,
  //   //                   }
  //   //                 : el
  //   //             ),
  //   //           }))
  //   //       : ""
  //   //   );
  //   // }
  // };
  return (
    <Row className="justify-content-center p-4 main-content">
      <RecipeFilter setSelectedRecipes={setSelectedRecipes} recipes={recipes} />
      <Collection id="fridge-collection" className="vertical-scroll">
        <CollectionItem className="row collection-message">
          <div className="col s12 small" style={{ lineHeight: "1rem" }}>
            Add items that you already have at home here and we'll compare them
            with what's in your shopping list so you won't have to worry about
            buying too much at the store!
          </div>
        </CollectionItem>
        <CollectionItem
          id="add-fridge-section"
          className="row s12 valign-wrapper"
        >
          <TextInput
            s={6}
            id="fridge-item-input"
            type="text"
            placeholder="What do you already have?"
            onChange={handleNewFridgeItem}
          />
          <TextInput
            s={3}
            id="fridge-quantity-input"
            type="text"
            placeholder="Quantity"
            onChange={handleNewFridgeQuantity}
          />
          <Button
            type="submit"
            className="col s2"
            onClick={userCreatedNewFridgeItem}
          >
            Add
          </Button>
        </CollectionItem>
        <Container className="fridge">
          <CollectionItem className="row fridge-item-header">
            <Col s={9}>Ingredient Name</Col>
            <Col s={1} className="">
              Needed
            </Col>
            <Col s={1} className="">
              Have
            </Col>
          </CollectionItem>
          {fridge.map((ingredient, i) => (
            <CollectionItem
              key={i}
              className={`row fridge-item valign-wrapper${
                selectedRecipes.includes(ingredient.name) ? "highlighted" : ""
              }`}
            >
              <Col s={9}>{ingredient.name}</Col>
              <small className="col s1 fridge-quantity-needed ">
                {ingredient.quantity} {ingredient.unit}
              </small>
              {!ingredient.edit ? (
                <small
                  className="col s1 center fridge-quantity-have"
                  data-name={ingredient.name}
                  onClick={toggleFridgeEdit}
                >
                  {ingredient.quantity} {ingredient.unit}
                </small>
              ) : (
                <small
                  className="col s1 center fridge-quantity-have"
                  data-name={ingredient.name}
                >
                  <form
                    name={ingredient.name}
                    data-name={ingredient.name}
                    onSubmit={handleSubmit}
                  >
                    <input
                      type="text"
                      className="w-100"
                      name={ingredient.name}
                      placeholder={ingredient.quantityStored}
                      onChange={handleInput}
                    ></input>
                  </form>
                </small>
              )}
              <button
                className="btn-flat col s1 center fridge-remove-item-button"
                onClick={removeFrmFridge}
              >
                <i
                  className="material-icons tiny"
                  data-index={i}
                  data-name={ingredient.name}
                >
                  clear
                </i>
              </button>
            </CollectionItem>
          ))}
        </Container>
      </Collection>
    </Row>
  );
};

export default Fridge;
