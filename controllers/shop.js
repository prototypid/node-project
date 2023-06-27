const Product = require("../models/product");

exports.getProductsPage = (req, res, next) => {
  Product.fetchAll().then(([data, _]) => {
    res.render("shop/product-list", {
      prods: data,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.addProduct;

exports.getIndexPage = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      console.log(rows, fieldData);
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};
