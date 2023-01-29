const mongoose = require("mongoose");   // importer mongoose
const uniqueValidator = require("mongoose-unique-validator");   // 2. pour gérer plus facilement les erreurs générées par défaut par MongoDB qui peuvent être illisibles

const userSchema = mongoose.Schema({    // schéma mongoose de données pour chaque utilisateur (id automatiquement généré par la BDD)
    email: {type: String, required: true, unique: true},    // 1. unique pour empêcher plusieurs user avec la même adresse mail
    password: {type: String, required: true},
});

userSchema.plugin(uniqueValidator); // appliquer le validator au schéma avant d'en faire un modèle

module.exports = mongoose.model("User", userSchema);    // exporter le schéma en tant que modèle mongoose appelé User, le rendant disponible pour notre app express