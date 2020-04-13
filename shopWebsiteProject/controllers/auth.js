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
      req.session.isLoggedIn = true;
      req.session.user = user
      req.session.save(err => { //the redirect might be finished and the new page might be rendered before your session was updated on the server and in the database.
        console.log(err)
        res.redirect("/");
      })
    })
    .catch((err) => {
      console.log(err);
    });
};  

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
};  