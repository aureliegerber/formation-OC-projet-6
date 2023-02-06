const Sauce = require("../models/Sauce");
const fs = require("fs");

/**
 * Add a sauce
 * @param {object} request - Request to the API
 * @param {object} response - Response of the API
 * @return {object} - Json Object
 */

exports.createSauce = (req, res) => {    
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject.userId;   
    const sauce = new Sauce ({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    });    
    sauce.save()
        .then(() => res.status(201).json({message : "Sauce registered !"}))
        .catch(error => res.status(400).json({error}));
};

/**
 * Modify a sauce
 * @param {object} request - Request to the API
 * @param {object} response - Response of the API
 * @return {object} - Json Object
 */

exports.modifySauce = (req, res) => {    
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,        
    } : {...req.body};    
    delete sauceObject.userId;
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({message : "Unauthorized request"})
            } else {
                if (req.file) {
                    const filename = sauce.imageUrl.split("/images/")[1];
                    fs.unlink(`images/${filename}`, () => console.log("Image modified"));
                }
            Sauce.updateOne({_id: req.params.id}, {...sauceObject, userId: req.auth.userId, _id: req.params.id})
                .then(() => res.status(200).json({message : "Sauce modified !"}))
                .catch(error => res.status(401).json({error}));                
            }
        })
        .catch(error => res.status(400).json({error}));
};

/**
 * Delete a sauce
 * @param {object} request - Request to the API
 * @param {object} response - Response of the API
 * @return {object} - Json Object
 */

exports.deleteSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({message: "Unauthorized request"});
            } else {
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {  
                    Sauce.deleteOne({_id: req.params.id})
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
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));
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