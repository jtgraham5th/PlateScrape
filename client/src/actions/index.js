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
  SET_RECIPES,
} from "./types";
// Register User
export const registerUser = (userData, history) => (dispatch) => {
  axios
    .post("/api/register", userData)
    .then((res) => history.push("/login")) // re-direct to login on successful register
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};
export const getAuthToken = (pinterestAuthCode) => (dispatch) => {
  console.log("hit me")
    axios
      .post(
        `https://api.pinterest.com/v1/oauth/token?grant_type=authorization_code&client_id=5073939286663940267&client_secret=f88681c57f7d8613522b1f09272c106f1fb1366e1464c80a8718442a19e8d743&code=${pinterestAuthCode}`
      )
      .then((response) => {
        const accessToken = response.data.access_token;
        console.log("pinterest access Token:", accessToken);
        dispatch(storeAuthToken(accessToken,localStorage.getItem("jwtToken")));
      })
      .catch((err) => {
        console.log("ERROR:", err);
      });
  }

export const storeAuthToken = (authToken, jwtToken) => (dispatch) => {
  setAuthToken(jwtToken);
  // Decode token to get user data
  let decoded = jwt_decode(jwtToken).sub;

  const userData = { userId: decoded, authToken: authToken };
  console.log(userData)
  axios
    .put("/api/storeAuthToken", userData)
    .then() // re-direct to login on successful register
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};
export const removeFridgeItem = (itemName, userId) => (dispatch) => {
  axios
    .put("/api/fridgeItem", { itemName: itemName, userId: userId })
    .then((res) => {
      console.log("Fridge Item Removed:", res);
      dispatch(getUserFridgeData(userId));
    })
    .catch((err) => {
      console.log(err);
      alert("Failed to remove: " + err.message);
    });
};
export const loginUser = (userData) => (dispatch) => {
  axios
    .post("/api/login", userData)
    .then((res) => {
      // Save to localStorage
      // Set token to localStorage
      console.log(res);
      const { token, userData } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      console.log(decoded);
      // Set current user
      batch(() => {
        dispatch(setRecipes([]));
        dispatch(setCurrentUser(userData));
        dispatch(setFridgeData(userData.fridge));
        dispatch(setShoppingList(userData.shoppingList));
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};
export const getUserFridgeData = (userId) => (dispatch) => {
  console.log("userId for fridge", userId);

  axios
    .get(`/api/getFridge/${userId}`)
    .then((response) => {
      dispatch(setFridgeData(response.data.data.fridge));
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};
export const getUserShoppingList = (userId) => (dispatch) => {
  console.log("userId for shopping", userId);
  axios
    .get(`/api/getShoppingList/${userId}`)
    .then((response) => {
      dispatch(setShoppingList(response.data.data.shoppingList));
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};
//Save user Shopping List
export const setShoppingList = (shoppingListData) => {
  return {
    type: SET_SHOPPINGLIST,
    payload: shoppingListData,
  };
};
//Save user Fridge Data
export const setFridgeData = (fridgeData) => {
  return {
    type: SET_FRIDGE_DATA,
    payload: fridgeData,
  };
};
//Save Recipe Data
export const setRecipes = (recipeData) => {
  return {
    type: SET_RECIPES,
    payload: recipeData,
  };
};
// Set logged in user
export const setCurrentUser = (userData) => {
  return {
    type: SET_CURRENT_USER,
    payload: userData,
  };
};
// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING,
  };
};
// Log user out
export const logoutUser = () => (dispatch) => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  batch(() => {
    dispatch(setCurrentUser({}));
    dispatch(setFridgeData([]));
    dispatch(setShoppingList([]));
    dispatch(setRecipes([]));
  });
};
//Check token & load user
export const loadUser = (token) => async (dispatch) => {
  // User loading
  dispatch({ type: USER_LOADING });

  setAuthToken(token);
  // Decode token to get user data
  let decoded = jwt_decode(token).sub;

  await axios
    .get(`/api/loadUser/${decoded}`)
    .then((res) =>
      batch(() => {
        dispatch(setCurrentUser(res.data));
        dispatch(setFridgeData(res.data.fridge));
        dispatch(setShoppingList(res.data.shoppingList))
        dispatch({ type: USER_LOADED });;
      })
    )
    .catch((err) => {
      console.log(err);
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR,
      });
    });
};
// Setup config/headers and token
export const tokenConfig = (getState) => {
  // Get token from localstorage
  const token = getState().auth.token;

  // Headers
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  // If token, add to headers
  if (token) {
    config.headers["x-auth-token"] = token;
  }

  return config;
};
