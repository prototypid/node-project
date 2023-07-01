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
const authRoutes = require("./routes/auth");

// add user to every request
app.use((req, res, next) => {
  User.findById("649ecd12dbb94c1cfac2156d")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    `mongodb://${env.database_username}:${env.database_password}@${env.database_host}:${env.database_port}/shop?authSource=admin&w=1`
  )
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "darq",
          email: "darq@example.com",
          cart: {
            items: [],
          },
        });

        user.save();
      }
    });

    console.log("Listening");
    app.listen(env.port);
  })
  .catch((err) => console.log(err));
