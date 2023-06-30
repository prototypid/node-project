const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    description: description,
    price: price,
    userId: req.user,
  });
  product
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.renderAdminProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.renderEditProducts = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) res.redirect("/");

  const productId = req.params.productId;

  Product.findById(productId)
    .then((product) => {
      if (!product) res.redirect("/");

      res.render("admin/edit-product", {
        product: product,
        path: "admin/edit-product",
        pageTitle: "Edit Product",
        editing: editMode,
      });
    })
    .catch((err) => console.log(err));
};

exports.postUpdateProduct = (req, res, next) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  Product.findById(productId)
    .then((product) => {
      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDescription;
      product.price = updatedPrice;
      return product.save();
    })
    .then((result) => {
      console.log("Updated Product");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findByIdAndRemove(productId)
    .then(() => {
      console.log("Deleted Product");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
