require("dotenv").config();
const fs = require('fs');
const https = require('https');
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const routes = require("./routes");
const passport = require("passport");
const cors = require('cors');

const PORT = process.env.PORT || 3001;
// // Creates HTTPS on local machine
https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, app).listen(PORT, function() {
  console.log(`App is running on http://localhost:${PORT}`);
});

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true })); 
// or try app.use(express.session({ secret: 'SECRET' }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


mongoose.set("useCreateIndex", true);

var db = process.env.MONGODB_URI;
mongoose.connect(db)
// mongoose.connect(db, { useNewUrlParser: true });
const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("Mongoose connected successfully");
});
connection.on("error", err => {
  console.log("Mongoose default connection error: " + err);
});
app.use("/api", routes)

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
app.use(express.static(__dirname + "client/build"))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
  });
//ROUTES



//Use for deployment
// app.listen(PORT, function() {
//   console.log(`App is running on http://localhost:${PORT}`);
// });
