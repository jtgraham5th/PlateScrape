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
router.put("/storeAuthToken", Authentication.storeAuthToken);
router.get("/loadUser/:id", Authentication.loadUser);
//Add pinterest boards to user collection in database
router.post("/boards", Authentication.storeBoards);


router.get("/recipes/:id", (req, res) => {
  console.log(req.params.id);
  let decodedUrl = decodeURIComponent(req.params.id);
  console.log(decodedUrl);
  axios.get(decodedUrl).then(function(response) {
    var ingredientData = [];
    // Load the html body from axios into cheerio
    var $ = cheerio.load(response.data);
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
    });
    // Send a ingredientData back as an array of objects back to the browser
    res.json(ingredientData);
  });
});
router.post("/fridgeItem", function(req, res) {
  const { newIngredient, userId } = req.body;
  console.log("Adding Item to Fridge");
  console.log(req.body);
  console.log(newIngredient);
  console.log(userId);
  db.User.updateOne({ _id: userId }, { $push: { fridge: newIngredient } })
    .then((newItem) => {
      console.log("New Fridge Item", newItem);
      res.json({
        message: "Successfully created",
        error: false,
        data: newItem,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        message: err.message,
        error: true,
      });
    });
});
router.put("/fridgeItem", function(req, res) {
  const { itemName, userId } = req.body;
  console.log(req.body);
  db.User.update({ _id: userId }, { $pull: { fridge: { name: itemName } } })
    .then((removedItem) => {
      console.log("Removed Fridge Item", removedItem);
      res.json({
        message: "Successfully removed",
        error: false,
        data: removedItem,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        message: err.message,
        error: true,
      });
    });
});

// router.use(function(req, res) {
//   res.sendFile(path.join(__dirname, "../client/build/index.html"));
// });

module.exports = router;
