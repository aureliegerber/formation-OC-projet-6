const express = require("express");
const userCtrl = require("../controllers/user");
const router = express.Router();    // créer un routeur

router.post("/signup", userCtrl.signup);

router.post("/login", userCtrl.login);

module.exports = router;    // exporter le routeur (pour l'importer dans app.js)