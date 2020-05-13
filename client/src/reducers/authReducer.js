import {
  SET_CURRENT_USER,
  USER_LOADING,
} from "../actions/types";
const isEmpty = require("is-empty");
const initialState = {
  isAuthenticated: !!localStorage.getItem("jwtToken"),
  userName: null, 
  userId: null,
  pinterestCode: null,
  loading: false
};
export default function reducer (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !!localStorage.getItem("jwtToken"),
        userName: action.payload.name,
        userId: action.payload._id,
        pinterestCode: action.payload.pinterestCode
      };
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
