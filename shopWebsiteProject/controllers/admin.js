const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageURL = req.body.imageURL;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageURL: imageURL,
    userId: req.user, //we can pass an user obj here, via ref, mongoose only get user._id
  });
  product
    .save() //this save() from mongoose, we don't need to write it
    .then((result) => {
      console.log("Created a product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedimageURL = req.body.imageURL;
  const updatedDesc = req.body.description;
  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageURL = updatedimageURL;
      /*
    product.save() will now not be a javascript object with the data but we will have a full 
    mongoose object here with all the mongoose methods like save and if we call save on an 
    existing object, it will not be saved as a new one but the changes will be saved, so it will 
    automatically do an update behind the scenes.
    */
      return product.save().then((result) => {
        console.log("Updated product");
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      console.log(err);
    });
  /*
  this catch block would catch errors both for this first promise here 
  and for the second promise. This then block will now handle any success 
  responses from this save promise here
  */
};

exports.getProducts = (req, res, next) => {
  /* mongoose gives us this method to get an array of products. If you know you will
    query a large amounts of data, you should turn it into a cursor by adding find().cursor().then()
    or use pagination later
    Populate allows you to tell mongoose to populate a certain field with all the detail information 
    and not just the ID
  */
  Product.find({ userId: req.user._id }) //only show products created by the current user
    // .select("title price -_id") //only show these field
    // .populate("userId", "name") //without 'name', this method will show User with full properties instead of only
    //id. But with 'name', it shows id and name
    .then((products) => {
      console.log(products);
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({_id: prodId, userId: req.user._id})
    .then(() => {
      console.log("Deleted product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
