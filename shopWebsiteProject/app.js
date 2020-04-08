const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const errorController = require('./controllers/error')
const mongoConnect = require('./util/database').mongoConnect//which is a function
const User = require('./models/user')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

//register a new middleware to store that user in my request so that I can use it everywhere
//when the app starts, it will run sequelize firstly. This middleware only run when there is an incoming request
app.use((req, res, next) => {
    User.findByPk("5e8bed2d211812138bdf00a8") 
    .then(user => {
        req.user = new User(user.username, user.email, user.cart, user._id)//store the user in the request from the database, then we can use req.user
        //we create a new User(), so we can access User's methods        
        next()
    })
    .catch(err => { console.log(err) })
})
app.use('/admin', adminRoutes)
app.use(shopRoutes) 

app.use(errorController.get404)

mongoConnect(() => {
    app.listen(3000)
})