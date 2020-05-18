const router = require("express").Router();
var axios = require("axios");
var cheerio = require("cheerio");
const jwt = require("jsonwebtoken");

const passport = require("passport");
const passportService = require("../config/passport");
const Authentication = require("../controllers/authentication");
const ShoppingList = require("../controllers/shoppingListController");
const Fridge = require("../controllers/fridgeController");

const requireAuth = passport.authenticate("jwt", { session: false });
const requireUserLogin = passport.authenticate("login", { session: false });

// Load input validation

router.get("/", function(req, res) {});
router.post("/login", requireUserLogin, Authentication.login);
router.post("/register", Authentication.register);
router.post("/pinterest/storeAuthCode", Authentication.login);
router.get("/getShoppingList/:id", ShoppingList.getList);
router.post("/shoppingListItem", ShoppingList.addItem);
router.get("/getFridge/:id", Fridge.getItems);
router.post("/fridgeItem", Fridge.addItem);
router.put("/fridgeItem", Fridge.removeItem);
router.put("/shoppingListItem", ShoppingList.removeItem);
router.put("/storeAuthToken", Authentication.storeAuthToken);
router.get("/loadUser/:id", Authentication.loadUser);
//Save pinterest boards to user collection in database
router.post("/boards", Authentication.saveBoards);

router.get("/recipes/:id", (req, res) => {
  console.log(req.params.id);
  let decodedUrl = decodeURIComponent(req.params.id);
  console.log(decodedUrl);
  axios.get(decodedUrl).then(function(response) {
    var recipeData = {}
    var ingredientData =[]
    // Load the html body from axios into cheerio
    var $ = cheerio.load(response.data);
    ;
    // Find the element that has a class of wprm-recipe-name
    // and add to result object
    recipeData.name = ($(".wprm-recipe-name").text());
    recipeData.image = ($(".wprm-recipe-image").html());
    // For each element that has a class of wprm-recipe-ingredient
    $(".wprm-recipe-ingredient").each(function(i, element) {
      var result = {}
      result.amount = $(this)
        .find(".wprm-recipe-ingredient-amount")
        .text();
      result.unit = $(this)
        .find(".wprm-recipe-ingredient-unit")
        .text();
      result.name = $(this)
        .find(".wprm-recipe-ingredient-name")
        .text();
      console.log(result);
      ingredientData.push(result);
    },recipeData.ingredients = ingredientData)
    // Send a recipeData back as an object with name and ingredients as keys back to the browser
    res.json(recipeData);
  });
});


module.exports = router;
