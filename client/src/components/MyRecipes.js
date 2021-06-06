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
    // setDataLoading,
    addCategory,
    // dataLoaded,
  } = bindActionCreators(ActionCreators, dispatch);

  const [ingredientsView, setToggle] = useState("");
  const [shoppingList, setShoppingList] = useState(userData.shoppingList);
  const [categories, setCategories] = useState(userData.categories);

  // const [recipes, setRecipes] = useState(userData.recipes);
  const recipes = [
    {
      URL:
        "https://www.yummly.com/recipe:Cinnamon-Roll-Cookies-2376887,recipe,search_based:search:cookies,list.recipe.search_based:search:cookies",
      name: "Cinnamon Roll Cookies",
      ingredients: [
        {
          name: "unsalted butter",
          quantity: "3/4",
          unit: "cup",
          category: "Dairy",
        },
        {
          name: "granulated sugar",
          quantity: "3/4",
          unit: "cup",
          category: "Baking & Cooking",
        },
        {
          name: "large eggs",
          quantity: 1,
          unit: "",
          category: "Dairy",
        },
        {
          name: "vanilla extract",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "all purpose flour",
          quantity: 2.25,
          unit: "cup",
          category: "Baking & Cooking",
        },
        {
          name: "baking soda",
          quantity: "1/2",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "salt",
          quantity: "1/2",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "light brown sugar",
          quantity: 6,
          unit: "tablespoon",
          category: "Baking & Cooking",
        },
        {
          name: "ground cinnamon",
          quantity: 1.5,
          unit: "tablespoon",
          category: "Baking & Cooking",
        },
        {
          name: "salt",
          quantity: "1/8",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "unsalted butter",
          quantity: 2,
          unit: "tablespoon",
          category: "Dairy",
        },
        {
          name: "powdered sugar",
          quantity: "2/3",
          unit: "cup",
          category: "Baking & Cooking",
        },
        {
          name: "salt",
          quantity: 1,
          unit: "pinch",
          category: "Baking & Cooking",
        },
        {
          name: "vanilla extract",
          quantity: "1/2",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "milk",
          quantity: 3,
          unit: "teaspoon",
          category: "Dairy",
        },
      ],
      image:
        "https://lh3.googleusercontent.com/JSTdyRJv8yP_3WkM0BwHBY3PgNB5UBaWx7FM7DYS-3JvpqkoH1XqrjVeMetO2WYJBIstSXKpmAXTJLm_Sh6_R6o",
    },
    {
      URL:
        "https://www.yummly.com/recipe:Mexican-Wedding-Cookies-9088916,recipe,search_based:search:cookies,list.recipe.search_based:search:cookies",
      name: "Mexican Wedding Cookies",
      ingredients: [
        {
          name: "pecans",
          quantity: "3/4",
          unit: "cup",
          category: "Snack Foods",
        },
        {
          name: "unsalted butter",
          quantity: 1,
          unit: "cup",
          category: "Dairy",
        },
        {
          name: "powdered sugar",
          quantity: "1/2",
          unit: "cup",
          category: "Baking & Cooking",
        },
        {
          name: "salt",
          quantity: "1/4",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "vanilla extract",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "all purpose flour",
          quantity: 2,
          unit: "cup",
          category: "Baking & Cooking",
        },
        {
          name: "powdered sugar",
          quantity: 2,
          unit: "cup",
          category: "Baking & Cooking",
        },
      ],
      image:
        "https://lh3.googleusercontent.com/xtZpiDOI5DT4_bkZZfjKDzBaXGcxD88WrTgurwSyBqEVgu_CFZxzFLbzY30aRY5e63D60LEiCqpIPqWKmlGXDw",
    },
    {
      URL:
        "https://www.yummly.com/recipe:Mexican-Wedding-Cookies-9088916,recipe,search_based:search:cookies,list.recipe.search_based:search:cookies",
      name: "Mexican Wedding Cookies",
      ingredients: [
        {
          name: "pecans",
          quantity: "3/4",
          unit: "cup",
          category: "Snack Foods",
        },
        {
          name: "unsalted butter",
          quantity: 1,
          unit: "cup",
          category: "Dairy",
        },
        {
          name: "powdered sugar",
          quantity: "1/2",
          unit: "cup",
          category: "Baking & Cooking",
        },
        {
          name: "salt",
          quantity: "1/4",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "vanilla extract",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "all purpose flour",
          quantity: 2,
          unit: "cup",
          category: "Baking & Cooking",
        },
        {
          name: "powdered sugar",
          quantity: 2,
          unit: "cup",
          category: "Baking & Cooking",
        },
      ],
      image:
        "https://lh3.googleusercontent.com/xtZpiDOI5DT4_bkZZfjKDzBaXGcxD88WrTgurwSyBqEVgu_CFZxzFLbzY30aRY5e63D60LEiCqpIPqWKmlGXDw",
    },
  ];
  useEffect(() => {
    addCategory(categories);
    console.log("!!!", categories);
  }, [categories]);

  useEffect(() => {
    setShoppingListData(shoppingList);
    console.log("$$$", shoppingList);
  }, [shoppingList]);

  const viewIngredients = (index) => {
    if (ingredientsView === index) {
      setToggle("");
    } else {
      setToggle(index);
    }
  };
  const addToList = async (ingredients) => {
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
        title: "Added",
        message: "Recipe ingredients successfully added to your shopping list!",
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

  return (
    <Row className="justify-content-center p-4 main-content">
      <Row s={12} className="section" id="recipe-button-container">
        {recipes.map((recipe, i) => (
          <div className="recipe-card">
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
                      <li className="left-align small">
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
                  onClick={() => addToList(recipe.ingredients)}
                  data-url={recipe.href}
                  icon={<Icon small>playlist_add</Icon>}
                />
                <Button
                  className="col card-action-button"
                  flat
                  color="secondary"
                  // onClick={() => console.log(recipe)}
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
