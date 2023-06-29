const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndexPage);

router.get("/products", shopController.getProductsPage);

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", shopController.renderCart);

router.post("/cart", shopController.postCart);

module.exports = router;
