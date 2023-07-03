const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendgrid({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.renderLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // res.setHeader("Set-Cookie", "loggedIn=true");

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      }

      bcrypt
        .compare(password, user.password)
        .then((passwordMatched) => {
          if (passwordMatched) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              // req.session.save() will make sure page is redirected only after creating a session
              // this is not required
              console.log(err);
              return res.redirect("/");
            });
          }
          req.flash("error", "Invalid email or password.");
          res.redirect("/login");
        })
        .catch((err) => console.log(err));
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
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    errorMessage: message,
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
        req.flash("error", "E-mail already in use.");
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
        .then(() => {
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: "hycamtinn@gmail.com",
            subject: "Signup succeeded!",
            html: "<h1>You successfully signed up!</h1>",
          });
        })
        .catch((err) => console.log(err));
    })

    .catch((err) => console.log(err));
};

exports.renderReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No user with this email found.");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        res.redirect("/");
        return transporter.sendMail({
          to: email,
          from: "hycamtinn@gmail.com",
          subject: "Password Reset",
          html: `
          <p>You requested a password reset.</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">Link</a> to set a new password.</p>
        `,
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  // retrieve token
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/password-reset", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: message,
        userId: user._id.toString(),
      });
    })
    .catch((err) => console.log(err));
};
