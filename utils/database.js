const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (cb) => {
  MongoClient.connect(
    "mongodb://darq:1324@localhost:27017/?authMechanism=DEFAULT"
  )
    .then((client) => {
      // client is a object which gives us access to the database.
      console.log("Connected!");
      _db = client.db("test");
      cb();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
