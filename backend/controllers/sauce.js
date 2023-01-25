const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);     // objet envoyé sous forme json mais en chaine de caractères, il faut donc le parser
    delete sauceObject._id;     // on supprime le Id de l'objet car celui-ci est automatiquement généré par la BDD
    delete sauceObject._userId;    // on supprime le userId pour utiliser le userId qui vient du token d'authentification   
    const sauce = new Sauce ({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`    // pour générer l'URL par nous-même car multer ne nous donne que le nom de fichier
    });
    sauce.save()
        .then(() => res.status(201).json({message : "Sauce enregistrée !"}))
        .catch(error => res.status(400).json({error}));
};

// Selon que l'utilisateur aura transmis un fichier ou pas, le format de la requête ne sera pas excatement le même. 
// Lorsqu'un fichier est transmis nous obtenons notre objet sous la forme d'une chaine de caractères, ce qui n'est pas le cas lorsqu'aucun fichier n'est transmis
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : {...req.body};
    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message : "Non autorisé"})
            } else {
                Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                    .then(() => res.status(200).json({message : "Sauce modifiée !"}))
                    .catch(error => res.status(400).json({error}));
            }
        })
        .catch(error => res.status(400).json( 'error'));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: "Non autorisé"});
            } else {
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {  // la méthode unlink() du packange fs permet de supprimer un fichier du système de fichiers
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => res.status(200).json({message : "Sauce supprimée !"}))
                        .catch(error => res.status(401).json({error}))
                });
            }
        })
        .catch(error => res.status(400).json({error}));       
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({error}));
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
};

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        
        const userDislikeIndex = sauce.usersDisliked.indexOf(req.body.userId);
        const userLikeIndex = sauce.usersLiked.indexOf(req.body.userId);
        console.log(req.body.like);

        if (req.body.like == 1) {
            sauce.usersLiked.push(req.body.userId);
            sauce.likes += 1;
        }
        if (req.body.like == -1) {
            sauce.usersDisliked.push(req.body.userId);
            sauce.dislikes += 1;
        }
        if (req.body.like == 0) {
            if (userLikeIndex != -1) {
                sauce.usersLiked.splice(userLikeIndex, 1);
                sauce.likes -= 1;
            } else {
                sauce.usersDisliked.splice(userDislikeIndex, 1);
                sauce.dislikes -= 1;
            }
        }
        sauce.save();
        res.status(201).json({ message: 'Like / Dislike mis à jour' });
    })
        .catch(error => res.status(400).json({error}));
};

