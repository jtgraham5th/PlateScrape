import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { returnErrors } from "./errorActions";
import { batch } from "react-redux";
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  SET_FRIDGE_DATA,
  SET_SHOPPINGLIST,
  ADD_RECIPE
} from "./types";
// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/register", userData)
    .then(res => history.push("/login")) // re-direct to login on successful register
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
export const removeFridgeItem = (itemName, userId) => dispatch => {
  axios
    .put("/api/fridgeItem", { itemName: itemName, userId: userId })
    .then(res => {
      console.log("Fridge Item Removed:", res);
      dispatch(getUserFridgeData(userId));
    })
    .catch(err => {
      console.log(err);
      alert("Failed to remove: " + err.message);
    });
};

export const loginUser = userData => dispatch => {
  axios
    .post("/api/login", userData)
    .then(res => {
      // Save to localStorage
      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      console.log(decoded);
      // Set current user
      batch(() => {
        dispatch(setCurrentUser(decoded));
        dispatch(getUserFridgeData(decoded.id));
        dispatch(getUserShoppingList(decoded));
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const getUserFridgeData = userId => dispatch => {
  axios
    .get(`/api/getFridge/${userId}`)
    .then(response => {
      console.log(response);
      dispatch(setFridgeData(response.data.data.fridge));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
export const getUserShoppingList = userId => dispatch => {
  axios
    .get(`/api/getShoppingList/${userId.id}`)
    .then(response => {
      console.log(response);
      dispatch(setShoppingList(response.data.data.shoppingList));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
//Save user Shopping List
export const setShoppingList = shoppingListData => {
  console.log(shoppingListData);
  return {
    type: SET_SHOPPINGLIST,
    payload: shoppingListData
  };
};
//Save user Fridge Data
export const setFridgeData = fridgeData => {
  console.log(fridgeData);
  return {
    type: SET_FRIDGE_DATA,
    payload: fridgeData
  };
};
//Save Recipe Data
export const addRecipe = recipeData => {
  console.log(recipeData);
  return {
    type: ADD_RECIPE,
    payload: recipeData
  };
};
// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};
// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};
// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  batch(() => {
    dispatch(setCurrentUser({}));
    dispatch(setFridgeData([]));
    dispatch(setShoppingList([]));
  });
};
//Check token & load user
export const loadUser = () => (dispatch, getState) => {
  // User loading
  dispatch({ type: USER_LOADING });

  axios
    .get("/api/auth/user", tokenConfig(getState))
    .then(res =>
      dispatch({
        type: USER_LOADED,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR
      });
    });
};

// Setup config/headers and token
export const tokenConfig = getState => {
  // Get token from localstorage
  const token = getState().auth.token;

  // Headers
  const config = {
    headers: {
      "Content-type": "application/json"
    }
  };

  // If token, add to headers
  if (token) {
    config.headers["x-auth-token"] = token;
  }

  return config;
};
