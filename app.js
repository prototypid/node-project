const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const env = require("./utils/config");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URI = `mongodb://${env.database_username}:${env.database_password}@${env.database_host}:${env.database_port}/shop?authSource=admin&w=1`;

const app = express();
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

// routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

// body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(
  session({
    secret: "hardestSecret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);

// add user to every request
app.use((req, res, next) => {
  if (!req.session.user) return next();

  User.findById(req.session.user._id)
    .then((user) => {
      // this will fetch the user from database using session user details
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Listening");
    app.listen(env.port);
  })
  .catch((err) => console.log(err));
