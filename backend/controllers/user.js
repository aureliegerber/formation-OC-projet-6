const bcrypt = require("bcrypt");       // package de cryptage pour les mdp
const jwt = require("jsonwebtoken");     // package qui permet de créer des token et de les vérifier
const User = require("../models/User");

/**
 * Regsiter a user
 * @param {object} request - Request to the API
 * @param {object} response - Response of the API
 * @return {undefined}
 */

exports.signup = (req, res) => {  // fonction signup pour l'enregistrement de nos utilisateurs    
    bcrypt.hash(req.body.password, 10)  // fonction pour crypter un mdp, on effectue 10 fois l'algorithme de hachage, méthode asynchrone
        .then(hash => {
            const user = new User({
                email: req.body.email,  // adresse qui est fournie dans le corps de la requête
                password: hash
            });
            user.save() // enregistrer l'utilisateur dans la BDD
                .then(() => res.status(201).json({message: "User created !"}))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(501).json({error}))  // on capte l'erreur et on envoie l'erreur dans un objet
};

/**
 * Connect a user
 * @param {object} request - Request to the API
 * @param {object} response - Response of the API
 * @return {promise}
 */

exports.login = (req, res) => {  // fonction login pour connecter des utilisateurs existants
    User.findOne({email: req.body.email})
        .then(user => {     // vérifier si l'utilisateur a été trouvé dans la BDD et si oui, si son mdp est le bon
            if (user === null) {     // l'utilisateur n'est pas enregistré dans la BDD
                res.status(401).json({message: "Incorrect login or password"})    // message "flou" pour ne pas donner d'informations, serait déjà une fuite de donnée
            } else {
                bcrypt.compare(req.body.password, user.password)    // ce qui est transmis par le client, ce qui est stocké dans la BDD, promesse retournée
                    .then(valid => {
                        if (!valid) {   // si la valeur retournée est false
                            res.status(401).json({message: "Incorrect login or password"})
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(    // vérifier le token à chaque requête effectué par le frontend pour vérifier que les requêtes sont authentifiées
                                    {userId: user._id}, // payload identifiant utilisateur (les données à encoder)
                                    process.env.TOKEN_KEY,  // clé secrète pour l'encodage
                                    {expiresIn: "24h"}  // expiration de 24 h pour le token
                                )
                            })
                        }
                    })
                    .catch(error => res.status(502).json({error}))
            }
        })
        .catch(error => res.status(503).json({error}))
};