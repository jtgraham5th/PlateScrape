const mongoose = require("mongoose");
const FridgeSchema = require("./Fridge");
const shoppingListSchema = require("./ShoppingList")

const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  fridge: [{ type: Schema.Types.Mixed, ref: FridgeSchema }],
  shoppingList: [{ type: Schema.Types.Mixed, ref: shoppingListSchema }]

});
module.exports = User = mongoose.model("user", UserSchema);