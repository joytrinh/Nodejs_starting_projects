const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    })
  })
  .catch(err => {console.log(err)})
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId
  //Method 1:
  // Product.findAll({where: {id: prodId}})
  //       .then(([products]) => {
  //         res.render('shop/product-detail', {
  //           product: products[0],//in sequelize, there is no array
  //           pageTitle: products[0].title,
  //           path: '/products'
  //         })
  //       })
  //       .catch(err => console.log(err))
  //Method 2:
  Product.findByPk(prodId)
        .then(product=>{
          res.render('shop/product-detail', {
            product: product,//in sequelize, there is no array
            pageTitle: product.title,
            path: '/products'
          })
        })
        .catch(err => console.log(err))
}

exports.getIndex = (req, res, next) => {
  Product.findAll()
  .then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    })
  })
  .catch(err => {console.log(err)})
}

exports.getCart = (req, res, next) => {
  req.user
  .getCart()
  .then(cart => {
    return cart
          .getProducts()//Cart.belongsToMany(Product)
          .then(products => {
            res.render('shop/cart', {
              path: '/cart',
              pageTitle: 'Your Cart',
              products: products
            })
          })
          .catch(err => {console.log(err)})
  })
  .catch(err => {console.log(err)})
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId
  let fetchedCart
  let newQuantity = 1
  req.user
  .getCart()
  .then(cart => {
    fetchedCart = cart
    return cart.getProducts({where: {id: prodId}})
  })
  .then(products => {//we get an array of products from above code
    let product
    if (products.length > 0)
        product = products[0]    
    if (product) {
      const oldQuantity = product.cartItem.quantity//cartItem is this extra field that gets added by sequelize to give us access to this in-between table
      newQuantity = oldQuantity + 1
      return product
    }
    return Product.findByPk(prodId) 
  })
  .then(product => {
    return fetchedCart.addProduct(product, 
      {through: {quantity: newQuantity}})//another magic method added by sequelize for many to many relationships,
  })
  .then(()=>{
    res.redirect('/cart')
  })
  .catch(err => {console.log(err)}) 
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price)
    res.redirect('/cart')
  })
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  })
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  })
}