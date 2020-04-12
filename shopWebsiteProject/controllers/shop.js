const Product = require("../models/product");
const Order = require('../models/order')

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        isAuthenticated: req.session.user
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

// So again findById here is not our own method, it's defined by mongoose. And best of all, we can
// even pass a string to findByI dand mongoose will automatically convert this to an objectID,
  Product.findById(prodId)//Product is mongoose model
    .then((product) => {
      res.render("shop/product-detail", {
        product: product, //in sequelize, there is no array
        pageTitle: product.title,
        path: "/products",
        isAuthenticated: req.session.user
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        isAuthenticated: req.session.user
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.session.user
    .populate('cart.items.productId')
    .execPopulate() //req.session.user.populate(...).then is not a function => we must write this function
    .then(user => {
      // console.log(user.cart.items) we should see the position of title, quantity, id of the product and modify cart.ejs
      const products = user.cart.items
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        isAuthenticated: req.session.user
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.session.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/cart");
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.session.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postOrder = (req, res, next) => {
  req.session.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
/*The map() method creates a new array populated with the results of calling a provided function 
on every element in the calling array.

With ._doc we pull out all the data in that document we retrieved and store it in a new object which we save here as a product.*/
      const products = user.cart.items.map(i => {
        return {quantity: i.quantity, product: {...i.productId._doc}}
      })
      const order = new Order({
        user: {
          name: req.session.user.name,
          userId: req.session.user._id
        },
        products: products
      })
      return order.save()
    })
    .then(result => {
      return req.session.user.clearCart()
    })
    .then(()=>{
      res.redirect('/orders');
    })
    .catch(err => {
      console.log(err);
    });
};
exports.getOrders = (req, res, next) => {
  Order.find({'user.userId': req.session.user._id})
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders, //the orders variable which simply stores all the retrieved orders. So with that I got my orders for this user
        isAuthenticated: req.session.user
      });
    }) 
    .catch((err) => {
      console.log(err);
    });
};
