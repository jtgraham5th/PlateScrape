import {
  SET_FRIDGE_DATA,
  SET_SHOPPINGLIST,
  SET_RECIPES,
  SET_BOARD_DATA
} from "../actions/types";
// const isEmpty = require("is-empty");
const initialState = {
  fridge: [],
  shoppingList: [],
  recipes: [],
  boards: [],
};
export default function(state = initialState, action) {
  switch (action.type) {
    case SET_FRIDGE_DATA:
      return {
        ...state,
        fridge: action.payload,
      };
    case SET_SHOPPINGLIST:
      return {
        ...state,
        shoppingList: action.payload,
      };
    case SET_RECIPES:
      return {
        ...state,
        recipes: action.payload,
      };
    case SET_BOARD_DATA:
      return {
        ...state,
        boards: action.payload,
      };
    default:
      return state;
  }
}
