const Product = require("../models/product");
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true},
                quantity: { type: Number, required: true}
            }
        ]
    },
})

userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
              return cp.productId.toString() === product._id.toString();
            });
            let newQuantity = 1;
            const updatedCartItems = [...this.cart.items];
            if (cartProductIndex >= 0) {
              newQuantity = this.cart.items[cartProductIndex].quantity + 1;
              updatedCartItems[cartProductIndex].quantity = newQuantity;
            } else {
              updatedCartItems.push({
                productId: product._id,
                quantity: newQuantity,
              });
            }
            const updatedCart = {
              items: updatedCartItems,
            };
            this.cart = updatedCart
            return this.save()
}

userSchema.methods.removeFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter((item) => {
        return item.productId.toString() !== productId.toString(); //this return true if we wanna keep in the array and false if we wanna get rid of it
    });
    this.cart.items = updatedCartItems
    return this.save()
}
// This is my method. We dont need to write like this. We can use populate in the shop.js
/*
userSchema.methods.getCart = function() {
    const productIds = this.cart.items.map((i) => {
      return i.productId; 
    });
    return Product
      .find({ _id: { $in: productIds } }) //find many products: $in takes an array of id
      .then((products) => {
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === p._id.toString();
            }).quantity,
          };
        });
      });
}
*/
module.exports = mongoose.model('User', userSchema)










// const mongodb = require("mongodb");
// const ObjectId = mongodb.ObjectId;
// const getDb = require("../util/database").getDb;

// class User {
//   constructor(username, email, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart; // {items: []}
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   addToCart(product) {
//     
//   }

//   getCart() {
//     
//   }

//   deleteItemFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter((item) => {
//       //make a new array
//       return item.productId.toString() !== productId.toString(); //this return true if we wanna keep in the array and false if we wanna get rid of it
//     }); //toString() to get the right datatype
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   // Add an order in users and clear the cart
//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then((products) => {
//         // We need a snapshot because we do not want to change anything in past order

//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             username: this.username,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ "user._id": new ObjectId(this._id) })
//       .toArray();
//   }

//   static findByPk(userId) {
//     const db = getDb();
//     return (
//       db
//         .collection("users")
//         .findOne({ _id: new ObjectId(userId) }) //return a cursor
//         // .next()//so we have to use next()
//         //If you're sure that there is only ONE result, we can use findOne and don't need to use next()
//         .then((user) => {
//           return user;
//         })
//         .catch((err) => {
//           console.log(err);
//         })
//     );
//   }
// }

// module.exports = User;
