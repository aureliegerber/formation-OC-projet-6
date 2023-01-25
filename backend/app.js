const express = require("express"); // importer express
const mongoose = require("mongoose"); // installer le package Mongoose (facilite les interactions avec la BDD MongoDB)
const userRoutes = require("./routes/user");    // importer le routeur pour les utilisateurs
const sauceRoutes = require("./routes/sauce");    // importer le routeur pour les sauces
const path = require("path");

const app = express();  // créer une application express


mongoose.connect("mongodb+srv://aureliegerber-OC:kZnXDAwUrnxnGHL1@cluster0.5tp1plk.mongodb.net/?retryWrites=true&w=majority", // connexion de l'API à la BDD
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

  app.use((req, res, next) => { // middleware qui reçoit la requête et la réponse et qui les gère, sera appliqué à toutes les routes (d'où le req)    
    res.setHeader("Access-Control-Allow-Origin", "*");  // permettre d'accéder à notre API depuis n'importe quelle origine
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");  // donner l'autorisation d'ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");  // donner l'autorisation d'envoyer des requêtes avec les méthodes mentionnées
    next();
  });
  
app.use(express.json());    // pour accéder au corps de la requête, intercepte toutes les req qui ont un content-type json et met à disposition ce contenu (corps de la requête) avec req.body
  // peut se faire aussi avec body parser (ancienne méthode)

app.use("/api/auth", userRoutes);

app.use("/api/sauces", sauceRoutes);

app.use("/images", express.static(path.join(__dirname, "images")));   // pour gérer la requête vers le répertoire images

module.exports = app; //  exporter l'application pour y accéder depuis les autres fichiers de notre projet notamment le server node