const jwt = require("jwt-simple");
const validateRegisterInput = require("../validation/register");
const User = require("../models/User");

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.secret);
}

exports.login = (req, res) => {
  //User has already had their email and password auth'd
  //We just need to give them a token
  res.send({ token: tokenForUser(req.user), userData: req.user });
};
exports.register = (req, res) => {
  const { name, email, password } = req.body;

  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  // See if a user with the given email exists
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) {
      return next(err);
    }
    //If a user with email does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: "Email is already in use" });
    }
    const user = new User({
      name: name,
      email: email,
      password: password,
    });
    user.save(function(err) {
      if (err) {
        return next(err);
      }
      //respond to the request indicating User was created
      res.json({ token: tokenForUser(user) });
    });
  });
};
exports.storeAuthToken = (req, res) => {
  User.update({_id: req.body.userId},{pinterestToken: req.body.authToken}).then(response => console.log(response))
  // console.log(req.body)
};
exports.loadUser = (req, res) => {
  User.findById(req.params.id)
    .select('-password')
    .then(user => res.json(user));
};
exports.saveBoards = (req,res) => {
  const { boards, userId } = req.body;
  console.log("Adding boards to database");
  console.log(req.body)
  console.log({boards, userId});
  // res.json({
  //   message: "Successfully created",
  //   error: false,
  //   data: boards,
  // });
  User.update({ _id: userId }, { boards: boards })
    .then((newBoards) => {
      console.log("New Boards", newBoards);
      res.json({
        message: "Successfully add Boards",
        error: false,
        data: newBoards,
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
