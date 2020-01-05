const Product = require('../models/products')

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    })
  })    
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    })
  })    
}

exports.getCart = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/cart', {
      prods: products,
      pageTitle: 'Your Cart',
      path: '/cart'
    })
  })    
}

exports.getCheckOut = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/checkout', {
      prods: products,
      pageTitle: 'Checkout',
      path: '/checkout'
    })
  })    
}