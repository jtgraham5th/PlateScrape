const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
require("dotenv").config();

const passport = require("passport");
const User = require("../models/User");

const LocalStrategy = require("passport-local");
const validateLoginInput = require("../validation/login");

//Create local Strategy
const localOptions = { usernameField: "email" };

const login = new LocalStrategy(localOptions, function(email, password, done) {
  const { errors, isValid } = validateLoginInput(email, password);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  //verify this email and password,
  //call done with the email and password
  //otherwise, call done with false
  User.findOne({ email }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }

    //compare passwords - is 'password' equal to user.password
    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        return done(err);
      }
      if (!isMatch) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    });
  });
});

//Setup options for Jwt Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: process.env.secret,
};

//Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  //See if user ID in the payload exists in our database
  //If it does call 'done' with that other
  //otherwise call 'done' with a user object
  User.findById(payload.sub, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

//Tell passport to use these Strategies
passport.use("jwt", jwtLogin);
passport.use("login", login);
