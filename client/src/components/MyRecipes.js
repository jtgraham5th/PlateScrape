import React, { useState, useEffect } from "react";
import {
  Button,
  Icon,
  Card,
  CardTitle,
  Row,
} from "react-materialize";
import { fraction } from "mathjs";
import convert from "convert-units";

import { useSelector, useDispatch } from "react-redux";
import * as ActionCreators from "../state/actions";
import { bindActionCreators } from "redux";

const MyRecipes = (props) => {
  const userData = useSelector((state) => state.userData);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const {
    setShoppingListData,
    setRecipesData,
    // setDataLoading,
    addCategory,
    // dataLoaded,
  } = bindActionCreators(ActionCreators, dispatch);

  const [ingredientsView, setToggle] = useState("");
  const [shoppingList, setShoppingList] = useState(userData.shoppingList);
  const [categories, setCategories] = useState(userData.categories);
  const [recipes, setRecipes] = useState(userData.recipes);

  useEffect(() => {
    addCategory(categories);
  }, [categories]);

  useEffect(() => {
    setShoppingListData(shoppingList);
  }, [shoppingList]);

  const viewIngredients = (index) => {
    if (ingredientsView === index) {
      setToggle("");
    } else {
      setToggle(index);
    }
  };
  const addToList = async (recipe) => {
    let ingredients = recipe.ingredients
    let array = categories;
    ingredients.map(
      (ingredient, i) => {
        console.log(ingredient);
        /* check to see if ingredient already exisit in the shoppingList*/
        if (
          !shoppingList.some((e) => e.name === ingredient.name.toLowerCase())
        ) {
          let newShoppingList = shoppingList;
          if (typeof ingredient.quantity === "string") {
            ingredient.quantity = fraction(ingredient.quantity).valueOf();
          }
          let newIngredient = {
            name: ingredient.name.toLowerCase(),
            quantity: ingredient.quantity,
            unit: unitAbbreviation(ingredient.unit),
            category: ingredient.category,
            enoughInFridge: false,
          };
          newShoppingList.push(newIngredient);
          setShoppingList(newShoppingList);
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
          shoppingList.map((item) => {
            if (item.name === key) {
              if (typeof item.quantity === "string") {
                item.quantity = fraction(ingredient.quantity).valueOf();
              }
              if (typeof ingredient.quantity === "string") {
                ingredient.quantity = fraction(ingredient.quantity).valueOf();
              }
              if (ingredient.unit === item.unit) {
                item.quantity = ingredient.quantity + item.quantity;
                console.log(item.name, ingredient.name, item.quantity)
              } else {
                let convertedAmount = convert(ingredient.quantity)
                  .from(unitAbbreviation(ingredient.unit))
                  .to(unitAbbreviation(item.unit));
                console.log("converted:", convertedAmount, ingredient.name);
                if (typeof convertedAmount === "string") {
                  convertedAmount = fraction(convertedAmount).valueOf();
                  console.log("convert Fractions:", convertedAmount, ingredient.name);
                }
                item.quantity = convertedAmount + item.quantity;
                console.log("item quantity after adding", item.quantity)
              }
            }
            newList.push(item);
          });
          setShoppingList(newList);
        }
      },

      props.modal({
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
  const removeRecipe = (recipe) => {
    if (recipes.indexOf(recipe) < 0) {
      setRecipes([...recipes, recipe]);
    } else {
      let index = recipes.indexOf(recipe);
      let recipesCopy = recipes;
      recipesCopy.splice(index, 1);
      setRecipes(recipesCopy);
      setRecipesData(recipesCopy);
    }
  };

  return (
    <Row className="justify-content-center p-4 main-content">
      <Row s={12} className="section" id="recipe-button-container">
        {recipes.map((recipe, i) => (
          <div className="recipe-card" key={i}>
            <Card
              closeIcon={<Icon>close</Icon>}
              header={<CardTitle image={recipe.image} waves="light" />}
              title={recipe.name}
              className="recipe-button"
            >
              {ingredientsView === i ? (
                <div>
                  <ul>
                    {recipe.ingredients.map((ingredient, e) => (
                      <li className="left-align small" key={e}>
                        {ingredient.quantity} {ingredient.unit}{" "}
                        {ingredient.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <Row
                style={{
                  flexWrap: "nowrap",
                  borderTop: "1px solid silver",
                  justifyContent: "center",
                }}
              >
                <Button
                  className="col card-action-button"
                  flat
                  color="secondary"
                  // onClick={() => this.addToList(recipe)}
                  node="a"
                  href={recipe.URL}
                  icon={<Icon>language</Icon>}
                />
                <Button
                  className="col card-action-button"
                  flat
                  color="secondary"
                  onClick={() => viewIngredients(i)}
                  icon={<Icon>format_list_bulleted</Icon>}
                />
                <Button
                  className="col card-action-button"
                  flat
                  color="secondary"
                  onClick={() => addToList(recipe)}
                  data-url={recipe.href}
                  icon={<Icon small>playlist_add</Icon>}
                />
                <Button
                  className="col card-action-button"
                  flat
                  color="secondary"
                  onClick={() => removeRecipe(recipe)}
                  data-url={recipe.href}
                  icon={<Icon small>delete_sweep</Icon>}
                />
              </Row>
            </Card>
          </div>
        ))}
      </Row>
    </Row>
    //   </CollapsibleItem>

    // </Collapsible>
  );
};

export default MyRecipes;
