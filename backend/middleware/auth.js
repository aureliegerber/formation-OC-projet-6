const jwt = require("jsonwebtoken");    // importer jsonwebtoken

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];    // récupérer le token qui est composé de 2 parties quand il est envoyé par le client : barer token
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");     // décoder le token. jwt(token, clé secrète)
        const userId = decodedToken.userId;     // dans le token décodé on récupère la propiété userId
        req.auth = {    // on ajoute cette valeur à l'objet request qui lui est transmis aux routes qui vont être appelées par la suite
            userId: userId
        };
        next();
    } catch(error) {res.status(401).json({error})};
};