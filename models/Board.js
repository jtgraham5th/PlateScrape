var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var imageSchema = new Schema({
  height: Number,
  url: String,
  width: Number,
});
var BoardSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    default: null,
  },
  id: {
    type: Number,
    required: true,
  },
  image: [imageSchema],
  url: {
    type: String,
    required: true,
  },
});
const Board = mongoose.model("Board", BoardSchema);
module.exports = Board;
