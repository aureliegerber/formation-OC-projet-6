const jwt = require("jsonwebtoken");    // importer jsonwebtoken

/**
 * Retrieve the user id from the token and add it to the request
 * @param {object} request - Request to the API
 * @param {object} response - Response of the API
 * @param {function} next
 * @return { (undefined | error) }
 */

module.exports = (req, res, next) => {      // pas de promesse
    try {
        const token = req.headers.authorization.split(" ")[1];    // récupérer le token qui est composé de 2 parties quand il est envoyé par le client : barer token
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);     // décoder le token. jwt(token, clé secrète)        
        const userId = decodedToken.userId;     // dans le token décodé on récupère la propiété userId        
        req.auth = {    // on ajoute cette valeur à l'objet request qui lui est transmis aux routes qui vont être appelées par la suite
            userId: userId
        };
        next();
    } catch(error) {res.status(401).json({error})};
};