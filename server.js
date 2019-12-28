const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require("mongoose");
const app = express();
const routes = require("./routes");

const PORT = process.env.PORT || 3001;

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", routes);
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client', 'index.html'));
//   });
//ROUTES


var db = process.env.MONGODB_URI || "mongodb://localhost/recipe-scraper";
mongoose.connect(db, function(error) {
  if (error) {
    console.log("Database Error:", error);
  } else {
    console.log("Mongoose connection is successful");
  }
});


app.listen(PORT, function() {
    console.log(`App is running on http://localhost:${PORT}`);
  });
