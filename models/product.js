const mongodb = require("mongodb");
const getDb = require("../utils/database").getDb;

module.exports = class Product {
  constructor(title, imageUrl, description, price, id) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    let dbAction;
    if (this._id) {
      dbAction = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbAction = db.collection("products").insertOne(this);
    }

    return dbAction
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => console.log(err));
  }

  static findById(productId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(productId) })
      .next()
      .then((product) => {
        return product;
      })
      .catch((err) => console.log(err));
  }

  static deleteById(productId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(productId) });
  }
};
