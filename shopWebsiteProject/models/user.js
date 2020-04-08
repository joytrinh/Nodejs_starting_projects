const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const getDb = require("../util/database").getDb;

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
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
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      }); //the javascript spread operator, three dots(...) to pull
      //out all properties of this object so of the product object and then with a comma, you can add or overwrite a property,
    }
    const updatedCart = {
      items: updatedCartItems,
    };
    const db = getDb();
    /*
        I'll just set cart equal to updated cart, that is it. So cart which I expect to have in a user in the database will
        now receive updated cart, so this object as a new value which will overwrite the old one and this is important,
        it will not merge this with the old one, it will not merge the elements in the items array, it will simply overwrite 
        the old cart with the new cart.
        */
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((i) => {
      return i.productId; //make an array of id
    });
    return db
      .collection("products")
      .find({ _id: { $in: productIds } }) //find many products: $in takes an array of id
      .toArray()
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

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter((item) => {
      //make a new array
      return item.productId.toString() !== productId.toString(); //this return true if we wanna keep in the array and false if we wanna get rid of it
    }); //toString() to get the right datatype
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  // Add an order in users and clear the cart
  addOrder() {
    const db = getDb();
    return this.getCart()
      .then((products) => {
        // We need a snapshot because we do not want to change anything in past order

        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            username: this.username,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then((result) => {
        this.cart = { items: [] };
        return db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  getOrders() {
    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": new ObjectId(this._id) })
      .toArray();
  }

  static findByPk(userId) {
    const db = getDb();
    return (
      db
        .collection("users")
        .findOne({ _id: new ObjectId(userId) }) //return a cursor
        // .next()//so we have to use next()
        //If you're sure that there is only ONE result, we can use findOne and don't need to use next()
        .then((user) => {
          return user;
        })
        .catch((err) => {
          console.log(err);
        })
    );
  }
}

module.exports = User;
