const mongoose = require('mongoose')
const Schema = mongoose.Schema //constructor to make a schema
const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageURL: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Product', productSchema)//mongoose takes this name and create a collection named "products" in db

// const mongodb = require('mongodb')
// const getDb = require('../util/database').getDb

// class Product {
//   constructor(title, price, description, imageURL, id, userId){
//     this.title = title
//     this.price = price
//     this.description = description
//     this.imageURL = imageURL
//     this._id = id ? new mongodb.ObjectId(id) : null
//     this.userId = userId
//   }

//   save(){
//     const db = getDb()
//     let dbOp
//     if (this._id) {
//       //Update the product
//       dbOp = db.collection('products')
//       .updateOne({_id: this._id}, {$set: this})//if you wanna update any properties, you can write {$set: {title: this.title}, {}, {}}
//     } else {
//       //Insert new product
//       dbOp = db.collection('products').insertOne(this)
//     }
//     return dbOp    
//     .then(result => {
//       console.log(result)
//     })
//     .catch(err => {console.log(err)})
//   }

//   static fetchAll(){
//     const db = getDb()
//     return db.collection('products')
//     .find()
//     .toArray()
//     .then(products => {
//       return products;
//     })
//     .catch(err => {
//       console.log(err);
//     });
//   }

//   static findByPk(prodId){
//     const db = getDb()
//     return db.collection('products')
//     .find({_id: new mongodb.ObjectId(prodId)})//Because mongoDB store data in bson format like this: _id:ObjectId(5e676425dcfc1521aa77e59d)
//     .next()
//     .then(product => {
//       return product;
//     })
//     .catch(err => {
//       console.log(err);
//     });
//   }

//   static deleteById(prodId){
//     const db = getDb()
//     return db.collection('products')
//     .deleteOne({_id: new mongodb.ObjectId(prodId)})
//   }
// }

// module.exports = Product