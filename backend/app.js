const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");
const path = require("path");
require('dotenv').config();

const app = express();


mongoose.connect(process.env.MONGO_URL,
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log("Successful connection to mongodb !"))
  .catch(() => console.log("Connection to mongodb failed !"));

  app.use((req, res, next) => {  
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
  });

app.use(express.json());

app.use("/api/auth", userRoutes);

app.use("/api/sauces", sauceRoutes);

app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;