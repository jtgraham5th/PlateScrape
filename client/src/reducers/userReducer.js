import {
  SET_FRIDGE_DATA,
  SET_SHOPPINGLIST,
  ADD_RECIPE
} from "../actions/types";
// const isEmpty = require("is-empty");
const initialState = {
  fridge: [],
  shoppingList: [],
  recipes: []
};
export default function(state = initialState, action) {
  switch (action.type) {
    case SET_FRIDGE_DATA:
      return {
        ...state,
        fridge: action.payload
      };
    case SET_SHOPPINGLIST:
      return {
        ...state,
        shoppingList: action.payload
      };
    case ADD_RECIPE:
      return {
        ...state,
        recipes: action.payload
      };
    default:
      return state;
  }
}
