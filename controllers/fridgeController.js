const User = require("../models/User");

exports.getItems = (req, res) => {
  console.log("Retrieving Fridge Data...");
  const userID = req.params.id;
  console.log(req.params);
  console.log(userID);
  User.findById(userID, "fridge")
    .then((allItems) => {
      res.json({
        message: "Requested all Fridge Items",
        error: false,
        data: allItems,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        message: err.message,
        error: true,
      });
    });
};

