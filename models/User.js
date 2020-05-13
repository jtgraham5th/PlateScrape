const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

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
  pinterestToken: {
    type: String,
    default: null
  },
  fridge: [{ type: Schema.Types.Mixed, ref: FridgeSchema }],
  shoppingList: [{ type: Schema.Types.Mixed, ref: shoppingListSchema }]

});
//On save hook, encrypt password
UserSchema.pre("save", function(next) {
  const user = this;

  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});
UserSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) { return callback(err)}

        callback(null, isMatch)
    });
}; 
module.exports = User = mongoose.model("user", UserSchema);