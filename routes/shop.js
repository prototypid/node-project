const express = require("express");

const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", shopController.getIndexPage);

router.get("/products", shopController.getProductsPage);

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", isAuth, shopController.renderCart);

router.post("/cart", isAuth, shopController.postCart);

router.post("/cart-delete-item", isAuth, shopController.postDeleteCartProduct);

router.get("/orders", isAuth, shopController.renderOrder);

router.post("/create-order", isAuth, shopController.postOrder);

module.exports = router;
