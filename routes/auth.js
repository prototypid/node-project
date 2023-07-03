const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.renderLogin);

router.get("/signup", authController.renderSignup);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.post("/signup", authController.postSignup);

router.get("/reset", authController.renderReset);

router.post("/reset", authController.postReset);

module.exports = router;
