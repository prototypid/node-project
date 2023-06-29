const express = require("express");
const adminController = require("../controllers/admin");

const router = express.Router();

router.get("/add-product", adminController.getAddProduct);

router.post("/add-product", adminController.postAddProduct);

router.get("/products", adminController.renderAdminProducts);

router.get("/edit-product/:productId", adminController.renderEditProducts);

router.post("/edit-product", adminController.postUpdateProduct);

module.exports = router;
