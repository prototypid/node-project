const Product = require("../models/product");

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
