const express = require("express");

const ShopController = require("../controllers/shop");

const router = express.Router();

router.get("/", ShopController.getIndexPage);

router.get("/products", ShopController.getProductsPage);

module.exports = router;
