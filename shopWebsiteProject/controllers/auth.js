const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
      isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("5e8fdc355c17cd14818d0451")
    .then((user) => {
      req.session.user = user
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};  