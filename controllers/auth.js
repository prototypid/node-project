const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.renderLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // res.setHeader("Set-Cookie", "loggedIn=true");

  User.findById("649ecd12dbb94c1cfac2156d")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        // this will make sure page is redirected only after creating a session
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.renderSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confimPassword = req.body.confimPassword;

  // check if user exists
  User.findOne({ email: email })
    .then((usr) => {
      if (usr) {
        return res.redirect("/signup");
      }
      // asynchronous
      // 12 -> salt, number of hashing
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });

          return user.save();
        })
        .then(() => res.redirect("/login"));
    })

    .catch((err) => console.log(err));
};
