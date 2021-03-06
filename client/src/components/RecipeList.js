import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Button,
  Collection,
  CollectionItem,
  Preloader,
  Icon,
} from "react-materialize";
import { useSelector, useDispatch } from "react-redux";
import * as ActionCreators from "../state/actions";
import { bindActionCreators } from "redux";
import { fraction } from "mathjs";
import convert from "convert-units";

import axios from "axios";
import RecipeForm from "./RecipeForm";

const RecipeList = (props) => {
  const userData = useSelector((state) => state.userData);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const {
    setRecipesData,
    setShoppingListData,
    getUserShoppingList,
    // getSuggestedRecipes,
    // setDataLoading,
    addCategory,
    // dataLoaded,
  } = bindActionCreators(ActionCreators, dispatch);

  const [shoppingList, setShoppingList] = useState(userData.shoppingList);
  const [categories, setCategories] = useState(userData.categories);
  const [recipes, setRecipes] = useState(userData.recipes);

  useEffect(() => {
    // getSuggestedRecipes();
  }, []);

  useEffect(() => {
    addCategory(categories);
  }, [categories]);

  useEffect(() => {
    setRecipesData(recipes);
    console.log(recipes);
  }, [recipes]);

  const saveNewShoppingListItem = (newIngredient) => {
    const { isAuthenticated, userId } = auth;

    if (isAuthenticated) {
      axios
        .post("/api/shoppingListItem", {
          newIngredient: newIngredient,
          userId: userId,
        })
        .then((response) => {
          getUserShoppingList(userId);
        })
        .catch((err) => {
          console.log(err);
          alert("Failed to create: " + err.message);
        });
    } else {
      setShoppingListData(shoppingList);
    }
  };

  const addToList = async (recipe) => {
    let ingredients = recipe.ingredients
    let array = categories;
    ingredients.forEach(
      (ingredient, i) => {
        console.log(ingredient);
        /* check to see if ingredient already exisit in the shoppingList*/
        if (
          !shoppingList.some((e) => e.name === ingredient.name.toLowerCase())
        ) {
          console.log("included");
          let newShoppingList = shoppingList;
          if (typeof ingredient.quantity === "string") {
            ingredient.quantity = fraction(ingredient.quantity).valueOf();
          }
          let newIngredient = {
            name: ingredient.name.toLowerCase(),
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            category: ingredient.category,
          };
          newShoppingList.push(newIngredient);
          setShoppingList(newShoppingList);
          saveNewShoppingListItem(newIngredient);
          if (
            !array.includes(ingredient.category) &&
            !categories.includes(ingredient.category)
          ) {
            array.push(ingredient.category);
            setCategories(array);
          }
        } else {
          let key = ingredient.name;
          let newList = [];
          shoppingList.forEach((item) => {
            if (item.name === key) {
              if (typeof item.quantity === "string") {
                item.quantity = fraction(ingredient.quantity).valueOf();
              }
              if (typeof ingredient.quantity === "string") {
                ingredient.quantity = fraction(ingredient.quantity).valueOf();
              }
              if (ingredient.unit === item.unit) {
                item.quantity = ingredient.quantity + item.quantity;
                console.log(item.name, ingredient.name, item.quantity);
              } else {
                let convertedAmount = convert(ingredient.quantity)
                  .from(unitAbbreviation(ingredient.unit))
                  .to(unitAbbreviation(item.unit));
                console.log("converted:", convertedAmount, ingredient.name);
                if (typeof convertedAmount === "string") {
                  convertedAmount = fraction(convertedAmount).valueOf();
                  console.log(
                    "convert Fractions:",
                    convertedAmount,
                    ingredient.name
                  );
                }
                item.quantity = convertedAmount + item.quantity;
                console.log("item quantity after adding", item.quantity);
              }
            }
            newList.push(item);
          });
          setShoppingList(newList);
        }
      },
      props.alert({
        trigger: true,
        state: "success",
        title: recipe.name,
        message: ": ingredients added to your shopping list",
      })
    );
  };
  const unitAbbreviation = (unit) => {
    switch (unit) {
      case "teaspoon":
        return "tsp";
      case "pinch":
        return "tsp";
      case "tablespoon":
        return "Tbs";
      case "pound":
        return "lbs";
      default:
        return unit;
    }
  };

  const addRecipe = (recipe) => {
    if (recipes.indexOf(recipe) < 0) {
      setRecipes([...recipes, recipe]);
    } else {
      let index = recipes.indexOf(recipe);
      let recipesCopy = recipes;
      recipesCopy.splice(index, 1);
      setRecipes(recipesCopy);
      setRecipesData(recipesCopy);
    }

    // const { title, thumbnail, href, ingredients } = recipe;
    // const url = encodeURIComponent(href);
    // setDataLoading();
    // axios.get(`/api/recipes/${url}`).then((response) => {
    // if (response.data.ingredients.length < 1) {
    // if (ingredients.length < 1) {
    //   this.toggleModal();
    // } else {
    // console.log(response.data);
    // dataLoaded();
    // let newList = recipes;
    // let newRecipe = {
    //   URL: href,
    //   name: title,
    //   // ingredients: response.data.ingredients,
    //   ingredients: ingredients,
    //   image: thumbnail,
    // };
    // newList.push(newRecipe);
    //     setRecipes(newList);

    //     console.log(recipes);
    //     addToList(ingredients);
    //   });
  };
  const loading = false;
  const { suggestedRecipes } = userData;

  return (
    <>
      <RecipeForm />
      <Row className="justify-content-center p-4 main-content-with-search">
        {!loading ? (
          suggestedRecipes < 1 ? (
            <Col
              s={12}
              id="recipe-list"
              className="section justify-content-center"
            >
              <h6>No Results Found</h6>
            </Col>
          ) : (
            <Collection style={{ border: 0 }}>
              {suggestedRecipes.map((recipe, i) => (
                <CollectionItem className="recipe-item" key={i}>
                  <div className="card-image">
                    <img alt={recipe.name} src={recipe.image} />
                  </div>
                  <Row style={{ flexWrap: "nowrap" }}>
                    <Col s={8} className="recipe-searchlist-title">
                      {recipe.name}
                    </Col>
                    <Button
                      className="col s2 recipe-action-button"
                      flat
                      color="secondary"
                      node="a"
                      href={recipe.URL}
                      icon={<Icon small>language</Icon>}
                    />
                    <Button
                      className="col s2 recipe-action-button"
                      flat
                      color="secondary"
                      onClick={() => addToList(recipe)}
                      data-url={recipe.href}
                      icon={<Icon small>playlist_add</Icon>}
                    />
                    <Button
                      className="col s2 recipe-action-button"
                      flat
                      color="secondary"
                      onClick={() => addRecipe(recipe)}
                      // onClick={() => setRecipes([...recipes,recipe])}
                      data-url={recipe.href}
                      icon={
                        recipes.includes(recipe) ? (
                          <Icon className="red-text" small>
                            favorite
                          </Icon>
                        ) : (
                          <Icon small>favorite_border</Icon>
                        )
                      }
                    />
                    {/* <Col s={4}>
                      <div
                        className="btn add-recipe-btn"
                        onClick={() => addRecipe(recipe)}
                        data-url={recipe.href}
                      >
                        Share
                      </div>
                    </Col>
                    <Col s={4}>
                      <div
                        className="btn add-recipe-btn"
                        onClick={() => addRecipe(recipe)}
                        data-url={recipe.href}
                      >
                        Visit
                      </div>
                    </Col>
                    <Col s={4}>
                      <div
                        className="btn add-recipe-btn outline"
                        onClick={() => addRecipe(recipe)}
                        data-url={recipe.href}
                      >
                        <Icon>like</Icon>
                        Add Recipe
                      </div>
                    </Col> */}
                  </Row>
                </CollectionItem>
              ))}
            </Collection>
          )
        ) : (
          <Preloader active color="green" flashing={false} size="big" />
        )}
      </Row>
    </>
  );
};

export default RecipeList;
