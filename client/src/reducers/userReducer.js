import {
  SET_FRIDGE_DATA,
  SET_SHOPPINGLIST,
  SET_RECIPES,
  SET_BOARD_DATA,
  GET_SUGGESTED_RECIPES,
  ADD_CATEGORY,
  DATA_LOADED,
  DATA_LOADING
} from "../actions/types";
// const isEmpty = require("is-empty");
const initialState = {
  fridge: [],
  shoppingList: [],
  recipes: [],
  boards: [],
  suggestedRecipes: [],
  categories: [],
  loading: true
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
    case GET_SUGGESTED_RECIPES:
      return {
        ...state,
        suggestedRecipes: action.payload,
      };
      case DATA_LOADING:
        return {
          ...state,
          loading: true,
        };
      case DATA_LOADED:
        return {
          ...state,
          loading: false,
        };
      case ADD_CATEGORY:
        return {
          ...state,
          categories: [...state.categories, action.payload]
        }
    default:
      return state;
  }
}
