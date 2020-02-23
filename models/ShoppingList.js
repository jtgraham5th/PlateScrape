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
    enoughInFridge: {
        type: Boolean,
        required: true,
        default: false
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