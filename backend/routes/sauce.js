const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sauceCtrl = require("../controllers/sauce");

router.post("/", auth, multer, sauceCtrl.createSauce);  // auth à mettre avant le gestionnaire de routes

router.put("/:id", auth, multer, sauceCtrl.modifySauce);    // en rajoutant multer le format de la requête change, il faut donc modifier le createSauce dans controllers/sauce

router.delete("/:id", auth, sauceCtrl.deleteSauce);

router.get("/:id", auth, sauceCtrl.getOneSauce);

router.get("/", auth, sauceCtrl.getAllSauce);

router.post("/:id/like", auth, sauceCtrl.likeSauce);

module.exports = router;