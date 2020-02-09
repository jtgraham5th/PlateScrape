var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ShoppingListSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    amountNeeded: {
        type: Number,
        required: false,
        default: 0
    },
    amountStored: {
        type: Number,
        required: false,
        default: 0
    },
    unit: {
        type: String,
        required: false
    },
    edit: {
        type: Boolean,
        required: true,
        default: false
    },
});
const ShoppingList = mongoose.model("ShoppingList", ShoppingListSchema);
module.exports = ShoppingList;