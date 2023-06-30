const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const env = require("./utils/config");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

// routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// add user to every request
// app.use((req, res, next) => {
//   User.findById("649cfa5d4f1490660365bc67")
//     .then((user) => {
//       req.user = new User(user.username, user.email, user.cart, user._id);
//       next();
//     })
//     .catch((err) => console.log(err));
// });

// body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    `mongodb://${env.database_username}:${env.database_password}@${env.database_host}:${env.database_port}/shop?authSource=admin&w=1`
  )
  .then(() => {
    console.log("Listening");
    app.listen(env.port);
  })
  .catch((err) => console.log(err));
