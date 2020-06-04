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
  SET_BOARD_DATA,
  SET_PINTEREST_TOKEN,
  GET_SUGGESTED_RECIPES,
  DATA_LOADED,
  DATA_LOADING
} from "./types";
require("dotenv").config();

export const searchRecipes = (searchQuery) => (dispatch) => {
  axios.get(`/api/yummlyAPI/search/${searchQuery}`).then((response) => {
    let array = [];
    response.data.map((recipe, i) => {
      let url;
      if (
        recipe.display.source.sourceRecipeUrl.includes(
          "https://www.yummly.com/private"
        )
      ) {
        url = "https://www.yummly.com/" + recipe["tracking-id"];
      } else {
        url = recipe.display.source.sourceRecipeUrl;
      }
      const data = {
        title: recipe.display.displayName,
        thumbnail: recipe.display.images[0],
        href: url,
      };
      array = [...array, data];
    });
    batch(() => {
      dispatch({
        type: GET_SUGGESTED_RECIPES,
        payload: array,
      });
      dispatch({ type: DATA_LOADED });
    });
  });
};
export const getSuggestedRecipes = () => (dispatch) => {
  axios.get("api/yummlyAPI/popular").then((response) => {
    let array = [];
    response.data.map((recipe, i) => {
      const data = {
        title: recipe.display.displayName,
        thumbnail: recipe.display.images[0],
        href: recipe.display.source.sourceRecipeUrl,
      };
      array = [...array, data];
    });
    batch(() => {
      dispatch({
        type: GET_SUGGESTED_RECIPES,
        payload: array,
      });
      dispatch({ type: DATA_LOADED });
    });
  });
};
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
  axios
    .post(
      `https://api.pinterest.com/v1/oauth/token?grant_type=authorization_code&client_id=${process.env.clientId}&client_secret=${process.env.clientSecret}&code=${pinterestAuthCode}`
    )
    .then((response) => {
      const accessToken = response.data.access_token;
      console.log("pinterest access Token:", accessToken);
      if (!!localStorage.getItem("jwtToken")) {
        dispatch(storeAuthToken(accessToken, localStorage.getItem("jwtToken")));
      } else {
        dispatch(setPinterestToken(accessToken));
      }
    })
    .catch((err) => {
      console.log("ERROR:", err);
    });
};
export const setPinterestToken = (accessToken) => {
  return {
    type: SET_PINTEREST_TOKEN,
    payload: accessToken,
  };
};
export const pinterestAPIBoardRequest = (pinterestToken) => (dispatch) => {
  let token = localStorage.getItem("jwtToken");
  axios
    .get(
      `https://api.pinterest.com/v1/me/boards/?access_token=${pinterestToken}&fields=id%2Cname%2Curl%2Cimage%2Cdescription`
    )
    .then((response) => {
      console.log(response.data.data);
      if (token) {
        batch(() => {
          dispatch(saveBoards(response.data.data, token));
          dispatch(setBoards(response.data.data));
        });
      } else {
        dispatch(setBoards(response.data.data));
      }
    })
    .catch((err) => {
      console.log("Error", err);
    });
};
//saveBoards to Database
export const saveBoards = (boards, jwtToken) => {
  let decoded = jwt_decode(jwtToken).sub;
  axios
    .post("api/boards", { boards: boards, userId: decoded })
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
      alert("Failed to create: " + err.message);
    });
};
export const storeAuthToken = (authToken, jwtToken) => (dispatch) => {
  setAuthToken(jwtToken);
  // Decode token to get user data
  let decoded = jwt_decode(jwtToken).sub;

  const userData = { userId: decoded, authToken: authToken };
  console.log(userData);
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
//Store user Boards
export const setBoards = (boardData) => {
  return {
    type: SET_BOARD_DATA,
    payload: boardData,
  };
};
export const removeFridgeItem = (itemName, userId) => (dispatch) => {
  console.log(itemName);
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
        dispatch(setBoards(userData.boards));
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};
export const removeShoppingListItem = (itemName, userId) => (dispatch) => {
  console.log(itemName);
  axios
    .put("/api/shoppingListItem", { itemName: itemName, userId: userId })
    .then((res) => {
      console.log("Shopping List Item Removed:", res);
      dispatch(getUserShoppingList(userId));
    })
    .catch((err) => {
      console.log(err);
      alert("Failed to remove: " + err.message);
    });
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
//Store user Shopping List
export const setShoppingList = (shoppingListData) => {
  return {
    type: SET_SHOPPINGLIST,
    payload: shoppingListData,
  };
};
//Store user Fridge Data
export const setFridgeData = (fridgeData) => {
  return {
    type: SET_FRIDGE_DATA,
    payload: fridgeData,
  };
};
//Store Recipe Data
export const setRecipes = (recipeData) => {
  return {
    type: SET_RECIPES,
    payload: recipeData,
  };
};
//Store logged in user
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
export const setDataLoading = () => {
  return {
    type: DATA_LOADING,
  };
};
export const dataLoaded = () => {
  return {
    type: DATA_LOADED,
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
    dispatch(setBoards([]));
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
        dispatch(setShoppingList(res.data.shoppingList));
        dispatch(setBoards(res.data.boards));
        dispatch({ type: USER_LOADED });
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
