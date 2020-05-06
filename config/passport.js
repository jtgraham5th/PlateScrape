// const JwtStrategy = require("passport-jwt").Strategy;
// const ExtractJwt = require("passport-jwt").ExtractJwt;

const passport = require("passport");
const PinterestStrategy = require("passport-pinterest").Strategy;
const User = require("../models/User");
const keys = require("./keys");
const localOptions = {};

// localOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
localOptions.secretOrKey = keys.secretOrKey;

const pinterest = new PinterestStrategy(
      {
        clientID: "5073939286663940267",
        clientSecret: "f88681c57f7d8613522b1f09272c106f1fb1366e1464c80a8718442a19e8d743",
        scope: ["read_public", "read_relationships"],
        callbackURL: "https://localhost:3000",
        state: true
      },
      function(accessToken, refreshToken, profile, done) {
        console.log("profile", profile);
        console.log("accessToken", accessToken);
        console.log("refreshToken", refreshToken);
        User.findOrCreate({ pinterestId: profile.id }, function (err, user) {
          return done(err, user);
      });
        

        // return cb(null, profile);
      }
    );

//Tell passport to use these Strategies
passport.use('pinterest',pinterest);
