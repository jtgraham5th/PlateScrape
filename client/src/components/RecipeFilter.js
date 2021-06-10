import React from "react";
import "../containers/home/style.css";
import {
  Icon,
  Collection,
  Chip,
  Collapsible,
  CollapsibleItem,
} from "react-materialize";

const RecipeFilter = (props) => {

  const {setSelectedRecipes, recipes} = props

  const highlightIngredients = (recipe) => {
    let ingredientArray = []
    recipe.ingredients.forEach(ingredient => {
      ingredientArray.push(ingredient.name)
    })
    setSelectedRecipes(ingredientArray)
  }

  return (
    
      <Collapsible accordion>
        <CollapsibleItem
          expanded={false}
          header="Recipes"
          icon={<Icon>menu_book</Icon>}
          node="div"
        >
          <Collection id="saved-recipes">
            {recipes.map((recipe, i) => (
              <Chip
                close={false}
                closeIcon={<Icon className="close">close</Icon>}
                options={null}
                onClick={() => highlightIngredients(recipe)}
              >
                <img
                  alt={recipe.name}
                  className="responsive-img"
                  src={recipe.image}
                />
                <div>{recipe.name}</div>
              </Chip>
            ))}
          </Collection>
        </CollapsibleItem>
      </Collapsible>
  );
};
export default RecipeFilter;
