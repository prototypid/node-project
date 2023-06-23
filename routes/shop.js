const express = require("express");

const ShopController = require("../controllers/shop");

const router = express.Router();

router.get("/", ShopController.getIndexPage);

module.exports = router;
