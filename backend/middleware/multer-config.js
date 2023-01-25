const multer = require("multer");

const MIME_TYPES = {    // dictionnaire de traduction
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
}

const storage = multer.diskStorage({    // objet de configuration pour multer
    destination: (req, file, callback) => {
        callback(null, "images")    // premier argument null pour dire qu'il n'y a pas d'erreur
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_");    // on remplace les espaces (qui peuvent poser des pb côté server) du nom original par des _
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + "." + extension);    // timestamp pour rendre le nom le plus unique possible
    }
});

module.exports = multer({storage: storage}).single("image");     // exporter le middleware multer