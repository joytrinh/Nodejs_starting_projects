const Product = require('../models/product')

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
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
  Product.fetchAll()
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
  .then(products => {
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products
    })
  })
  .catch(err => {console.log(err)})
  }

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId
  Product.findByPk(prodId)
  .then(product => {
    return req.user.addToCart(product)
  })
  .then(result => {
    res.redirect('/cart')
  })
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  req.user
  .deleteItemFromCart(prodId)
  .then(result => {
    res.redirect('/cart')
  })
  .catch(err => {console.log(err)})
}
exports.postOrder = (req, res, next) => {
  let fetchedCart
  req.user.getCart()
  .then(cart => {
    fetchedCart = cart
    return cart.getProducts()
  })
  .then(products => {
    return req.user
    .createOrder()
    .then(order => {
      return order.addProducts(
        products.map(product => {
          product.orderItem = {quantity: product.cartItem.quantity}
          return product
        })
      )
    })
    .catch(err => {console.log(err)})
  })
  .then(result => {
    return fetchedCart.setProducts(null)//remove all of items in the cart
  })
  .then(result => {
    res.redirect('/orders')
  })
  .catch(err => {console.log(err)})
}
exports.getOrders = (req, res, next) => {
  req.user
  .getOrders({include: ['products']})
  /*if you are fetching all the orders, please also fetch all related products already 
  and give me back one array of orders that also includes the products per order.
  Now this only works of course because we do have a relation between orders and products
  as set up in app.js here and now we can load both together.
  Each order will now have a products array
  */
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders//the orders variable which simply stores all the retrieved orders. So with that I got my orders for this user
    })
  })
  .catch(err => {console.log(err)})
  
}