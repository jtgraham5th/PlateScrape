var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var FridgeSchema = new Schema({
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
const Fridge = mongoose.model("Fridge", FridgeSchema);
module.exports = Fridge;