const express = require("express");
const { check, body } = require("express-validator/check");
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const router = express.Router();
const { validationResult } = require("express-validator/check");

router.get("/add-product", isAuth, adminController.getAddProduct); // go from left to right

router.post(
  "/add-product",
  [
    body(
      "title",
      "Please enter a title with minimum 10 characters and maximum 20 characters"
    )
    .isString()  
    .isLength({ min: 10, max: 20 })
      .trim(),
    // body("imageURL").isURL(),
    body("price").isFloat({ gt: 0 }),
    body(
      "description",
      "Please enter a description with minimum 10 characters and maximum 100 characters"
    )
      .isLength({ min: 10, max: 400 })
      .trim(),
  ],
  isAuth,
  adminController.postAddProduct
);

router.get("/products", isAuth, adminController.getProducts);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    body(
      "title",
      "Please enter a title with minimum 10 characters and maximum 20 characters"
    )
      .isString()
      .isLength({ min: 10, max: 20 })
      .trim(),
    // body("imageURL").isURL(),
    body("price").isFloat({ gt: 0 }),
    body(
      "description",
      "Please enter a description with minimum 10 characters and maximum 100 characters"
    )
      .isLength({ min: 10, max: 400 })
      .trim(),
  ],
  isAuth,
  adminController.postEditProduct
);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
