import { SET_CURRENT_USER, USER_LOADING, USER_LOADED, SET_PINTEREST_TOKEN } from "../actions/types";
// const isEmpty = require("is-empty");
const initialState = {
  isAuthenticated: !!localStorage.getItem("jwtToken"),
  userName: null,
  userId: null,
  pinterestToken: null,
  loading: false,
};
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !!localStorage.getItem("jwtToken"),
        userName: action.payload.name,
        userId: action.payload._id,
        pinterestToken: action.payload.pinterestToken,
      };
    case SET_PINTEREST_TOKEN:
      return {
        ...state,
        pinterestToken: action.payload
      }
    case USER_LOADING:
      return {
        ...state,
        loading: true,
      };
    case USER_LOADED:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
