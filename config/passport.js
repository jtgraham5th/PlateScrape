const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const PinterestStrategy = require("passport-pinterest").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("user");
const keys = require("./keys");
const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;
module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
  passport.use("pinterest",
    new PinterestStrategy(
      {
        clientID: "5073939286663940267",
        clientSecret: "f88681c57f7d8613522b1f09272c106f1fb1366e1464c80a8718442a19e8d743",
        scope: ["read_public", "read_relationships"],
        callbackURL: "/api/pinterest/callback",
        state: true
      },
      function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        return cb(null, profile);
      }
    )
  );
};
