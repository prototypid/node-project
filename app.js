const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

// routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const app = express();

// body-parser
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "./views/404.html"));
});

app.listen(3000);
