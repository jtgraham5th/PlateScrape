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
exports.addItem = (req,res) => {
  const { newIngredient, userId } = req.body;
  console.log("Adding Item to Shopping List");
  console.log(req.body);
  console.log(newIngredient);
  console.log(userId);
  User.updateOne({ _id: userId }, { $push: { shoppingList: newIngredient } })
    .then((newItem) => {
      console.log("New Shopping List Item", newItem);
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


}

