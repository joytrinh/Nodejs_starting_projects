const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const errorController = require('./controllers/error')
const sequelize = require('./util/database')
const Product = require('./models/product')
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
    User.findByPk(1)
    .then(user => {
        req.user = user//store the user in the request from the database
    })
    .catch(err => { console.log(err) })
})
app.use('/admin', adminRoutes)
app.use(shopRoutes) 

app.use(errorController.get404)
/*A product belongs to a user and very important, we can define so-called constraints,
set them to true and onDelete, so if a user is deleted, "cascade" which simply means
 well the deletion would then also be executed for the product
so if we delete a user, any price related to the user would also be gone.
belongsTo: when create table "Products", it will add userid as FK of products
*/
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'})
User.hasMany(Product)

//public sync(options: object): Promise, Sync all defined models to the DB.
// sequelize.sync({force: true})//replace existing tables
sequelize.sync()
.then(result => {
    return User.findByPk(1)
})
.then(user => {
    if (!user) {
        User.create({
            name: 'Max',
            email: 'test@gmail.com'
        })
    }
    return user
})
.then(user => {
    app.listen(3000)
})
.catch(err => { console.log(err) })
