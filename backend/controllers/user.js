const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.signup = (req, res, next) => {  // pour l'enregistrement de nos utilisateurs
    console.log(req.body);
    bcrypt.hash(req.body.password, 10)  // on effectue 10 fois l'algorithme de hachage
        .then(hash => {
            const user = new User({
                email: req.body.email,  // adresse qui est fournie dans le corps de la requête
                password: hash
            });
            user.save() // enregistrer l'utilisateur dans la BDD
                .then(() => res.status(201).json({message: "Utilisateur créé !"}))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error}))  // on capte l'erreur et on envoie l'erreur dans un objet
};

exports.login = (req, res, next) => {  // pour connecter des utilisateurs existants
    User.findOne({email: req.body.email})
        .then(user => {     // vérifier si l'utilisateur a été trouvé dans la BDD et si oui, si son mdp est le bon
            if (user === null) {     // l'utilisateur n'est pas enregistré dans la BDD
                res.status(401).json({message: "Paire identifiant/mot de passe incorrecte"})    // message "flou" pour ne pas donner d'informations
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({message: "Paire identifiant/mot de passe incorrecte"})
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(    // encodage
                                    {userId: user._id}, // payload identifiant utilisateur
                                    "RANDOM_TOKEN_SECRET",  // clé secrète pour l'encodage (A SECURISER DAVANTAGE)
                                    {expiresIn: "24h"}  // expiration de 24 h pour le token
                                )
                            })
                        }
                    })
                    .catch(error => res.status(500).json({error}))
            }
        })
        .catch(error => res.status(500).json({error}))
};



