exports.renderLogin = (req, res, next) => {
  // const isLoggedIn = req.get("Cookie");
  // const v = isLoggedIn.split("=")[1] === "true";
  // console.log(isLoggedIn, v);
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // res.setHeader("Set-Cookie", "loggedIn=true");
  req.session.isLoggedIn = true;
  res.redirect("/");
};
