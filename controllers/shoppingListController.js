const User = require("../models/User");

exports.getList = (req, res) => {
  console.log("Retriving Shopping List Data...");
  const userID = req.params.id;
  console.log(req.params);
  console.log(userID);
  User.findById(userID, "shoppingList")
    .then((allItems) => {
      res.json({
        message: "Requested Shopping List",
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

