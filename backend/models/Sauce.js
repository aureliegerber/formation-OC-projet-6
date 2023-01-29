const mongoose = require("mongoose");   // importer mongoose, nécessaire pour créer un schéma

const sauceSchema = mongoose.Schema({    
    userId: {type: String, required: true},  // ou type: mongoose.Types.ObjectId ??
    name: {type: String, required: true},       // sans name on ne pourra pas enregistrer une sauce dans la base de données
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type: String, required: true},
    heat: {type: Number, required: true},
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0},
    usersLiked: {type: [String], required: false},
    usersDisliked: {type: [String], required: false},
});

module.exports = mongoose.model("Sauce", sauceSchema);      // pour exploiter le schéma précédent comme modèle (nom du modèle, schéma que l'on veut utiliser)

// la méthode model transforme ce modèle en un modèle utilisable