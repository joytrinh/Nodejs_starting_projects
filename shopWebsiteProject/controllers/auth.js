const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const User = require("../models/user");

const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key: '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'
  }
}))// pass a function here return a configuration that nodemailer can use to use sendgrid.

exports.getLogin = (req, res, next) => {
  let message = req.flash('error')
  if (message.length) {
    message = message[0]
  } else {
    message = null
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  User.findOne({email: email})
    .then((user) => {
      if (!user){
        req.flash('error', 'invalid email or password.')
        return res.redirect('/login')
      } 
      bcrypt.compare(password, user.password).then(matched => {
        if(matched) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => { //user return here to avoid executing res.redirect('/login')
            //the redirect might be finished and the new page might be rendered before your session was updated on the server and in the database.
            console.log(err);
            res.redirect('/') // do not use return here because it is in a callback and never reach res.redirect('/login')
          });
        }
        req.flash('error', 'Incorrect password.')
        res.redirect('/login')
      })
      .catch((err) => {
        console.log(err);
        res.redirect('/login')
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error')
  if (message.length) {
    message = message[0]
  } else {
    message = null
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errMessage: message
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash('error', 'Email exists already, please choose a different one!')
        return res.redirect("/signup");
      } 
      return bcrypt
        .hash(password, 12) // 12 is the most secure level
        .then((cryptedPassword) => {
          const user = new User({
            email: email,
            password: cryptedPassword,
            cart: { items: [] },
          });
          user.save();
        })
        .then((result) => {
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: 'shop@joycheng.com',
            subject: 'Signup successully!',
            html: '<h1>You successfully signed up!</h1>'
          })
          .catch((err) => console.log(err));
        });
    })
    .catch((err) => console.log(err));
};
