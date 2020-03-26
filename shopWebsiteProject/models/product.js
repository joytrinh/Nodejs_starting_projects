const mongodb = require('mongodb')
const getDb = require('../util/database').getDb

class Product {
  constructor(title, price, description, imageURL, id){
    this.title = title
    this.price = price
    this.description = description
    this.imageURL = imageURL
    this._id = id ? new mongodb.ObjectId(id) : null
  }

  save(){
    const db = getDb()
    let dbOp
    if (this._id) {
      //Update the product
      dbOp = db.collection('products').updateOne({_id: this._id}, {$set: this})//if you wanna update any properties, you can write {$set: {title: this.title}, {}, {}}
    } else {
      //Insert new product
      dbOp = db.collection('products').insertOne(this)
    }
    return dbOp    
    .then(result => {
      console.log(result)
    })
    .catch(err => {console.log(err)})
  }

  static fetchAll(){
    const db = getDb()
    return db.collection('products')
    .find()
    .toArray()
  }

  static findByPk(prodId){
    const db = getDb()
    return db.collection('products')
    .find({_id: new mongodb.ObjectId(prodId)})//Because mongoDB store data in bson format like this: _id:ObjectId(5e676425dcfc1521aa77e59d)
    .next()
  }

  static deleteById(prodId){
    const db = getDb()
    return db.collection('products').deleteOne({_id: new mongodb.ObjectId(prodId)})
  }
}

module.exports = Product