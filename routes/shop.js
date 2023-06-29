const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndexPage);

router.get("/products", shopController.getProductsPage);

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", shopController.renderCart);

router.post("/cart", shopController.postCart);

router.post("/cart-delete-item", shopController.postDeleteCartProduct);

router.post("/create-order", shopController.postOrder);

module.exports = router;
