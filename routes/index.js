const path = require("path");
const router = require("express").Router();
var axios = require("axios");
var cheerio = require("cheerio");

// const apiRoutes = require("./api");

// API Routes
// router.use("/api", apiRoutes);
router.get("/dunso", (req, res) => {
  console.log("Is it working");
});
// If no API routes are hit, send the React app
router.get("/recipes/:id", (req, res) => {
  console.log(req.params.id);
  decodedUrl = decodeURIComponent(req.params.id);
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

// router.use(function(req, res) {
//   res.sendFile(path.join(__dirname, "../client/build/index.html"));
// });

module.exports = router;
