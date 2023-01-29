const Sauce = require("../models/Sauce");
const fs = require("fs");

/**
 * Add a sauce
 * @param {object} request - Request to the API
 * @param {object} response - Response of the API
 * @return { (string | error) }
 */

exports.createSauce = (req, res) => {    
    const sauceObject = JSON.parse(req.body.sauce);     // à cause de multer (?) objet envoyé sous forme json mais en chaine de caractères, il faut donc le parser
    delete sauceObject.userId;   // ????????????   
    const sauce = new Sauce ({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`    // pour générer l'URL par nous-même car multer ne nous donne que le nom de fichier
    });    
    sauce.save()   // méthode save enregistre l'objet dans la base de données et retourne une promesse
        .then(() => res.status(201).json({message : "Sauce registered !"}))    // il faut renvoyer une réponse à la frontend sinon on aura expiration de la requête 
        .catch(error => res.status(400).json({error}));
};

// Selon que l'utilisateur aura transmis un fichier ou pas, le format de la requête ne sera pas excatement le même. 
// Lorsqu'un fichier est transmis nous obtenons notre objet sous la forme d'une chaine de caractères, ce qui n'est pas le cas lorsqu'aucun fichier n'est transmis

/**
 * Modify a sauce
 * @param {object} request - Request to the API
 * @param {object} response - Response of the API
 * @return { (string | error) }
 */

exports.modifySauce = (req, res) => {    
    const sauceObject = req.file ? {    // Est-ce qu'il y a un champ file dans notre req ?
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,        
    } : {...req.body};    
    delete sauceObject.userId;     // supprimer le userId venant de la requête pour éviter que quelqu'un crée un objet à son nom puis le modifie pour le réassigner à quelqu'un d'autre
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({message : "Unauthorized request"})
            } else {
                if (req.file) {
                    const filename = sauce.imageUrl.split("/images/")[1];
                    fs.unlink(`images/${filename}`, () => console.log("Image modified"));
                }
            Sauce.updateOne({_id: req.params.id}, {...sauceObject, userId: req.auth.userId, _id: req.params.id})     // 1er argument : objet de comparaison pour savoir quel objet on modifie, 2ème argument : nouvelle version de l'objet
                .then(() => res.status(200).json({message : "Sauce modified !"}))
                .catch(error => res.status(401).json({error}));    //  renvoyer une erreur 400 avec l'objet erreur dans le corps de la réponse                
            }
        })
        .catch(error => res.status(400).json({error}));
};

/**
 * Delete a sauce
 * @param {object} request - Request to the API
 * @param {object} response - Response of the API
 * @return {promise}
 */

exports.deleteSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id})     // promesse
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({message: "Unauthorized request"});
            } else {
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {  // la méthode unlink() du package fs permet de supprimer un fichier du système de fichiers, la suppression est faite de manière asynchrone
                    Sauce.deleteOne({_id: req.params.id})       // pas besoin de 2ème argument puisque c'est une supression
                        .then(() => res.status(200).json({message : "Sauce deleted !"}))
                        .catch(error => res.status(401).json({error}));
                });
            }
        })
        .catch(error => res.status(500).json({error}));       
};

/**
 * Find a sauce
 * @param {object} request - Request to the API
 * @param {object} response - Response of the API
 * @return {promise}
 */

exports.getOneSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id})     // pour trouver un seul objet, on veut que l'id de la sauce soit le même que le paramètre de requête (voir routes)
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));     // 404 objet non trouvé
};

/**
 * Find all sauces
 * @param {object} request - Request to the API
 * @param {object} response - Response of the API
 * @return {promise}
 */

exports.getAllSauce = (req, res) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
};

/**
 * Like or dislike a sauce
 * @param {object} request - Request to the API
 * @param {object} response - Response of the API
 * @return {promise}
 */

exports.likeSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        const userDislikeIndex = sauce.usersDisliked.indexOf(req.body.userId);
        const userLikeIndex = sauce.usersLiked.indexOf(req.body.userId);        

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
        res.status(201).json({message: "Like / Dislike updated"});
    })
        .catch(error => res.status(400).json({error}));
};