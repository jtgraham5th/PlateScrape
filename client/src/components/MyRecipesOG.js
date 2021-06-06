import React, { Component } from "react";
import {
  Col,
  Collapsible,
  CollapsibleItem,
  Icon,
  Card,
  Badge,
  CardTitle,
} from "react-materialize";

class MyRecipes extends Component {
  render() {
    const { addToList, recipes } = this.props;

    return (
      <Collapsible accordion id="my-recipes" className="col s12">
        <CollapsibleItem
          icon={<Icon>arrow_drop_down</Icon>}
          id="collapsible-item"
          header={
            <>
              <div>My Recipes</div>
              {recipes.length > 0 ? (
                <Badge className="ml-2 teal darken-4 white-text p-0">
                  {recipes.length}
                </Badge>
              ) : (
                ""
              )}
            </>
          }
          node="div"
        >
          <Col
            s={12}
            className="section horizontal-scroll"
            id="recipe-button-container"
          >
            {recipes.map((recipe, i) => (
              <Card
                closeIcon={<Icon>close</Icon>}
                header={<CardTitle image={recipe.image} reveal waves="light" />}
                reveal={
                  <ul>
                    {recipe.ingredients.map((ingredient, e) => (
                      <li className="left-align small">
                        {ingredient.quantity} {ingredient.unit}{" "}
                        {ingredient.name}
                      </li>
                    ))}
                  </ul>
                }
                title={recipe.name}
                className="recipe-button"
              >
                <div
                  className="btn add-recipe-btn"
                  onClick={() => addToList(recipe.ingredient)}
                  data-url={recipe.href}
                >
                  Add Recipe
                </div>
              </Card>
            ))}
          </Col>
        </CollapsibleItem>
      </Collapsible>
    );
  }
}
export default MyRecipes;
