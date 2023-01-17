const express = require("express"); // importer express
const mongoose = require("mongoose"); // installer le package Mongoose (facilite les interactions avec la BDD MongoDB)
const app = express();  // créer une application express

app.use((req, res, next) => { // middleware qui reçoit la requête et la réponse et qui les gère
  res.json({message : "requête reçue !"});
  res.setHeader("Access-Control-Allow-Origin", "*");  // accéder à notre API depuis n'importe quelle origine
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");  // ajouter les headers mentionnés aux requêtes envoyées vers notre API
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");  // envoyer des requêtes avec les méthodes mentionnées
  next();
});

mongoose.connect("mongodb+srv://aureliegerber-OC:kZnXDAwUrnxnGHL1@cluster0.5tp1plk.mongodb.net/?retryWrites=true&w=majority", // connexion de l'API à la BDD
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

module.exports = app; //  exporter l'application pour y accéder depuis les autres fichiers de notre projet notamment le server node