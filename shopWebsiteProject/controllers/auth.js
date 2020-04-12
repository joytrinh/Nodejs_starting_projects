exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get('Cookie').trim().split('=')[1]//get the value true of the cookie => true
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  res.setHeader('Set-Cookie', 'loggedIn=true')
  res.redirect("/");
};  