const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const errorController = require('./controllers/error')
const mongoConnect = require('./util/database').mongoConnect//which is a function

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
//     User.findByPk(1)
//     .then(user => {
//         req.user = user//store the user in the request from the database
//         next()
//     })
//     .catch(err => { console.log(err) })
    next()
})
app.use('/admin', adminRoutes)
app.use(shopRoutes) 

app.use(errorController.get404)

mongoConnect(() => {
    app.listen(3000)
})