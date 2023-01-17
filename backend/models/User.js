const mongoose = require("mongoose");   // importer mongoose
const uniqueValidator = require("mongoose-unique-validator");   // pour gérer plus facilement les erreurs générées par défaut par MongoDB

const userSchema = mongoose.Schema({    // schéma mongoose de données pour chaque utilisateur (id automatiquement donné par la BDD)
    email: {type: String, required: true, unique: true},    // unique pour empêcher plusieurs user avec la même adresse mail
    passwword: {type: String, required: true}
});

userSchema.plugin(uniqueValidator); // appliquer le validator au schéma avant d'en faire un modèle

module.exports = mongoose.model("User", userSchema);    // exporter le schéma en tant que modèle mongoose appelé user, le rendant disponible pour notre app express