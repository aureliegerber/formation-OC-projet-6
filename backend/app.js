const express = require("express"); // importer express
const mongoose = require("mongoose"); // installer le package Mongoose (facilite les interactions avec la BDD MongoDB)
const userRoutes = require("./routes/user");    // importer le routeur pour les utilisateurs
const sauceRoutes = require("./routes/sauce");    // importer le routeur pour les sauces
const path = require("path");
require('dotenv').config();

const app = express();  // créer une application express


mongoose.connect(process.env.MONGO_URL, // connexion de l'API à la BDD // chaine de connexion srv : SSL activé par défaut
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log("Successful connection to mongodb !"))
  .catch(() => console.log("Connection to mongodb failed !"));

  app.use((req, res, next) => { // middleware qui reçoit la requête et la réponse et qui les gère, sera appliqué à toutes les routes   
    res.setHeader("Access-Control-Allow-Origin", "*");  // permettre d'accéder à notre API depuis n'importe quelle origine
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");  // donner l'autorisation d'ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");  // donner l'autorisation d'envoyer des requêtes avec les méthodes mentionnées
    next();
  });
  
app.use(express.json());    // pour accéder au corps de la requête, intercepte toutes les req qui ont un content-type json et met à disposition ce contenu (corps de la requête) avec req.body
  // peut se faire aussi avec body parser (ancienne méthode)

app.use("/api/auth", userRoutes);

app.use("/api/sauces", sauceRoutes);

app.use("/images", express.static(path.join(__dirname, "images")));   // pour gérer la requête vers le répertoire images, on récupère le répertoire dans lequel s'exécute notre server et on y concatène le dossier images

module.exports = app; //  exporter l'application pour y accéder depuis les autres fichiers de notre projet notamment le server node