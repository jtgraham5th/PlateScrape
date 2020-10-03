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
router.get("/yummlyAPI/popular", (req, res) => {
  axios({
    "method":"GET",
    "url":"https://yummly2.p.rapidapi.com/feeds/list",
    "headers":{
    "x-rapidapi-host":"yummly2.p.rapidapi.com",
    "x-rapidapi-key":"8c9d803252msh0838d888ce56253p165855jsna533a76ddc02",
    "useQueryString":true
    },"params":{
    "tag":"list.recipe.popular",
    "limit":"20",
    "start":"0"
    }
    })
    .then((response)=>{
      res.json(response.data.feed)
    })
    .catch((error)=>{
      console.log(error)
    })
});
router.get("/yummlyAPI/search/:query", (req, res) => {
  axios({
    "method":"GET",
    "url":"https://yummly2.p.rapidapi.com/feeds/list",
    "headers":{
    "x-rapidapi-host":"yummly2.p.rapidapi.com",
    "x-rapidapi-key":"8c9d803252msh0838d888ce56253p165855jsna533a76ddc02",
    "useQueryString":true
    },"params":{
      "tag":`list.recipe.search_based%3Asearch%3A${req.params.query}`,
      "limit":"18",
      "start":"0"
      }
    })
    .then((response)=>{
      console.log(response.data)
      res.json(response.data.feed)
    })
    .catch((error)=>{
      console.log(error)
    })
});
router.get("/recipes/:id", (req, res) => {
  console.log(req.params.id);
  let decodedUrl = decodeURIComponent(req.params.id);
  console.log(decodedUrl);
  axios.get(decodedUrl).then(function(response) {
    var recipeData = {};
    var ingredientData = [];
    // Load the html body from axios into cheerio
    var $ = cheerio.load(response.data);
    // Find the element that has a class of wprm-recipe-name and add to result object

    //Scrape for Wordpress website
    if ($(".wprm-recipe-name")) {
      recipeData.name = $(".wprm-recipe-name").text();
      recipeData.image = $(".wprm-recipe-image").html();
      // For each element that has a class of wprm-recipe-ingredient
      $(".wprm-recipe-ingredient").each(function(i, element) {
        var result = {};
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
      }, (recipeData.ingredients = ingredientData));
    }

    //Scrape handler for allrecipes.com without video
    if ($("#recipe-main-content")) {
      recipeData.name = $("#recipe-main-content").text();
      recipeData.image = $(".rec-photo--250").html();
      
      $(".checkList__line").each(function(i, element) {
        let ingredient = $(this)
          .find(".recipe-ingred_txt")
          .text().split(" ")
          console.log(ingredient)
        let amount = ingredient[0]
        let unit = ingredient[1]
        ingredient.slice(0,2)
        console.log("look here", ingredient.slice(2))
        let name = ingredient.slice(2).join(" ").toString()
        var result = {};
        result.amount = amount
        result.unit = unit
        result.name = name
        console.log(result);
        ingredientData.push(result);
      }, console.log(ingredientData),(recipeData.ingredients = ingredientData));
    }
    
    //Scrape handler for allrecipes.com w/video
    if ($(".ingredients-section")) {
      recipeData.name = $(".headline-wrapper > .heading-content").text();
      recipeData.image = $(".lead-media").html();
      
      $(".ingredients-item-name").each(function(i, element) {
        let ingredient = $(this).text().trim().split(" ")
        console.log(ingredient)
        ingredient.slice(0,2)
        var result = {};
        result.amount = ingredient[0]
        result.unit = ingredient[1]
        result.name = ingredient.slice(2).join(" ").toString()
        console.log(result);
        ingredientData.push(result);
      }, console.log(ingredientData),(recipeData.ingredients = ingredientData));
    }

    //Scrape handler for recipezaar & food.com
    if ($(".recipe-title")) {
      recipeData.name = $(".recipe-title").text();
      recipeData.image = $(".lead-media").html();
      
      $(".recipe-ingredients__ingredient").each(function(i, element) {
        let ingredient = $(this).text()
        console.log(ingredient)
        var result = {};
        result.amount = $(this)
        .find(".recipe-ingredients__ingredient-quantity").text()
        result.unit = $(this)
        .find(".recipe-ingredients__ingredient-part:first-child > span").text()
        result.name = $(this)
        .find(".recipe-ingredients__ingredient-part > a").text()
        console.log(result);
        ingredientData.push(result);
      }, console.log(ingredientData),(recipeData.ingredients = ingredientData));
    }
    //Scrape handler for yummly.com
    if ($("#optanon")) {
      recipeData.name = $(".recipe-title").text();
      recipeData.image = $(".recipe-image").html();
      
      $(".IngredientLine").each(function(i, element) {
        let ingredient = $(this).text()
        console.log(ingredient)
        var result = {};
        result.amount = $(this)
        .find(".amount").text()
        result.unit = $(this)
        .find(".unit").text()
        result.name = $(this)
        .find(".ingredient").text()
        console.log(result);
        ingredientData.push(result);
      }, console.log(ingredientData),(recipeData.ingredients = ingredientData));
    }
    console.log(recipeData)
    // Send a recipeData back as an object with name and ingredients as keys back to the browser
    res.json(recipeData);
  });
});

module.exports = router;
