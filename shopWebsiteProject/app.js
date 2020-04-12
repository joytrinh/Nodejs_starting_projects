const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session) //session is a variable above

const errorController = require("./controllers/error");
const User = require("./models/user");
const MONGODB_URL = "mongodb+srv://tuyentrinh:tuyen1234@cluster0-7dvwp.azure.mongodb.net/shop?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: 'sessions'
})

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}))

//register a new middleware to store that user in my request so that I can use it everywhere
//when the app starts, it will run sequelize firstly. This middleware only run when there is an incoming request
app.use((req, res, next) => {
  User.findById("5e8fdc355c17cd14818d0451")
    .then((user) => {
       //store the user in the request from the database, then we can use req.user      
      req.user = user //we save req.user in user which is a full mongoose model so we can call 
      // all these mongoose model functions or methods on that user object and therefore also 
      // on the user object which I do store here.
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
  .connect(
    MONGODB_URL
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'joy',
          email: 'test@test.com',
          cart: { items: [] }
        });
        user.save()
      }
    })
    app.listen(3000);
  }) 
  .catch((err) => console.log(err));
