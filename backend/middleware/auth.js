const jwt = require("jsonwebtoken");

/**
 * Retrieve the user id from the token and add it to the request
 * @param {object} request - Request to the API
 * @param {object} response - Response of the API
 * @param {function} next
 * @return { (undefined | object) }
 */

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY)      
        const userId = decodedToken.userId;     
        req.auth = {
            userId: userId
        };
        next();
    } catch(error) {res.status(401).json({error})};
};